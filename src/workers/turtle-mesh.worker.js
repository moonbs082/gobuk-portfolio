/**
 * 거북이 조형 메시 생성 워커
 *
 * SDF 를 격자에 샘플링한 뒤 Marching Cubes 로 매끈한 표면(position / normal)을 만든다.
 * 계산량이 많아 메인 스레드가 멈추지 않도록 워커에서 실행한다.
 */
import { MeshBasicMaterial } from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';
import {
  BODY_PRIMS,
  FAR,
  GRIDS,
  TORSO_PRIMS,
  plastronDistance,
  shellDistance,
  unionDistance,
} from '../utils/turtle-sdf.js';

/**
 * 격자 하나를 샘플링해 메시 데이터로 만든다.
 *
 * @param {object} grid - { center, half, resolution, maxPolyCount }
 * @param {object[]} prims - 행 단위로 걸러 쓸 도형 목록
 * @param {function} toDistance - (unionDist, x, y, z) => 최종 거리
 * @returns {{ position: Float32Array, normal: Float32Array }}
 */
function buildMesh(grid, prims, toDistance) {
  const { center, half, resolution: n, maxPolyCount } = grid;
  const material = new MeshBasicMaterial();
  const mc = new MarchingCubes(n, material, false, false, maxPolyCount);
  mc.isolation = 0;

  const halfN = n / 2;
  const toWorld = (index, axis) => center[axis] + ((index - halfN) / halfN) * half[axis];

  for (let zi = 0; zi < n; zi += 1) {
    const wz = toWorld(zi, 2);
    for (let yi = 0; yi < n; yi += 1) {
      const wy = toWorld(yi, 1);
      const rowPrims = prims.filter((p) => wy >= p.min[1] && wy <= p.max[1] && wz >= p.min[2] && wz <= p.max[2]);
      const offset = zi * n * n + yi * n;
      for (let xi = 0; xi < n; xi += 1) {
        const wx = toWorld(xi, 0);
        const d = toDistance(unionDistance(rowPrims, wx, wy, wz), wx, wy, wz);
        mc.field[offset + xi] = -Math.max(-FAR, Math.min(FAR, d));
      }
    }
  }

  mc.update();

  /** 로컬(-1~1) 좌표 → 월드 좌표, 법선은 축별 크기 보정 후 정규화 */
  const vertexCount = mc.count;
  const position = new Float32Array(vertexCount * 3);
  const normal = new Float32Array(vertexCount * 3);
  for (let i = 0; i < vertexCount; i += 1) {
    const o = i * 3;
    position[o] = center[0] + mc.positionArray[o] * half[0];
    position[o + 1] = center[1] + mc.positionArray[o + 1] * half[1];
    position[o + 2] = center[2] + mc.positionArray[o + 2] * half[2];
    const nx = mc.normalArray[o] / half[0];
    const ny = mc.normalArray[o + 1] / half[1];
    const nz = mc.normalArray[o + 2] / half[2];
    const length = Math.hypot(nx, ny, nz) || 1;
    normal[o] = nx / length;
    normal[o + 1] = ny / length;
    normal[o + 2] = nz / length;
  }

  mc.geometry.dispose();
  material.dispose();
  return { position, normal };
}

const body = buildMesh(GRIDS.body, BODY_PRIMS, (d) => d);
const shell = buildMesh(GRIDS.shell, [], (d, x, y, z) => shellDistance(x, y, z));
const plastron = buildMesh(GRIDS.plastron, TORSO_PRIMS, plastronDistance);

const meshes = { body, shell, plastron };
const transfer = Object.values(meshes).flatMap((mesh) => [mesh.position.buffer, mesh.normal.buffer]);

self.postMessage(meshes, transfer);
