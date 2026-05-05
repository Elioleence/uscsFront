<template>
  <div class="achievement-list-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="search-bar">
        <el-input 
          v-model="keyword" 
          placeholder="请输入成果标题搜索"
          class="search-input"
          @keyup.enter="loadAchievementList"
        >
          <template #append>
            <el-button @click="loadAchievementList">搜索</el-button>
          </template>
        </el-input>
        
        <el-select
          v-model="clubId"
          placeholder="选择社团"
          class="type-select"
          @change="loadAchievementList"
        >
          <el-option label="全部" :value="0" />
          <el-option v-for="club in clubs" :key="club.id" :label="club.clubName" :value="club.id" />
        </el-select>
      </div>
      
      <div class="achievement-grid">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.id" 
          class="achievement-card"
          @click="handleCardClick(achievement.id)"
        >
          <img :src="formatImageUrl(achievement.certificate)" alt="成果证书" class="achievement-cover">
          <div class="achievement-info">
            <h3>{{ achievement.title }}</h3>
            <p class="achievement-club">{{ achievement.clubName }}</p>
            <p class="achievement-time">{{ formatTime(achievement.achieveTime) }}</p>
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
import { useRouter } from 'vue-router'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import { getClubList } from '@/api/index'
import { getPublicAchievementList } from '@/api/club'
import { formatImageUrl } from '@/utils/imageUtils'

const router = useRouter()
const keyword = ref('')
const clubId = ref(undefined)
const achievements = ref([])
const clubs = ref([])
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

onMounted(() => {
  loadClubList()
  loadAchievementList()
})

const loadClubList = async () => {
  try {
    const res = await getClubList({ pageNum: 1, pageSize: 100 })
    clubs.value = res.data.records || []
  } catch (error) {
    console.error('加载社团列表失败:', error)
  }
}

const loadAchievementList = async () => {
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      title: keyword.value
    }
    if (clubId.value !== undefined && clubId.value > 0) {
      params.clubId = clubId.value
    }
    const res = await getPublicAchievementList(params)
    achievements.value = res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error('加载成果列表失败:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadAchievementList()
}

const formatTime = (time) => {
  if (!time) return ''
  return time.split('T')[0]
}

const handleCardClick = (id) => {
  router.push(`/achievement/detail/${id}`)
}
</script>

<style scoped>
.achievement-list-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.search-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.search-input {
  width: 350px;
}

.type-select {
  width: 150px;
}

.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.achievement-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.achievement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.achievement-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.achievement-info {
  padding: 15px;
}

.achievement-info h3 {
  margin: 0 0 10px;
  font-size: 17px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.achievement-club {
  font-size: 13px;
  color: #409EFF;
  margin-bottom: 5px;
}

.achievement-time {
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
}

.pagination {
  text-align: center;
}
</style>