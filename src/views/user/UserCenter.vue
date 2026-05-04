<template>
  <div class="user-center-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="user-profile">
        <img :src="avatarUrl" alt="头像" class="avatar" @error="handleAvatarError">
        <div class="profile-info">
          <h2>{{ userInfo.realName }}</h2>
          <p class="username">{{ userInfo.username }}</p>
          <p class="email">{{ userInfo.email }}</p>
          <p class="phone">{{ userInfo.phone }}</p>
        </div>
        <el-button type="primary" @click="goEdit">编辑资料</el-button>
      </div>
      
      <div class="tabs-container">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="我的活动" name="activities">
            <div v-if="activities.length > 0" class="activity-list">
              <div
                v-for="activity in activities"
                :key="activity.id"
                class="activity-item"
                @click="goActivity(activity.id)"
              >
                <img :src="formatImageUrl(activity.cover)" alt="活动封面">
                <div class="activity-info">
                  <h3>{{ activity.title }}</h3>
                  <p>{{ activity.time }}</p>
                  <span :class="['status', activity.status === 1 ? 'active' : 'ended']">
                    {{ activity.status === 1 ? '进行中' : '已结束' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="empty">
              <p>暂无参与的活动</p>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="我的社团" name="clubs">
            <div v-if="clubs.length > 0" class="club-list">
              <div
                v-for="club in clubs"
                :key="club.id"
                class="club-item"
                @click="goClub(club.id)"
              >
                <img :src="formatImageUrl(club.logo)" alt="社团logo">
                <div class="club-info">
                  <h3>{{ club.name }}</h3>
                  <p>{{ getClubTypeName(club.typeId) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="empty">
              <p>暂无加入的社团</p>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="我的收藏" name="favorites">
            <div v-if="favorites.length > 0" class="favorite-list">
              <div 
                v-for="item in favorites" 
                :key="item.id" 
                class="favorite-item"
              >
                <h3>{{ item.title }}</h3>
                <p>{{ item.type === 'activity' ? '活动' : '社团' }}</p>
              </div>
            </div>
            <div v-else class="empty">
              <p>暂无收藏</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import { useUserStore } from '@/stores/user'
import { getClubTypeName } from '@/utils/clubUtils'
import { formatAvatarUrl, formatImageUrl } from '@/utils/imageUtils'

const userStore = useUserStore()
const activeTab = ref('activities')
const userInfo = ref({})
const activities = ref([])
const clubs = ref([])
const favorites = ref([])

const avatarUrl = computed(() => {
  return formatAvatarUrl(userInfo.value.avatar)
})

const handleAvatarError = (event) => {
  event.target.src = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    window.location.href = '/login'
    return
  }
  
  await loadUserInfo()
  await loadUserData()
})

const loadUserInfo = async () => {
  userInfo.value = userStore.userInfo || {}
}

const loadUserData = async () => {
  activities.value = []
  clubs.value = []
  favorites.value = []
}

const handleTabChange = (tab) => {
  activeTab.value = tab
}

const goEdit = () => {
  alert('编辑资料功能开发中')
}

const goActivity = (id) => {
  window.location.href = `/activity/detail/${id}`
}

const goClub = (id) => {
  window.location.href = `/club/detail/${id}`
}
</script>

<style scoped>
.user-center-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 30px;
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  margin: 0 0 10px;
  font-size: 24px;
  color: #303133;
}

.username {
  font-size: 14px;
  color: #409EFF;
  margin-bottom: 5px;
}

.email, .phone {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.tabs-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.activity-list, .club-list, .favorite-list {
  padding: 20px;
}

.activity-item, .club-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: background 0.3s;
}

.activity-item:hover, .club-item:hover {
  background: #f0f0f0;
}

.activity-item img, .club-item img {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
}

.activity-info, .club-info {
  flex: 1;
}

.activity-info h3, .club-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.activity-info p, .club-info p {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 4px;
}

.status.active {
  background: #f6ffed;
  color: #67c23a;
}

.status.ended {
  background: #fff7e6;
  color: #e6a23c;
}

.favorite-item {
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 15px;
}

.favorite-item h3 {
  margin: 0 0 5px;
  font-size: 16px;
  color: #303133;
}

.favorite-item p {
  font-size: 13px;
  color: #909399;
}

.empty {
  text-align: center;
  padding: 40px;
  color: #909399;
}
</style>