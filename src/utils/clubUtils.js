import { getTypeList } from '@/api/clubType'

let clubTypeCache = null
let clubTypeTagTypeCache = null

const defaultClubTypes = [
  { id: 1, typeName: '学术科技', tagType: 'primary' },
  { id: 2, typeName: '文化艺术', tagType: 'success' },
  { id: 3, typeName: '体育健身', tagType: 'warning' },
  { id: 4, typeName: '志愿服务', tagType: 'info' },
  { id: 5, typeName: '其他', tagType: 'danger' }
]

// 获取社团类型数据
export const loadClubTypes = async () => {
  try {
    const res = await getTypeList()
    if (res.code === 200 && res.data && res.data.length > 0) {
      clubTypeCache = new Map(res.data.map(item => [item.id, item.typeName]))
      clubTypeTagTypeCache = new Map(res.data.map(item => [item.id, getDefaultTagType(item.id)]))
    } else {
      initDefaultCache()
    }
  } catch (error) {
    initDefaultCache()
  }
}

const initDefaultCache = () => {
  clubTypeCache = new Map(defaultClubTypes.map(item => [item.id, item.typeName]))
  clubTypeTagTypeCache = new Map(defaultClubTypes.map(item => [item.id, item.tagType]))
}

const getDefaultTagType = (typeId) => {
  const item = defaultClubTypes.find(t => t.id === typeId)
  return item ? item.tagType : 'info'
}

// 映射社团类型ID为名称
export const getClubTypeName = (typeId) => {
  if (!clubTypeCache) {
    const item = defaultClubTypes.find(t => t.id === typeId)
    return item ? item.typeName : '未知类型'
  }
  return clubTypeCache.get(typeId) || '未知类型'
}

export const getClubTypeClass = (typeId) => {
  const typeName = getClubTypeName(typeId)
  return typeName ? typeName.toLowerCase().replace(/\s+/g, '-') : 'other'
}

export const getClubTypeTagType = (typeId) => {
  if (!clubTypeTagTypeCache) {
    return getDefaultTagType(typeId)
  }
  return clubTypeTagTypeCache.get(typeId) || 'info'
}

export const getClubTypeOptions = () => {
  if (!clubTypeCache) {
    return defaultClubTypes.map(item => ({
      label: item.typeName,
      value: item.id
    }))
  }
  return Array.from(clubTypeCache.entries()).map(([value, label]) => ({
    label,
    value
  }))
}