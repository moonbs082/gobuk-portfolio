/** 홈 화면에 표시할 스킬 개수 */
export const HOME_SKILL_COUNT = 4;

/** 스킬 카테고리 (표시 순서 + 구분 색상) */
export const skillCategories = [
  { id: 'Frontend', label: 'Frontend', color: '#FF6B1A' },
  { id: 'Framework', label: 'Framework', color: '#E5252E' },
  { id: 'Design', label: 'Design', color: '#FFB547' },
  { id: 'Backend', label: 'Backend', color: '#4DB6AC' },
  { id: 'Tools', label: '도구 & 기타', color: '#9FA8DA' },
];

/** 아이콘 키 → 이모지 */
export const skillIcons = {
  'orange-diamond': '🔶',
  palette: '🎨',
  zap: '⚡',
  atom: '⚛️',
  target: '🎯',
  'green-heart': '💚',
  shield: '🛡️',
  'blue-book': '📘',
  'green-circle': '🟢',
  snake: '🐍',
  coffee: '☕',
  branch: '🔀',
  phone: '📱',
  leaf: '🍃',
};

/** '스킬 추가' 버튼으로 추가할 수 있는 기술 목록 */
export const skillPresets = [
  { name: 'Vue.js', icon: 'green-heart', category: 'Frontend', description: '반응형 데이터 바인딩 기반 UI 프레임워크' },
  { name: 'Angular', icon: 'shield', category: 'Frontend', description: 'TypeScript 기반의 대규모 SPA 프레임워크' },
  { name: 'TypeScript', icon: 'blue-book', category: 'Frontend', description: '정적 타입으로 안전한 JavaScript 개발' },
  { name: 'Node.js', icon: 'green-circle', category: 'Backend', description: 'JavaScript 런타임, 서버 · 빌드 환경' },
  { name: 'Python', icon: 'snake', category: 'Backend', description: '데이터 처리 · 자동화 · 서버 개발' },
  { name: 'Java', icon: 'coffee', category: 'Backend', description: '객체지향 기반의 백엔드 개발' },
  { name: 'Git', icon: 'branch', category: 'Tools', description: '버전 관리와 GitHub 협업' },
  { name: 'React Native', icon: 'phone', category: 'Tools', description: 'React 로 만드는 모바일 앱' },
  { name: 'MongoDB', icon: 'leaf', category: 'Tools', description: '문서 기반 NoSQL 데이터베이스' },
];
