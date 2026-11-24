import { lazy, Suspense, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import { isWebGLAvailable } from '../../../utils/webgl-utils.js';
import { findExercisePose } from '../../utils/exercise-poses.js';
import MuscleLegend from './muscle-legend.jsx';

/** three.js 는 용량이 커서 필요할 때 따로 불러온다 */
const PostureCanvas = lazy(() => import('./posture-canvas.jsx'));

/**
 * Posture3DViewer 컴포넌트 - 운동 자세를 3D 마네킹 동작으로 보여주는 카드
 * - 시작 ↔ 끝 자세를 반복 재생하고, 좌우로 드래그하면 돌려볼 수 있다.
 * - WebGL 을 지원하지 않거나 자세 데이터가 없으면 안내 문구를 보여준다.
 *
 * Props:
 * @param {string} exerciseId - 운동 id [Required]
 * @param {string} exerciseName - 운동 이름 (화면 낭독기용) [Optional, 기본값: '운동']
 *
 * Example usage:
 * <Posture3DViewer exerciseId="squat" exerciseName="스쿼트" />
 */
function Posture3DViewer({ exerciseId, exerciseName = '운동' }) {
  const [isWebGL] = useState(isWebGLAvailable);
  const [isPlaying, setIsPlaying] = useState(true);
  const pose = findExercisePose(exerciseId);

  if (!pose) return null;

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: { xs: '1 / 1', sm: '5 / 4' },
          borderRadius: 3,
          overflow: 'hidden',
          border: 1,
          borderColor: 'grey.200',
          background: 'radial-gradient(circle at 50% 40%, #ffffff 0%, #f6f6f6 60%, #e9e9e9 100%)',
        }}
      >
        { isWebGL ? (
          <Suspense
            fallback={ (
              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress color="secondary" />
              </Box>
            ) }
          >
            <PostureCanvas pose={ pose } isPlaying={ isPlaying } label={ `${exerciseName} 자세를 보여주는 3D 사람 모델 (드래그로 회전 가능)` } />
          </Suspense>
        ) : (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, color: 'text.secondary', textAlign: 'center' }}>
            이 기기에서는 3D 보기를 지원하지 않아요.
          </Box>
        ) }

        { isWebGL && (
          <>
            <Box
              sx={{
                position: 'absolute',
                left: 12,
                bottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: 0.5,
                borderRadius: 999,
                bgcolor: 'rgba(0, 0, 0, 0.45)',
                color: 'common.white',
                fontSize: '0.8rem',
                fontWeight: 700,
                pointerEvents: 'none',
              }}
            >
              <ThreeSixtyIcon sx={{ fontSize: 18 }} />
              드래그 회전 · 휠 확대/축소
            </Box>
            <IconButton
              aria-label={ isPlaying ? '동작 일시정지' : '동작 재생' }
              onClick={ () => setIsPlaying((prev) => !prev) }
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: 44,
                height: 44,
                bgcolor: 'rgba(0, 0, 0, 0.45)',
                color: 'common.white',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.65)' },
              }}
            >
              { isPlaying ? <PauseIcon /> : <PlayArrowIcon /> }
            </IconButton>
          </>
        ) }
      </Box>

      <Box sx={{ mt: 1.5, color: 'text.secondary', fontSize: '0.9rem', lineHeight: 1.6 }}>
        { pose.caption }
      </Box>
      <MuscleLegend muscles={ pose.muscles } />
    </Box>
  );
}

export default Posture3DViewer;
