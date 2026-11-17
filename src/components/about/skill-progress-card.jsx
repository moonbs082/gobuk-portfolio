import { memo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { getCategoryColor, getSkillIcon } from '../../utils/skill-utils.js';

/**
 * SkillProgressCard 컴포넌트
 *
 * 아이콘 + 기술명 + 숙련도 퍼센트 바를 보여주는 스킬 카드.
 * 마우스를 올리면 간단한 설명 툴팁이 나타나고, 바는 isAnimated 가 true 가 되면 0 → level 로 차오른다.
 * memo 로 감싸 다른 스킬이 바뀔 때 불필요하게 다시 그려지지 않는다.
 *
 * Props:
 * @param {object} skill - 스킬 정보 ({ id, icon, name, level, category, description, isMainSkill }) [Required]
 * @param {boolean} isAnimated - 바 애니메이션 시작 여부 [Optional, 기본값: true]
 * @param {boolean} isInHome - 현재 홈 화면에 표시 중인지 여부 [Optional, 기본값: false]
 * @param {function} onEdit - 수정 버튼 클릭 시 실행 (skill) => void [Required]
 * @param {function} onToggleMain - 메인 스킬 별 버튼 클릭 시 실행 (skill) => void [Required]
 *
 * Example usage:
 * <SkillProgressCard skill={ skill } isAnimated={ isInView } onEdit={ handleEdit } onToggleMain={ handleToggleMain } />
 */
function SkillProgressCard({ skill, isAnimated = true, isInHome = false, onEdit, onToggleMain }) {
  const color = getCategoryColor(skill.category);

  return (
    <Tooltip title={ skill.description } arrow placement="top" enterDelay={ 200 }>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          p: 2.5,
          borderRadius: 3,
          border: '1px solid var(--color-border)',
          bgcolor: 'var(--color-surface-raised)',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          transition: 'border-color 300ms, transform 300ms',
          '&:hover': { borderColor: color, transform: 'translateY(-3px)' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            aria-hidden
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              fontSize: '1.4rem',
              bgcolor: `${color}24`,
            }}
          >
            { getSkillIcon(skill.icon) }
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text)' }}>{ skill.name }</Box>
            <Box sx={{ fontSize: '0.78rem', color }}>{ skill.category }</Box>
          </Box>
          <Box sx={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: 0.5, color: 'var(--color-text)' }}>
            { skill.level }
            <Box component="span" sx={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', ml: 0.25 }}>%</Box>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={ isAnimated ? skill.level : 0 }
          aria-label={ `${skill.name} 숙련도 ${skill.level}%` }
          sx={{
            height: 8,
            borderRadius: 999,
            bgcolor: 'rgba(255, 255, 255, 0.08)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
              bgcolor: color,
              transition: 'transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)',
            },
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 'auto' }}>
          {isInHome && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: 999,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-orange)',
                bgcolor: 'var(--color-orange-soft)',
              }}
            >
              <HomeIcon sx={{ fontSize: 14 }} />
              홈 표시 중
            </Box>
          )}
          <IconButton
            size="small"
            onClick={ () => onToggleMain(skill) }
            aria-pressed={ skill.isMainSkill }
            aria-label={ `${skill.name} 메인 스킬 ${skill.isMainSkill ? '해제' : '지정'}` }
            sx={{ ml: 'auto', color: skill.isMainSkill ? '#FFB547' : 'var(--color-text-muted)' }}
          >
            {skill.isMainSkill ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>
          <IconButton
            size="small"
            onClick={ () => onEdit(skill) }
            aria-label={ `${skill.name} 숙련도 수정` }
            sx={{ color: 'var(--color-text-muted)', '&:hover': { color: 'var(--color-orange)' } }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </Card>
    </Tooltip>
  );
}

export default memo(SkillProgressCard);
