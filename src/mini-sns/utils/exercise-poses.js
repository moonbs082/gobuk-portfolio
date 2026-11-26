/**
 * 운동별 3D 자세 데이터 (마네킹 관절 각도 · 기구 배치)
 *
 * 좌표 기준: 바닥 y = 0, 마네킹은 기본적으로 +z(정면)를 바라본다. 왼쪽 = +x.
 * 관절 각도(라디안, [x, y, z], 회전 순서 'XZY' = 비틀기 → 벌리기 → 앞뒤로 들기)
 * - 어깨 · 고관절 x: 음수 = 앞으로 들기, 양수 = 뒤로 보내기
 * - 팔꿈치 x: 음수 = 굽히기 / 무릎 x: 양수 = 굽히기
 * - 척추 x: 양수 = 앞으로 숙이기 / 머리 x: 음수 = 위를 보기
 * - 왼쪽 관절 z: 양수 = 바깥으로 벌리기 (오른쪽은 자동으로 좌우 반전)
 *
 * start ↔ end 두 자세를 오가며 동작을 보여준다.
 * - isGrounded: true 면 발바닥이 바닥에 붙도록 몸 위치를 자동으로 맞춘다.
 * - held: 손에 쥔 기구 ('barbell' | 'lat-bar' | 'v-handle' | 'dumbbells')
 * - dumbbellDir: 덤벨 손잡이가 향할 방향 (예: [1, 0, 0] = 좌우 가로). 없으면 손 방향을 따른다
 * - cableAnchor: 손잡이와 연결되는 케이블 도르래 위치
 * - legIk: { stance, toeOut } 가 있으면 발목 위치(좌우 ±stance)와 발끝 방향(바깥으로 toeOut)을 고정하고
 *   골반 위치에 맞춰 다리 각도를 자동 계산한다. (발이 미끄러지지 않음)
 * - barOnBack: { position, gripWidth, elbowDir } 가 있으면 바벨을 척추 기준 position(승모근 위)에 고정하고
 *   두 손이 바 중앙에서 ±gripWidth 지점을 쥐도록 팔 각도를 자동 계산한다. (elbowDir: 팔꿈치 방향, 척추 기준)
 * - barPath: { start, end, gripWidth, elbowDir } 가 있으면 바 중앙을 척추 기준 start ↔ end 위치로 움직이고
 *   두 손이 항상 바 중앙에서 ±gripWidth 지점을 쥐도록 팔 각도를 자동 계산한다. (그립 너비 고정)
 * - muscles: { primary, secondary } 주동근(빨강) · 보조근(연한 빨강)으로 강조할 근육
 * - footPlate: 발에 붙어 움직이는 발판 (normal = 발판이 바라보는 방향)
 * - equipment: 고정된 기구 조각 목록 (shape: box | cylinder | sphere, tone: frame | pad | metal | plate | mat)
 */

/**
 * 좌우 대칭 관절 각도 만들기 (오른쪽은 y · z 를 반전)
 * @param {string} joint - 관절 이름 (Shoulder, Elbow, Hip, Knee, Ankle)
 * @param {number[]} angles - 왼쪽 기준 [x, y, z]
 * @returns {object}
 */
function sym(joint, [x = 0, y = 0, z = 0]) {
  return { [`l${joint}`]: [x, y, z], [`r${joint}`]: [x, -y, -z] };
}

/** 근육 이름 → 화면에 보여줄 한글 이름 */
export const MUSCLE_LABELS = {
  chest: '대흉근(가슴)',
  shoulders: '삼각근(어깨)',
  biceps: '이두근',
  triceps: '삼두근',
  lats: '광배근(등)',
  traps: '승모근',
  abs: '복근',
  lowerBack: '척추기립근(허리)',
  glutes: '둔근(엉덩이)',
  quads: '대퇴사두근(앞허벅지)',
  hamstrings: '햄스트링(뒤허벅지)',
  calves: '종아리',
};

/** 원기둥을 x축 방향으로 눕히는 회전 */
const ALONG_X = [0, 0, Math.PI / 2];

