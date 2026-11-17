import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { contactInfo } from '../../data/site-data.js';

/**
 * ContactSection 컴포넌트
 *
 * 연락 CTA 섹션. contactInfo.email 이 있을 때만 이메일 버튼을 보여준다.
 *
 * Example usage:
 * <ContactSection />
 */
function ContactSection() {
  const { email, github } = contactInfo;

  return (
    <Box component="section" id="contact" sx={{ py: { xs: 8, md: 12 }, px: { xs: 2, md: 3 }, scrollMarginTop: 64 }}>
      <Container
        maxWidth="md"
        sx={{
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 6 },
          textAlign: 'center',
          borderRadius: 4,
          border: '1px solid rgba(255, 107, 26, 0.4)',
          background: 'radial-gradient(circle at 50% 0%, rgba(255,107,26,0.22) 0%, var(--color-surface) 70%)',
        }}
      >
        <Box sx={{ fontFamily: 'var(--font-display)', letterSpacing: 3, color: 'var(--color-orange)', mb: 1 }}>
          04 — CONTACT
        </Box>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'var(--font-display-ko)',
            fontSize: { xs: '1.8rem', md: '2.6rem' },
            lineHeight: 1.35,
            color: 'var(--color-text)',
          }}
        >
          끝까지 함께 달릴
          <br />
          팀을 찾고 있습니다
        </Typography>
        <Typography sx={{ mt: 2, color: 'var(--color-text-muted)', fontSize: { xs: '1rem', md: '1.1rem' } }}>
          신뢰할 수 있는 웹을 함께 만들고 싶다면 편하게 연락해 주세요.
        </Typography>

        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
          {email && (
            <Button
              href={ `mailto:${email}` }
              variant="contained"
              disableElevation
              startIcon={ <MailOutlinedIcon /> }
              sx={{
                px: 3.5,
                py: 1.25,
                borderRadius: 999,
                background: 'var(--gradient-power)',
                color: '#0E0E10',
              }}
            >
              이메일 보내기
            </Button>
          )}
          <Button
            href={ github }
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            startIcon={ <GitHubIcon /> }
            sx={{
              px: 3.5,
              py: 1.25,
              borderRadius: 999,
              color: 'var(--color-text)',
              borderColor: 'var(--color-border)',
              '&:hover': { borderColor: 'var(--color-orange)', bgcolor: 'var(--color-orange-soft)' },
            }}
          >
            GitHub
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ContactSection;
