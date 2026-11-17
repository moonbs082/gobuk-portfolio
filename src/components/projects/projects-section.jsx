import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import SectionHeading from '../common/section-heading.jsx';
import ProjectCard from './project-card.jsx';
import { projects } from '../../data/projects-data.js';

/**
 * ProjectsSection 컴포넌트
 *
 * 프로젝트 카드 목록 섹션.
 *
 * Example usage:
 * <ProjectsSection />
 */
function ProjectsSection() {
  return (
    <Box component="section" id="projects" sx={{ py: { xs: 8, md: 12 }, scrollMarginTop: 64 }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
        <SectionHeading number="03" title="PROJECTS" description="내 문제에서 출발해, 끝까지 완성한 작업물입니다." />
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {projects.map(({ id, ...project }) => (
            <Grid key={ id } size={{ xs: 12, md: 6 }}>
              <ProjectCard { ...project } />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default ProjectsSection;
