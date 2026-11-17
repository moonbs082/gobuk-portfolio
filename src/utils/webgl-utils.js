/**
 * 브라우저가 WebGL 을 지원하는지 확인한다.
 * (three.js 를 import 하지 않아야 메인 번들이 가볍게 유지된다)
 *
 * @returns {boolean} 지원 여부
 */
export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')));
  } catch {
    return false;
  }
}
