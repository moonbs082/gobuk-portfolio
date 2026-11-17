import { NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

const navItems = [
  { to: '/', label: 'HOME' },
  { to: '/about', label: 'ABOUT' },
];

/**
 * SiteHeader 컴포넌트
 *
 * 화면 상단에 고정되는 반투명 헤더. 로고와 페이지 이동 메뉴로 구성된다.
 *
 * Example usage:
 * <SiteHeader />
 */
function SiteHeader() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(14, 14, 16, 0.72)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 3 },
          justifyContent: 'space-between',
        }}
      >
        <Box
          component={ NavLink }
          to="/"
          aria-label="문보성 포트폴리오 홈으로 이동"
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 1.25,
            textDecoration: 'none',
          }}
        >
          <Box
            component="span"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '1.4rem', md: '1.6rem' },
              letterSpacing: 2,
              color: 'var(--color-text)',
            }}
          >
            GOBUK
            <Box component="span" sx={{ color: 'var(--color-orange)' }}>.</Box>
          </Box>
          <Box
            component="span"
            sx={{
              pl: 1.25,
              borderLeft: '1px solid var(--color-border)',
              fontFamily: 'var(--font-display-ko)',
              fontSize: { xs: '0.85rem', md: '0.95rem' },
              letterSpacing: 1,
              color: 'var(--color-text-muted)',
            }}
          >
            문보성
          </Box>
        </Box>
        <Box component="nav" sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={ item.to }
              component={ NavLink }
              to={ item.to }
              end={ item.to === '/' }
              sx={{
                fontFamily: 'var(--font-display)',
                letterSpacing: 1.5,
                fontWeight: 400,
                color: 'var(--color-text-muted)',
                '&:hover': { color: 'var(--color-text)', bgcolor: 'var(--color-orange-soft)' },
                '&.active': { color: 'var(--color-orange)' },
              }}
            >
              { item.label }
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default SiteHeader;
