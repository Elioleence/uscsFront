<template>
  <div class="activity-detail-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="activity-header">
        <img :src="formatImageUrl(activity.cover)" alt="活动封面" class="activity-banner">
        <div class="activity-title-section">
          <h1>{{ activity.title }}</h1>
          <div class="activity-meta">
            <span class="meta-item">{{ activity.clubName }}</span>
            <span class="meta-item">{{ activity.time }}</span>
            <span class="meta-item">{{ activity.location }}</span>
          </div>
        </div>
      </div>
      
      <div class="activity-body">
        <div class="activity-info">
          <div class="info-item">
            <span class="label">活动类型</span>
            <span class="value">{{ getActivityTypeName(activity.typeId) }}</span>
          </div>
          <div class="info-item">
            <span class="label">报名人数</span>
            <span class="value">{{ activity.participants }} 人</span>
          </div>
          <div class="info-item">
            <span class="label">报名截止</span>
            <span class="value">{{ activity.signupEndTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">活动状态</span>
            <span :class="['value', activity.status === 1 ? 'active' : 'inactive']">
              {{ activity.status === 1 ? '进行中' : '已结束' }}
            </span>
          </div>
        </div>
        
        <div class="activity-content">
          <h2>活动详情</h2>
          <div v-html="activity.content"></div>
        </div>
        
        <div class="action-bar">
          <el-button 
            v-if="!hasEnrolled && activity.status === 1" 
            type="primary" 
            @click="handleEnroll"
            class="enroll-btn"
          >
            立即报名
          </el-button>
          <el-button 
            v-else-if="hasEnrolled" 
            type="success" 
            disabled
          >
            已报名
          </el-button>
          <el-button 
            v-else 
            type="default" 
            disabled
          >
            活动已结束
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import { getActivityDetail, enrollActivity } from '@/api/index'
import { useUserStore } from '@/stores/user'
import { formatImageUrl } from '@/utils/imageUtils'

const userStore = useUserStore()
const activity = ref({})
const hasEnrolled = ref(false)

onMounted(async () => {
  const id = window.location.pathname.split('/').pop()
  await loadActivity(id)
})

const loadActivity = async (id) => {
  try {
    const res = await getActivityDetail(id)
    activity.value = res.data || {}
    checkEnrollStatus()
  } catch (error) {
    console.error('加载活动详情失败:', error)
  }
}

const checkEnrollStatus = () => {
  hasEnrolled.value = false
}

const handleEnroll = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    window.location.href = '/login'
    return
  }
  
  try {
    await enrollActivity({ activityId: activity.value.id })
    ElMessage.success('报名成功')
    hasEnrolled.value = true
  } catch (error) {
    ElMessage.error(error.message || '报名失败')
  }
}

const getActivityTypeName = (typeId) => {
  const typeMap = {
    1: '学术讲座',
    2: '文艺演出',
    3: '体育活动',
    4: '社会实践',
    5: '其他'
  }
  return typeMap[typeId] || '未知类型'
}
</script>

<style scoped>
.activity-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.activity-header {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.activity-banner {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.activity-title-section {
  padding: 20px;
}

.activity-title-section h1 {
  margin: 0 0 15px;
  font-size: 24px;
  color: #303133;
}

.activity-meta {
  display: flex;
  gap: 20px;
}

.meta-item {
  font-size: 14px;
  color: #606266;
}

.activity-body {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.activity-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item .label {
  font-size: 13px;
  color: #909399;
}

.info-item .value {
  font-size: 15px;
  color: #303133;
}

.info-item .value.active {
  color: #67c23a;
}

.info-item .value.inactive {
  color: #f56c6c;
}

.activity-content {
  margin-bottom: 30px;
}

.activity-content h2 {
  margin: 0 0 20px;
  font-size: 18px;
  color: #303133;
}

.activity-content div {
  font-size: 15px;
  line-height: 1.8;
  color: #606266;
}

.action-bar {
  text-align: center;
}

.enroll-btn {
  width: 200px;
  height: 44px;
  font-size: 16px;
}
</style>