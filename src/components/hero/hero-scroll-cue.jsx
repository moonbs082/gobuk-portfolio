import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

/**
 * HeroScrollCue 컴포넌트
 *
 * Hero 하단 가운데의 스크롤 유도 표시 ('SCROLL' 문구 + 위아래로 튀는 원형 화살표 버튼).
 * 클릭하면 onClick 으로 다음 섹션까지 부드럽게 스크롤한다.
 * 세로 공간이 넉넉한 데스크탑(1200px~)에서만 렌더링된다. (HeroSection 에서 제어)
 *
 * Props:
 * @param {function} onClick - 클릭 시 실행 [Required]
 * @param {string} label - 안내 문구 [Optional, 기본값: 'SCROLL']
 *
 * Example usage:
 * <HeroScrollCue onClick={ handleScroll } />
 */
function HeroScrollCue({ onClick, label = 'SCROLL' }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: '50%',
        bottom: 16,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
      }}
    >
      <Box
        aria-hidden
        sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: 3, color: 'var(--color-text-muted)' }}
      >
        { label }
      </Box>
      <IconButton
        onClick={ onClick }
        aria-label="다음 섹션으로 스크롤"
        sx={{
          width: 44,
          height: 44,
          color: 'var(--color-orange)',
          border: '1px solid rgba(255, 107, 26, 0.45)',
          bgcolor: 'rgba(14, 14, 16, 0.5)',
          animation: 'scrollCueBounce 2s ease-in-out infinite',
          '@keyframes scrollCueBounce': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(6px)' },
          },
          transition: 'background-color 250ms, color 250ms, box-shadow 250ms',
          '&:hover': {
            color: '#0E0E10',
            bgcolor: 'var(--color-orange)',
            boxShadow: '0 0 0 6px rgba(255, 107, 26, 0.18)',
            animationPlayState: 'paused',
          },
        }}
      >
        <KeyboardDoubleArrowDownIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default HeroScrollCue;
