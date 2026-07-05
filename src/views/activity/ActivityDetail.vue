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
            <!-- {{ activity}} -->
            <span class="value">{{ activity.typeName || '未分类' }}</span>
          </div>
          <div class="info-item">
            <span class="label">活动时间</span>
            <span class="value">{{ activity.actTime || activity.act_time }}</span>
          </div>
          <div class="info-item">
            <span class="label">活动结束时间</span>
            <span class="value">{{ activity.actEndTime || activity.act_end_time || '未设置' }}</span>
          </div>
                    <div class="info-item">
            <span class="label">活动地点</span>
            <span class="value">{{ activity.address }}</span>
          </div>
          <div class="info-item">
            <span class="label">报名截止时间</span>
            <span class="value">{{ activity.enrollDeadline }}</span>
          </div>
          <div class="info-item">
            <span class="label">活动状态</span>
            <span :class="['value', getActivityStatusText === '进行中' ? 'active' : 'inactive']">
              {{ getActivityStatusText }}
            </span>
          </div>
          <!-- <div class="info-item">
            <span class="label">活动开始时间</span>
            <span class="value">{{ getActTime || '无数据' }}</span>
          </div> -->
        </div>
        
        <div class="activity-content">
          <h2>活动详情</h2>
          <div v-html="activity.content"></div>
        </div>
        
        <div class="action-bar">
          <el-button
            v-if="enrollStatus === 'none' && getActivityStatusText === '待开展'"
            type="primary"
            @click="handleEnroll"
            class="enroll-btn"
          >
            立即报名
          </el-button>
          <el-button
            v-else-if="enrollStatus === 'pending'"
            type="warning"
            disabled
          >
            报名申请待审核
          </el-button>
          <el-button
            v-else-if="enrollStatus === 'approved'"
            type="success"
            disabled
          >
            已报名
          </el-button>
          <el-button
            v-else-if="enrollStatus === 'rejected'"
            type="danger"
            disabled
          >
            报名被拒绝
          </el-button>
          <el-button
            v-else-if="getActivityStatusText === '进行中'"
            type="default"
            disabled
          >
            活动中
          </el-button>
          <el-button
            v-else
            type="default"
            disabled
          >
            已结束
          </el-button>
        </div>

        <div v-if="signInfo" class="sign-info-section">
          <h2>我的签到信息</h2>
          <div class="sign-info-card">
            <div class="sign-info-row">
              <span class="sign-label">签到时间：</span>
              <span class="sign-value">{{ formatTime(signInfo.checkinTime) }}</span>
            </div>
            <div class="sign-info-row">
              <span class="sign-label">签到地址：</span>
              <span class="sign-value">{{ signInfo.location }}</span>
            </div>
            <div v-if="signInfo.signImg" class="sign-info-row">
              <span class="sign-label">签到图片：</span>
              <img :src="formatImageUrl(signInfo.signImg)" class="sign-img" />
            </div>
            <div v-if="signInfo.signInfo" class="sign-info-row">
              <span class="sign-label">签到说明：</span>
              <span class="sign-value">{{ signInfo.signInfo }}</span>
            </div>
          </div>
        </div>

        <div v-if="enrollStatus === 'approved' && !signInfo && isActivityInProgress" class="sign-action-section">
          <el-button type="success" @click="openCheckinDialog">
            立即签到
          </el-button>
        </div>

        <div v-if="enrollStatus === 'approved' && !signInfo && !isActivityInProgress" class="sign-action-section">
          <el-tag type="info">
            {{ getActivityStatusText === '待开展' ? '活动未开始' : '活动已结束' }}
          </el-tag>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="checkinDialogVisible"
      title="活动签到"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="checkinForm" label-width="100px">
        <el-form-item label="签到地址" required>
          <el-input 
            v-model="checkinForm.location" 
            placeholder="请输入签到地址"
          />
        </el-form-item>
        <el-form-item label="签到图片">
          <UploadImg v-model="checkinForm.signImg" />
        </el-form-item>
        <el-form-item label="签到说明">
          <el-input
            v-model="checkinForm.signInfo"
            type="textarea"
            :rows="3"
            placeholder="请输入签到说明（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="checkinDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="checkinLoading" @click="submitCheckin">
          确认签到
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import UploadImg from '@/components/common/UploadImg.vue'
import { getActivityInfo, signActivity, checkEnrollStatus as checkEnrollStatusApi } from '@/api/index'
import { checkIn, getMySignByActId } from '@/api/activitySign'
import { useUserStore } from '@/stores/user'
import { formatImageUrl } from '@/utils/imageUtils'

