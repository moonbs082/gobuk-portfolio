import Box from '@mui/material/Box';
import useTypewriter from '../../hooks/use-typewriter.js';
import { bySize } from '../../utils/hero-responsive.js';

/**
 * HeroEyebrow 컴포넌트
 *
 * 헤드라인 위 터미널 스타일의 작은 라벨. 문장이 타이핑 효과로 순환한다.
 * 스크린리더에는 전체 문장을 한 번에 읽어준다.
 *
 * Props:
 * @param {string} label - 왼쪽 상태 라벨 (예: 'MISSION LOG') [Required]
 * @param {string[]} phrases - 타이핑할 문장 목록 [Required]
 *
 * Example usage:
 * <HeroEyebrow label="MISSION LOG" phrases={ ['해군 정보통신 5년'] } />
 */
function HeroEyebrow({ label, phrases }) {
  const typedText = useTypewriter(phrases);

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        maxWidth: '100%',
        gap: 1.25,
        px: 1.5,
        py: 0.75,
        borderRadius: 1.5,
        border: '1px solid rgba(255, 107, 26, 0.28)',
        bgcolor: 'rgba(14, 14, 16, 0.6)',
        backdropFilter: 'blur(6px)',
        fontFamily: 'var(--font-mono)',
        ...bySize({ mobile: { fontSize: '0.72rem' }, tablet: { fontSize: '0.8rem' } }),
        letterSpacing: 0.3,
      }}
    >
      {/* 수신 중 표시등 */}
      <Box
        aria-hidden
        sx={{
          width: 8,
          height: 8,
          flexShrink: 0,
          borderRadius: '50%',
          bgcolor: 'var(--color-orange)',
          boxShadow: '0 0 0 0 rgba(255, 107, 26, 0.6)',
          animation: 'heroBlip 1.8s ease-out infinite',
          '@keyframes heroBlip': {
            '0%': { boxShadow: '0 0 0 0 rgba(255, 107, 26, 0.6)' },
            '100%': { boxShadow: '0 0 0 8px rgba(255, 107, 26, 0)' },
          },
        }}
      />
      <Box component="span" sx={{ fontWeight: 700, color: 'var(--color-orange)', whiteSpace: 'nowrap' }}>
        { label }
      </Box>
      <Box component="span" aria-hidden sx={{ color: 'rgba(255,255,255,0.25)' }}>{ '//' }</Box>

      {/* 스크린리더용 전체 문장 */}
      <Box
        component="span"
        sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }}
      >
        { phrases.join(', ') }
      </Box>

      {/* 화면용 타이핑 문장 (좁은 화면에서는 말줄임) + 커서 (항상 보이도록 말줄임 영역 밖에 둠) */}
      <Box component="span" aria-hidden sx={{ display: 'inline-flex', alignItems: 'center', minWidth: 0 }}>
        <Box
          component="span"
          sx={{ color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}
        >
          { typedText }
        </Box>
        <Box
          component="span"
          sx={{
            flexShrink: 0,
            width: '0.55em',
            height: '1.1em',
            ml: 0.25,
            bgcolor: 'var(--color-orange)',
            animation: 'heroCaret 1s steps(1) infinite',
            '@keyframes heroCaret': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0 },
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default HeroEyebrow;
