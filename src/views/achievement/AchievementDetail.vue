<template>
  <div class="achievement-detail-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="breadcrumb-nav">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/achievement/list' }">社团成果</el-breadcrumb-item>
          <el-breadcrumb-item>{{ achievement.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="detail-container" v-loading="loading">
        <div class="achievement-header">
          <h1>{{ achievement.title }}</h1>
          <div class="achievement-meta">
            <span class="club-name">
              <el-icon><Location /></el-icon>
              {{ achievement.clubName }}
            </span>
            <span class="achieve-time">
              <el-icon><Calendar /></el-icon>
              {{ formatTime(achievement.achieveTime) }}
            </span>
          </div>
        </div>

        <div class="achievement-image" v-if="achievement.certificate">
          <img :src="formatImageUrl(achievement.certificate)" alt="成果证书">
        </div>
        <p v-html="achievement.description"></p>
        <div class="achievement-footer">
          <el-button type="primary" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import { getAchievementDetail } from '@/api/club'
import { formatImageUrl } from '@/utils/imageUtils'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const achievement = ref({})
const loading = ref(false)

onMounted(() => {
  loadAchievementDetail()
})

const loadAchievementDetail = async () => {
  loading.value = true
  try {
    const res = await getAchievementDetail(route.params.id)
    achievement.value = res.data || {}
  } catch (error) {
    console.error('加载成果详情失败:', error)
    ElMessage.error('加载成果详情失败')
  } finally {
    loading.value = false
  }
}

const formatTime = (time) => {
  if (!time) return ''
  return time.split('T')[0]
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.achievement-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.breadcrumb-nav {
  margin-bottom: 20px;
}

.detail-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.achievement-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #ebeef5;
}

.achievement-header h1 {
  margin: 0 0 20px;
  font-size: 28px;
  color: #303133;
  line-height: 1.5;
}

.achievement-meta {
  display: flex;
  justify-content: center;
  gap: 40px;
  color: #606266;
  font-size: 15px;
}

.achievement-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.club-name {
  color: #409EFF;
}

.achievement-image {
  text-align: center;
  margin-bottom: 40px;
}

.achievement-image img {
  max-width: 100%;
  max-height: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.achievement-footer {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid #ebeef5;
}
</style>
