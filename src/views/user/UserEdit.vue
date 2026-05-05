<template>
  <div class="user-edit-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="page-title">
        <h1>编辑个人资料</h1>
        <el-button @click="goBack">返回</el-button>
      </div>

      <div class="form-card">
        <el-form :model="form" label-width="100px" ref="formRef">
          <el-form-item label="头像">
            <UploadImg v-model="form.avatar" />
          </el-form-item>

          <el-form-item label="姓名">
            <el-input v-model="form.realName" placeholder="请输入姓名" />
          </el-form-item>

          <el-form-item label="性别">
            <el-radio-group v-model="form.gender">
              <el-radio :label="0">未知</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="出生日期">
            <el-date-picker
              v-model="form.birthday"
              type="date"
              placeholder="选择出生日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>

          <el-form-item label="学院">
            <el-input v-model="form.college" placeholder="请输入学院" />
          </el-form-item>

          <el-form-item label="专业">
            <el-input v-model="form.major" placeholder="请输入专业" />
          </el-form-item>

          <el-form-item label="班级">
            <el-input v-model="form.className" placeholder="请输入班级" />
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item label="手机">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :loading="loading">保存修改</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import UploadImg from '@/components/common/UploadImg.vue'
import { useUserStore } from '@/stores/user'
import { updateUser } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const form = ref({
  id: null,
  realName: '',
  avatar: '',
  gender: 0,
  birthday: null,
  college: '',
  major: '',
  className: '',
  email: '',
  phone: ''
})

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  // 从 store 中读取当前用户信息
  const userInfo = userStore.userInfo || {}
  form.value.id = userInfo.id
  form.value.realName = userInfo.realName || ''
  form.value.avatar = userInfo.avatar || ''
  form.value.gender = userInfo.gender || 0
  form.value.birthday = userInfo.birthday || null
  form.value.college = userInfo.college || ''
  form.value.major = userInfo.major || ''
  form.value.className = userInfo.className || ''
  form.value.email = userInfo.email || ''
  form.value.phone = userInfo.phone || ''
})

const handleSubmit = async () => {
  if (!form.value.realName.trim()) {
    ElMessage.warning('姓名不能为空')
    return
  }
  
  loading.value = true
  try {
    await updateUser(form.value)
    ElMessage.success('保存成功')
    // 更新 store 中的用户信息
    await userStore.fetchUserInfo()
    router.back()
  } catch (error) {
    ElMessage.error(error.message || '保存失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.user-edit-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 36px;
}

.page-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.form-card {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
</style>
