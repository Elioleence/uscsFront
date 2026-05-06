<template>
  <div class="top-container">
    <div class="title-wrap">
      <router-link to="/" class="title-link">
        基于SpringBoot+Vue的高校社团活动平台的设计与实现
      </router-link>
    </div>

    <template v-if="userStore.isLoggedIn">
      <img
        class="avatar"
        :src="avatarUrl"
        alt="头像"
        @error="handleAvatarError"
      />
      <span class="username">{{ userStore.userInfo?.realName || userStore.userInfo?.username }}</span>
      <router-link to="/user/center" class="center">个人中心</router-link>
      <el-button class="btn" @click="handleLogout">退出</el-button>
    </template>

    <template v-else>
      <router-link to="/login" class="login-link">登录</router-link>
      <router-link to="/register" class="register-link">注册</router-link>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { formatAvatarUrl } from '@/utils/imageUtils'

const router = useRouter()
const userStore = useUserStore()

const avatarUrl = computed(() => {
  return formatAvatarUrl(userStore.userInfo?.avatar)
})

const handleAvatarError = (event) => {
  event.target.src = 'http://localhost:8080/api/upload/default.png'
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('退出成功')
  router.push('/login')
}
</script>

<style scoped>
.top-container {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 calc((100% - 1200px) / 2);
  align-items: center;
  color: #fff;
  text-align: right;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  top: 0;
  border-radius: 0;
  left: 0;
  background: linear-gradient(90deg, #10b981 0%, #10b981 70%, #3b82f6 100%);
  width: 100%;
  font-size: 14px;
  line-height: 36px;
  position: fixed;
  height: 36px;
  z-index: 1002;
}

.title-wrap {
  position: absolute;
  left: calc((100% - 1200px) / 2);
  height: 100%;
  display: flex;
  align-items: center;
}

.title-link {
  color: inherit;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}

.title-link:hover {
  color: #fff;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.username {
  color: #fff;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.center {
  color: inherit;
  text-decoration: none;
  padding: 0 12px;
  height: 24px;
  line-height: 24px;
  display: inline-block;
}

.center:hover {
  color: #fff;
}

.btn {
  border: none;
  padding: 0 10px;
  margin: 0;
  color: inherit;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  display: inline-block;
  font-size: 14px;
  line-height: 28px;
  height: 28px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.login-link,
.register-link {
  color: inherit;
  text-decoration: none;
  padding: 4px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.login-link:hover,
.register-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}
</style>