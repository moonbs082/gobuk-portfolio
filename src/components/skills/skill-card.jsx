import { useState } from 'react';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FolderIcon from '@mui/icons-material/Folder';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckIcon from '@mui/icons-material/Check';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import CircularGauge from './circular-gauge.jsx';
import LevelBar from './level-bar.jsx';

/** 카드 앞/뒷면 공통 스타일 */
const faceSx = {
  position: 'absolute',
  inset: 0,
  p: 3,
  borderRadius: 3,
  border: '1px solid var(--color-border)',
  bgcolor: 'var(--color-surface)',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

/**
 * SkillCard 컴포넌트
 *
 * 앞면: 기술 이름 + 원형 게이지(레벨) / 뒷면: 세그먼트 바 + 경험 기간·프로젝트 수·인증·할 수 있는 것.
 * 클릭(또는 Enter/Space)하면 카드가 3D로 뒤집힌다.
 *
 * Props:
 * @param {object} skill - 기술 정보 ({ id, name, level, months, projects, certificate, canDo }) [Required]
 * @param {string} levelName - 레벨 이름 (예: '실무 기초') [Required]
 * @param {number} maxLevel - 최대 레벨 [Required]
 * @param {boolean} isAnimated - 게이지 애니메이션 시작 여부 [Optional, 기본값: true]
 *
 * Example usage:
 * <SkillCard skill={ skill } levelName="기초" maxLevel={ 5 } isAnimated={ isInView } />
 */
function SkillCard({ skill, levelName, maxLevel, isAnimated = true }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const stats = [
    { label: '경험 기간', value: `${skill.months}개월`, icon: <CalendarMonthIcon fontSize="small" /> },
    { label: '프로젝트', value: `${skill.projects}개`, icon: <FolderIcon fontSize="small" /> },
    { label: '인증', value: skill.certificate || '준비 중', icon: <VerifiedIcon fontSize="small" /> },
  ];

  /** 카드 뒤집기 */
  const handleFlip = () => setIsFlipped((prev) => !prev);

  /** 키보드 Enter / Space 로도 뒤집기 */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleFlip();
    }
  };

  return (
    <Box
      role="button"
      tabIndex={ 0 }
      onClick={ handleFlip }
      onKeyDown={ handleKeyDown }
      aria-pressed={ isFlipped }
      aria-label={ `${skill.name} 레벨 ${skill.level}, ${levelName}. ${isFlipped ? '앞면 보기' : '자세히 보기'}` }
      sx={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: 320,
        textAlign: 'left',
        cursor: 'pointer',
        perspective: '1000px',
        borderRadius: 3,
        '&:hover .skill-card__inner': { boxShadow: '0 14px 40px rgba(255, 107, 26, 0.18)' },
      }}
    >
      <Box
        className="skill-card__inner"
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: 3,
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms',
        }}
      >
        {/* 앞면 */}
        <Box sx={{ ...faceSx, alignItems: 'center', justifyContent: 'space-between', textAlign: 'center' }}>
          <Box sx={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', letterSpacing: 1.5, color: 'var(--color-text)' }}>
            { skill.name }
          </Box>
          <CircularGauge
            level={ skill.level }
            maxLevel={ maxLevel }
            gradientId={ `gauge-${skill.id}` }
            isAnimated={ isAnimated }
          />
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--color-orange)',
              bgcolor: 'var(--color-orange-soft)',
            }}
          >
            { levelName }
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <TouchAppIcon sx={{ fontSize: 16 }} />
            눌러서 자세히 보기
          </Box>
        </Box>

        {/* 뒷면 */}
        <Box sx={{ ...faceSx, transform: 'rotateY(180deg)', gap: 2, borderColor: 'rgba(255, 107, 26, 0.5)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Box sx={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', letterSpacing: 1, color: 'var(--color-text)' }}>
              { skill.name }
            </Box>
            <Box sx={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-orange)' }}>
              Lv.{ skill.level } { levelName }
            </Box>
          </Box>
          <LevelBar level={ skill.level } maxLevel={ maxLevel } />

          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {stats.map((stat) => (
              <Box
                component="li"
                key={ stat.label }
                sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}
              >
                <Box component="span" sx={{ display: 'inline-flex', color: 'var(--color-orange)' }}>{ stat.icon }</Box>
                { stat.label }
                <Box component="span" sx={{ ml: 'auto', fontWeight: 700, color: 'var(--color-text)' }}>{ stat.value }</Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ borderTop: '1px solid var(--color-border)', pt: 1.5 }}>
            <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {skill.canDo.map((item) => (
                <Box
                  component="li"
                  key={ item }
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: '0.88rem', color: 'var(--color-text)' }}
                >
                  <CheckIcon sx={{ fontSize: 16, color: 'var(--color-orange)' }} />
                  { item }
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default SkillCard;
