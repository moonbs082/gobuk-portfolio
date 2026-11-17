/** 숙련도 평가 기준 (행동 기준 5단계) */
export const levelGuide = [
  { level: 1, name: '입문', criteria: '문법과 개념을 이해하고, 예제를 따라 만들 수 있음' },
  { level: 2, name: '기초', criteria: '문서를 보며 혼자 간단한 기능을 구현할 수 있음' },
  { level: 3, name: '실무 기초', criteria: '개인 프로젝트를 처음부터 끝까지 완성하고 배포함' },
  { level: 4, name: '숙련', criteria: '구조를 설계하고, 다른 사람 코드를 리뷰·리팩터링함' },
  { level: 5, name: '전문', criteria: '팀 기준을 만들고 다른 사람을 가르칠 수 있음' },
];

export const MAX_LEVEL = levelGuide.length;

/**
 * 주력 기술 5개
 * TODO: level / months / projects / certificate 는 예시 값이므로 실제 경험에 맞게 수정할 것
 */
export const skills = [
  {
    id: 'html',
    name: 'HTML',
    level: 3,
    months: 6,
    projects: 4,
    certificate: '',
    canDo: ['시맨틱 마크업', '웹 접근성 기본', '폼 구성'],
  },
  {
    id: 'css',
    name: 'CSS',
    level: 3,
    months: 6,
    projects: 4,
    certificate: '',
    canDo: ['Flexbox · Grid 레이아웃', '반응형 디자인', '트랜지션 · 3D 변형'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    level: 2,
    months: 4,
    projects: 3,
    certificate: '',
    canDo: ['DOM 조작 · 이벤트', '배열 · 객체 다루기', '비동기 fetch'],
  },
  {
    id: 'react',
    name: 'React',
    level: 2,
    months: 3,
    projects: 3,
    certificate: '',
    canDo: ['컴포넌트 설계', 'useState · useEffect', 'MUI 기반 UI 구성'],
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    level: 1,
    months: 1,
    projects: 1,
    certificate: '',
    canDo: ['npm 패키지 관리', '개발 서버 · 빌드 환경 이해'],
  },
];

/** 성격 스탯 (재미 요소) */
export const bonusStats = [
  { id: 'never-give-up', label: '포기하지 않기', value: 'Lv.MAX' },
  { id: 'on-time', label: '기상 정시성', value: 'Lv.MAX' },
  { id: 'gym', label: '헬스 꾸준함', value: 'Lv.MAX' },
];
