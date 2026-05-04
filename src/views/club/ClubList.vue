<template>
  <div class="club-list-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="search-bar">
        <el-input 
          v-model="keyword" 
          placeholder="请输入社团名称搜索"
          class="search-input"
          @keyup.enter="loadClubList"
        >
          <template #append>
            <el-button @click="loadClubList">搜索</el-button>
          </template>
        </el-input>
        
        <el-select 
          v-model="typeId" 
          placeholder="选择社团类型"
          class="type-select"
          @change="loadClubList"
        >
          <el-option label="全部" :value="0" />
          <el-option v-for="option in typeOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </div>
      
      <div class="club-grid">
        <div 
          v-for="club in clubs" 
          :key="club.id" 
          class="club-card"
          @click="goDetail(club.id)"
        >
          <img :src="club.logo" alt="社团logo" class="club-logo">
          <div class="club-info">
            <h3>{{ club.name }}</h3>
            <p class="club-type">{{ getClubTypeName(club.typeId) }}</p>
            <p class="club-desc">{{ club.description }}</p>
            <div class="club-stats">
              <span>成员 {{ club.memberCount }}</span>
              <span>|</span>
              <span>活动 {{ club.activityCount }}</span>
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
import { ref, onMounted, computed } from 'vue'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import { getClubList } from '@/api/index'
import { getClubTypeName, getClubTypeOptions } from '@/utils/clubUtils'

const keyword = ref('')
const typeId = ref(0)
const clubs = ref([])
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

const typeOptions = computed(() => getClubTypeOptions())

onMounted(() => {
  loadClubList()
})

const loadClubList = async () => {
  try {
    const params = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: keyword.value
    }
    if (typeId.value > 0) {
      params.typeId = typeId.value
    }
    const res = await getClubList(params)
    clubs.value = res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error('加载社团列表失败:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadClubList()
}

const goDetail = (id) => {
  window.location.href = `/club/detail/${id}`
}
</script>

<style scoped>
.club-list-page {
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

.club-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.club-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: center;
}

.club-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.club-logo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 20px;
  border: 4px solid #f0f0f0;
}

.club-info {
  padding: 20px;
}

.club-info h3 {
  margin: 10px 0;
  font-size: 18px;
  color: #303133;
}

.club-type {
  font-size: 14px;
  color: #409EFF;
  margin-bottom: 10px;
}

.club-desc {
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 15px;
}

.club-stats {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-size: 13px;
  color: #606266;
}

.pagination {
  text-align: center;
}
</style>