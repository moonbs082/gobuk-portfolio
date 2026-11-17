import Box from '@mui/material/Box';

const SIZE = 120;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * CircularGauge 컴포넌트
 *
 * 숙련도 레벨을 원형 게이지로 보여준다. isAnimated 가 true 가 되면 0에서 레벨까지 차오른다.
 *
 * Props:
 * @param {number} level - 현재 레벨 [Required]
 * @param {number} maxLevel - 최대 레벨 [Required]
 * @param {string} gradientId - SVG 그라데이션 고유 id [Required]
 * @param {boolean} isAnimated - 게이지 채우기 시작 여부 [Optional, 기본값: true]
 *
 * Example usage:
 * <CircularGauge level={ 3 } maxLevel={ 5 } gradientId="gauge-html" isAnimated={ isInView } />
 */
function CircularGauge({ level, maxLevel, gradientId, isAnimated = true }) {
  const ratio = isAnimated ? level / maxLevel : 0;

  return (
    <Box sx={{ position: 'relative', width: SIZE, height: SIZE }}>
      <svg width={ SIZE } height={ SIZE } viewBox={ `0 0 ${SIZE} ${SIZE}` } aria-hidden>
        <defs>
          <linearGradient id={ gradientId } x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6B1A" />
            <stop offset="100%" stopColor="#E5252E" />
          </linearGradient>
        </defs>
        <circle
          cx={ SIZE / 2 }
          cy={ SIZE / 2 }
          r={ RADIUS }
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={ STROKE }
        />
        <circle
          cx={ SIZE / 2 }
          cy={ SIZE / 2 }
          r={ RADIUS }
          fill="none"
          stroke={ `url(#${gradientId})` }
          strokeWidth={ STROKE }
          strokeLinecap="round"
          strokeDasharray={ CIRCUMFERENCE }
          strokeDashoffset={ CIRCUMFERENCE * (1 - ratio) }
          transform={ `rotate(-90 ${SIZE / 2} ${SIZE / 2})` }
          style={{ transition: 'stroke-dashoffset 1200ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1, color: 'var(--color-text)' }}>
          Lv.{ level }
        </Box>
        <Box sx={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', mt: 0.5 }}>
          / { maxLevel }
        </Box>
      </Box>
    </Box>
  );
}

export default CircularGauge;
