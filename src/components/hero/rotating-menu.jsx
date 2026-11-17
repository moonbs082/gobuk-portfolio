import { useRef } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useHeroLayout from '../../hooks/use-hero-layout.js';
import { bySize } from '../../utils/hero-responsive.js';

/** 휠 연속 입력을 막는 최소 간격(ms) */
const WHEEL_DELAY = 550;
/** 스와이프로 인정할 최소 이동 거리(px) */
const SWIPE_DISTANCE = 40;

/**
 * 구간별 궤도 · 항목 크기
 * - itemHeight × minScale ≥ 44px 이 되도록 맞춰, 뒤로 물러난 메뉴도 터치 영역이 44px 이상이다.
 */
const RING_CONFIG = {
  narrow: { radiusX: 84, radiusY: 24, itemHeight: 48, minScale: 0.92, fontSize: '0.95rem', px: 1.5 },
  mobile: { radiusX: 112, radiusY: 24, itemHeight: 48, minScale: 0.92, fontSize: '1.1rem', px: 2 },
  tablet: { radiusX: 220, radiusY: 30, itemHeight: 52, minScale: 0.86, fontSize: '1.35rem', px: 3 },
  desktop: { radiusX: 180, radiusY: 30, itemHeight: 52, minScale: 0.86, fontSize: '1.45rem', px: 3 },
};
/** 맨 앞(활성) 메뉴 확대 비율 */
const ACTIVE_SCALE = 1.08;

/**
 * RotatingMenu 컴포넌트
 *
 * 메뉴 항목들을 타원형 링 위에 배치하고 회전시키는 3D 메뉴.
 * 맨 앞에 온 메뉴만 크게·밝게 강조되고, 나머지는 뒤로 물러난다.
 * 조작: 좌우 버튼, ← → 키, 마우스 휠, 스와이프, 메뉴 클릭 / Enter 로 선택.
 * - 궤도 크기는 useHeroLayout 으로 구간(좁은 모바일 / 모바일 / 태블릿 / 데스크탑)별로 바뀐다.
 * - 좌우 버튼은 44px 터치 영역. 데스크탑은 링 양옆, 그 외에는 링 아래 한 줄.
 *
 * Props:
 * @param {object[]} items - 메뉴 항목 목록 ({ id, label }) [Required]
 * @param {number} step - 누적 회전 단계 (음수 가능) [Required]
 * @param {function} onStepChange - 회전 단계 변경 시 호출 (newStep) [Required]
 * @param {function} onSelect - 맨 앞 메뉴를 선택했을 때 호출 (item) [Required]
 *
 * Example usage:
 * <RotatingMenu items={ menuItems } step={ step } onStepChange={ setStep } onSelect={ handleSelect } />
 */
