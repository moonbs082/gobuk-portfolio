import profilePhoto from '../assets/images/profile-photo.jpg';

/**
 * About Me 초기 데이터 (PortfolioProvider 의 초기 state 로 사용)
 * - sections[].showInHome: true 인 섹션은 홈 화면 About 미리보기에도 표시된다.
 * - skills[].isMainSkill: true 인 스킬 중 숙련도 상위 4개가 홈 화면에 표시된다.
 */
export const initialAboutMeData = {
  basicInfo: {
    name: '문보성',
    education: '구미대학교 전자통신학부',
    major: '전자통신학과',
    experience: '신입',
    photo: profilePhoto,
  },
  sections: [
    {
      id: 'dev-story',
      title: '나의 개발 스토리',
      content:
        '운동을 스스로 찾아보며 공부하다 보니, 자연스럽게 다른 운동 전문가들의 생각과 자세 영상을 찾아보게 되었습니다.\n\n' +
        '정보는 넘쳐났지만 정작 "내 몸에 맞는 답"을 찾기는 어려웠습니다. 그때 떠오른 질문이 있었습니다.\n' +
        '"운동에 조금이라도 관심 있는 사람들을 위해, AI가 몸을 분석하고 자세와 운동 스케줄을 맞춰줄 수는 없을까?"\n\n' +
        '이 질문을 직접 웹으로 풀어보고 싶어 디자인과 개발을 시작했고, 그 과정을 이 포트폴리오에 담았습니다.',
      showInHome: true,
    },
    {
      id: 'philosophy',
      title: '개발 철학',
      content:
        '저는 "신뢰할 수 있는 웹"을 만드는 것을 가장 중요하게 생각합니다.\n\n' +
        '• 진실 — 거짓되거나 과장된 정보가 없는 웹\n' +
        '• 공감 — 누가 사용해도 고개를 끄덕일 수 있는 경험\n' +
        '• 간결 — 불필요한 정보를 덜어낸 깔끔한 디자인\n\n' +
        '보기 좋은 화면을 넘어, 사용자가 믿고 다시 찾아오는 사이트를 디자인하고 개발하겠습니다.',
      showInHome: true,
    },
    {
      id: 'personal',
      title: '개인적인 이야기',
      content:
        '평소 헬스를 좋아해 오랫동안 꾸준히 운동해 왔습니다.\n\n' +
        '직업군인으로 복무한 경력이 있고, 지금도 군인의 정신을 동경합니다. 전역한 뒤에도 현역 때처럼 ' +
        '어떤 일이든 포기하지 않고 끝까지 열정적으로 해내는 것이 저의 가장 큰 장점입니다.\n\n' +
        '앞으로의 목표는 대한민국 누구나 한 번쯤 접속해 본 웹사이트를 제 손으로 만드는 것입니다.',
      showInHome: false,
    },
  ],
  skills: [
    {
      id: 1,
      icon: 'orange-diamond',
      name: 'HTML',
      level: 80,
      category: 'Frontend',
      description: '시맨틱 마크업과 웹 접근성을 고려한 구조 설계',
      isMainSkill: true,
    },
    {
      id: 2,
      icon: 'palette',
      name: 'CSS',
      level: 75,
      category: 'Frontend',
      description: 'Flexbox · Grid 레이아웃, 반응형, 3D 트랜지션',
      isMainSkill: true,
    },
    {
      id: 3,
      icon: 'zap',
      name: 'JavaScript',
      level: 70,
      category: 'Frontend',
      description: 'DOM 조작, 이벤트 처리, 비동기 fetch',
      isMainSkill: true,
    },
    {
      id: 4,
      icon: 'atom',
      name: 'React',
      level: 60,
      category: 'Framework',
      description: '컴포넌트 설계, Hooks, MUI 기반 UI 구성',
      isMainSkill: true,
    },
    {
      id: 5,
      icon: 'target',
      name: 'Figma',
      level: 65,
      category: 'Design',
      description: '와이어프레임 · 시안 제작, 컴포넌트와 오토레이아웃 활용',
      isMainSkill: true,
    },
  ],
};
