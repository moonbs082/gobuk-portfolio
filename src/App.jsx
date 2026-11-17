import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import PortfolioLayout from './components/common/portfolio-layout.jsx';
import ProjectIntroOverlay from './components/intro/project-intro-overlay.jsx';
import AuthProvider from './mini-sns/components/common/auth-provider.jsx';
import MiniSnsApp from './mini-sns/mini-sns-app.jsx';
import { toMiniSnsPath } from './mini-sns/utils/mini-sns-path.js';
import {
  finishSiteIntroFlow,
  SITE_INTRO_COMPLETE_MESSAGE,
  startSiteIntroFlow,
} from './mini-sns/utils/site-intro-flow.js';
import { projects } from './data/projects-data.js';
import { shouldShowProjectIntro } from './utils/intro-utils.js';

/** 사이트 첫 화면에 먼저 보여줄 프로젝트 (AI 스마트 운동) */
const introProject = projects.find((project) => project.id === 'ai-smart-workout');

/** 인트로는 mini_sns 신체 분석(온보딩) 화면부터 시작한다 */
const INTRO_URL = `${import.meta.env.BASE_URL}#${toMiniSnsPath('/onboarding')}`;

/**
 * GitHub Pages 새로고침 대응을 위해 HashRouter 사용
 * - '#/mini-sns/*' : AI 스마트 운동(mini_sns) 앱
 * - 그 외 경로      : 포트폴리오
 * - 사이트 접속 시 인트로(iframe)에서 신체 분석 → 회원가입을 거친 뒤 포트폴리오가 나타난다.
 *   (재방문자는 인트로 우측 상단 '건너뛰기'로 바로 포트폴리오로 이동)
 * - 로그인 정보(AuthProvider)는 포트폴리오와 mini_sns 가 함께 사용한다.
 */
function App() {
  const [isIntroEnabled] = useState(shouldShowProjectIntro);

  /** 인트로가 떠 있는 동안 '접속 흐름 진행 중' 표시 (SNS 로그인으로 창을 벗어났다 와도 유지) */
  useEffect(() => {
    if (isIntroEnabled) startSiteIntroFlow();
  }, [isIntroEnabled]);

  return (
    <HashRouter>
      <AuthProvider>
        { isIntroEnabled && introProject && (
          <ProjectIntroOverlay
            title={ introProject.title }
            url={ INTRO_URL }
            closeMessage={ SITE_INTRO_COMPLETE_MESSAGE }
            onClose={ finishSiteIntroFlow }
          />
        ) }
        <Routes>
          <Route path="/mini-sns/*" element={ <MiniSnsApp /> } />
          <Route path="*" element={ <PortfolioLayout /> } />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
