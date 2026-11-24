import { useFrame } from '@react-three/fiber';

/**
 * CameraZoom 컴포넌트 (R3F Canvas 내부 전용)
 * zoomRef 의 거리 배율에 맞춰 카메라를 바라보는 지점 쪽으로 부드럽게 당기거나 민다.
 * (배율 1 = 기본 거리, 작을수록 확대)
 *
 * Props:
 * @param {object} zoomRef - 목표 거리 배율 ref ({ current: number }) [Required]
 * @param {number[]} basePosition - 배율 1 일 때 카메라 위치 [x, y, z] [Required]
 * @param {number[]} target - 카메라가 바라보는 지점 [x, y, z] [Required]
 *
 * Example usage:
 * <CameraZoom zoomRef={ zoomRef } basePosition={ [0, 1.2, 4.7] } target={ [0, 0.85, 0] } />
 */
function CameraZoom({ zoomRef, basePosition, target }) {
  useFrame(({ camera }, delta) => {
    const [bx, by, bz] = basePosition;
    const [tx, ty, tz] = target;
    const scale = zoomRef.current;
    /** 목표 위치로 조금씩 다가가 부드럽게 확대 · 축소 */
    const ease = 1 - Math.pow(0.0015, delta);
    camera.position.x += (tx + (bx - tx) * scale - camera.position.x) * ease;
    camera.position.y += (ty + (by - ty) * scale - camera.position.y) * ease;
    camera.position.z += (tz + (bz - tz) * scale - camera.position.z) * ease;
    camera.lookAt(tx, ty, tz);
  });

  return null;
}

export default CameraZoom;
