import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop 컴포넌트
 *
 * 페이지(라우트)가 바뀔 때 화면을 맨 위로 올려준다. 화면에는 아무것도 그리지 않는다.
 *
 * Example usage:
 * <ScrollToTop />
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
