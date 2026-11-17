import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { bySize } from '../../utils/hero-responsive.js';

/** 버튼별 아이콘 */
const ACTION_ICONS = {
  projects: <ArrowDownwardIcon />,
  contact: <EmailOutlinedIcon />,
  resume: <FileDownloadOutlinedIcon />,
};

/** 주요 CTA: 그라데이션 + 숨 쉬는 빛 + 주기적으로 스쳐 가는 하이라이트 */
const primarySx = {
  ...bySize({
    mobile: { minHeight: 54, px: 3.5, fontSize: '1.02rem' },
    tablet: { minHeight: 56, px: 4.5, fontSize: '1.08rem' },
  }),
  background: 'var(--gradient-power)',
  color: '#0E0E10',
  animation: 'ctaGlow 2.8s ease-in-out infinite',
  '@keyframes ctaGlow': {
    '0%, 100%': { boxShadow: '0 8px 26px rgba(255, 107, 26, 0.35), 0 0 0 0 rgba(255, 107, 26, 0.35)' },
    '50%': { boxShadow: '0 10px 34px rgba(255, 107, 26, 0.5), 0 0 0 6px rgba(255, 107, 26, 0)' },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-60%',
    width: '40%',
    height: '100%',
    background: 'linear-gradient(110deg, transparent, rgba(255,255,255,0.5), transparent)',
    transform: 'skewX(-20deg)',
    animation: 'ctaShine 4.5s ease-in-out 1.2s infinite',
    '@keyframes ctaShine': {
      '0%, 70%': { left: '-60%' },
      '90%, 100%': { left: '130%' },
    },
  },
  /** 마우스가 있는 기기에서만 호버 효과 (터치 기기에서 눌린 채 남는 현상 방지) */
  '@media (hover: hover)': {
    '&:hover': {
      transform: 'translateY(-3px) scale(1.02)',
      background: 'var(--gradient-power)',
      boxShadow: '0 16px 40px rgba(255, 107, 26, 0.55)',
      /** 숨 쉬는 빛 애니메이션이 호버 그림자를 덮어쓰지 않도록 해제 */
      animation: 'none',
    },
    '&:hover .MuiButton-endIcon': { transform: 'translateY(3px)' },
  },
  '&:active': { transform: 'scale(0.98)' },
};

/** 보조 CTA: 외곽선 + 반투명 배경 (주요 CTA 보다 한 단계 약하게) */
const secondarySx = {
  ...bySize({
    mobile: { minHeight: 50, px: 3, fontSize: '0.98rem' },
    tablet: { minHeight: 56, px: 3.5, fontSize: '1rem' },
  }),
  color: 'var(--color-text)',
  borderColor: 'rgba(245, 243, 239, 0.35)',
  bgcolor: 'rgba(14, 14, 16, 0.4)',
  backdropFilter: 'blur(6px)',
  '@media (hover: hover)': {
    '&:hover': {
      transform: 'translateY(-3px)',
      borderColor: 'var(--color-orange)',
      bgcolor: 'var(--color-orange-soft)',
      boxShadow: '0 10px 28px rgba(0, 0, 0, 0.35)',
    },
    '&:hover .MuiButton-endIcon': { transform: 'rotate(-12deg) scale(1.1)' },
  },
  '&:active': { transform: 'scale(0.98)', bgcolor: 'var(--color-orange-soft)' },
};

/**
 * HeroActions 컴포넌트
 *
 * Hero 의 CTA 버튼 묶음.
 * - 주요 CTA: 그라데이션 · 더 큰 크기 · 숨 쉬는 빛 · 주기적 하이라이트로 가장 먼저 눈에 띈다.
 * - 보조 CTA: 외곽선 스타일로 한 단계 약하게, 호버 시 오렌지로 반응한다.
 * - type 'scroll' 은 onAction 으로 섹션 이동, type 'download' 는 파일을 내려받는다. (href 가 없으면 숨김)
 * - isStacked 가 true 면(모바일) 세로로 쌓이고 전체 너비가 된다. 아니면 가로 배치.
 * - 모든 버튼은 높이 50px 이상, 버튼 사이 간격 12px 이상으로 터치하기 쉽다.
 *
 * Props:
 * @param {object[]} actions - 버튼 목록 ({ id, label, type, sectionId, href, fileName, isPrimary }) [Required]
 * @param {function} onAction - scroll 버튼 클릭 시 실행 (action) => void [Required]
 * @param {boolean} isStacked - 세로 전체 너비 배치 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <HeroActions actions={ heroActions } onAction={ handleAction } isStacked={ isMobile } />
 */
function HeroActions({ actions, onAction, isStacked = false }) {
  const visibleActions = actions.filter((action) => action.type !== 'download' || action.href);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isStacked ? 'column' : 'row',
        flexWrap: isStacked ? 'nowrap' : 'wrap',
        gap: 1.5,
        width: '100%',
        ...(isStacked ? { maxWidth: 420, mx: 'auto' } : {}),
        ...bySize({ mobile: { justifyContent: 'center' }, desktop: { justifyContent: 'flex-start' } }),
      }}
    >
      {visibleActions.map((action) => {
        const isDownload = action.type === 'download';
        const linkProps = isDownload
          ? { component: 'a', href: `${import.meta.env.BASE_URL}${action.href}`, download: action.fileName }
          : { onClick: () => onAction(action) };

        return (
          <Button
            key={ action.id }
            { ...linkProps }
            variant={ action.isPrimary ? 'contained' : 'outlined' }
            fullWidth={ isStacked }
            disableElevation
            endIcon={ ACTION_ICONS[action.id] }
            sx={{
              position: 'relative',
              overflow: 'hidden',
              minWidth: 150,
              borderRadius: 999,
              transition: 'transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms, border-color 250ms, background-color 250ms',
              '& .MuiButton-endIcon': { transition: 'transform 250ms' },
              ...(action.isPrimary ? primarySx : secondarySx),
            }}
          >
            { action.label }
          </Button>
        );
      })}
    </Box>
  );
}

export default HeroActions;
