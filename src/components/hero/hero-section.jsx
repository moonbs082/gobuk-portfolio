import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import HeroBackground from './hero-background.jsx';
import HeroEyebrow from './hero-eyebrow.jsx';
import Headline3D from './headline-3d.jsx';
import HeroValueProp from './hero-value-prop.jsx';
import HeroActions from './hero-actions.jsx';
import HeroScrollCue from './hero-scroll-cue.jsx';
import HeroSocialLinks from './hero-social-links.jsx';
import TurtleStage from './turtle-stage.jsx';
import RotatingMenu from './rotating-menu.jsx';
import FadeIn from '../ui/fade-in.jsx';
import useHeroLayout from '../../hooks/use-hero-layout.js';
import { bySize } from '../../utils/hero-responsive.js';
import { heroActions, heroContent, menuItems, socialLinks } from '../../data/site-data.js';

/** 텍스트 칼럼 요소 사이 간격 (모바일 → 태블릿 → 데스크탑 순으로 넓어짐) */
const GAP = {
  headline: bySize({ mobile: { mt: 2 }, tablet: { mt: 3 }, desktop: { mt: 3 } }),
  valueProp: bySize({ mobile: { mt: 1.5 }, tablet: { mt: 2 }, desktop: { mt: 2.5 } }),
  actions: bySize({ mobile: { mt: 3 }, tablet: { mt: 3.5 }, desktop: { mt: 4 } }),
  social: bySize({ mobile: { mt: 2.5 }, tablet: { mt: 3 }, desktop: { mt: 3 } }),
};

/**
 * HeroSection 컴포넌트
 *
 * 첫 화면. Container + Grid 레이아웃이며 3구간으로 반응한다. (useHeroLayout + bySize)
 * - 모바일(~767px): 세로형 1단 · 가운데 정렬 · CTA 세로 전체 너비 · 거북이는 CTA 아래
 * - 태블릿(768~1199px): 가운데 정렬 1단 · 넉넉한 간격 · CTA 가로 배치 · 더 큰 거북이
 * - 데스크탑(1200px~): 좌(텍스트)/우(3D) 2단 · 왼쪽 정렬 · 하단 스크롤 유도 표시
 *
 * Example usage:
 * <HeroSection />
 */
function HeroSection() {
  const [step, setStep] = useState(0);
  const { isMobile, isTablet, isDesktop } = useHeroLayout();

  const count = menuItems.length;

  let gridSpacing = 3;
  if (isTablet) gridSpacing = 5;
  if (isDesktop) gridSpacing = 6;

  /** 해당 섹션으로 부드럽게 이동 */
  const scrollToSection = (item) => {
    document.getElementById(item.sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      component="section"
      aria-label="소개"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'var(--color-bg)',
        ...bySize({
          mobile: { minHeight: 'calc(100svh - 56px)' },
          tablet: { minHeight: 'calc(100svh - 64px)' },
          desktop: { minHeight: 'calc(100vh - 64px)' },
        }),
      }}
    >
      <HeroBackground />

      <Container
        maxWidth="lg"
        disableGutters
        sx={{
          position: 'relative',
          ...bySize({
            mobile: { px: 2.5, pt: 3, pb: 4 },
            tablet: { px: 5, pt: 6, pb: 6 },
            desktop: { px: 4, pt: 8, pb: 11 },
          }),
        }}
      >
        <Grid container spacing={ gridSpacing } sx={{ alignItems: 'center' }}>
          {/* 텍스트 칼럼 */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                ...bySize({
                  mobile: { alignItems: 'center' },
                  tablet: { alignItems: 'center', maxWidth: 680, mx: 'auto' },
                  desktop: { alignItems: 'flex-start', maxWidth: 'none', mx: 0 },
                }),
              }}
            >
              <FadeIn delay={ 0 } sx={{ maxWidth: '100%' }}>
                <HeroEyebrow label={ heroContent.eyebrowLabel } phrases={ heroContent.eyebrowPhrases } />
              </FadeIn>
              <FadeIn delay={ 120 } sx={{ width: '100%', ...GAP.headline }}>
                <Headline3D title={ heroContent.slogan } subtitle={ heroContent.role } highlight={ heroContent.name } />
              </FadeIn>
              <FadeIn delay={ 260 } sx={{ width: '100%', ...GAP.valueProp }}>
                <HeroValueProp text={ heroContent.valueProp } keywords={ heroContent.keywords } />
              </FadeIn>
              <FadeIn delay={ 400 } sx={{ width: '100%', ...GAP.actions }}>
                <HeroActions actions={ heroActions } onAction={ scrollToSection } isStacked={ isMobile } />
              </FadeIn>
              <FadeIn delay={ 520 } sx={{ width: '100%', ...GAP.social }}>
                <HeroSocialLinks links={ socialLinks } />
              </FadeIn>
            </Box>
          </Grid>

          {/* 3D 조형 칼럼 */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <FadeIn delay={ 200 } distance={ 30 }>
              <TurtleStage syncDeg={ step * (360 / count) } pulseKey={ step } caption={ heroContent.techCaption } />
              <Box sx={ bySize({ mobile: { mt: 1.5 }, tablet: { mt: 2 }, desktop: { mt: 1 } }) }>
                <RotatingMenu items={ menuItems } step={ step } onStepChange={ setStep } onSelect={ scrollToSection } />
              </Box>
            </FadeIn>
          </Grid>
        </Grid>
      </Container>

      {isDesktop && <HeroScrollCue onClick={ () => scrollToSection({ sectionId: 'about' }) } />}
    </Box>
  );
}

export default HeroSection;