function RotatingMenu({ items, step, onStepChange, onSelect }) {
  const { device, isNarrow, isDesktop } = useHeroLayout();
  const lastWheelRef = useRef(0);
  const touchStartXRef = useRef(null);

  const config = RING_CONFIG[isNarrow ? 'narrow' : device];
  const { radiusX, radiusY, itemHeight, minScale } = config;
  const ringHeight = radiusY * 2 + Math.ceil(itemHeight * ACTIVE_SCALE);

  const count = items.length;
  const angleStep = (Math.PI * 2) / count;
  const activeIndex = ((step % count) + count) % count;

  /** 클릭한 메뉴가 앞으로 오도록 가장 짧은 방향으로 회전 */
  const handleItemClick = (index) => {
    if (index === activeIndex) {
      onSelect(items[index]);
      return;
    }
    let diff = index - activeIndex;
    if (diff > count / 2) diff -= count;
    if (diff < -count / 2) diff += count;
    onStepChange(step + diff);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onStepChange(step - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      onStepChange(step + 1);
    } else if (event.key === 'Enter' && event.target === event.currentTarget) {
      onSelect(items[activeIndex]);
    }
  };

  const handleWheel = (event) => {
    const now = Date.now();
    if (now - lastWheelRef.current < WHEEL_DELAY || Math.abs(event.deltaY) < 4) return;
    lastWheelRef.current = now;
    onStepChange(step + (event.deltaY > 0 ? 1 : -1));
  };

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartXRef.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(distance) > SWIPE_DISTANCE) {
      onStepChange(step + (distance < 0 ? 1 : -1));
    }
    touchStartXRef.current = null;
  };

  /** 좌우 이동 버튼 공통 스타일 (44px 터치 영역) */
  const arrowSx = {
    width: 44,
    height: 44,
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    bgcolor: 'rgba(14, 14, 16, 0.4)',
    transition: 'border-color 250ms, color 250ms',
    '@media (hover: hover)': {
      '&:hover': { borderColor: 'var(--color-orange)', color: 'var(--color-orange)' },
    },
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mx: 'auto' }}>
      <Box
        role="group"
        aria-roledescription="회전 메뉴"
        aria-label="섹션 메뉴: 좌우 방향키로 회전, Enter 로 이동"
        tabIndex={ 0 }
        onKeyDown={ handleKeyDown }
        onWheel={ handleWheel }
        onTouchStart={ handleTouchStart }
        onTouchEnd={ handleTouchEnd }
        sx={{
          position: 'relative',
          height: ringHeight,
          maxWidth: 720,
          mx: 'auto',
          borderRadius: 4,
          touchAction: 'pan-y',
        }}
      >
        {/* 타원형 궤도선 */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: radiusX * 2 + 40,
            height: radiusY * 2 + 20,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px dashed rgba(255, 107, 26, 0.35)',
          }}
        />

        {items.map((item, index) => {
          // 현재 단계 기준 각도: 0 이면 맨 앞(아래쪽), PI 면 맨 뒤(위쪽)
          const theta = (index - step) * angleStep;
          const depth = (Math.cos(theta) + 1) / 2;
          const x = Math.sin(theta) * radiusX;
          const y = Math.cos(theta) * radiusY;
          const isActive = index === activeIndex;
          const scale = (minScale + depth * (1 - minScale)) * (isActive ? ACTIVE_SCALE : 1);

          return (
            <Box
              key={ item.id }
              component="button"
              type="button"
              tabIndex={ -1 }
              aria-current={ isActive ? 'true' : undefined }
              onClick={ () => handleItemClick(index) }
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                zIndex: Math.round(depth * 10),
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 400ms, border-color 250ms',
                opacity: isActive ? 1 : 0.6 + depth * 0.3,
                display: 'inline-flex',
                alignItems: 'center',
                height: itemHeight,
                px: config.px,
                border: '1px solid',
                borderColor: isActive ? 'transparent' : 'var(--color-border)',
                borderRadius: 999,
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: config.fontSize,
                letterSpacing: 2,
                whiteSpace: 'nowrap',
                color: isActive ? '#0E0E10' : 'var(--color-text)',
                background: isActive ? 'var(--gradient-power)' : 'var(--color-surface)',
                boxShadow: isActive
                  ? '0 0 0 4px rgba(255, 107, 26, 0.2), 0 10px 40px rgba(255, 107, 26, 0.55)'
                  : 'none',
                '@media (hover: hover)': {
                  '&:hover': isActive ? {} : { borderColor: 'rgba(255, 107, 26, 0.6)' },
                },
              }}
            >
              { item.label }
            </Box>
          );
        })}
      </Box>

      {/* 좌우 버튼 + 현재 위치 (데스크탑: 링 양옆 / 그 외: 링 아래 한 줄) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          '& .MuiIconButton-root': { pointerEvents: 'auto' },
          ...bySize({
            mobile: { justifyContent: 'center', mt: 1 },
            tablet: { mt: 1.5 },
            desktop: {
              justifyContent: 'space-between',
              mt: 0,
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            },
          }),
        }}
      >
        <IconButton aria-label="이전 메뉴" onClick={ () => onStepChange(step - 1) } sx={ arrowSx }>
          <ChevronLeftIcon />
        </IconButton>
        <Box
          aria-live="polite"
          sx={{
            fontFamily: 'var(--font-display)',
            letterSpacing: 2,
            textAlign: 'center',
            minWidth: 72,
            /** 데스크탑에서는 화면에서 숨기되 스크린리더 안내는 유지 */
            ...(isDesktop
              ? { position: 'absolute', width: 1, minWidth: 0, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }
              : {}),
          }}
        >
          <Box component="span" sx={{ color: 'var(--color-orange)' }}>
            { String(activeIndex + 1).padStart(2, '0') }
          </Box>
          <Box component="span" sx={{ color: 'var(--color-text-muted)' }}>
            {' '}/ { String(count).padStart(2, '0') }
          </Box>
        </Box>
        <IconButton aria-label="다음 메뉴" onClick={ () => onStepChange(step + 1) } sx={ arrowSx }>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default RotatingMenu;
