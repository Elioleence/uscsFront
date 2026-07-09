<template>
  <div class="notice-list-page">
    <header-component />
    <sidebar-component />
    <swiper-component />

    <div class="content">
      <!-- <div class="page-title">
        <h1>公告列表</h1>
      </div> -->
      
      <div class="notice-grid">
        <div
          v-for="notice in notices"
          :key="notice.id"
          class="notice-card"
          @click="goDetail(notice.id)"
        >
          <img :src="formatImageUrl(notice.picture)" alt="公告封面" class="notice-cover">
          <div class="notice-info">
            <h3>{{ notice.title }}</h3>
            <p class="notice-introduction" v-if="notice.introduction">{{ notice.introduction }}</p>
            <div class="notice-footer">
              <span class="publisher">{{ notice.publisherName }}</span>
              <span class="notice-time">{{ formatTime(notice.createTime) }}</span>
            </div>
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
import SwiperComponent from '@/components/swiper/swiper.vue'
import { getNoticeList } from '@/api/index'
import { getUserNameById } from '@/utils/userUtils'
import { formatImageUrl } from '@/utils/imageUtils'

const notices = ref([])
const currentPage = ref(1)
const pageSize = ref(9)
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.page-title h1 {
  margin: 0 0 20px;
  font-size: 24px;
  color: #303133;
}

.notice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.notice-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.notice-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.notice-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.notice-info {
  padding: 15px;
}

.notice-info h3 {
  margin: 0 0 10px;
  font-size: 17px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-introduction {
  font-size: 14px;
  color: #909399;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
}

.notice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
}

.publisher {
  font-size: 13px;
  color: #409EFF;
}

.notice-time {
  font-size: 13px;
  color: #909399;
}

.pagination {
  text-align: center;
}
</style>