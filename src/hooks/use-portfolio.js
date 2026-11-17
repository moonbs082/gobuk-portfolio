import { useContext } from 'react';
import PortfolioContext from '../contexts/portfolio-context.js';

/**
 * 포트폴리오 전역 데이터를 꺼내 쓰는 훅
 *
 * @returns {object} { aboutMeData, setAboutMeData, homeData, getHomeData, updateSectionContent, updateSkill, addSkill }
 *
 * Example usage:
 * const { homeData } = usePortfolio();
 */
function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio 는 PortfolioProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}

export default usePortfolio;
