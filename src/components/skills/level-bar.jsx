import Box from '@mui/material/Box';

/**
 * LevelBar 컴포넌트
 *
 * 숙련도를 퍼센트 대신 '레벨 칸 수'로 보여주는 세그먼트형 프로그레스 바.
 *
 * Props:
 * @param {number} level - 현재 레벨 [Required]
 * @param {number} maxLevel - 최대 레벨 (전체 칸 수) [Required]
 *
 * Example usage:
 * <LevelBar level={ 2 } maxLevel={ 5 } />
 */
function LevelBar({ level, maxLevel }) {
  return (
    <Box
      role="img"
      aria-label={ `숙련도 ${maxLevel}단계 중 ${level}단계` }
      sx={{ display: 'flex', gap: 0.75 }}
    >
      {Array.from({ length: maxLevel }, (_, index) => (
        <Box
          key={ index }
          sx={{
            flex: 1,
            height: 10,
            borderRadius: 999,
            background: index < level ? 'var(--gradient-power)' : 'rgba(255, 255, 255, 0.08)',
          }}
        />
      ))}
    </Box>
  );
}

export default LevelBar;
