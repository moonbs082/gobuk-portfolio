import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

/**
 * ProjectCard 컴포넌트
 *
 * 프로젝트 제목, 설명, 기술 스택, 사이트 링크를 보여주는 카드.
 *
 * Props:
 * @param {string} title - 프로젝트 제목 [Required]
 * @param {string} description - 프로젝트 설명 [Required]
 * @param {string[]} techStack - 기술 스택 목록 [Optional, 기본값: []]
 * @param {string} url - 배포 사이트 주소 (없으면 '지금 보고 계신 사이트' 표시) [Optional, 기본값: '']
 * @param {boolean} isFeatured - 대표 프로젝트 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <ProjectCard title="AI 스마트 운동" description="..." techStack={ ['React'] } url="https://..." isFeatured />
 */
function ProjectCard({ title, description, techStack = [], url = '', isFeatured = false }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid',
        borderColor: isFeatured ? 'rgba(255, 107, 26, 0.6)' : 'var(--color-border)',
        bgcolor: 'var(--color-surface)',
        transition: 'transform 300ms, box-shadow 300ms',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 40px rgba(255, 107, 26, 0.15)' },
      }}
    >
      <Box
        aria-hidden
        sx={{
          height: { xs: 140, md: 180 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isFeatured
            ? 'var(--gradient-power)'
            : 'linear-gradient(135deg, #24242B 0%, #1C1C21 100%)',
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '2rem', md: '2.6rem' },
          letterSpacing: 2,
          color: isFeatured ? '#0E0E10' : 'var(--color-orange)',
        }}
      >
        { isFeatured ? 'FEATURED' : 'PROJECT' }
      </Box>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5, p: { xs: 3, md: 4 } }}>
        <Typography component="h3" sx={{ fontFamily: 'var(--font-display-ko)', fontSize: '1.5rem', color: 'var(--color-text)' }}>
          { title }
        </Typography>
        <Typography sx={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
          { description }
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {techStack.map((tech) => (
            <Chip
              key={ tech }
              label={ tech }
              size="small"
              sx={{ fontWeight: 700, color: 'var(--color-orange)', bgcolor: 'var(--color-orange-soft)' }}
            />
          ))}
        </Box>
        <Box sx={{ mt: 'auto', pt: 1 }}>
          {url ? (
            <Button
              href={ url }
              target="_blank"
              rel="noopener noreferrer"
              endIcon={ <OpenInNewIcon /> }
              sx={{ px: 0, color: 'var(--color-orange)' }}
            >
              사이트 보기
            </Button>
          ) : (
            <Box component="span" sx={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              🐢 지금 보고 계신 사이트입니다
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProjectCard;
