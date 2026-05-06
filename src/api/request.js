import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 30000 // 增加到30秒
})

// 错误重试
const retryConfig = {
  retries: 2, // 最多重试2次
  retryDelay: 1000 // 每次重试间隔1秒
}

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code && res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  async error => {
    const config = error.config
    if (!config) {
      ElMessage.error('网络错误')
      return Promise.reject(error)
    }
    
    config.__retryCount = config.__retryCount || 0
    
    // 如果是502/500/网络超时，且没超过重试次数，就重试
    if (config.__retryCount < retryConfig.retries) {
      config.__retryCount += 1
      console.log(`请求失败，第${config.__retryCount}次重试...`)
      
      await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay))
      return request(config)
    }
    
    // 超过重试次数，处理错误
    if (error.response) {
      if (error.response.status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/login'
      } else if (error.response.status === 502) {
        ElMessage.error('服务器繁忙，请稍后重试')
      } else {
        ElMessage.error(error.response.data?.message || '请求失败')
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请检查网络')
    } else {
      ElMessage.error('网络错误，请检查后端服务是否正常运行')
    }
    
    return Promise.reject(error)
  }
)

export default request
