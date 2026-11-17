import { useLocation } from 'react-router-dom';
import { fromMiniSnsPath } from '../utils/mini-sns-path.js';

/**
 * 현재 화면의 mini_sns 내부 경로('/mini-sns/posts' → '/posts')
 * @returns {string}
 */
export function useMiniSnsPathname() {
  const { pathname } = useLocation();
  return fromMiniSnsPath(pathname);
}
