import useMediaQuery from '@mui/material/useMediaQuery';
import { HERO_QUERIES } from '../utils/hero-responsive.js';

/**
 * Hero 레이아웃 구간을 알려주는 훅 (MUI useMediaQuery 기반)
 * 레이아웃 구조나 JS 계산 값(궤도 반경 등)이 바뀌어야 할 때 사용한다.
 * 단순 스타일 변경은 bySize() + sx 를 사용한다.
 *
 * @returns {{ device: string, isMobile: boolean, isTablet: boolean, isDesktop: boolean, isNarrow: boolean }}
 *
 * Example usage:
 * const { isMobile, isDesktop } = useHeroLayout();
 */
function useHeroLayout() {
  /** noSsr: 첫 렌더부터 실제 화면 크기로 계산해 레이아웃이 깜빡이지 않게 함 */
  const isTabletUp = useMediaQuery(HERO_QUERIES.tabletUp, { noSsr: true });
  const isDesktop = useMediaQuery(HERO_QUERIES.desktopUp, { noSsr: true });
  const isNarrow = useMediaQuery(HERO_QUERIES.narrow, { noSsr: true });

  const isMobile = !isTabletUp;
  const isTablet = isTabletUp && !isDesktop;

  let device = 'mobile';
  if (isTablet) device = 'tablet';
  if (isDesktop) device = 'desktop';

  return { device, isMobile, isTablet, isDesktop, isNarrow };
}

export default useHeroLayout;
