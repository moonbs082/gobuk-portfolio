import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { bySize } from '../../utils/hero-responsive.js';

/** 서비스별 아이콘 + 호버 시 브랜드 색 (배경 / 아이콘) */
const SOCIAL_STYLES = {
  github: { icon: <GitHubIcon />, hoverBg: '#F5F3EF', hoverColor: '#0E0E10' },
  linkedin: { icon: <LinkedInIcon />, hoverBg: '#0A66C2', hoverColor: '#FFFFFF' },
  email: { icon: <EmailOutlinedIcon />, hoverBg: 'var(--color-orange)', hoverColor: '#0E0E10' },
};

/**
 * HeroSocialLinks 컴포넌트
 *
 * Hero 의 소셜 링크 아이콘 버튼 묶음.
 * - 외부 링크는 새 탭에서 열린다. (이메일은 메일 앱으로 열림)
 * - 호버 시 떠오르며 각 서비스의 브랜드 색으로 채워지고, 툴팁으로 이름을 보여준다.
 * - url 이 비어 있는 항목은 표시하지 않는다.
 *
 * Props:
 * @param {object[]} links - 링크 목록 ({ id, label, url }) [Required]
 * @param {string} label - 왼쪽 안내 문구 [Optional, 기본값: 'FIND ME']
 *
 * Example usage:
 * <HeroSocialLinks links={ socialLinks } />
 */
function HeroSocialLinks({ links, label = 'FIND ME' }) {
  const visibleLinks = links.filter((link) => link.url && SOCIAL_STYLES[link.id]);
  if (visibleLinks.length === 0) return null;

  return (
    <Box
      component="nav"
      aria-label="소셜 링크"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        ...bySize({ mobile: { justifyContent: 'center' }, desktop: { justifyContent: 'flex-start' } }),
      }}
    >
      <Box
        aria-hidden
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: 2,
          color: 'var(--color-text-muted)',
        }}
      >
        { label }
        <Box sx={{ width: 28, height: '1px', bgcolor: 'rgba(245, 243, 239, 0.25)' }} />
      </Box>

      {visibleLinks.map((link) => {
        const style = SOCIAL_STYLES[link.id];
        const isMail = link.url.startsWith('mailto:');

        return (
          <Tooltip key={ link.id } title={ link.label } arrow>
            <IconButton
              component="a"
              href={ link.url }
              target={ isMail ? undefined : '_blank' }
              rel={ isMail ? undefined : 'noopener noreferrer' }
              aria-label={ isMail ? `${link.label} 보내기` : `${link.label} (새 탭에서 열림)` }
              sx={{
                /** 터치 영역 48px 이상 확보 */
                width: 48,
                height: 48,
                color: 'var(--color-text)',
                border: '1px solid rgba(245, 243, 239, 0.22)',
                bgcolor: 'rgba(14, 14, 16, 0.4)',
                backdropFilter: 'blur(6px)',
                transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1), background-color 250ms, color 250ms, border-color 250ms, box-shadow 250ms',
                '& svg': { transition: 'transform 250ms' },
                '@media (hover: hover)': {
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    color: style.hoverColor,
                    bgcolor: style.hoverBg,
                    borderColor: 'transparent',
                    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.4)',
                  },
                  '&:hover svg': { transform: 'rotate(-8deg) scale(1.08)' },
                },
                '&:active': { color: style.hoverColor, bgcolor: style.hoverBg },
              }}
            >
              { style.icon }
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
}

export default HeroSocialLinks;
