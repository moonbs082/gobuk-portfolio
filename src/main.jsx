import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.jsx';
import PortfolioProvider from './contexts/portfolio-provider.jsx';
import theme from './theme.js';
import { isMiniSnsAuthCallback, MINI_SNS_BASE } from './mini-sns/utils/mini-sns-path.js';
import { finishSiteIntroFlow, isSiteIntroFlowActive } from './mini-sns/utils/site-intro-flow.js';
import './index.css';

/**
 * mini_sns 의 SNS 로그인 / 이메일 인증 후 돌아오면(?code=)
 * - 사이트 첫 접속 흐름 중이면: 포트폴리오 홈에 그대로 머문다
 * - 그 외: mini_sns 화면으로 이동
 */
if (isMiniSnsAuthCallback() && !window.location.hash) {
  if (isSiteIntroFlowActive()) {
    finishSiteIntroFlow();
  } else {
    window.location.hash = `#${MINI_SNS_BASE}`;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <PortfolioProvider>
        <App />
      </PortfolioProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
