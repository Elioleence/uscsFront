<template>
  <div class="activity-list-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="search-bar">
        <el-input 
          v-model="keyword" 
          placeholder="请输入活动名称搜索"
          class="search-input"
          @keyup.enter="loadActivityList"
        >
          <template #append>
            <el-button @click="loadActivityList">搜索</el-button>
          </template>
        </el-input>
      </div>
      
      <div class="activity-grid">
        <div 
          v-for="activity in activities" 
          :key="activity.id" 
          class="activity-card"
          @click="goDetail(activity.id)"
        >
          <img :src="formatImageUrl(activity.cover)" alt="活动封面" class="activity-cover">
          <div class="activity-info">
            <h3>{{ activity.title }}</h3>
            <p class="activity-time">{{ activity.time }}</p>
            <p class="activity-club">{{ activity.clubName }}</p>
            <div class="activity-tags">
              <span class="tag">{{ getActivityTypeName(activity.typeId) }}</span>
              <span class="tag participants">报名人数：{{ activity.participants }}</span>
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
import { getActivityList } from '@/api/index'
import { formatImageUrl } from '@/utils/imageUtils'

const keyword = ref('')
const activities = ref([])
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

onMounted(() => {
  loadActivityList()
})

const loadActivityList = async () => {
  try {
    const res = await getActivityList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: keyword.value
    })
    activities.value = res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error('加载活动列表失败:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadActivityList()
}

const goDetail = (id) => {
  window.location.href = `/activity/detail/${id}`
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
.activity-list-page {
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
  margin-bottom: 20px;
}

.search-input {
  width: 400px;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.activity-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.activity-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.activity-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.activity-info {
  padding: 15px;
}

.activity-info h3 {
  margin: 0 0 10px;
  font-size: 17px;
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
  margin-bottom: 10px;
}

.activity-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  background: #f0f5ff;
  color: #409EFF;
  border-radius: 4px;
  font-size: 12px;
}

.tag.participants {
  background: #f6ffed;
  color: #67c23a;
}

.pagination {
  text-align: center;
}
</style>