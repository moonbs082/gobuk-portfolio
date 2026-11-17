/** 프로젝트 목록 */
export const projects = [
  {
    id: 'ai-smart-workout',
    title: 'AI 스마트 운동',
    description:
      '운동에 관심 있는 누구나 자세와 운동 정보를 찾고 공유할 수 있는 모바일 웹앱. 이 포트폴리오의 출발점이 된 프로젝트입니다.',
    techStack: ['React', 'MUI', 'Supabase'],
    /** 같은 사이트 안의 mini_sns 화면 (포트폴리오와 하나의 주소로 통합) */
    url: `${import.meta.env.BASE_URL}#/mini-sns`,
    isFeatured: true,
  },
  {
    id: 'gobuk-portfolio',
    title: 'GOBUK 포트폴리오',
    description:
      '3D 회전 메뉴와 근육 거북이 마스코트로 "포기하지 않는 디자이너"를 표현한 지금 이 사이트입니다.',
    techStack: ['React', 'MUI', 'CSS 3D'],
    url: '',
    isFeatured: false,
  },
];
