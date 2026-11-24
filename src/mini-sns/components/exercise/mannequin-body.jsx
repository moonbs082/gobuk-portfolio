import BodyPart from './body-part.jsx';

/** 좌우 팔 · 다리 (s: 왼쪽 1 / 오른쪽 -1) */
const SIDES = [
  { key: 'l', s: 1 },
  { key: 'r', s: -1 },
];

/**
 * MannequinBody 컴포넌트 (R3F Canvas 내부 전용)
 * 근육 윤곽이 있는 3D 사람 마네킹 (키 약 1.8, 골반 중심이 원점).
 * 관절마다 group 을 두고 jointRefs 에 등록해, 바깥(PostureRig)에서 각도를 움직인다.
 * 등록되는 관절: root, spine, head, l/rShoulder, l/rElbow, l/rGrip, l/rHip, l/rKnee, l/rAnkle
 * 운동에 쓰이는 근육은 주동근(빨강) · 보조근(연한 빨강)으로 칠한다.
 * 근육 이름: chest, shoulders, biceps, triceps, lats, traps, abs, lowerBack, glutes, quads, hamstrings, calves
 *
 * Props:
 * @param {object} jointRefs - 관절 group 을 담을 ref 객체 (useRef({})) [Required]
 * @param {object} muscles - 강조할 근육 { primary: string[], secondary: string[] } [Optional, 기본값: 강조 없음]
 *
 * Example usage:
 * <MannequinBody jointRefs={ jointRefs } muscles={{ primary: ['quads'], secondary: ['hamstrings'] }} />
 */
function MannequinBody({ jointRefs, muscles = {} }) {
  const { primary = [], secondary = [] } = muscles;

  /** 이름으로 관절 group 등록 */
  const bind = (name) => (node) => {
    if (node) jointRefs.current[name] = node;
  };

  /** 근육 이름 → 표면 색 */
  const toneOf = (muscle) => {
    if (primary.includes(muscle)) return 'primary';
    if (secondary.includes(muscle)) return 'secondary';
    return 'base';
  };

  return (
    <group ref={ bind('root') }>
      {/* 골반 · 엉덩이 */}
      <BodyPart scale={ [0.155, 0.12, 0.115] } />
      <BodyPart scale={ [0.085, 0.095, 0.075] } position={ [0.07, -0.03, -0.06] } tone={ toneOf('glutes') } />
      <BodyPart scale={ [0.085, 0.095, 0.075] } position={ [-0.07, -0.03, -0.06] } tone={ toneOf('glutes') } />

      {/* 몸통 */}
      <group ref={ bind('spine') } position={ [0, 0.05, 0] }>
        <BodyPart shape="cylinder" args={ [0.125, 0.14, 0.24, 20, 8] } position={ [0, 0.12, 0] } />
        <BodyPart scale={ [0.195, 0.17, 0.125] } position={ [0, 0.33, 0] } />
        <BodyPart scale={ [0.085, 0.065, 0.045] } position={ [0.075, 0.36, 0.085] } tone={ toneOf('chest') } />
        <BodyPart scale={ [0.085, 0.065, 0.045] } position={ [-0.075, 0.36, 0.085] } tone={ toneOf('chest') } />
        <BodyPart scale={ [0.07, 0.12, 0.035] } position={ [0, 0.17, 0.1] } tone={ toneOf('abs') } />
        <BodyPart scale={ [0.07, 0.15, 0.05] } position={ [0.11, 0.27, -0.075] } tone={ toneOf('lats') } />
        <BodyPart scale={ [0.07, 0.15, 0.05] } position={ [-0.11, 0.27, -0.075] } tone={ toneOf('lats') } />
        <BodyPart scale={ [0.07, 0.12, 0.04] } position={ [0, 0.12, -0.11] } tone={ toneOf('lowerBack') } />
        <BodyPart scale={ [0.13, 0.06, 0.08] } position={ [0, 0.45, -0.02] } tone={ toneOf('traps') } />
        <BodyPart shape="cylinder" args={ [0.05, 0.058, 0.12, 16, 4] } position={ [0, 0.52, 0] } />

        {/* 머리 */}
        <group ref={ bind('head') } position={ [0, 0.56, 0] }>
          <BodyPart scale={ [0.095, 0.118, 0.105] } position={ [0, 0.11, 0.01] } />
          <BodyPart scale={ [0.02, 0.025, 0.02] } position={ [0, 0.1, 0.11] } />
        </group>

        {/* 팔 */}
        { SIDES.map(({ key, s }) => (
          <group key={ key } ref={ bind(`${key}Shoulder`) } position={ [s * 0.205, 0.44, 0] }>
            <BodyPart scale={ [0.07, 0.075, 0.07] } position={ [s * 0.01, -0.02, 0] } tone={ toneOf('shoulders') } />
            <BodyPart shape="cylinder" args={ [0.052, 0.042, 0.27, 16, 8] } position={ [0, -0.15, 0] } />
            <BodyPart scale={ [0.045, 0.08, 0.05] } position={ [0, -0.14, 0.015] } tone={ toneOf('biceps') } />
            <BodyPart scale={ [0.045, 0.085, 0.045] } position={ [0, -0.13, -0.02] } tone={ toneOf('triceps') } />
            <group ref={ bind(`${key}Elbow`) } position={ [0, -0.29, 0] }>
              <BodyPart args={ [0.042, 16, 12] } />
              <BodyPart shape="cylinder" args={ [0.045, 0.03, 0.25, 16, 8] } position={ [0, -0.125, 0] } />
              <group position={ [0, -0.27, 0] }>
                <BodyPart scale={ [0.032, 0.065, 0.042] } position={ [0, -0.045, 0] } />
                <group ref={ bind(`${key}Grip`) } position={ [0, -0.05, 0] } />
              </group>
            </group>
          </group>
        )) }
      </group>

      {/* 다리 */}
      { SIDES.map(({ key, s }) => (
        <group key={ key } ref={ bind(`${key}Hip`) } position={ [s * 0.09, -0.05, 0] }>
          <BodyPart shape="cylinder" args={ [0.082, 0.058, 0.42, 18, 10] } position={ [0, -0.22, 0] } />
          <BodyPart scale={ [0.074, 0.19, 0.062] } position={ [0, -0.21, 0.03] } tone={ toneOf('quads') } />
          <BodyPart scale={ [0.064, 0.16, 0.055] } position={ [0, -0.21, -0.035] } tone={ toneOf('hamstrings') } />
          <group ref={ bind(`${key}Knee`) } position={ [0, -0.44, 0] }>
            <BodyPart args={ [0.055, 16, 12] } />
            <BodyPart shape="cylinder" args={ [0.056, 0.04, 0.41, 16, 8] } position={ [0, -0.215, 0] } />
            <BodyPart scale={ [0.05, 0.11, 0.055] } position={ [0, -0.13, -0.02] } tone={ toneOf('calves') } />
            <group ref={ bind(`${key}Ankle`) } position={ [0, -0.43, 0] }>
              <BodyPart scale={ [0.045, 0.035, 0.115] } position={ [0, -0.035, 0.055] } />
            </group>
          </group>
        </group>
      )) }
    </group>
  );
}

export default MannequinBody;
