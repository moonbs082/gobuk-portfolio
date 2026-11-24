import { useMemo } from 'react';
import * as THREE from 'three';
import { BODY_SURFACE_MATERIALS, BODY_WIRE_MATERIAL } from '../../utils/mannequin-materials.js';

/**
 * BodyPart 컴포넌트 (R3F Canvas 내부 전용)
 * 마네킹 몸의 한 조각을 면 + 메시 격자 선으로 그린다.
 *
 * Props:
 * @param {string} shape - 'sphere' | 'cylinder' [Optional, 기본값: 'sphere']
 * @param {number[]} args - 도형 생성 인자 (sphere: [반지름, 가로분할, 세로분할] / cylinder: [위반지름, 아래반지름, 높이, 둘레분할, 높이분할]) [Optional, 기본값: [1, 24, 16]]
 * @param {number[]} position - 위치 [x, y, z] [Optional]
 * @param {number[]} scale - 크기 배율 [x, y, z] [Optional]
 * @param {string} tone - 표면 색 'base' | 'primary'(주동근) | 'secondary'(보조근) [Optional, 기본값: 'base']
 *
 * Example usage:
 * <BodyPart shape="sphere" scale={ [0.1, 0.12, 0.1] } position={ [0, 0.1, 0] } tone="primary" />
 */
function BodyPart({ shape = 'sphere', args = [1, 24, 16], position, scale, tone = 'base' }) {
  /** 배열은 렌더마다 새로 만들어지므로 문자열 키로 비교해 도형을 한 번만 만든다 */
  const argsKey = args.join(',');
  const geometry = useMemo(() => {
    const values = argsKey.split(',').map(Number);
    return shape === 'cylinder' ? new THREE.CylinderGeometry(...values) : new THREE.SphereGeometry(...values);
  }, [shape, argsKey]);

  return (
    <group position={ position } scale={ scale }>
      <mesh geometry={ geometry } material={ BODY_SURFACE_MATERIALS[tone] } castShadow />
      <mesh geometry={ geometry } material={ BODY_WIRE_MATERIAL } />
    </group>
  );
}

export default BodyPart;
