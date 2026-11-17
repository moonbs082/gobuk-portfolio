/**
 * Hero 전용 반응형 브레이크포인트
 * - 모바일: 767px 이하 (세로형 1단)
 * - 태블릿: 768px ~ 1199px (가운데 정렬 1단, 넉넉한 간격)
 * - 데스크탑: 1200px 이상 (좌우 2단, 여유로운 레이아웃)
 *
 * MUI 기본 브레이크포인트(sm 600 / md 900)와 달라 앱 전체 테마를 바꾸지 않고 Hero 에서만 사용한다.
 */
export const HERO_BREAKPOINTS = {
  tablet: 768,
  desktop: 1200,
};

/** useMediaQuery 용 쿼리 */
export const HERO_QUERIES = {
  narrow: '(max-width: 374.95px)',
  tabletUp: `(min-width: ${HERO_BREAKPOINTS.tablet}px)`,
  desktopUp: `(min-width: ${HERO_BREAKPOINTS.desktop}px)`,
};

/**
 * 모바일 우선 sx 조각을 만든다. (모바일 = 기본값, 태블릿 이상 / 데스크탑 이상에서 덮어씀)
 *
 * @param {object} styles - { mobile, tablet, desktop } 각 구간 sx 객체
 * @returns {object} sx 에 펼쳐 넣을 객체
 *
 * Example usage:
 * sx={{ ...bySize({ mobile: { fontSize: '1rem' }, desktop: { fontSize: '1.2rem' } }) }}
 */
export function bySize({ mobile = {}, tablet = {}, desktop = {} }) {
  return {
    ...mobile,
    [`@media ${HERO_QUERIES.tabletUp}`]: tablet,
    [`@media ${HERO_QUERIES.desktopUp}`]: desktop,
  };
}
