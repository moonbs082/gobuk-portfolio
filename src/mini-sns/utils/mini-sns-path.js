/** 포트폴리오 사이트 안에서 mini_sns(AI 스마트 운동)가 위치한 경로 */
export const MINI_SNS_BASE = '/mini-sns';

/**
 * mini_sns 내부 경로('/posts')를 사이트 전체 경로('/mini-sns/posts')로 변환
 * @param {string} path - mini_sns 내부 경로
 * @returns {string}
 */
export function toMiniSnsPath(path) {
  return path === '/' ? MINI_SNS_BASE : `${MINI_SNS_BASE}${path}`;
}

/**
 * 사이트 전체 경로('/mini-sns/posts')를 mini_sns 내부 경로('/posts')로 변환
 * @param {string} pathname - 사이트 전체 경로
 * @returns {string}
 */
export function fromMiniSnsPath(pathname) {
  if (!pathname.startsWith(MINI_SNS_BASE)) {
    return pathname;
  }
  return pathname.slice(MINI_SNS_BASE.length) || '/';
}

/**
 * Supabase SNS 로그인 / 이메일 인증 후 돌아온 주소(?code=)인지 여부
 * @returns {boolean}
 */
export function isMiniSnsAuthCallback() {
  return new URLSearchParams(window.location.search).has('code');
}