const router = useRouter()
const userStore = useUserStore()
const activity = ref({})
const enrollStatus = ref('none')
const signInfo = ref(null)
const checkinDialogVisible = ref(false)
const checkinLoading = ref(false)
const checkinForm = ref({
  actId: null,
  location: '',
  signImg: '',
  signInfo: ''
})

const isActivityActive = computed(() => {
  const actTime = getActTime.value
  if (!actTime) {
    return false
  }
  const actTimeDate = new Date(actTime)
  const now = new Date()
  return now >= actTimeDate
})

const getActTime = computed(() => {
  return activity.value.actTime || activity.value.act_time || null
})

const getActEndTime = computed(() => {
  return activity.value.actEndTime || activity.value.act_end_time || null
})

const getActivityStatusText = computed(() => {
  const actTime = getActTime.value
  const actEndTime = getActEndTime.value
  if (!actTime) {
    return '未知'
  }
  const now = new Date()
  const actTimeDate = new Date(actTime)
  
  if (now < actTimeDate) {
    return '待开展'
  }
  
  if (actEndTime) {
    const actEndTimeDate = new Date(actEndTime)
    if (now < actEndTimeDate) {
      return '进行中'
    }
  } else {
    const twoHoursAfter = new Date(actTimeDate.getTime() + 2 * 60 * 60 * 1000)
    if (now < twoHoursAfter) {
      return '进行中'
    }
  }
  return '已结束'
})

const isActivityInProgress = computed(() => {
  const actTime = getActTime.value
  const actEndTime = getActEndTime.value
  if (!actTime) return false
  
  const now = new Date()
  const actTimeDate = new Date(actTime)
  
  if (now < actTimeDate) return false
  
  if (actEndTime) {
    const actEndTimeDate = new Date(actEndTime)
    return now < actEndTimeDate
  } else {
    const twoHoursAfter = new Date(actTimeDate.getTime() + 2 * 60 * 60 * 1000)
    return now < twoHoursAfter
  }
})

onMounted(async () => {
  const id = window.location.pathname.split('/').pop()
  await loadActivity(id)
})

const loadActivity = async (id) => {
  try {
    const res = await getActivityInfo(id)
    activity.value = res.data || {}
    await checkEnrollStatus(id)
    await loadSignInfo(id)
  } catch (error) {
    console.error('加载活动详情失败:', error)
  }
}

const loadSignInfo = async (actId) => {
  if (!userStore.isLoggedIn) {
    signInfo.value = null
    return
  }
  try {
    const res = await getMySignByActId(actId)
    signInfo.value = res.data || null
  } catch (error) {
    signInfo.value = null
  }
}

const checkEnrollStatus = async (actId) => {
  if (!userStore.isLoggedIn) {
    enrollStatus.value = 'none'
    return
  }
  try {
    const res = await checkEnrollStatusApi(actId)
    const records = res.data?.records || []
    if (records.length > 0) {
      const status = records[0].auditStatus
      if (status === 0) enrollStatus.value = 'pending'
      else if (status === 1) enrollStatus.value = 'approved'
      else if (status === 2) enrollStatus.value = 'rejected'
      else enrollStatus.value = 'none'
    } else {
      enrollStatus.value = 'none'
    }
  } catch (error) {
    enrollStatus.value = 'none'
  }
}

const handleEnroll = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage({
      message: '请先登录或注册账号',
      type: 'warning',
      duration: 10000
    })
    return
  }

  try {
    await signActivity({ actId: activity.value.id })
    ElMessage.success('报名成功，请等待审核')
    enrollStatus.value = 'pending'
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

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openCheckinDialog = () => {
  checkinForm.value = {
    actId: activity.value.id,
    location: '',
    signImg: '',
    signInfo: ''
  }
  checkinDialogVisible.value = true
}

const submitCheckin = async () => {
  if (!checkinForm.value.location) {
    ElMessage.warning('请输入签到地址')
    return
  }
  checkinLoading.value = true
  try {
    await checkIn(checkinForm.value)
    ElMessage.success('签到成功')
    checkinDialogVisible.value = false
    await loadSignInfo(activity.value.id)
  } catch (err) {
    ElMessage.error(err.message || '签到失败')
  } finally {
    checkinLoading.value = false
  }
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

.sign-info-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.sign-info-section h2 {
  margin: 0 0 20px;
  font-size: 18px;
  color: #303133;
}

.sign-info-card {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
}

.sign-info-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.sign-info-row:last-child {
  margin-bottom: 0;
}

.sign-label {
  font-size: 14px;
  color: #909399;
  min-width: 80px;
}

.sign-value {
  font-size: 14px;
  color: #303133;
}

.sign-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 5px;
}

.sign-action-section {
  margin-top: 30px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>