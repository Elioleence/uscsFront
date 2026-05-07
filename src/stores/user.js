import { defineStore } from 'pinia'
import { login as loginApi, getUserInfo } from '@/api/login'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
    roleIds: JSON.parse(localStorage.getItem('roleIds') || '[]')
  }),

  getters: {
    isLoggedIn: state => !!state.token,
    isNormalUser: state => state.roleIds.includes(3)
  },

  actions: {
    async login(loginForm) {
      const res = await loginApi(loginForm)
      this.token = res.data.token
      this.userInfo = res.data.userInfo
      this.roleIds = res.data.roleIds || []
      
      localStorage.setItem('token', this.token)
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      localStorage.setItem('roleIds', JSON.stringify(this.roleIds))
      return res
    },

    // 拉取最新用户信息
    async fetchUserInfo() {
      if (!this.userInfo?.id) return
      const res = await getUserInfo(this.userInfo.id)
      this.userInfo = res.data
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },

    logout() {
      this.token = ''
      this.userInfo = null
      this.roleIds = []
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('roleIds')
    }
  }
})