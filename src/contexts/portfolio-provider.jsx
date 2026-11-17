import { useCallback, useMemo, useState } from 'react';
import PortfolioContext from './portfolio-context.js';
import { initialAboutMeData } from '../data/about-me-data.js';
import { HOME_SKILL_COUNT } from '../data/skill-meta.js';
import { getTopSkills } from '../utils/skill-utils.js';
import { createSummary } from '../utils/text-utils.js';

/**
 * PortfolioProvider 컴포넌트
 *
 * About Me 데이터를 한 곳에서 관리하고, 홈 탭용 데이터를 자동으로 만들어 내려준다.
 * About 탭에서 수정한 내용이 홈 탭에 즉시 반영된다.
 *
 * Props:
 * @param {node} children - Provider 로 감쌀 하위 트리 [Required]
 *
 * Example usage:
 * <PortfolioProvider><App /></PortfolioProvider>
 */
function PortfolioProvider({ children }) {
  const [aboutMeData, setAboutMeData] = useState(initialAboutMeData);

  /** 콘텐츠 섹션 본문 수정 */
  const updateSectionContent = useCallback((sectionId, content) => {
    setAboutMeData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (
        section.id === sectionId ? { ...section, content } : section
      )),
    }));
  }, []);

  /** 스킬 일부 속성 수정 (level, isMainSkill 등) */
  const updateSkill = useCallback((skillId, changes) => {
    setAboutMeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) => (skill.id === skillId ? { ...skill, ...changes } : skill)),
    }));
  }, []);

  /** 새 스킬 추가 */
  const addSkill = useCallback((newSkill) => {
    setAboutMeData((prev) => ({
      ...prev,
      skills: [...prev.skills, { isMainSkill: true, ...newSkill, id: Date.now() }],
    }));
  }, []);

  /** 홈 탭용 데이터 (aboutMeData 가 바뀔 때만 다시 계산) */
  const homeData = useMemo(() => {
    const content = aboutMeData.sections
      .filter((section) => section.showInHome)
      .map((section) => ({
        id: section.id,
        title: section.title,
        summary: createSummary(section.content, 100),
      }));

    return {
      content,
      skills: getTopSkills(aboutMeData.skills, HOME_SKILL_COUNT),
      basicInfo: aboutMeData.basicInfo,
    };
  }, [aboutMeData]);

  const getHomeData = useCallback(() => homeData, [homeData]);

  /** value 객체를 메모해 불필요한 하위 리렌더링 방지 */
  const value = useMemo(() => ({
    aboutMeData,
    setAboutMeData,
    homeData,
    getHomeData,
    updateSectionContent,
    updateSkill,
    addSkill,
  }), [aboutMeData, homeData, getHomeData, updateSectionContent, updateSkill, addSkill]);

  return (
    <PortfolioContext.Provider value={ value }>
      { children }
    </PortfolioContext.Provider>
  );
}

export default PortfolioProvider;
