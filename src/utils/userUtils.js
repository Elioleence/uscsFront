import { getUserList } from '@/api/user'

let userMap = new Map()
let isLoading = false
let loadPromise = null

/**
 * 加载用户映射表
 * @returns {Promise<void>}
 */
export const loadUserMap = async () => {
  if (isLoading) {
    return loadPromise
  }
  
  if (userMap.size > 0) {
    return
  }
  
  isLoading = true
  loadPromise = (async () => {
    try {
      const res = await getUserList({ pageNum: 1, pageSize: 1000 })
      
      res.data.records.forEach(user => {
        userMap.set(user.id, user.realName)
      })
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      isLoading = false
      loadPromise = null
    }
  })()
  
  return loadPromise
}

/**
 * 根据用户ID获取用户名
 * @param {number} userId - 用户ID
 * @returns {string} 用户名
 */
export const getUserNameById = (userId) => {
  return userMap.get(userId) || '未知用户'
}

/**
 * 清空用户映射表
 */
export const clearUserMap = () => {
  userMap.clear()
}