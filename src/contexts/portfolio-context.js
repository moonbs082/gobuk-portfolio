import { createContext } from 'react';

/**
 * 포트폴리오 전역 데이터 Context
 * - 값은 PortfolioProvider 가 채우고, usePortfolio 훅으로 꺼내 쓴다.
 */
const PortfolioContext = createContext(null);

export default PortfolioContext;
