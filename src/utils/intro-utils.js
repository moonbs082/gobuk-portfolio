import { isMiniSnsAuthCallback } from '../mini-sns/utils/mini-sns-path.js';

/**
 * 사이트 접속 시 프로젝트 인트로(iframe 전체 화면, 신체 분석부터 시작)를 보여줄지 여부
 * - 첫 방문 / 재방문 상관없이 보여주고, 재방문자는 우측 상단 '건너뛰기'로 넘어간다.
 * - 인트로 iframe 안에서 다시 열린 경우: 숨김 (인트로가 끝없이 겹치는 것 방지)
 * - mini_sns 화면('#/mini-sns...')으로 바로 들어온 경우: 숨김
 * - SNS 로그인 / 이메일 인증 후 돌아온 경우: 숨김
 * @returns {boolean}
 */
export function shouldShowProjectIntro() {
  const isInIframe = window.self !== window.top;
  const isMiniSnsRoute = window.location.hash.startsWith('#/mini-sns');
  return !isInIframe && !isMiniSnsRoute && !isMiniSnsAuthCallback();
}
