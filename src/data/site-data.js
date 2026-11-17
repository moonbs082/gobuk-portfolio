/** Hero 문구 */
export const heroContent = {
  eyebrowLabel: 'MISSION LOG',
  eyebrowPhrases: ['해군 정보통신 5년, 임무 완수 경험', 'UI 디자인부터 React 구현까지', '신뢰할 수 있는 웹을 설계합니다'],
  slogan: 'MISSION: TRUSTED WEB',
  role: '신뢰라는 임무를 웹으로 완수하는 웹디자이너,',
  name: '문보성',
  valueProp: '5년간 해군 통신망을 지키던 책임감으로 믿을 수 있는 웹앱을 만듭니다.',
  keywords: ['UI Design', 'React 구현', '3D 인터랙션'],
  techCaption: 'Real-time 3D · React Three Fiber · 직접 모델링',
};

/**
 * Hero CTA
 * - type 'scroll': sectionId 섹션으로 부드럽게 스크롤
 * - type 'download': public 폴더의 파일을 내려받음 (href 가 비어 있으면 버튼을 숨김)
 * TODO: 이력서 PDF 를 public/resume.pdf 로 넣고 href 를 'resume.pdf' 로 바꾸면 '이력서 PDF' 버튼이 생긴다.
 */
export const heroActions = [
  { id: 'projects', label: '프로젝트 보기', type: 'scroll', sectionId: 'projects', isPrimary: true },
  { id: 'contact', label: '연락하기', type: 'scroll', sectionId: 'contact', isPrimary: false },
  { id: 'resume', label: '이력서 PDF', type: 'download', href: '', fileName: '문보성_이력서.pdf', isPrimary: false },
];

/** Hero 회전 메뉴 항목 (sectionId 로 스크롤 이동) */
export const menuItems = [
  { id: 'about', label: 'ABOUT', caption: '나의 이야기', sectionId: 'about' },
  { id: 'skills', label: 'SKILLS', caption: '기술과 숙련도', sectionId: 'skills' },
  { id: 'projects', label: 'PROJECTS', caption: '작업물', sectionId: 'projects' },
  { id: 'contact', label: 'CONTACT', caption: '연락하기', sectionId: 'contact' },
];

/**
 * 연락처
 * TODO: 공개할 이메일 / LinkedIn 주소를 입력하면 Contact 섹션과 Hero 소셜 링크에 버튼이 생긴다.
 */
export const contactInfo = {
  email: '',
  github: 'https://github.com/moonbs082',
  linkedin: '',
};

/** Hero 소셜 링크 (url 이 비어 있는 항목은 숨김) */
export const socialLinks = [
  { id: 'github', label: 'GitHub', url: contactInfo.github },
  { id: 'linkedin', label: 'LinkedIn', url: contactInfo.linkedin },
  { id: 'email', label: '이메일', url: contactInfo.email ? `mailto:${contactInfo.email}` : '' },
];
