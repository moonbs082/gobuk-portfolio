import Box from '@mui/material/Box';
import { MUSCLE_LABELS } from '../../utils/exercise-poses.js';

/** 3D 모델의 근육 강조 색과 같은 색 */
const GROUPS = [
  { key: 'primary', label: '주동근', color: '#e53935' },
  { key: 'secondary', label: '보조근', color: '#f19c99' },
];

/**
 * MuscleLegend 컴포넌트 - 3D 모델에 칠해진 근육 색이 무엇인지 알려주는 범례
 *
 * Props:
 * @param {object} muscles - { primary: string[], secondary: string[] } 근육 이름 목록 [Optional, 기본값: {}]
 *
 * Example usage:
 * <MuscleLegend muscles={{ primary: ['quads', 'glutes'], secondary: ['hamstrings'] }} />
 */
function MuscleLegend({ muscles = {} }) {
  const rows = GROUPS.filter(({ key }) => (muscles[key] || []).length > 0);

  if (rows.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 1.5 }}>
      { rows.map(({ key, label, color }) => (
        <Box key={ key } sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, fontSize: '0.875rem', lineHeight: 1.5 }}>
          <Box sx={{ width: 12, height: 12, mt: '4px', borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
          <Box component="span" sx={{ fontWeight: 800, flexShrink: 0 }}>{ label }</Box>
          <Box component="span" sx={{ color: 'text.secondary' }}>
            { muscles[key].map((muscle) => MUSCLE_LABELS[muscle] || muscle).join(' · ') }
          </Box>
        </Box>
      )) }
    </Box>
  );
}

export default MuscleLegend;
