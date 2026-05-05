<template>
  <div class="notice-detail-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="notice-detail">
        <div class="notice-header" v-if="notice.picture">
          <img :src="formatImageUrl(notice.picture)" alt="公告封面" class="notice-banner">
        </div>
        <div class="notice-title-section">
          <h1>{{ notice.title }}</h1>
          <div class="notice-meta">
            <span class="publisher">发布人：{{ notice.publisherName }}</span>
            <span class="time">发布时间：{{ formatTime(notice.createTime) }}</span>
          </div>
        </div>

        <div class="notice-body">
          <div class="notice-introduction" v-if="notice.introduction">
            <p>{{ notice.introduction }}</p>
          </div>
          <div v-html="notice.content"></div>
        </div>

        <div class="notice-footer">
          <el-button @click="goBack">返回列表</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import { getNoticeDetail } from '@/api/index'
import { getUserNameById } from '@/utils/userUtils'
import { formatImageUrl } from '@/utils/imageUtils'

const notice = ref({})

onMounted(async () => {
  await loadNoticeDetail()
})

const loadNoticeDetail = async () => {
  try {
    const id = window.location.pathname.split('/').pop()
    const res = await getNoticeDetail(id)
    notice.value = res.data || {}
  } catch (error) {
    console.error('加载公告详情失败:', error)
  }
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const goBack = () => {
  window.history.back()
}
</script>

<style scoped>
.notice-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.notice-detail {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.notice-header {
  background: white;
}

.notice-banner {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.notice-title-section {
  padding: 30px;
  border-bottom: 1px solid #ebeef5;
}

.notice-title-section h1 {
  margin: 0 0 15px;
  font-size: 24px;
  color: #303133;
  text-align: center;
}

.notice-meta {
  display: flex;
  justify-content: center;
  gap: 30px;
  font-size: 14px;
  color: #909399;
}

.publisher {
  color: #409EFF;
}

.notice-body {
  padding: 30px;
  font-size: 15px;
  line-height: 1.8;
  color: #606266;
}

.notice-introduction {
  padding: 15px 20px;
  background: #f5f7fa;
  border-radius: 6px;
  margin-bottom: 20px;
}

.notice-introduction p {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: #606266;
}

.notice-body div {
  word-wrap: break-word;
}

.notice-footer {
  padding: 20px 30px;
  border-top: 1px solid #ebeef5;
  text-align: center;
}
</style>