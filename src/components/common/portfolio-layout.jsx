import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import SiteHeader from './site-header.jsx';
import SiteFooter from './site-footer.jsx';
import ScrollToTop from './scroll-to-top.jsx';
import HomePage from '../../pages/home-page.jsx';
import AboutPage from '../../pages/about-page.jsx';

/**
 * PortfolioLayout 컴포넌트
 *
 * 포트폴리오 화면(헤더 + 본문 + 푸터)과 페이지 라우팅. mini_sns('/mini-sns/*') 이외의 모든 경로를 담당한다.
 *
 * Example usage:
 * <Route path="*" element={ <PortfolioLayout /> } />
 */
function PortfolioLayout() {
  return (
    <>
      <ScrollToTop />
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'var(--color-bg)',
        }}
      >
        <SiteHeader />
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/about" element={ <AboutPage /> } />
          </Routes>
        </Box>
        <SiteFooter />
      </Box>
    </>
  );
}

export default PortfolioLayout;
