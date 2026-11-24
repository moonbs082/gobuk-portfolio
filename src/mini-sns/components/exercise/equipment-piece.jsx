import { EQUIPMENT_MATERIALS } from '../../utils/mannequin-materials.js';

/**
 * EquipmentPiece 컴포넌트 (R3F Canvas 내부 전용)
 * 운동 기구를 이루는 단순한 도형 한 조각 (상자 / 원기둥 / 구).
 *
 * Props:
 * @param {string} shape - 'box' | 'cylinder' | 'sphere' [Required]
 * @param {number[]} args - 도형 생성 인자 [Required]
 * @param {number[]} position - 위치 [x, y, z] [Optional]
 * @param {number[]} rotation - 회전 [x, y, z] (라디안) [Optional]
 * @param {string} tone - 재질 이름 (frame | pad | metal | plate | mat | cable) [Optional, 기본값: 'frame']
 *
 * Example usage:
 * <EquipmentPiece shape="box" args={ [0.3, 0.07, 1.2] } position={ [0, 0.46, 0] } tone="pad" />
 */
function EquipmentPiece({ shape, args, position, rotation, tone = 'frame' }) {
  return (
    <mesh position={ position } rotation={ rotation } material={ EQUIPMENT_MATERIALS[tone] } castShadow receiveShadow>
      { shape === 'box' && <boxGeometry args={ args } /> }
      { shape === 'cylinder' && <cylinderGeometry args={ args } /> }
      { shape === 'sphere' && <sphereGeometry args={ args } /> }
    </mesh>
  );
}

export default EquipmentPiece;
