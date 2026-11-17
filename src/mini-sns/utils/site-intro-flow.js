/**
 * 사이트 접속 흐름(인트로 안에서 신체 분석 → 회원가입 → 포트폴리오) 진행 여부 저장
 * - sessionStorage 를 사용해 SNS 로그인처럼 페이지를 벗어났다 돌아와도 같은 탭이면 흐름이 이어진다.
 * - 인트로(iframe)와 포트폴리오는 같은 주소라 같은 탭의 sessionStorage 를 함께 쓴다.
 */
const STORAGE_KEY = 'gobuk_site_intro_flow';

/** 인트로 iframe → 포트폴리오(부모 창)로 보내는 '흐름 완료' 신호 */
export const SITE_INTRO_COMPLETE_MESSAGE = 'gobuk:site-intro-complete';

/** 인트로(iframe) 안에서 실행 중인지 여부 */
export const isInIntroFrame = window.self !== window.top;

/** 첫 접속 흐름 시작 */
export function startSiteIntroFlow() {
  try {
    sessionStorage.setItem(STORAGE_KEY, 'active');
  } catch {
    /** 저장소를 쓸 수 없는 환경(시크릿 모드 등)에서는 무시 */
  }
}

/**
 * 첫 접속 흐름 진행 중인지 여부
 * @returns {boolean}
 */
export function isSiteIntroFlowActive() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'active';
  } catch {
    return false;
  }
}

/** 첫 접속 흐름 종료 */
export function finishSiteIntroFlow() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /** 저장소를 쓸 수 없는 환경(시크릿 모드 등)에서는 무시 */
  }
}

/**
 * 인트로 iframe 안에서 흐름을 마쳤을 때 포트폴리오(부모 창)에 알려 인트로를 닫게 한다.
 * @returns {boolean} 알림을 보냈으면 true (iframe 밖이면 false)
 */
export function notifySiteIntroComplete() {
  if (!isInIntroFrame) return false;
  window.parent.postMessage(SITE_INTRO_COMPLETE_MESSAGE, window.location.origin);
  return true;
}
