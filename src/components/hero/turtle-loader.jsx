import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * TurtleLoader 컴포넌트
 *
 * 3D 조형이 생성되는 동안 무대 가운데에 보여주는 로딩 표시.
 * 은은하게 숨 쉬는 실루엣 + 진행 표시로 빈 화면처럼 보이지 않게 한다.
 *
 * Props:
 * @param {boolean} isVisible - 표시 여부 (false 가 되면 서서히 사라짐) [Required]
 *
 * Example usage:
 * <TurtleLoader isVisible={ !isReady } />
 */
function TurtleLoader({ isVisible }) {
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-hidden={ !isVisible }
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 600ms ease-out',
      }}
    >
      {/* 몸통 실루엣 */}
      <Box
        aria-hidden
        sx={{
          width: '46%',
          height: '58%',
          borderRadius: '42% 42% 30% 30%',
          background: 'radial-gradient(ellipse at 50% 40%, rgba(255,107,26,0.22) 0%, rgba(255,107,26,0.05) 60%, transparent 75%)',
          animation: 'gobukBreath 1.6s ease-in-out infinite',
          '@keyframes gobukBreath': {
            '0%, 100%': { opacity: 0.5, transform: 'scale(0.97)' },
            '50%': { opacity: 1, transform: 'scale(1.02)' },
          },
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
        <CircularProgress size={ 14 } thickness={ 5 } sx={{ color: 'var(--color-orange)' }} />
        {isVisible ? '3D 조형 생성 중' : ''}
      </Box>
    </Box>
  );
}

export default TurtleLoader;
