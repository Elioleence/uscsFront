<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>基于SpringBoot+Vue的高校社团活动平台的设计与实现前台登录</h1>
      </div>

      <el-form :model="loginForm" :rules="rules" ref="formRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login-btn" size="large">登录</el-button>
        </el-form-item>

        <div class="login-footer">
          <span>还没有账号？</span>
          <a href="/register">立即注册</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loginForm = ref({
  username: '',
  password: ''
})

onMounted(() => {
  setTimeout(() => {
    ElMessage({
      message: '<p>测试用户名：stu01</p><p>密码：111</p>',
      type: 'info',
      duration: 15000,
      dangerouslyUseHTMLString: true,
      customClass: 'test-account-message'
    })
  }, 500)
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!formRef.value) return
  // 校验表单
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.login(loginForm.value)
        ElMessage.success('登录成功')
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      }
    }
  })
}
</script>

<style scoped>
.login-page {
  width: 100%;
  height: 100vh;
  background: url('/img/loginBackImg.png') center/cover no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  width: 400px;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #303133;
  font-size: 20px;
  line-height: 1.4;
}

.login-form {
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  color: #909399;
  font-size: 14px;
}

.login-footer a {
  color: #409EFF;
  margin-left: 5px;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>