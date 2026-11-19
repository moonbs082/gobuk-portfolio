import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';

/**
 * ProjectIntroOverlay 컴포넌트
 *
 * 사이트 첫 접속 시 프로젝트 사이트를 전체 화면(iframe)으로 먼저 보여주고,
 * '건너뛰기'를 누르거나 iframe 이 closeMessage 를 보내면 페이드아웃되며 본 사이트가 나타난다.
 *
 * Props:
 * @param {string} title - 상단 바에 표시할 프로젝트 이름 [Required]
 * @param {string} url - 전체 화면으로 보여줄 프로젝트 주소 [Required]
 * @param {string} closeMessage - iframe(같은 주소)이 postMessage 로 보내면 인트로를 닫는 신호 [Optional, 기본값: '']
 * @param {function} onClose - 인트로가 닫히기 시작할 때 호출 [Optional]
 *
 * Example usage:
 * <ProjectIntroOverlay title="AI 스마트 운동" url="https://..." closeMessage="intro-done" onClose={ handleClose } />
 */
function ProjectIntroOverlay({ title, url, closeMessage = '', onClose }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  /** iframe 안에서 흐름을 마쳤다는 신호를 받으면 인트로를 닫는다 (같은 주소에서 온 신호만 허용) */
  useEffect(() => {
    if (!closeMessage) return undefined;
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin || event.data !== closeMessage) return;
      setIsOpen(false);
      onClose?.();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [closeMessage, onClose]);

  /** 인트로가 떠 있는 동안 뒤쪽 페이지 스크롤을 막는다 */
  useEffect(() => {
    if (!isMounted) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMounted]);

  const handleSkip = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isMounted || !url) return null;

  return (
    <Fade in={ isOpen } timeout={ 600 } onExited={ () => setIsMounted(false) }>
      <Box
        role="dialog"
        aria-label={ `${title} 프로젝트 인트로` }
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: (theme) => theme.zIndex.modal + 1,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'var(--color-bg)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: { xs: 2, md: 3 },
            py: { xs: 1, md: 1.5 },
            borderBottom: '1px solid var(--color-border)',
            bgcolor: 'var(--color-surface)',
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: { xs: '0.65rem', md: '0.75rem' },
                letterSpacing: '0.12em',
                color: 'var(--color-orange)',
              }}
            >
              FEATURED PROJECT
            </Box>
            <Box
              sx={{
                fontFamily: 'var(--font-display-ko)',
                fontSize: { xs: '1rem', md: '1.25rem' },
                color: 'var(--color-text)',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              { /** 대문자(예: B·H·M)는 강조 색상 + 굵게 표시 */ }
              { title.split('').map((char, index) => (
                /[A-Z]/.test(char) ? (
                  <Box
                    key={ index }
                    component="span"
                    sx={{
                      color: 'var(--color-orange)',
                      fontWeight: 900,
                      fontSize: '1.2em',
                    }}
                  >
                    { char }
                  </Box>
                ) : char
              )) }
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={ handleSkip }
            endIcon={ <SkipNextRoundedIcon /> }
            sx={{
              flexShrink: 0,
              background: 'var(--gradient-power)',
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '0.8rem', md: '0.9rem' },
              borderRadius: 999,
              px: { xs: 2, md: 3 },
            }}
          >
            건너뛰기
          </Button>
        </Box>

        <Box
          component="iframe"
          src={ url }
          title={ `${title} 화면` }
          sx={{ flex: 1, width: '100%', border: 0, bgcolor: '#fff' }}
        />
      </Box>
    </Fade>
  );
}

export default ProjectIntroOverlay;
