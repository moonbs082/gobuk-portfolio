/**
 * 긴 본문을 한 줄 요약으로 만든다. 줄바꿈은 공백으로 합치고, 길면 '...' 을 붙인다.
 *
 * @param {string} content - 원본 본문
 * @param {number} maxLength - 최대 글자 수 (기본값: 100)
 * @returns {string} 요약 문자열
 */
export function createSummary(content, maxLength = 100) {
  const flatText = content.replace(/\s*\n+\s*/g, ' ').trim();
  if (flatText.length <= maxLength) return flatText;
  return `${flatText.substring(0, maxLength).trim()}...`;
}
