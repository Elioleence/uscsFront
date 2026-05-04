<template>
  <div class="home-page">
    <header-component />
    <sidebar-component />
    <swiper-component />

    <div class="content">
      <div class="section">
        <h2>推荐社团</h2>
        <div class="club-list">
          <div v-for="club in clubs" :key="club.id" class="club-card" @click="goClub(club.id)">
            <img :src="formatImageUrl(club.cover)" alt="社团logo" class="club-logo">
            <div class="club-info">
              <h3>{{ club.clubName }}</h3>
              <p class="club-type">{{ getClubTypeName(club.typeId) }}</p>
              <!-- <p class="club-member">成员数：{{ club.memberCount }}</p> -->
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <h2>热门活动</h2>
        <div class="activity-list">
          <div v-for="activity in activities" :key="activity.id" class="activity-card" @click="goActivity(activity.id)">
            <img :src="formatImageUrl(activity.cover)" alt="活动封面" class="activity-cover">
            <div class="activity-info">
              <h3>{{ activity.title }}</h3>
              <p class="activity-time">{{ activity.time }}</p>
              <p class="activity-club">{{ activity.clubName }}</p>
            </div>
          </div>
        </div>
      </div>



      <div class="section">
        <h2>最新公告</h2>
        <div class="notice-list">
          <div v-for="notice in notices" :key="notice.id" class="notice-item" @click="goNotice()">
            <span class="notice-title">{{ notice.title }}</span>
            <span class="notice-time">{{ formatTime(notice.createTime) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import SwiperComponent from '@/components/swiper/swiper.vue'
import { getActivityList, getClubList, getNoticeList } from '@/api/index'
import { getClubTypeName } from '@/utils/clubUtils'
import { formatImageUrl } from '@/utils/imageUtils'

const activities = ref([])
const clubs = ref([])
const notices = ref([])

onMounted(async () => {
  try {
    const activityRes = await getActivityList({ pageNum: 1, pageSize: 6 })
    activities.value = activityRes.data.records || []

    const clubRes = await getClubList({ pageNum: 1, pageSize: 6 })
    clubs.value = clubRes.data.records || []

    const noticeRes = await getNoticeList({ pageNum: 1, pageSize: 5 })
    notices.value = noticeRes.data.records || []
  } catch (error) {
    console.error('加载数据失败:', error)
  }
})

const goActivity = (id) => {
  window.location.href = `/activity/detail/${id}`
}

const goClub = (id) => {
  window.location.href = `/club/detail/${id}`
}

const goNotice = () => {
  window.location.href = '/notice/list'
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 36px;
}

.section {
  background: white;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
  color: #303133;
  font-size: 20px;
}

.activity-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.activity-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.activity-cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.activity-info {
  padding: 15px;
}

.activity-info h3 {
  margin: 0 0 10px;
  font-size: 16px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-time {
  font-size: 13px;
  color: #409EFF;
  margin-bottom: 5px;
}

.activity-club {
  font-size: 13px;
  color: #909399;
}

.club-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.club-card {
  cursor: pointer;
  transition: transform 0.3s;
  text-align: center;
}

.club-card:hover {
  transform: translateY(-5px);
}

.club-logo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
  border: 3px solid #f0f0f0;
}

.club-info h3 {
  margin: 0 0 5px;
  font-size: 16px;
  color: #303133;
}

.club-type {
  font-size: 13px;
  color: #409EFF;
  margin-bottom: 5px;
}

.club-member {
  font-size: 12px;
  color: #909399;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notice-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed #ebeef5;
  cursor: pointer;
  transition: color 0.3s;
}

.notice-item:hover {
  color: #409EFF;
}

.notice-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.notice-time {
  margin-left: 20px;
  color: #909399;
  font-size: 13px;
}
</style>