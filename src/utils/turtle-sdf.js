/**
 * 거북이 조형(프론트 더블 바이셉스 포즈)의 SDF(Signed Distance Field) 정의
 *
 * - 근육 하나하나를 타원체 / 테이퍼 캡슐로 배치하고, smooth union 으로 매끈하게 이어 붙인다.
 * - 좌표계: y 위쪽, z 정면(관람자 쪽), 바닥 y = 0
 * - 값이 0보다 작으면 내부, 크면 외부
 */

const ELLIPSOID = 0;
const CONE = 1;

/** 오일러 회전(Rz·Ry·Rx)의 역행렬(전치) — world → local 변환용 */
function inverseRotation([rx, ry, rz]) {
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const cz = Math.cos(rz);
  const sz = Math.sin(rz);
  // R = Rz * Ry * Rx
  const r = [
    cz * cy, cz * sy * sx - sz * cx, cz * sy * cx + sz * sx,
    sz * cy, sz * sy * sx + cz * cx, sz * sy * cx - cz * sx,
    -sy, cy * sx, cy * cx,
  ];
  return [r[0], r[3], r[6], r[1], r[4], r[7], r[2], r[5], r[8]];
}

/** 타원체 */
function ellipsoid(c, r, k, rot = [0, 0, 0]) {
  const reach = Math.max(...r) + k;
  return {
    type: ELLIPSOID, c, r, k, m: inverseRotation(rot),
    min: [c[0] - reach, c[1] - reach, c[2] - reach],
    max: [c[0] + reach, c[1] + reach, c[2] + reach],
  };
}

/** 양 끝 반지름이 다른 캡슐 (뼈대 / 팔다리) */
function cone(a, b, r1, r2, k) {
  const reach = Math.max(r1, r2) + k;
  return {
    type: CONE, a, b, r1, r2, k,
    ba: [b[0] - a[0], b[1] - a[1], b[2] - a[2]],
    min: [0, 1, 2].map((i) => Math.min(a[i], b[i]) - reach),
    max: [0, 1, 2].map((i) => Math.max(a[i], b[i]) + reach),
  };
}

/** 좌우 대칭으로 두 개 만들기 (s = -1 / 1) */
function mirrored(build) {
  return [-1, 1].map((s) => build(s));
}

/* ===================== 조형 데이터 ===================== */

/** 몸통 (배딱지 계산에도 사용) */
export const TORSO_PRIMS = [
  ellipsoid([0, 1.52, 0], [0.36, 0.24, 0.25], 0.1),
  ellipsoid([0, 1.83, 0], [0.31, 0.3, 0.24], 0.12),
  ellipsoid([0, 2.3, -0.02], [0.46, 0.42, 0.32], 0.12),
  // 대흉근
  ...mirrored((s) => ellipsoid([s * 0.23, 2.46, 0.17], [0.28, 0.18, 0.16], 0.06, [0, 0, s * 0.2])),
  // 외복사근
  ...mirrored((s) => ellipsoid([s * 0.3, 1.88, 0.04], [0.1, 0.24, 0.18], 0.08)),
];

