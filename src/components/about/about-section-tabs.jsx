import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import HomeIcon from '@mui/icons-material/Home';
import SectionContentEditor from './section-content-editor.jsx';

/**
 * AboutSectionTabs 컴포넌트
 *
 * About Me 콘텐츠 섹션들을 탭으로 보여준다.
 * showInHome 이 true 인 섹션에는 '홈 탭 표시' 뱃지가 붙는다.
 * '수정' 버튼으로 본문을 고치면 onSaveContent 로 전달된다.
 *
 * Props:
 * @param {object[]} sections - 섹션 목록 ({ id, title, content, showInHome }) [Required]
 * @param {function} onSaveContent - 본문 저장 시 실행 (sectionId, content) => void [Required]
 *
 * Example usage:
 * <AboutSectionTabs sections={ aboutMeData.sections } onSaveContent={ updateSectionContent } />
 */
function AboutSectionTabs({ sections, onSaveContent }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const [isEditing, setIsEditing] = useState(false);

  const activeSection = sections.find((section) => section.id === activeId);

  /** 탭 클릭 시 선택된 섹션 변경 (수정 중이던 내용은 닫힘) */
  const handleTabChange = (event, newId) => {
    setActiveId(newId);
    setIsEditing(false);
  };

  /** 본문 저장 */
  const handleSave = (newContent) => {
    onSaveContent(activeSection.id, newContent);
    setIsEditing(false);
  };

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 3, border: '1px solid var(--color-border)', bgcolor: 'var(--color-surface)' }}
    >
      <Tabs
        value={ activeId }
        onChange={ handleTabChange }
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="About Me 콘텐츠 탭"
        sx={{
          px: { xs: 1, md: 2 },
          borderBottom: '1px solid var(--color-border)',
          '& .MuiTabs-indicator': { height: 3, background: 'var(--gradient-power)' },
        }}
      >
        {sections.map((section) => (
          <Tab
            key={ section.id }
            value={ section.id }
            label={ section.title }
            id={ `about-tab-${section.id}` }
            aria-controls={ `about-tabpanel-${section.id}` }
            sx={{
              py: 2.5,
              fontWeight: 700,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              color: 'var(--color-text-muted)',
              '&.Mui-selected': { color: 'var(--color-orange)' },
            }}
          />
        ))}
      </Tabs>

      {activeSection && (
        <Box
          role="tabpanel"
          id={ `about-tabpanel-${activeSection.id}` }
          aria-labelledby={ `about-tab-${activeSection.id}` }
          sx={{ py: { xs: 3, md: 5 }, px: { xs: 3, md: 5 } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 2.5 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontFamily: 'var(--font-display-ko)',
                fontSize: { xs: '1.4rem', md: '1.8rem' },
                color: 'var(--color-text)',
              }}
            >
              { activeSection.title }
            </Typography>
            {activeSection.showInHome && (
              <Chip
                icon={ <HomeIcon fontSize="small" /> }
                label="홈 탭 표시"
                size="small"
                sx={{
                  fontWeight: 700,
                  color: 'var(--color-orange)',
                  bgcolor: 'var(--color-orange-soft)',
                  '& .MuiChip-icon': { color: 'var(--color-orange)' },
                }}
              />
            )}
            {!isEditing && (
              <Button
                size="small"
                startIcon={ <EditIcon fontSize="small" /> }
                onClick={ () => setIsEditing(true) }
                sx={{
                  ml: 'auto',
                  borderRadius: 999,
                  color: 'var(--color-text-muted)',
                  '&:hover': { color: 'var(--color-orange)', bgcolor: 'var(--color-orange-soft)' },
                }}
              >
                수정
              </Button>
            )}
          </Box>
          {isEditing ? (
            <SectionContentEditor
              key={ activeSection.id }
              initialContent={ activeSection.content }
              label={ activeSection.title }
              onSave={ handleSave }
              onCancel={ () => setIsEditing(false) }
            />
          ) : (
            <Typography
              sx={{
                whiteSpace: 'pre-line',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.08rem' },
                color: 'rgba(245, 243, 239, 0.82)',
              }}
            >
              { activeSection.content }
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
}

export default AboutSectionTabs;
