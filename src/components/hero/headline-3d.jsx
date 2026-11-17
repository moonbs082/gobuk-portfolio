import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { bySize } from '../../utils/hero-responsive.js';

/** 글자를 앞으로 튀어나오게 만드는 겹겹의 그림자 (3D 돌출 효과) */
const extrudeShadow = [
  '1px 1px 0 #C2410C',
  '2px 2px 0 #B8350C',
  '3px 3px 0 #A82A0D',
  '4px 4px 0 #98200E',
  '5px 5px 0 #86170F',
  '6px 6px 0 #730F0F',
  '7px 7px 0 #5F0A0C',
  '10px 12px 24px rgba(0, 0, 0, 0.6)',
  '0 0 40px rgba(255, 107, 26, 0.35)',
].join(', ');

/**
 * Headline3D 컴포넌트
 *
 * 2단 슬로건 + 이름·직무 제목.
 * - 'MISSION: TRUSTED WEB' → 1줄째(콜론까지)는 오렌지 외곽선 글자, 2줄째는 3D 돌출 글자.
 * - 메인 슬로건 크기: 데스크탑은 테마 h1(6rem), 모바일은 테마 h2(3.75rem) 크기를 상한으로 화면에 맞춰 줄어든다.
 * - 이름·직무 제목(<h1>)과 슬로건(<p>)은 같은 비율로 단계적으로 축소된다.
 * - 모바일·태블릿은 가운데 정렬, 데스크탑은 왼쪽 정렬.
 *
 * Props:
 * @param {string} title - 슬로건 (콜론 뒤에서 2줄로 나뉨) [Required]
 * @param {string} subtitle - 직무 소개 (h1 앞부분) [Optional, 기본값: '']
 * @param {string} highlight - 강조할 이름 (h1 뒷부분) [Optional, 기본값: '']
 *
 * Example usage:
 * <Headline3D title="MISSION: TRUSTED WEB" subtitle="신뢰라는 임무를 웹으로 완수하는 웹디자이너," highlight="문보성" />
 */
function Headline3D({ title, subtitle = '', highlight = '' }) {
  const theme = useTheme();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const h1Size = theme.typography.h1.fontSize;
  const h2Size = theme.typography.h2.fontSize;

  const [leadLine, mainLine] = title.includes(':')
    ? title.split(/(?<=:)\s+/)
    : ['', title];

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchOnly = window.matchMedia('(hover: none)').matches;
    if (isReducedMotion || isTouchOnly) return undefined;

    /** 화면 중앙 기준 마우스 위치로 기울기 계산 */
    const handlePointerMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 14;
      const y = (event.clientY / window.innerHeight - 0.5) * -10;
      setTilt({ x, y });
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <Box
      sx={{
        perspective: '900px',
        ...bySize({ mobile: { textAlign: 'center' }, desktop: { textAlign: 'left' } }),
      }}
    >
      <Typography
        component="p"
        sx={{
          fontFamily: 'var(--font-display)',
          lineHeight: 0.95,
          transform: `rotateX(${8 + tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: 'transform 200ms ease-out',
          userSelect: 'none',
          ...bySize({
            mobile: { letterSpacing: '1.5px', transformOrigin: 'center' },
            tablet: { letterSpacing: '2.5px' },
            desktop: { letterSpacing: '3px', transformOrigin: 'left center' },
          }),
        }}
      >
        {leadLine && (
          <Box
            component="span"
            sx={{
              display: 'block',
              color: 'transparent',
              textShadow: '0 0 30px rgba(255, 107, 26, 0.35)',
              ...bySize({
                mobile: { fontSize: 'clamp(1.75rem, 9vw, 2.4rem)', WebkitTextStroke: '1.5px var(--color-orange)' },
                tablet: { fontSize: 'clamp(2.4rem, 5vw, 3rem)', WebkitTextStroke: '2px var(--color-orange)' },
                desktop: { fontSize: 'clamp(2.4rem, 6vh, 3.6rem)' },
              }),
            }}
          >
            { leadLine }
          </Box>
        )}
        <Box
          component="span"
          sx={{
            display: 'block',
            whiteSpace: 'nowrap',
            color: 'var(--color-text)',
            textShadow: extrudeShadow,
            ...bySize({
              mobile: { fontSize: `clamp(2.5rem, 13.5vw, ${h2Size})` },
              tablet: { fontSize: 'clamp(3.75rem, 8.5vw, 5rem)' },
              desktop: { fontSize: `clamp(3.75rem, 10vh, ${h1Size})` },
            }),
          }}
        >
          { mainLine }
        </Box>
      </Typography>

      {subtitle && (
        <Typography
          variant="h1"
          sx={{
            fontFamily: 'var(--font-display-ko)',
            fontWeight: 400,
            color: 'var(--color-text)',
            wordBreak: 'keep-all',
            ...bySize({
              mobile: { mt: 2, fontSize: '1.2rem', lineHeight: 1.5, letterSpacing: '0.3px' },
              tablet: { mt: 2.5, fontSize: '1.5rem', lineHeight: 1.45, letterSpacing: '0.5px' },
              desktop: { mt: 2.5, fontSize: '1.75rem', lineHeight: 1.4 },
            }),
          }}
        >
          { subtitle }{' '}
          <Box
            component="span"
            sx={{
              background: 'var(--gradient-power)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            { highlight }
          </Box>
        </Typography>
      )}
    </Box>
  );
}

export default Headline3D;
