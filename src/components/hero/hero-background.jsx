import Box from '@mui/material/Box';
import GeometricShape from './geometric-shape.jsx';
import { bySize } from '../../utils/hero-responsive.js';

/** 회로 기판 패턴 타일 (160×160, 가장자리가 이어지도록 설계) */
const CIRCUIT_TILE = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>"
  + "<g fill='none' stroke='#FF6B1A' stroke-width='1'>"
  + "<path d='M0 40 H50 L70 60 H120 L140 40 H160'/>"
  + "<path d='M50 0 V30'/>"
  + "<path d='M110 60 V100 L130 120 H160'/>"
  + "<path d='M0 120 H30 L50 140 V160'/>"
  + "<path d='M80 160 V130 L100 110 H110'/>"
  + '</g>'
  + "<g fill='#FF6B1A'>"
  + "<circle cx='50' cy='30' r='2.5'/><circle cx='110' cy='100' r='2.5'/>"
  + "<circle cx='30' cy='120' r='2.5'/><circle cx='110' cy='110' r='2.5'/>"
  + '</g></svg>',
);

/**
 * 신호가 흐르는 회로선 (viewBox 1440×900 기준)
 * 텍스트 칼럼(x 140~660, y 220~730)과 거북이 영역을 피해 화면 가장자리로만 흐른다.
 */
const SIGNAL_TRACES = [
  { d: 'M0 120 H160 L200 80 H340', end: [340, 80], duration: 6, delay: 0 },
  { d: 'M1440 110 H1260 L1220 70 H1100', end: [1100, 70], duration: 7, delay: 1.2 },
  { d: 'M0 790 H220 L260 830 H420', end: [420, 830], duration: 5.5, delay: 2.4 },
  { d: 'M1440 830 H1300 L1260 870 H1120', end: [1120, 870], duration: 6.5, delay: 0.6 },
  { d: 'M560 0 V36 L600 70 H720', end: [720, 70], duration: 5, delay: 3 },
  { d: 'M0 380 H60 L96 416 V560', end: [96, 560], duration: 6, delay: 1.8 },
];

/** 떠다니는 기하 도형 */
const SHAPES = [
  { type: 'hexagon', position: { top: '14%', left: '6%' }, size: 64, duration: 11 },
  { type: 'hexagon', position: { bottom: '16%', right: '5%' }, size: 44, duration: 9, delay: 1.5, color: 'var(--color-red)' },
  { type: 'diamond', position: { bottom: '12%', left: '4%' }, size: 26, duration: 8, delay: 0.8, color: 'var(--color-red)', isDesktopOnly: true },
  { type: 'plus', position: { top: '18%', right: '8%' }, size: 22, duration: 7, delay: 2 },
  { type: 'triangle', position: { top: '8%', right: '30%' }, size: 24, duration: 10, delay: 3, isDesktopOnly: true },
  { type: 'ring', position: { top: '46%', left: '3%' }, size: 18, duration: 6, delay: 1, isDesktopOnly: true },
];

/**
 * HeroBackground 컴포넌트
 *
 * Hero 의 배경 레이어 (모두 장식용, 클릭 통과).
 * - 방향성 있는 오렌지 · 레드 광원 그라데이션 (데스크탑: 거북이가 있는 오른쪽, 모바일: 가운데)
 * - 회로 기판 패턴 (가장자리로 갈수록 사라짐)
 * - 회로선을 따라 흐르는 통신 신호 애니메이션
 * - 천천히 떠다니는 기하 도형
 * - 아래쪽은 다음 섹션 배경색으로 자연스럽게 이어짐
 *
 * Example usage:
 * <HeroBackground />
 */
function HeroBackground() {
  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* 광원 그라데이션 */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          /** 광원 위치를 거북이 위치에 맞춤 (모바일·태블릿: 아래쪽 가운데 / 데스크탑: 오른쪽) */
          ...bySize({
            mobile: { background: 'radial-gradient(circle at 50% 72%, rgba(229,37,46,0.26) 0%, rgba(255,107,26,0.07) 35%, transparent 65%)' },
            tablet: { background: 'radial-gradient(circle at 50% 70%, rgba(229,37,46,0.26) 0%, rgba(255,107,26,0.07) 32%, transparent 60%)' },
            desktop: { background: 'radial-gradient(circle at 74% 50%, rgba(229,37,46,0.28) 0%, rgba(255,107,26,0.08) 30%, transparent 60%), radial-gradient(circle at 10% 20%, rgba(255,107,26,0.08) 0%, transparent 40%)' },
          }),
        }}
      />

      {/* 회로 기판 패턴 */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.09,
          backgroundImage: `url("data:image/svg+xml,${CIRCUIT_TILE}")`,
          backgroundSize: '160px 160px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)',
        }}
      />

      {/* 흐르는 통신 신호 */}
      <Box
        component="svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {SIGNAL_TRACES.map((trace) => (
            <path key={ `base-${trace.d}` } d={ trace.d } stroke="rgba(255,107,26,0.16)" strokeWidth="1.5" />
          ))}
        </g>
        <Box
          component="g"
          fill="none"
          strokeLinecap="round"
          sx={{
            filter: 'drop-shadow(0 0 6px rgba(255,107,26,0.9))',
            /** 80 → 1080: 신호가 시작점 밖에서 들어와 끝점 밖으로 빠져나간다 */
            '@keyframes heroSignal': {
              from: { strokeDashoffset: 1080 },
              to: { strokeDashoffset: 80 },
            },
          }}
        >
          {SIGNAL_TRACES.map((trace) => (
            <Box
              component="path"
              key={ `signal-${trace.d}` }
              d={ trace.d }
              pathLength="1000"
              stroke="#FF8A3D"
              strokeWidth="2"
              strokeDasharray="80 920"
              sx={{ animation: `heroSignal ${trace.duration}s linear ${trace.delay}s infinite backwards` }}
            />
          ))}
        </Box>
        <Box
          component="g"
          sx={{
            '@keyframes heroNode': {
              '0%, 100%': { opacity: 0.35 },
              '50%': { opacity: 1 },
            },
          }}
        >
          {SIGNAL_TRACES.map((trace) => (
            <Box
              component="circle"
              key={ `node-${trace.d}` }
              cx={ trace.end[0] }
              cy={ trace.end[1] }
              r="4"
              fill="#0E0E10"
              stroke="#FF6B1A"
              strokeWidth="2"
              sx={{ animation: `heroNode ${trace.duration}s ease-in-out ${trace.delay}s infinite` }}
            />
          ))}
        </Box>
      </Box>

      {/* 기하 도형 */}
      {SHAPES.map((shape) => (
        <GeometricShape key={ `${shape.type}-${shape.size}` } { ...shape } />
      ))}

      {/* 가장자리 비네팅 + 아래쪽 다음 섹션으로 페이드 */}
      <Box sx={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 140px rgba(120, 10, 10, 0.28)' }} />
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 120,
          background: 'linear-gradient(to bottom, transparent, var(--color-bg))',
        }}
      />
    </Box>
  );
}

export default HeroBackground;
