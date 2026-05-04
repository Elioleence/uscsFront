<template>
  <div class="club-detail-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="club-header">
        <img :src="formatImageUrl(club.cover)" alt="社团logo" class="club-logo">
        <div class="club-title-section">
          <h1>{{ club.clubName }}</h1>
          <p class="club-type">{{ getClubTypeName(club.typeId) }}类</p>
        </div>
      </div>
      
      <div class="club-body">
        <!-- {{ club }} -->
        <div class="club-info">
          <h2>社团简介</h2>
          <p>{{ club.intro }}</p>
          
          <div class="stats-grid">
                        <div class="stat-item">
              <span class="stat-value">{{ club.leaderName }}</span>
              <span class="stat-label">社团负责人</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ club.contact }}</span>
              <span class="stat-label">联系电话</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ club.memberCount }}</span>
              <span class="stat-label">成员数</span>
            </div>


          </div>
        </div>
        

        
        <div class="action-bar">
          <el-button
            v-if="joinStatus === 'none'"
            type="primary"
            @click="showJoinDialog"
            class="join-btn"
          >
            加入社团
          </el-button>
          <el-button
            v-else-if="joinStatus === 'pending'"
            type="warning"
            disabled
          >
            加入申请待审核
          </el-button>
          <el-button
            v-else
            type="success"
            disabled
          >
            已加入
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog v-model="joinDialogVisible" title="申请加入社团" width="500px">
      <el-form>
        <el-form-item label="申请理由">
          <el-input
            v-model="joinReason"
            type="textarea"
            :rows="4"
            placeholder="请输入申请理由..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="joinDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleJoin">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import { getClubInfo, submitClubApply, checkClubApplyStatus } from '@/api/index'
import { getClubTypeName } from '@/utils/clubUtils'
import { getUserNameById } from '@/utils/userUtils'
import { useUserStore } from '@/stores/user'
import { formatImageUrl } from '@/utils/imageUtils'

const userStore = useUserStore()
const club = ref({})
const achievements = ref([])
const activities = ref([])
const joinStatus = ref('none')
const joinDialogVisible = ref(false)
const joinReason = ref('')

onMounted(async () => {
  const id = window.location.pathname.split('/').pop()
  await loadClub(id)
})

const loadClub = async (id) => {
  try {
    const res = await getClubInfo(id)
    club.value = res.data || {}
    achievements.value = res.data.achievements || []
    activities.value = res.data.activities || []
    await checkJoinStatus(id)
  } catch (error) {
    console.error('加载社团详情失败:', error)
  }
}

const checkJoinStatus = async (clubId) => {
  if (!userStore.isLoggedIn) {
    joinStatus.value = 'none'
    return
  }
  try {
    const res = await checkClubApplyStatus(clubId)
    joinStatus.value = res.data.status || 'none'
  } catch (error) {
    joinStatus.value = 'none'
  }
}

const showJoinDialog = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    window.location.href = '/login'
    return
  }
  joinReason.value = ''
  joinDialogVisible.value = true
}

const handleJoin = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    window.location.href = '/login'
    return
  }

  try {
    await submitClubApply({ clubId: club.value.id, reason: joinReason.value })
    ElMessage.success('申请已提交，请等待审核')
    joinDialogVisible.value = false
    joinStatus.value = 'pending'
  } catch (error) {
    ElMessage.error(error.message || '申请失败')
  }
}

const getLeaderName = (leaderId) => {
  return getUserNameById(leaderId) || '未知'
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const goActivity = (id) => {
  window.location.href = `/activity/detail/${id}`
}
</script>

<style scoped>
.club-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.club-header {
  display: flex;
  align-items: center;
  gap: 30px;
  background: white;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.club-logo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
}

.club-title-section h1 {
  margin: 0 0 10px;
  font-size: 28px;
  color: #303133;
}

.club-type {
  font-size: 16px;
  color: #409EFF;
}

.club-body {
  background: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.club-info h2 {
  margin: 0 0 15px;
  font-size: 18px;
  color: #303133;
}

.club-info p {
  font-size: 15px;
  line-height: 1.8;
  color: #606266;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: #909399;
}

.club-achievements, .club-activities {
  margin-top: 30px;
}

.club-achievements h2, .club-activities h2 {
  margin: 0 0 15px;
  font-size: 18px;
  color: #303133;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.achievement-item {
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
}

.achievement-item h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.achievement-item p {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.achievement-time {
  font-size: 13px;
  color: #909399;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.activity-item:hover {
  background: #f0f0f0;
}

.activity-item img {
  width: 100px;
  height: 70px;
  object-fit: cover;
  border-radius: 6px;
}

.activity-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.activity-info p {
  font-size: 13px;
  color: #909399;
}

.empty {
  text-align: center;
  padding: 30px;
  color: #909399;
}

.action-bar {
  margin-top: 30px;
  text-align: center;
}

.join-btn {
  width: 200px;
  height: 44px;
  font-size: 16px;
}
</style>