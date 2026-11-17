import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toMiniSnsPath } from '../utils/mini-sns-path.js';

/**
 * mini_sns 내부 경로('/posts')로 이동하는 navigate 훅
 * - 문자열 경로는 '/mini-sns' 를 앞에 붙여 이동하고, 숫자(-1 등)는 그대로 사용한다.
 * @returns {function} navigate(to, options)
 */
export function useMiniSnsNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (to, options) => (typeof to === 'string' ? navigate(toMiniSnsPath(to), options) : navigate(to, options)),
    [navigate],
  );
}
