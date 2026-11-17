import HeroSection from '../components/hero/hero-section.jsx';
import AboutPreviewSection from '../components/about/about-preview-section.jsx';
import SkillsSection from '../components/skills/skills-section.jsx';
import ProjectsSection from '../components/projects/projects-section.jsx';
import ContactSection from '../components/contact/contact-section.jsx';

/**
 * HomePage 페이지
 *
 * Hero → About → Skills → Projects → Contact 순서의 메인 페이지.
 * About / Skills 섹션은 PortfolioContext 의 홈 탭 데이터를 사용한다.
 */
function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutPreviewSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}

export default HomePage;
