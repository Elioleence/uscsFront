/**
 * 社团类型工具函数
 */

// 社团类型ID映射
const clubTypeIdMap = new Map([
  [1, '学术科技'],
  [2, '文化艺术'],
  [3, '体育健身'],
  [4, '志愿服务'],
  [5, '其他']
])

// 社团类型标签类型映射
const clubTypeTagTypeMap = new Map([
  [1, 'primary'],
  [2, 'success'],
  [3, 'warning'],
  [4, 'info'],
  [5, 'danger']
])

/**
 * 获取社团类型的显示名称
 * @param {number} typeId - 社团类型ID
 * @returns {string} 显示名称
 */
export const getClubTypeName = (typeId) => {
  return clubTypeIdMap.get(typeId) || '未知类型'
}

/**
 * 获取社团类型的样式类名
 * @param {number} typeId - 社团类型ID
 * @returns {string} 样式类名
 */
export const getClubTypeClass = (typeId) => {
  const typeName = clubTypeIdMap.get(typeId)
  return typeName ? typeName.toLowerCase().replace(/\s+/g, '-') : 'other'
}

/**
 * 获取社团类型的标签类型
 * @param {number} typeId - 社团类型ID
 * @returns {string} 标签类型
 */
export const getClubTypeTagType = (typeId) => {
  return clubTypeTagTypeMap.get(typeId) || 'info'
}

/**
 * 获取所有社团类型选项
 * @returns {Array} 社团类型选项数组
 */
export const getClubTypeOptions = () => {
  return Array.from(clubTypeIdMap.entries()).map(([value, label]) => ({
    label,
    value
  }))
}