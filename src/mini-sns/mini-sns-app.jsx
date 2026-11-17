import { ThemeProvider } from '@mui/material/styles';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MiniSnsRoutes from './mini-sns-routes.jsx';
import miniSnsTheme from './theme.js';

/**
 * MiniSnsApp 컴포넌트 - 포트폴리오 안의 '/mini-sns/*' 경로에서 동작하는 AI 스마트 운동 앱
 * 포트폴리오(다크 테마)와 섞이지 않도록 자체 MUI 테마 + ScopedCssBaseline 으로 감싼다.
 * 로그인 정보(AuthProvider)는 App 에서 사이트 전체에 제공한다.
 *
 * Props: 없음
 *
 * Example usage:
 * <Route path="/mini-sns/*" element={ <MiniSnsApp /> } />
 */
function MiniSnsApp() {
  return (
    <ThemeProvider theme={ miniSnsTheme }>
      <ScopedCssBaseline sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default' }}>
        <MiniSnsRoutes />
      </ScopedCssBaseline>
    </ThemeProvider>
  );
}

export default MiniSnsApp;
