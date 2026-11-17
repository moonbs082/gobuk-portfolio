import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { bySize } from '../../utils/hero-responsive.js';

/**
 * HeroValueProp 컴포넌트
 *
 * Hero 의 한 줄 가치 제안 + 핵심 키워드 칩.
 * 모바일·태블릿은 가운데, 데스크탑은 왼쪽 정렬. 글자 크기는 화면에 비례해 단계적으로 커진다.
 * 칩에 마우스를 올리면 살짝 떠오르며 채워진다.
 *
 * Props:
 * @param {string} text - 가치 제안 문장 [Required]
 * @param {string[]} keywords - 키워드 목록 [Optional, 기본값: []]
 *
 * Example usage:
 * <HeroValueProp text="디자인하고, 직접 구현까지." keywords={ ['UI Design', 'React 구현'] } />
 */
function HeroValueProp({ text, keywords = [] }) {
  return (
    <Box sx={ bySize({ mobile: { textAlign: 'center' }, desktop: { textAlign: 'left' } }) }>
      <Typography
        sx={{
          lineHeight: 1.65,
          color: 'rgba(245, 243, 239, 0.8)',
          wordBreak: 'keep-all',
          ...bySize({
            mobile: { maxWidth: 340, mx: 'auto', fontSize: '0.98rem' },
            tablet: { maxWidth: 560, fontSize: '1.08rem' },
            desktop: { maxWidth: 520, mx: 0, fontSize: '1.1rem' },
          }),
        }}
      >
        { text }
      </Typography>
      {keywords.length > 0 && (
        <Box
          component="ul"
          aria-label="핵심 역량"
          sx={{
            listStyle: 'none',
            m: 0,
            p: 0,
            display: 'flex',
            flexWrap: 'wrap',
            ...bySize({
              mobile: { mt: 2, gap: 0.75, justifyContent: 'center' },
              tablet: { gap: 1 },
              desktop: { justifyContent: 'flex-start' },
            }),
          }}
        >
          {keywords.map((keyword) => (
            <Box
              component="li"
              key={ keyword }
              sx={{
                py: 0.5,
                borderRadius: 999,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--color-orange)',
                bgcolor: 'var(--color-orange-soft)',
                border: '1px solid rgba(255, 107, 26, 0.3)',
                cursor: 'default',
                transition: 'transform 250ms, background-color 250ms, color 250ms, box-shadow 250ms',
                ...bySize({
                  mobile: { px: 1.25, fontSize: '0.72rem' },
                  tablet: { px: 1.5, fontSize: '0.78rem' },
                }),
                '@media (hover: hover)': {
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    color: '#0E0E10',
                    bgcolor: 'var(--color-orange)',
                    boxShadow: '0 6px 18px rgba(255, 107, 26, 0.35)',
                  },
                },
              }}
            >
              { keyword }
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default HeroValueProp;
