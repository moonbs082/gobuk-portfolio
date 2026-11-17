import { memo } from 'react';
import Box from '@mui/material/Box';
import { getCategoryColor, getSkillIcon } from '../../utils/skill-utils.js';

/**
 * SkillIconCard 컴포넌트
 *
 * 아이콘 + 기술명만 간단히 보여주는 스킬 카드 (홈 화면용).
 *
 * Props:
 * @param {object} skill - 스킬 정보 ({ icon, name, category }) [Required]
 * @param {boolean} isCompact - 작은 크기로 표시할지 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <SkillIconCard skill={ skill } isCompact />
 */
function SkillIconCard({ skill, isCompact = false }) {
  const color = getCategoryColor(skill.category);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: isCompact ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: isCompact ? 'flex-start' : 'center',
        gap: isCompact ? 1 : 1.5,
        p: isCompact ? 1.25 : { xs: 2.5, md: 3.5 },
        borderRadius: 3,
        border: '1px solid var(--color-border)',
        borderTop: isCompact ? undefined : `3px solid ${color}`,
        bgcolor: 'var(--color-surface)',
        transition: 'border-color 300ms, transform 300ms',
        '&:hover': { borderColor: color, transform: 'translateY(-3px)' },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: isCompact ? 36 : { xs: 56, md: 68 },
          height: isCompact ? 36 : { xs: 56, md: 68 },
          flexShrink: 0,
          borderRadius: isCompact ? 1.5 : 2.5,
          display: 'grid',
          placeItems: 'center',
          fontSize: isCompact ? '1.15rem' : { xs: '1.8rem', md: '2.2rem' },
          bgcolor: `${color}24`,
        }}
      >
        { getSkillIcon(skill.icon) }
      </Box>
      <Box
        sx={{
          fontWeight: 700,
          fontSize: isCompact ? '0.9rem' : { xs: '1rem', md: '1.15rem' },
          color: 'var(--color-text)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        { skill.name }
      </Box>
    </Box>
  );
}

export default memo(SkillIconCard);