export const EXERCISE_POSES = {
  squat: {
    caption: '바벨을 등에 얹고, 발은 바닥에 고정한 채 엉덩이를 뒤로 빼며 허벅지가 바닥과 평행할 때까지 앉았다 일어나요.',
    muscles: { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'lowerBack'] },
    viewAngle: -0.6,
    held: 'barbell',
    legIk: { stance: 0.16, toeOut: 0.3 },
    barOnBack: { position: [0, 0.46, -0.13], gripWidth: 0.46, elbowDir: [0.3, -1, -0.35] },
    start: {
      rootPosition: [0, 0.975, 0.03],
      spine: [0.08, 0, 0],
    },
    end: {
      rootPosition: [0, 0.5, -0.18],
      rootRotation: [0.38, 0, 0],
      spine: [0.25, 0, 0],
      head: [-0.45, 0, 0],
    },
    equipment: [
      { shape: 'box', args: [0.07, 1.9, 0.07], position: [0.62, 0.95, -0.42], tone: 'frame' },
      { shape: 'box', args: [0.07, 1.9, 0.07], position: [-0.62, 0.95, -0.42], tone: 'frame' },
      { shape: 'box', args: [1.31, 0.07, 0.07], position: [0, 1.9, -0.42], tone: 'frame' },
    ],
  },
  'bench-press': {
    caption: '견갑골을 모은 채 바를 가슴 중앙까지 내렸다가 팔을 곧게 펴며 밀어 올려요.',
    muscles: { primary: ['chest'], secondary: ['shoulders', 'triceps'] },
    viewAngle: -1.25,
    held: 'barbell',
    barPath: { start: [0, 0.42, 0.55], end: [0, 0.36, 0.15], gripWidth: 0.4, elbowDir: [0.7, -0.35, -0.6] },
    start: {
      rootPosition: [0, 0.61, 0.25],
      rootRotation: [-Math.PI / 2, 0, 0],
      ...sym('Hip', [0.3, 0, 0.25]),
      ...sym('Knee', [1.27]),
    },
    end: {
      rootPosition: [0, 0.61, 0.25],
      rootRotation: [-Math.PI / 2, 0, 0],
      ...sym('Hip', [0.3, 0, 0.25]),
      ...sym('Knee', [1.27]),
    },
    equipment: [
      { shape: 'box', args: [0.3, 0.07, 1.2], position: [0, 0.465, -0.1], tone: 'pad' },
      { shape: 'box', args: [0.08, 0.43, 0.08], position: [0, 0.215, 0.35], tone: 'frame' },
      { shape: 'box', args: [0.08, 0.43, 0.08], position: [0, 0.215, -0.55], tone: 'frame' },
      { shape: 'box', args: [0.5, 0.04, 0.08], position: [0, 0.02, 0.35], tone: 'frame' },
      { shape: 'box', args: [0.5, 0.04, 0.08], position: [0, 0.02, -0.55], tone: 'frame' },
      { shape: 'box', args: [0.06, 1.2, 0.06], position: [0.55, 0.6, -0.62], tone: 'frame' },
      { shape: 'box', args: [0.06, 1.2, 0.06], position: [-0.55, 0.6, -0.62], tone: 'frame' },
    ],
  },
  deadlift: {
    caption: '등을 곧게 편 채 바를 다리에 붙여 끌어올리고, 같은 길로 내려놓아요.',
    muscles: { primary: ['glutes', 'hamstrings', 'lowerBack'], secondary: ['quads', 'traps', 'lats'] },
    viewAngle: -1.0,
    isGrounded: true,
    held: 'barbell',
    start: {
      rootRotation: [0.7, 0, 0],
      spine: [0.25, 0, 0],
      head: [-0.55, 0, 0],
      ...sym('Shoulder', [-0.95, 0, 0.06]),
      ...sym('Hip', [-1.75, 0, 0.06]),
      ...sym('Knee', [1.15]),
      ...sym('Ankle', [-0.1]),
    },
    end: {
      ...sym('Shoulder', [-0.05, 0, 0.06]),
      ...sym('Hip', [0, 0, 0.06]),
    },
    equipment: [
      { shape: 'box', args: [2.3, 0.02, 1.3], position: [0, 0.01, 0], tone: 'mat' },
    ],
  },
  'lat-pulldown': {
    caption: '가슴을 살짝 들고, 팔꿈치를 옆구리로 끌어내리듯 바를 쇄골까지 당겨요.',
    muscles: { primary: ['lats'], secondary: ['biceps', 'traps'] },
    viewAngle: -0.7,
    held: 'lat-bar',
    cableAnchor: [0, 2.28, 0.12],
    barPath: { start: [0, 0.97, 0.08], end: [0, 0.42, 0.18], gripWidth: 0.42, elbowDir: [0.7, -0.6, -0.3] },
    start: {
      rootPosition: [0, 0.55, 0],
      spine: [-0.15, 0, 0],
      head: [-0.15, 0, 0],
      ...sym('Hip', [-1.5, 0, 0.12]),
      ...sym('Knee', [1.5]),
    },
    end: {
      rootPosition: [0, 0.55, 0],
      spine: [-0.3, 0, 0],
      ...sym('Hip', [-1.5, 0, 0.12]),
      ...sym('Knee', [1.5]),
    },
    equipment: [
      { shape: 'box', args: [0.42, 0.07, 0.4], position: [0, 0.395, 0.03], tone: 'pad' },
      { shape: 'box', args: [0.08, 0.36, 0.08], position: [0, 0.18, 0.03], tone: 'frame' },
      { shape: 'cylinder', args: [0.05, 0.05, 0.5, 16], position: [0, 0.66, 0.36], rotation: ALONG_X, tone: 'pad' },
      { shape: 'box', args: [0.1, 2.35, 0.1], position: [0, 1.175, 0.6], tone: 'frame' },
      { shape: 'box', args: [0.08, 0.08, 0.8], position: [0, 2.32, 0.22], tone: 'frame' },
      { shape: 'sphere', args: [0.05, 16, 12], position: [0, 2.28, 0.12], tone: 'metal' },
      { shape: 'box', args: [0.3, 0.8, 0.18], position: [0, 0.45, 0.78], tone: 'pad' },
    ],
  },
  'leg-press': {
    caption: '등과 엉덩이를 등받이에 붙이고, 무릎이 90도가 될 때까지 내렸다가 발뒤꿈치로 밀어요.',
    muscles: { primary: ['quads', 'glutes'], secondary: ['hamstrings', 'calves'] },
    viewAngle: -1.15,
    footPlate: { normal: [0, 0.707, 0.707], size: [0.62, 0.04, 0.45] },
    start: {
      rootPosition: [0, 0.55, 0],
      rootRotation: [-1.0, 0, 0],
      head: [0.4, 0, 0],
      ...sym('Shoulder', [0, 0, 0.2]),
      ...sym('Elbow', [-0.3]),
      ...sym('Hip', [-1.36, 0, 0.12]),
      ...sym('Knee', [0.15]),
    },
    end: {
      rootPosition: [0, 0.55, 0],
      rootRotation: [-1.0, 0, 0],
      head: [0.4, 0, 0],
      ...sym('Shoulder', [0, 0, 0.2]),
      ...sym('Elbow', [-0.3]),
      ...sym('Hip', [-2.0, 0, 0.18]),
      ...sym('Knee', [1.75]),
    },
    equipment: [
      { shape: 'box', args: [0.46, 0.85, 0.07], position: [0, 0.6, -0.34], rotation: [-1.0, 0, 0], tone: 'pad' },
      { shape: 'box', args: [0.46, 0.07, 0.36], position: [0, 0.37, 0.02], rotation: [-0.45, 0, 0], tone: 'pad' },
      { shape: 'box', args: [0.1, 0.4, 0.5], position: [0, 0.18, -0.1], tone: 'frame' },
      { shape: 'cylinder', args: [0.03, 0.03, 1.5, 12], position: [0.36, 1.0, 0.62], rotation: [Math.PI / 4, 0, 0], tone: 'metal' },
      { shape: 'cylinder', args: [0.03, 0.03, 1.5, 12], position: [-0.36, 1.0, 0.62], rotation: [Math.PI / 4, 0, 0], tone: 'metal' },
      { shape: 'box', args: [0.9, 0.06, 1.5], position: [0, 0.03, 0.35], tone: 'frame' },
    ],
  },
  'shoulder-press': {
    caption: '등을 등받이에 붙이고, 귀 높이의 덤벨을 머리 위로 밀어 올렸다 천천히 내려요.',
    muscles: { primary: ['shoulders'], secondary: ['triceps', 'traps'] },
    viewAngle: -0.55,
    held: 'dumbbells',
    dumbbellDir: [1, 0, 0],
    start: {
      rootPosition: [0, 0.56, 0],
      ...sym('Shoulder', [-0.25, 1.57, 1.4]),
      ...sym('Elbow', [-1.6]),
      ...sym('Hip', [-1.5, 0, 0.2]),
      ...sym('Knee', [1.5]),
    },
    end: {
      rootPosition: [0, 0.56, 0],
      ...sym('Shoulder', [-0.15, 1.57, 2.85]),
      ...sym('Elbow', [-0.12]),
      ...sym('Hip', [-1.5, 0, 0.2]),
      ...sym('Knee', [1.5]),
    },
    equipment: [
      { shape: 'box', args: [0.42, 0.07, 0.4], position: [0, 0.405, 0.03], tone: 'pad' },
      { shape: 'box', args: [0.42, 0.8, 0.07], position: [0, 0.86, -0.18], rotation: [-0.1, 0, 0], tone: 'pad' },
      { shape: 'box', args: [0.08, 0.37, 0.08], position: [0, 0.185, 0], tone: 'frame' },
      { shape: 'box', args: [0.5, 0.04, 0.5], position: [0, 0.02, -0.05], tone: 'frame' },
    ],
  },
  'seated-row': {
    caption: '허리를 곧게 세운 채 팔꿈치를 몸 뒤로 보내며 손잡이를 배꼽 쪽으로 당겨요.',
    muscles: { primary: ['lats', 'traps'], secondary: ['biceps', 'shoulders'] },
    viewAngle: -1.2,
    held: 'v-handle',
    cableAnchor: [0, 0.45, 1.5],
    footPlate: { normal: [0, -0.4, 0.92], size: [0.5, 0.04, 0.35] },
    start: {
      rootPosition: [0, 0.5, 0],
      spine: [0.3, 0, 0],
      head: [-0.25, 0, 0],
      ...sym('Shoulder', [-1.7, 0, -0.08]),
      ...sym('Elbow', [-0.05]),
      ...sym('Hip', [-1.45, 0, 0.08]),
      ...sym('Knee', [0.55]),
    },
    end: {
      rootPosition: [0, 0.5, 0],
      spine: [-0.1, 0, 0],
      ...sym('Shoulder', [0.55, 0, -0.05]),
      ...sym('Elbow', [-1.95]),
      ...sym('Hip', [-1.45, 0, 0.08]),
      ...sym('Knee', [0.55]),
    },
    equipment: [
      { shape: 'box', args: [0.36, 0.06, 0.4], position: [0, 0.35, 0], tone: 'pad' },
      { shape: 'box', args: [0.2, 0.32, 0.2], position: [0, 0.16, 0], tone: 'frame' },
      { shape: 'box', args: [0.22, 0.06, 1.7], position: [0, 0.03, 0.75], tone: 'frame' },
      { shape: 'box', args: [0.12, 1.3, 0.12], position: [0, 0.65, 1.62], tone: 'frame' },
      { shape: 'sphere', args: [0.05, 16, 12], position: [0, 0.45, 1.5], tone: 'metal' },
    ],
  },
  plank: {
    caption: '팔꿈치를 어깨 바로 아래에 두고, 머리부터 발뒤꿈치까지 일직선을 유지해요.',
    muscles: { primary: ['abs'], secondary: ['shoulders', 'glutes'] },
    viewAngle: -1.3,
    start: {
      rootPosition: [0, 0.27, -0.1],
      rootRotation: [1.39, 0, 0],
      ...sym('Shoulder', [-1.39, 0, 0.05]),
      ...sym('Elbow', [-1.57]),
      ...sym('Hip', [0, 0, 0.05]),
      ...sym('Ankle', [0.18]),
    },
    end: {
      rootPosition: [0, 0.275, -0.1],
      rootRotation: [1.39, 0, 0],
      spine: [-0.02, 0, 0],
      ...sym('Shoulder', [-1.39, 0, 0.05]),
      ...sym('Elbow', [-1.57]),
      ...sym('Hip', [0, 0, 0.05]),
      ...sym('Ankle', [0.18]),
    },
    equipment: [
      { shape: 'box', args: [0.7, 0.015, 2.0], position: [0, 0.0075, -0.15], tone: 'mat' },
    ],
  },
};

/**
 * id 로 운동 3D 자세 데이터 찾기
 * @param {string} exerciseId - 운동 id
 * @returns {object | undefined}
 */
export function findExercisePose(exerciseId) {
  return EXERCISE_POSES[exerciseId];
}
