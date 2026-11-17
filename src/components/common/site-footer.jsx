import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * SiteFooter 컴포넌트
 *
 * 사이트 하단 저작권 영역.
 *
 * Example usage:
 * <SiteFooter />
 */
function SiteFooter() {
  return (
    <Box
      component="footer"
      sx={{ py: 4, px: 2, textAlign: 'center', borderTop: '1px solid var(--color-border)' }}
    >
      <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
        © 2026 문보성 · 느려도 멈추지 않는다 🐢
      </Typography>
    </Box>
  );
}

export default SiteFooter;
