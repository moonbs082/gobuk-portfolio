import Box from '@mui/material/Box';

/**
 * FadeIn 컴포넌트
 *
 * 자식 요소를 아래에서 위로 떠오르며 나타나게 한다. (페이지 진입 시 1회)
 * '움직임 줄이기' 설정 사용자는 전역 CSS 에 의해 즉시 표시된다.
 *
 * Props:
 * @param {node} children - 감쌀 내용 [Required]
 * @param {number} delay - 시작 지연(ms) [Optional, 기본값: 0]
 * @param {number} distance - 떠오르는 거리(px) [Optional, 기본값: 18]
 * @param {object} sx - 추가 스타일 [Optional, 기본값: {}]
 *
 * Example usage:
 * <FadeIn delay={ 200 }><Typography>안녕하세요</Typography></FadeIn>
 */
function FadeIn({ children, delay = 0, distance = 18, sx = {} }) {
  return (
    <Box
      sx={{
        animation: `fadeInUp${distance} 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
        [`@keyframes fadeInUp${distance}`]: {
          from: { opacity: 0, transform: `translateY(${distance}px)` },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        ...sx,
      }}
    >
      { children }
    </Box>
  );
}

export default FadeIn;
