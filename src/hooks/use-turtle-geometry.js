import { useEffect, useState } from 'react';
import { BufferAttribute, BufferGeometry } from 'three';

/** 워커 계산 결과 캐시 (페이지를 다시 방문해도 재계산하지 않음) */
let meshDataPromise = null;

/** 워커를 실행해 메시 데이터를 받아온다 */
function loadMeshData() {
  if (!meshDataPromise) {
    meshDataPromise = new Promise((resolve, reject) => {
      const worker = new Worker(new URL('../workers/turtle-mesh.worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (event) => {
        resolve(event.data);
        worker.terminate();
      };
      worker.onerror = (error) => {
        meshDataPromise = null;
        reject(error);
        worker.terminate();
      };
    });
  }
  return meshDataPromise;
}

/** position / normal 배열로 BufferGeometry 생성 */
function toGeometry({ position, normal }) {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(position, 3));
  geometry.setAttribute('normal', new BufferAttribute(normal, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

/**
 * 거북이 조형 메시(body / shell / plastron)를 워커에서 만들어 반환하는 훅
 *
 * @returns {object|null} { body, shell, plastron } BufferGeometry, 준비 전에는 null
 *
 * Example usage:
 * const geometries = useTurtleGeometry();
 */
function useTurtleGeometry() {
  const [geometries, setGeometries] = useState(null);

  useEffect(() => {
    let isActive = true;
    loadMeshData()
      .then((data) => {
        if (!isActive) return;
        setGeometries({
          body: toGeometry(data.body),
          shell: toGeometry(data.shell),
          plastron: toGeometry(data.plastron),
        });
      })
      .catch(() => {
        /** 실패 시 모델 없이 배경 연출만 유지 */
      });
    return () => {
      isActive = false;
    };
  }, []);

  /** 언마운트 / 교체 시 GPU 메모리 해제 */
  useEffect(() => () => {
    if (geometries) Object.values(geometries).forEach((geometry) => geometry.dispose());
  }, [geometries]);

  return geometries;
}

export default useTurtleGeometry;
