import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SectionHeading from '../common/section-heading.jsx';
import SkillIconCard from '../ui/skill-icon-card.jsx';
import usePortfolio from '../../hooks/use-portfolio.js';

/**
 * SkillsSection 컴포넌트
 *
 * 홈 화면의 Skills 섹션. PortfolioContext 의 상위 4개 스킬을 아이콘 + 이름으로 보여주고
 * '전체 스킬 보기' 버튼으로 About 페이지로 이동한다.
 *
 * Example usage:
 * <SkillsSection />
 */
function SkillsSection() {
  const { homeData } = usePortfolio();

  return (
    <Box component="section" id="skills" sx={{ py: { xs: 8, md: 12 }, scrollMarginTop: 64, bgcolor: '#121215' }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <SectionHeading number="02" title="SKILLS" description="가장 자신 있는 기술들입니다." />

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {homeData.skills.map((skill) => (
            <Grid key={ skill.id } size={{ xs: 6, md: 3 }}>
              <SkillIconCard skill={ skill } />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: { xs: 4, md: 5 }, textAlign: 'center' }}>
          <Button
            component={ Link }
            to="/about"
            variant="outlined"
            endIcon={ <ArrowForwardIcon /> }
            sx={{
              px: 4,
              py: 1.25,
              borderRadius: 999,
              color: 'var(--color-orange)',
              borderColor: 'var(--color-orange)',
              '&:hover': { borderColor: 'var(--color-orange)', bgcolor: 'var(--color-orange-soft)' },
            }}
          >
            전체 스킬 보기
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default SkillsSection;
