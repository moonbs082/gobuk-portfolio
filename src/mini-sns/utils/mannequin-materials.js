import * as THREE from 'three';

/**
 * 3D 자세 보기에서 함께 쓰는 재질 (한 번만 만들어 재사용)
 * - 몸: 밝은 회색 면 + 진한 와이어프레임 격자 (3D 모델링 메시 느낌)
 * - 근육 강조: 주동근(빨강) / 보조근(연한 빨강)
 * - 기구: 프레임 · 패드 · 금속 · 원판 · 매트
 */

/** 와이어프레임 선이 위에 보이도록 면을 살짝 뒤로 미는 설정 */
const SURFACE_OFFSET = { polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 };

/** 몸 표면 재질 (tone 이름 → 재질) */
export const BODY_SURFACE_MATERIALS = {
  base: new THREE.MeshStandardMaterial({ color: '#d9d9d9', roughness: 0.72, metalness: 0.05, ...SURFACE_OFFSET }),
  primary: new THREE.MeshStandardMaterial({ color: '#e53935', roughness: 0.6, metalness: 0.05, ...SURFACE_OFFSET }),
  secondary: new THREE.MeshStandardMaterial({ color: '#f19c99', roughness: 0.65, metalness: 0.05, ...SURFACE_OFFSET }),
};

/** 마네킹 몸 위의 메시 격자 선 */
export const BODY_WIRE_MATERIAL = new THREE.MeshBasicMaterial({
  color: '#2b2b2b',
  wireframe: true,
  transparent: true,
  opacity: 0.3,
});

/** 기구 재질 (tone 이름 → 재질) */
export const EQUIPMENT_MATERIALS = {
  frame: new THREE.MeshStandardMaterial({ color: '#4a4d52', roughness: 0.5, metalness: 0.55 }),
  pad: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.85 }),
  metal: new THREE.MeshStandardMaterial({ color: '#b9bec4', roughness: 0.3, metalness: 0.85 }),
  plate: new THREE.MeshStandardMaterial({ color: '#151515', roughness: 0.6, metalness: 0.1 }),
  mat: new THREE.MeshStandardMaterial({ color: '#8f8f8f', roughness: 0.95 }),
  cable: new THREE.MeshStandardMaterial({ color: '#1b1b1b', roughness: 0.6 }),
};
