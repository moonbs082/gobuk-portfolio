import { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import SkillProgressCard from './skill-progress-card.jsx';
import SkillFormDialog from './skill-form-dialog.jsx';
import usePortfolio from '../../hooks/use-portfolio.js';
import useInView from '../../hooks/use-in-view.js';
import { HOME_SKILL_COUNT, skillPresets } from '../../data/skill-meta.js';
import { groupSkillsByCategory, sortSkillsByLevel } from '../../utils/skill-utils.js';

/**
 * AboutSkillsSection 컴포넌트
 *
 * About Me 탭의 스킬 섹션. 카테고리별로 묶은 스킬 카드를 반응형 그리드(1 / 2 / 3열)로 보여준다.
 * - 정렬: 기본순 / 숙련도순
 * - 별(★) 버튼: 메인 스킬 지정 → 메인 스킬 중 숙련도 상위 4개가 홈 화면에 표시
 * - '스킬 추가' 버튼: 추가 가능한 기술 목록에서 선택
 *
 * Example usage:
 * <AboutSkillsSection />
 */
function AboutSkillsSection() {
  const { aboutMeData, homeData, updateSkill, addSkill } = usePortfolio();
  const [sortMode, setSortMode] = useState('default');
  const [dialogState, setDialogState] = useState(null);
  const [gridRef, isInView] = useInView(0.15);

  const { skills } = aboutMeData;

  const skillGroups = useMemo(
    () => groupSkillsByCategory(sortMode === 'level' ? sortSkillsByLevel(skills) : skills),
    [skills, sortMode],
  );

  const homeSkillIds = useMemo(() => new Set(homeData.skills.map((skill) => skill.id)), [homeData.skills]);

  const availablePresets = useMemo(
    () => skillPresets.filter((preset) => !skills.some((skill) => skill.name === preset.name)),
    [skills],
  );

  /** 정렬 방식 변경 (같은 버튼 재클릭 시 null 이 오므로 무시) */
  const handleSortChange = (event, newMode) => {
    if (newMode) setSortMode(newMode);
  };

  /** 수정 다이얼로그 열기 (memo 카드에 넘기므로 useCallback) */
  const handleEdit = useCallback((skill) => setDialogState({ skill }), []);

  /** 메인 스킬 지정 / 해제 */
  const handleToggleMain = useCallback(
    (skill) => updateSkill(skill.id, { isMainSkill: !skill.isMainSkill }),
    [updateSkill],
  );

  /** 다이얼로그 저장 */
  const handleSubmit = (values) => {
    if (dialogState?.skill) {
      updateSkill(dialogState.skill.id, values);
    } else {
      addSkill(values);
    }
    setDialogState(null);
  };

  return (
    <Card
      component="section"
      aria-labelledby="about-skills-title"
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 3,
        border: '1px solid var(--color-border)',
        bgcolor: 'var(--color-surface)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'flex-end' },
          justifyContent: 'space-between',
          gap: 2,
          mb: { xs: 3, md: 4 },
        }}
      >
        <Box>
          <Typography
            id="about-skills-title"
            component="h2"
            sx={{ fontFamily: 'var(--font-display)', fontSize: { xs: '2rem', md: '2.4rem' }, lineHeight: 1.1, letterSpacing: 1 }}
          >
            SKILLS
          </Typography>
          <Typography sx={{ mt: 1, fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
            ★ 메인 스킬 중 숙련도 상위 { HOME_SKILL_COUNT }개가 홈 화면에 표시됩니다.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={ sortMode }
            onChange={ handleSortChange }
            aria-label="스킬 정렬 방식"
            sx={{
              '& .MuiToggleButton-root': { px: 1.5, fontWeight: 700, color: 'var(--color-text-muted)' },
              '& .MuiToggleButton-root.Mui-selected': { color: 'var(--color-orange)', bgcolor: 'var(--color-orange-soft)' },
            }}
          >
            <ToggleButton value="default">기본순</ToggleButton>
            <ToggleButton value="level">숙련도순</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            startIcon={ <AddIcon /> }
            onClick={ () => setDialogState({ skill: null }) }
            disabled={ availablePresets.length === 0 }
            sx={{ borderRadius: 999, background: 'var(--gradient-power)', color: '#0E0E10' }}
          >
            스킬 추가
          </Button>
        </Box>
      </Box>

      <Box ref={ gridRef } sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
        {skillGroups.map((group) => (
          <Box key={ group.id }>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, fontWeight: 700 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: group.color }} />
              { group.label }
              <Box component="span" sx={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                { group.skills.length }
              </Box>
            </Box>
            <Grid container spacing={ 2 }>
              {group.skills.map((skill) => (
                <Grid key={ skill.id } size={{ xs: 12, sm: 6, md: 4 }}>
                  <SkillProgressCard
                    skill={ skill }
                    isAnimated={ isInView }
                    isInHome={ homeSkillIds.has(skill.id) }
                    onEdit={ handleEdit }
                    onToggleMain={ handleToggleMain }
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>

      {dialogState && (
        <SkillFormDialog
          isOpen
          skill={ dialogState.skill }
          presets={ availablePresets }
          onClose={ () => setDialogState(null) }
          onSubmit={ handleSubmit }
        />
      )}
    </Card>
  );
}

export default AboutSkillsSection;
