<template>
  <div class="notice-list-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="page-title">
        <h1>公告列表</h1>
      </div>
      
      <div class="notice-list">
        <div
          v-for="notice in notices"
          :key="notice.id"
          class="notice-item"
          @click="goDetail(notice.id)"
        >
          <div class="notice-header">
            <h3>{{ notice.title }}</h3>
            <span class="notice-time">{{ formatTime(notice.createTime) }}</span>
          </div>
          <p class="notice-content">{{ notice.content }}</p>
          <div class="notice-footer">
            <span class="publisher">{{ getUserNameById(notice.publisher) }}</span>
          </div>
        </div>
      </div>
      
      <el-pagination
        v-if="total > 0"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
        layout="prev, pager, next, jumper"
        class="pagination"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import { getNoticeList } from '@/api/index'
import { getUserNameById } from '@/utils/userUtils'

const notices = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

onMounted(() => {
  loadNoticeList()
})

const loadNoticeList = async () => {
  try {
    const res = await getNoticeList({
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })
    notices.value = res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error('加载公告列表失败:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadNoticeList()
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

const goDetail = (id) => {
  window.location.href = `/notice/detail/${id}`
}
</script>

<style scoped>
.notice-list-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.page-title h1 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #303133;
}

.notice-list {
  margin-bottom: 30px;
}

.notice-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.notice-item:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.notice-header h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.notice-time {
  font-size: 14px;
  color: #909399;
}

.notice-content {
  font-size: 15px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 15px;
}

.notice-footer {
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

.publisher {
  font-size: 14px;
  color: #409EFF;
}

.pagination {
  text-align: center;
}
</style>