/** 전신 */
export const BODY_PRIMS = [
  ...TORSO_PRIMS,
  // 광배근 (V자 실루엣) · 승모근 · 둔근
  ...mirrored((s) => ellipsoid([s * 0.48, 2.2, -0.07], [0.22, 0.44, 0.22], 0.1, [0, 0, -s * 0.35])),
  ...mirrored((s) => ellipsoid([s * 0.18, 2.77, -0.06], [0.24, 0.14, 0.17], 0.08, [0, 0, -s * 0.45])),
  ...mirrored((s) => ellipsoid([s * 0.17, 1.5, -0.14], [0.19, 0.21, 0.17], 0.08)),

  // 목 · 머리 (거북이 두상: 길쭉한 두개골 + 주둥이 + 턱)
  cone([0, 2.7, -0.04], [0, 3.1, 0.08], 0.21, 0.16, 0.12),
  ellipsoid([0, 3.22, 0.13], [0.19, 0.17, 0.25], 0.08, [-0.1, 0, 0]),
  ellipsoid([0, 3.16, 0.33], [0.12, 0.1, 0.12], 0.07),
  ellipsoid([0, 3.1, 0.22], [0.15, 0.075, 0.2], 0.06),

  // 팔: 어깨 → 위팔(약간 위·앞으로) → 팔꿈치 → 아래팔(안쪽으로 기울임) → 주먹(머리 높이)
  ...mirrored((s) => ellipsoid([s * 0.65, 2.63, 0], [0.22, 0.23, 0.23], 0.07)),
  ...mirrored((s) => cone([s * 0.6, 2.62, 0], [s * 1.18, 2.8, 0.1], 0.16, 0.12, 0.08)),
  ...mirrored((s) => ellipsoid([s * 0.9, 2.81, 0.08], [0.25, 0.17, 0.16], 0.05, [0, 0, s * 0.3])),
  ...mirrored((s) => ellipsoid([s * 0.94, 2.9, 0.08], [0.13, 0.12, 0.12], 0.05)),
  ...mirrored((s) => ellipsoid([s * 0.88, 2.59, -0.04], [0.25, 0.13, 0.15], 0.05, [0, 0, s * 0.3])),
  ...mirrored((s) => ellipsoid([s * 1.19, 2.78, 0.08], [0.1, 0.1, 0.1], 0.06)),
  ...mirrored((s) => cone([s * 1.19, 2.8, 0.1], [s * 1.07, 3.42, 0.09], 0.12, 0.08, 0.06)),
  ...mirrored((s) => ellipsoid([s * 1.17, 2.99, 0.12], [0.13, 0.22, 0.12], 0.05, [0, 0, s * 0.18])),
  ...mirrored((s) => ellipsoid([s * 1.05, 3.53, 0.1], [0.1, 0.12, 0.11], 0.04)),

  // 다리: 대퇴사두(외측광근 · 대퇴직근 · 내측광근) · 햄스트링 · 무릎 · 종아리 · 발
  ...mirrored((s) => cone([s * 0.2, 1.5, 0], [s * 0.3, 0.86, 0.04], 0.2, 0.12, 0.1)),
  ...mirrored((s) => ellipsoid([s * 0.36, 1.16, 0.03], [0.15, 0.32, 0.16], 0.06, [0, 0, s * 0.15])),
  ...mirrored((s) => ellipsoid([s * 0.26, 1.2, 0.13], [0.13, 0.32, 0.13], 0.06, [0, 0, s * 0.15])),
  ...mirrored((s) => ellipsoid([s * 0.2, 0.96, 0.1], [0.11, 0.14, 0.11], 0.05)),
  ...mirrored((s) => ellipsoid([s * 0.27, 1.18, -0.1], [0.15, 0.3, 0.14], 0.06, [0, 0, s * 0.15])),
  ...mirrored((s) => ellipsoid([s * 0.3, 0.86, 0.06], [0.11, 0.11, 0.11], 0.05)),
  ...mirrored((s) => cone([s * 0.3, 0.86, 0.04], [s * 0.35, 0.16, 0], 0.11, 0.07, 0.06)),
  ...mirrored((s) => ellipsoid([s * 0.33, 0.6, -0.07], [0.13, 0.2, 0.13], 0.05)),
  ...mirrored((s) => ellipsoid([s * 0.38, 0.62, -0.04], [0.09, 0.16, 0.09], 0.05)),
  ...mirrored((s) => ellipsoid([s * 0.37, 0.06, 0.07], [0.12, 0.07, 0.21], 0.05, [0, s * 0.3, 0])),
];

/** 눈 위치 (작고 광택 있는 실제 거북이 눈) */
export const EYES = [-1, 1].map((s) => [s * 0.135, 3.26, 0.29]);

/** 등딱지 */
const SHELL = { c: [0, 2.08, -0.2], r: [0.6, 0.84, 0.42] };
/** 등딱지 인갑(scute) 중심점 — 보로노이 경계가 육각형 홈이 된다 (척추판 5 + 늑판 좌우 4) */
const SCUTE_CENTERS = [
  [0, 2.72], [0, 2.4], [0, 2.07], [0, 1.74], [0, 1.43],
  ...[-1, 1].flatMap((s) => [[s * 0.33, 2.58], [s * 0.37, 2.23], [s * 0.37, 1.88], [s * 0.31, 1.54]]),
];

/** 배딱지 (복근처럼 나뉜 판) */
const PLASTRON = { c: [0, 1.9], r: [0.29, 0.55] };
const PLASTRON_ROWS = [2.22, 1.98, 1.74, 1.5];

/** 조형별 계산 영역 (center / half 크기 / 해상도) */
export const GRIDS = {
  body: { center: [0, 1.835, 0.05], half: [1.38, 1.92, 0.48], resolution: 120, maxPolyCount: 400000 },
  shell: { center: [0, 2.08, -0.31], half: [0.66, 0.9, 0.37], resolution: 84, maxPolyCount: 150000 },
  plastron: { center: [0, 1.9, 0.22], half: [0.36, 0.62, 0.23], resolution: 72, maxPolyCount: 100000 },
};

/* ===================== 거리 함수 ===================== */

/** 부드러운 합집합 */
function smin(a, b, k) {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}

/** 부드러운 교집합 */
function smax(a, b, k) {
  return -smin(-a, -b, k);
}

