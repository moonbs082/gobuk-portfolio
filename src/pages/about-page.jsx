import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import ProfileCard from '../components/about/profile-card.jsx';
import AboutSectionTabs from '../components/about/about-section-tabs.jsx';
import AboutSkillsSection from '../components/about/about-skills-section.jsx';
import usePortfolio from '../hooks/use-portfolio.js';

/**
 * AboutPage 페이지
 *
 * 기본 정보 카드 → 콘텐츠 탭 → 스킬 섹션으로 구성된 About Me 상세 페이지.
 * 데이터는 PortfolioContext 에서 가져오며, 여기서 수정한 내용은 홈 탭에 즉시 반영된다.
 */
function AboutPage() {
  const { aboutMeData, updateSectionContent } = usePortfolio();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 2, md: 4 },
        background: 'radial-gradient(circle at 50% 0%, rgba(229, 37, 46, 0.16) 0%, transparent 55%)',
      }}
    >
      <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, md: 3 } }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <ProfileCard basicInfo={ aboutMeData.basicInfo } />
          <AboutSectionTabs sections={ aboutMeData.sections } onSaveContent={ updateSectionContent } />
          <AboutSkillsSection />
        </Stack>
      </Container>
    </Box>
  );
}

export default AboutPage;
