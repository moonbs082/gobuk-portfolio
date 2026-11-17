import { useEffect, useRef, useState } from 'react';

/**
 * 요소가 화면에 처음 들어왔는지 감지하는 훅 (한 번 true 가 되면 유지)
 *
 * @param {number} threshold - 몇 % 보였을 때 true 로 볼지 (0~1) [Optional, 기본값: 0.3]
 * @returns {[object, boolean]} [ref, isInView]
 *
 * Example usage:
 * const [ref, isInView] = useInView();
 */
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isInView) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, isInView]);

  return [ref, isInView];
}

export default useInView;
