<template>
  <div class="forum-create-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="page-title">
        <h1>发布帖子</h1>
      </div>

      <div class="form-card">
        <el-form :model="form" label-width="80px">
          <el-form-item label="标题">
            <el-input
              v-model="form.title"
              placeholder="请输入帖子标题"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="封面">
            <UploadImg v-model="form.img" />
            <div class="tip">可选，上传一张帖子封面图</div>
          </el-form-item>

          <el-form-item label="内容">
            <QuillEditor
              v-model="form.content"
              placeholder="请输入帖子内容..."
              height="400px"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit" :loading="loading">
              发布帖子
            </el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import QuillEditor from '@/components/common/QuillEditor.vue'
import UploadImg from '@/components/common/UploadImg.vue'
import { createPost } from '@/api/forumPost'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = ref({
  title: '',
  content: '',
  img: ''
})

const handleSubmit = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (!form.value.title.trim()) {
    ElMessage.warning('请输入帖子标题')
    return
  }

  if (!form.value.content.trim()) {
    ElMessage.warning('请输入帖子内容')
    return
  }

  loading.value = true
  try {
    await createPost({
      title: form.value.title,
      content: form.value.content,
      img: form.value.img
    })
    ElMessage.success('发布成功')
    router.push('/forum/list')
  } catch (error) {
    ElMessage.error(error.message || '发布失败')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.forum-create-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.page-title h1 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #303133;
}

.form-card {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-card :deep(.el-textarea__inner) {
  min-height: 200px;
}

.tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>
