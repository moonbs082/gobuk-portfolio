import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * SectionHeading 컴포넌트
 *
 * 섹션 번호(01, 02 ...) + 영문 대제목 + 한글 설명으로 구성된 섹션 제목.
 *
 * Props:
 * @param {string} number - 섹션 번호 [Required]
 * @param {string} title - 영문 대제목 [Required]
 * @param {string} description - 한 줄 설명 [Optional, 기본값: '']
 *
 * Example usage:
 * <SectionHeading number="01" title="ABOUT" description="나의 이야기" />
 */
function SectionHeading({ number, title, description = '' }) {
  return (
    <Box sx={{ mb: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '0.95rem', md: '1.05rem' },
          letterSpacing: 3,
          color: 'var(--color-orange)',
          mb: 1,
        }}
      >
        { number } —
      </Box>
      <Typography
        variant="h2"
        sx={{
          fontFamily: 'var(--font-display)',
          fontSize: { xs: '2.4rem', md: '3.4rem' },
          lineHeight: 1.1,
          letterSpacing: 1,
          color: 'var(--color-text)',
        }}
      >
        { title }
      </Typography>
      {description && (
        <Typography sx={{ mt: 1.5, color: 'var(--color-text-muted)', fontSize: { xs: '1rem', md: '1.1rem' } }}>
          { description }
        </Typography>
      )}
    </Box>
  );
}

export default SectionHeading;
