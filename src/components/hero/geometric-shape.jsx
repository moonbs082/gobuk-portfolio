import Box from '@mui/material/Box';
import { bySize } from '../../utils/hero-responsive.js';

/** 도형 종류별 SVG 내용 (viewBox 0 0 100 100) */
const SHAPES = {
  hexagon: <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" />,
  diamond: <polygon points="50,6 94,50 50,94 6,50" />,
  triangle: <polygon points="50,8 94,88 6,88" />,
  plus: <path d="M50 10 V90 M10 50 H90" />,
  ring: <circle cx="50" cy="50" r="42" />,
};

/**
 * GeometricShape 컴포넌트
 *
 * Hero 배경에 떠다니는 외곽선 기하 도형.
 *
 * Props:
 * @param {string} type - 'hexagon' | 'diamond' | 'triangle' | 'plus' | 'ring' [Required]
 * @param {object} position - 위치 ({ top, left, right, bottom } CSS 값) [Required]
 * @param {number} size - 크기(px) [Required]
 * @param {string} color - 선 색상 [Optional, 기본값: 'var(--color-orange)']
 * @param {number} duration - 떠다니는 주기(초) [Optional, 기본값: 9]
 * @param {number} delay - 애니메이션 지연(초) [Optional, 기본값: 0]
 * @param {boolean} isDesktopOnly - 모바일(~767px)에서 숨길지 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <GeometricShape type="hexagon" position={{ top: '20%', left: '8%' }} size={ 64 } />
 */
function GeometricShape({
  type,
  position,
  size,
  color = 'var(--color-orange)',
  duration = 9,
  delay = 0,
  isDesktopOnly = false,
}) {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        ...position,
        width: size,
        height: size,
        ...(isDesktopOnly ? bySize({ mobile: { display: 'none' }, tablet: { display: 'block' } }) : {}),
        color,
        opacity: 0.35,
        animation: `heroShapeFloat ${duration}s ease-in-out ${delay}s infinite`,
        '@keyframes heroShapeFloat': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(12deg)' },
        },
      }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="3">
        { SHAPES[type] }
      </svg>
    </Box>
  );
}

export default GeometricShape;
