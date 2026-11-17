import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SectionHeading from '../common/section-heading.jsx';
import SkillIconCard from '../ui/skill-icon-card.jsx';
import usePortfolio from '../../hooks/use-portfolio.js';

/** 공통 카드 스타일 */
const cardSx = {
  height: '100%',
  borderRadius: 3,
  border: '1px solid var(--color-border)',
  bgcolor: 'var(--color-surface)',
};

/**
 * AboutPreviewSection 컴포넌트
 *
 * 홈 화면의 About 섹션. PortfolioContext 의 홈 탭 데이터를 사용한다.
 * - 메인: showInHome 섹션 요약 ('나의 개발 스토리'가 가장 크게)
 * - 사이드: 프로필 사진 + 기본 정보
 * - 하단: 주요 스킬 4개
 * - '더 알아보기' 버튼 → About 페이지
 *
 * Example usage:
 * <AboutPreviewSection />
 */
function AboutPreviewSection() {
  const { homeData } = usePortfolio();
  const { basicInfo, content, skills } = homeData;
  const [mainContent, ...subContents] = content;

  const infoItems = [
    { label: '학력', value: basicInfo.education },
    { label: '전공', value: basicInfo.major },
    { label: '경력', value: basicInfo.experience },
  ];

  return (
    <Box component="section" id="about" sx={{ py: { xs: 8, md: 12 }, scrollMarginTop: 64 }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <SectionHeading number="01" title="ABOUT" description="운동하다 생긴 질문이, 저를 웹으로 데려왔습니다." />

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* 메인 콘텐츠 */}
          <Grid size={{ xs: 12, md: 8 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Card elevation={0} sx={ cardSx }>
              <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                {mainContent && (
                  <Box>
                    <Typography
                      component="h3"
                      sx={{ fontFamily: 'var(--font-display-ko)', fontSize: { xs: '1.4rem', md: '1.7rem' }, color: 'var(--color-orange)', mb: 1.5 }}
                    >
                      { mainContent.title }
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        lineHeight: 1.7,
                        color: 'var(--color-text)',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      { mainContent.summary }
                    </Typography>
                  </Box>
                )}

                {subContents.map((item) => (
                  <Box key={ item.id } sx={{ pt: 2.5, borderTop: '1px solid var(--color-border)' }}>
                    <Typography component="h3" sx={{ fontWeight: 700, color: 'var(--color-text)', mb: 0.75 }}>
                      { item.title }
                    </Typography>
                    <Typography
                      sx={{
                        lineHeight: 1.6,
                        color: 'var(--color-text-muted)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      { item.summary }
                    </Typography>
                  </Box>
                ))}

                {/* 주요 스킬 */}
                <Box sx={{ mt: 'auto', pt: 2.5, borderTop: '1px solid var(--color-border)' }}>
                  <Box sx={{ fontFamily: 'var(--font-display)', letterSpacing: 2, color: 'var(--color-text-muted)', mb: 1.5 }}>
                    MAIN SKILLS
                  </Box>
                  <Grid container spacing={ 1.5 }>
                    {skills.map((skill) => (
                      <Grid key={ skill.id } size={{ xs: 6, sm: 3 }}>
                        <SkillIconCard skill={ skill } isCompact />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 사이드: 프로필 */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Card
              elevation={0}
              sx={{ ...cardSx, background: 'linear-gradient(160deg, rgba(255,107,26,0.18) 0%, var(--color-surface) 55%)' }}
            >
              <CardContent
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  py: { xs: 4, md: 5 },
                }}
              >
                <Avatar
                  src={ basicInfo.photo }
                  alt={ `${basicInfo.name} 프로필 사진` }
                  sx={{ width: 120, height: 120, mb: 2, border: '3px solid var(--color-orange)' }}
                />
                <Typography sx={{ fontFamily: 'var(--font-display-ko)', fontSize: '1.6rem', color: 'var(--color-text)', mb: 2 }}>
                  { basicInfo.name }
                </Typography>
                <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {infoItems.map((item) => (
                    <Box
                      component="li"
                      key={ item.label }
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        fontSize: '0.9rem',
                        bgcolor: 'rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      <Box component="span" sx={{ fontWeight: 700, color: 'var(--color-orange)' }}>{ item.label }</Box>
                      <Box component="span" sx={{ color: 'var(--color-text)', textAlign: 'right' }}>{ item.value }</Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
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
            더 알아보기
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AboutPreviewSection;
