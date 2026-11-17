import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';

/**
 * ProfileCard 컴포넌트
 *
 * 프로필 사진 + 이름 + 학력·전공·경력을 보여주는 기본 정보 카드.
 * 모바일에서는 사진과 정보가 세로로 쌓인다.
 *
 * Props:
 * @param {object} basicInfo - 기본 정보 ({ name, education, major, experience, photo }) [Required]
 *
 * Example usage:
 * <ProfileCard basicInfo={ aboutMeData.basicInfo } />
 */
function ProfileCard({ basicInfo }) {
  const { name, education, major, experience, photo } = basicInfo;

  const infoItems = [
    { label: '학력', value: education, icon: <SchoolIcon fontSize="small" /> },
    { label: '전공', value: major, icon: <MenuBookIcon fontSize="small" /> },
    { label: '경력', value: experience, icon: <WorkOutlinedIcon fontSize="small" /> },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid var(--color-border)',
        bgcolor: 'var(--color-surface)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 4,
          background: 'var(--gradient-power)',
        },
      }}
    >
      <CardContent sx={{ py: { xs: 4, md: 5 }, px: { xs: 3, md: 5 } }}>
        <Grid container spacing={{ xs: 3, md: 5 }} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                p: '4px',
                borderRadius: '50%',
                background: 'var(--gradient-power)',
                boxShadow: '0 12px 40px rgba(255, 107, 26, 0.3)',
              }}
            >
              <Avatar
                src={ photo }
                alt={ `${name} 프로필 사진` }
                sx={{
                  width: { xs: 140, md: 180 },
                  height: { xs: 140, md: 180 },
                  border: '4px solid var(--color-surface)',
                }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box
                sx={{ fontFamily: 'var(--font-display)', letterSpacing: 3, color: 'var(--color-orange)', mb: 0.5 }}
              >
                WEB DESIGNER
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontFamily: 'var(--font-display-ko)',
                  fontSize: { xs: '2rem', md: '2.6rem' },
                  lineHeight: 1.3,
                  mb: 3,
                  color: 'var(--color-text)',
                }}
              >
                { name }
              </Typography>

              <Box
                component="ul"
                sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}
              >
                {infoItems.map((item) => (
                  <Box
                    component="li"
                    key={ item.label }
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.75,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 999,
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--color-orange)',
                        bgcolor: 'var(--color-orange-soft)',
                      }}
                    >
                      { item.icon }
                      { item.label }
                    </Box>
                    <Box component="span" sx={{ color: 'var(--color-text)', fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
                      { item.value }
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
