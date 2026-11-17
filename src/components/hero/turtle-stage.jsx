import { lazy, Suspense, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import TurtleFigure from './turtle-figure.jsx';
import TurtleLoader from './turtle-loader.jsx';
import { isWebGLAvailable } from '../../utils/webgl-utils.js';
import { bySize } from '../../utils/hero-responsive.js';

/** three.js 는 용량이 커서 필요할 때 따로 불러온다 */
const Turtle3D = lazy(() => import('./turtle-3d.jsx'));

/** 앞/뒤 면 공통 스타일: 뒤집혔을 때 반대쪽 면은 숨긴다 */
const faceSx = {
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
};

/**
 * TurtleStage 컴포넌트
 *
 * 거북이 조형을 3D 무대 위에서 회전시킨다.
 * - WebGL 을 지원하면 three.js 3D 조형을, 지원하지 않으면 SVG 일러스트를 보여준다.
 * - 3D 조형이 준비되기 전에는 로딩 표시를, 준비되면 기술 캡션 + 드래그 안내를 보여준다.
 * - 무대 크기는 화면 높이(vh)에 맞춰 줄어들어, 낮은 화면에서도 Hero 가 한 화면에 들어온다.
 * - 메뉴가 바뀌면 syncDeg 만큼 함께 회전하고, 뒤쪽 광원이 한 번 퍼진다.
 *
 * Props:
 * @param {number} syncDeg - 메뉴 회전과 동기화할 추가 회전 각도(도) [Optional, 기본값: 0]
 * @param {number} pulseKey - 값이 바뀔 때마다 광원 펄스 효과 재생 [Optional, 기본값: 0]
 * @param {string} caption - 무대 아래 기술 캡션 [Optional, 기본값: '']
 *
 * Example usage:
 * <TurtleStage syncDeg={ step * 90 } pulseKey={ step } caption="Real-time 3D" />
 */
function TurtleStage({ syncDeg = 0, pulseKey = 0, caption = '' }) {
  const [isWebGL] = useState(isWebGLAvailable);
  const [isReady, setIsReady] = useState(false);

  const handleReady = useCallback(() => setIsReady(true), []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          position: 'relative',
          /** 모바일은 CTA 아래에 오므로 크게, 데스크탑은 오른쪽 칼럼을 채우도록 */
          ...bySize({
            mobile: { height: 'clamp(240px, 40vh, 340px)' },
            tablet: { height: 'clamp(320px, 40vh, 440px)' },
            desktop: { height: 'clamp(300px, 52vh, 480px)' },
          }),
          aspectRatio: '5 / 6',
          mx: 'auto',
          perspective: '1200px',
        }}
      >
        {/* 메뉴 변경 시 퍼지는 광원 */}
        <Box
          key={ pulseKey }
          aria-hidden
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '120%',
            aspectRatio: '1',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,26,0.55) 0%, rgba(229,37,46,0.25) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            animation: 'gobukPulse 900ms ease-out',
            '@keyframes gobukPulse': {
              '0%': { transform: 'translate(-50%, -50%) scale(0.6)', opacity: 1 },
              '100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.55 },
            },
            opacity: 0.55,
          }}
        />

        {/* 바닥 그림자 */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            bottom: -6,
            left: '50%',
            width: '62%',
            height: 22,
            borderRadius: '50%',
            bgcolor: 'rgba(0, 0, 0, 0.55)',
            filter: 'blur(6px)',
            transform: 'translateX(-50%)',
          }}
        />

        {isWebGL ? (
          <>
            <TurtleLoader isVisible={ !isReady } />
            <Suspense fallback={ null }>
              <Turtle3D syncDeg={ syncDeg } onReady={ handleReady } />
            </Suspense>
          </>
        ) : (
          /* WebGL 미지원 시: SVG 앞/뒤 카드 회전 */
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              transformStyle: 'preserve-3d',
              transform: `rotateY(${syncDeg}deg)`,
              transition: 'transform 800ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                transformStyle: 'preserve-3d',
                animation: 'gobukSpin 24s linear infinite',
                '@keyframes gobukSpin': {
                  from: { transform: 'rotateY(0deg)' },
                  to: { transform: 'rotateY(360deg)' },
                },
              }}
            >
              <Box sx={ faceSx }>
                <TurtleFigure side="front" />
              </Box>
              <Box sx={{ ...faceSx, transform: 'rotateY(180deg)' }}>
                <TurtleFigure side="back" />
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* 기술 캡션 + 드래그 안내 (3D 준비 후 표시) */}
      {isWebGL && caption && (
        <Box
          sx={{
            mt: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            columnGap: 1,
            rowGap: 0.25,
            ...bySize({ mobile: { fontSize: '0.72rem' }, tablet: { fontSize: '0.78rem' } }),
            letterSpacing: 0.5,
            color: 'var(--color-text-muted)',
            opacity: isReady ? 1 : 0,
            transition: 'opacity 600ms ease-out 200ms',
          }}
        >
          <Box component="span">{ caption }</Box>
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'var(--color-orange)' }}>
            <ThreeSixtyIcon sx={{ fontSize: 15 }} />
            드래그해서 돌려보세요
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default TurtleStage;
