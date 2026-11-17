import { skillCategories, skillIcons } from '../data/skill-meta.js';

/**
 * 숙련도 높은 순으로 정렬한 새 배열을 반환한다. (원본 state 를 변경하지 않음)
 *
 * @param {object[]} skills - 스킬 목록
 * @returns {object[]} 정렬된 스킬 목록
 */
export function sortSkillsByLevel(skills) {
  return [...skills].sort((a, b) => b.level - a.level);
}

/**
 * 숙련도 상위 N개 스킬을 반환한다.
 *
 * @param {object[]} skills - 스킬 목록
 * @param {number} count - 가져올 개수
 * @param {boolean} isMainOnly - isMainSkill 이 true 인 스킬만 대상으로 할지 여부 (기본값: true)
 * @returns {object[]} 상위 N개 스킬
 */
export function getTopSkills(skills, count, isMainOnly = true) {
  const targets = isMainOnly ? skills.filter((skill) => skill.isMainSkill) : skills;
  return sortSkillsByLevel(targets).slice(0, count);
}

/**
 * 카테고리 순서대로 스킬을 묶는다. 스킬이 없는 카테고리는 제외한다.
 *
 * @param {object[]} skills - 스킬 목록
 * @returns {object[]} [{ id, label, color, skills }]
 */
export function groupSkillsByCategory(skills) {
  return skillCategories
    .map((category) => ({
      ...category,
      skills: skills.filter((skill) => skill.category === category.id),
    }))
    .filter((group) => group.skills.length > 0);
}

/**
 * 카테고리 색상을 반환한다.
 *
 * @param {string} categoryId - 카테고리 id
 * @returns {string} 색상 코드
 */
export function getCategoryColor(categoryId) {
  return skillCategories.find((category) => category.id === categoryId)?.color ?? '#8A8A93';
}

/**
 * 아이콘 키에 해당하는 이모지를 반환한다.
 *
 * @param {string} iconKey - 아이콘 키 (예: 'atom')
 * @returns {string} 이모지
 */
export function getSkillIcon(iconKey) {
  return skillIcons[iconKey] ?? '⭐';
}
