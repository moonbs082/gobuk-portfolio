import { useEffect, useState } from 'react';

/** '움직임 줄이기' 설정 여부 */
const getIsReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 여러 문장을 한 글자씩 타이핑 → 잠시 멈춤 → 지우기를 반복하는 훅
 * '움직임 줄이기' 설정 사용자에게는 첫 문장을 그대로 보여준다.
 *
 * @param {string[]} phrases - 순서대로 타이핑할 문장 목록 (컴포넌트 밖 상수로 넘길 것)
 * @param {object} options - { typeSpeed, deleteSpeed, pause } (ms)
 * @returns {string} 현재 화면에 보일 문자열
 *
 * Example usage:
 * const text = useTypewriter(['안녕하세요', '반갑습니다']);
 */
function useTypewriter(phrases, { typeSpeed = 70, deleteSpeed = 35, pause = 1800 } = {}) {
  const [isReducedMotion] = useState(getIsReducedMotion);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isReducedMotion || phrases.length === 0) return undefined;

    const current = phrases[phraseIndex];
    const isTyped = !isDeleting && text === current;
    const isCleared = isDeleting && text === '';

    let delay = isDeleting ? deleteSpeed : typeSpeed;
    if (isTyped) delay = pause;
    if (isCleared) delay = 350;

    const timer = setTimeout(() => {
      if (isTyped) {
        setIsDeleting(true);
      } else if (isCleared) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setText(current.slice(0, text.length + (isDeleting ? -1 : 1)));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex, phrases, typeSpeed, deleteSpeed, pause, isReducedMotion]);

  return isReducedMotion ? phrases[0] ?? '' : text;
}

export default useTypewriter;