function sdEllipsoid(p, x, y, z) {
  const dx = x - p.c[0];
  const dy = y - p.c[1];
  const dz = z - p.c[2];
  const { m, r } = p;
  const lx = (m[0] * dx + m[1] * dy + m[2] * dz) / r[0];
  const ly = (m[3] * dx + m[4] * dy + m[5] * dz) / r[1];
  const lz = (m[6] * dx + m[7] * dy + m[8] * dz) / r[2];
  const k0 = Math.sqrt(lx * lx + ly * ly + lz * lz);
  const k1 = Math.sqrt((lx / r[0]) ** 2 + (ly / r[1]) ** 2 + (lz / r[2]) ** 2);
  return k1 === 0 ? -Math.min(...r) : (k0 * (k0 - 1)) / k1;
}

function sdCone(p, x, y, z) {
  const pax = x - p.a[0];
  const pay = y - p.a[1];
  const paz = z - p.a[2];
  const [bx, by, bz] = p.ba;
  const h = Math.min(Math.max((pax * bx + pay * by + paz * bz) / (bx * bx + by * by + bz * bz), 0), 1);
  const qx = pax - bx * h;
  const qy = pay - by * h;
  const qz = paz - bz * h;
  return Math.sqrt(qx * qx + qy * qy + qz * qz) - (p.r1 + (p.r2 - p.r1) * h);
}

/** 바깥 기본값 (주변에 도형이 없을 때) */
export const FAR = 0.3;

/**
 * 도형 목록의 smooth union 거리
 *
 * @param {object[]} prims - 이 행(row)에 걸치는 도형 목록
 * @returns {number} 거리 (주변 도형 없으면 FAR)
 */
export function unionDistance(prims, x, y, z) {
  let d = FAR;
  let hasAny = false;
  for (let i = 0; i < prims.length; i += 1) {
    const p = prims[i];
    if (x < p.min[0] || x > p.max[0]) continue;
    const pd = p.type === ELLIPSOID ? sdEllipsoid(p, x, y, z) : sdCone(p, x, y, z);
    d = hasAny ? smin(d, pd, p.k) : pd;
    hasAny = true;
  }
  return d;
}

/** 홈(groove) 근처에서 표면을 살짝 파낸다 */
function groove(dist, depth, width) {
  return depth * Math.max(0, 1 - dist / width);
}

/** 등딱지 거리: 돔 + 정면 절단 + 인갑(scute) 홈 */
export function shellDistance(x, y, z) {
  const { c, r } = SHELL;
  const ex = (x - c[0]) / r[0];
  const ey = (y - c[1]) / r[1];
  const ez = (z - c[2]) / r[2];
  const k0 = Math.sqrt(ex * ex + ey * ey + ez * ez);
  const k1 = Math.sqrt((ex / r[0]) ** 2 + (ey / r[1]) ** 2 + (ez / r[2]) ** 2);
  let d = k1 === 0 ? -0.4 : (k0 * (k0 - 1)) / k1;
  d = smax(d, z + 0.02, 0.04);

  const ringNorm = Math.sqrt(ex * ex + ey * ey);
  const ringDist = Math.abs(ringNorm - 0.82) * r[0];
  let lineDist = ringDist;
  if (ringNorm < 0.82) {
    /** 가장 가까운 두 중심점 거리 차이의 절반 ≈ 보로노이 경계까지의 거리 */
    let nearest = Infinity;
    let second = Infinity;
    for (let i = 0; i < SCUTE_CENTERS.length; i += 1) {
      const dist = Math.hypot(x - SCUTE_CENTERS[i][0], y - SCUTE_CENTERS[i][1]);
      if (dist < nearest) {
        second = nearest;
        nearest = dist;
      } else if (dist < second) {
        second = dist;
      }
    }
    lineDist = Math.min(lineDist, (second - nearest) / 2);
  }
  return d + groove(lineDist, 0.016, 0.026);
}

/** 배딱지 거리: 몸통 표면을 살짝 부풀린 판 + 방패 모양 윤곽 + 판 사이 홈 */
export function plastronDistance(torsoDistance, x, y, z) {
  const { c, r } = PLASTRON;
  const outline = (Math.sqrt(((x - c[0]) / r[0]) ** 2 + ((y - c[1]) / r[1]) ** 2) - 1) * r[0];
  let d = smax(torsoDistance - 0.03, outline, 0.03);
  d = smax(d, 0.02 - z, 0.02);

  let lineDist = Math.abs(x);
  for (let i = 0; i < PLASTRON_ROWS.length; i += 1) lineDist = Math.min(lineDist, Math.abs(y - PLASTRON_ROWS[i]));
  return d + groove(lineDist, 0.014, 0.022);
}
