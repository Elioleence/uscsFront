<template>
  <div class="user-center-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="user-profile">
        <img 
          :src="avatarUrl" 
          alt="头像" 
          class="avatar" 
          @error="handleAvatarError" 
        />
        <div class="profile-info">
          <h2>{{ userInfo.realName || '未设置' }}</h2>
          <p class="username">{{ userInfo.college || '未设置' }}</p>
          <p class="email">{{ userInfo.email || '未绑定' }}</p>
          <p class="phone">{{ userInfo.phone || '未绑定' }}</p>
        </div>
        <el-button type="primary" @click="goEdit">编辑资料</el-button>
      </div>

      <div class="tabs-container">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="我的活动" name="activities">
            <div v-if="activities.length > 0" class="activity-list">
              <div
                v-for="item in activities"
                :key="item.id"
                class="activity-item"
              >
                <div class="activity-left">
                  <div class="activity-title" @click="goActivityDetail(item.actId)">
                    {{ item.actName }}
                  </div>
                  <div class="activity-info">
                    <span class="info-item">报名时间：{{ formatTime(item.enrollTime) }}</span>
                    <span class="info-item">
                      审核状态：
                      <el-tag :type="getStatusType(item.auditStatus)" size="small">
                        {{ getAuditStatusText(item.auditStatus) }}
                      </el-tag>
                    </span>
                  </div>
                  <div v-if="item.auditStatus === 2 && item.auditReply" class="audit-reply">
                    拒绝理由：{{ item.auditReply }}
                  </div>
                </div>
                <div class="activity-right">
                  <div v-if="item.auditStatus === 1">
                    <el-tag v-if="isSigned(item.actId)" type="success" size="small">
                      已签到
                    </el-tag>
                    <el-button
                      v-else-if="isActivityInProgress(item)"
                      type="success"
                      size="small"
                      @click="handleCheckin(item.actId)"
                    >
                      签到
                    </el-button>
                    <el-tag v-else type="info" size="small">
                      {{ getActivityTimeStatus(item) === '进行中' ? '未签到' : getActivityTimeStatus(item) }}
                    </el-tag>
                    <el-button
                      size="small"
                      @click="goActivityDetail(item.actId)"
                    >
                      查看详情
                    </el-button>
                  </div>
                  <el-button
                    v-else-if="item.auditStatus === 0"
                    type="warning"
                    size="small"
                    @click="handleCancelEnroll(item.id)"
                  >
                    取消报名
                  </el-button>
                </div>
              </div>
            </div>
            <div v-else class="empty">
              <p>暂无报名的活动</p>
            </div>
          </el-tab-pane>

          <el-tab-pane label="我的社团" name="clubs">
            <el-tabs v-model="clubSubTab" type="card">
              <el-tab-pane label="加入申请" name="join">
                <div v-if="joinApplications.length > 0" class="club-list">
                  <div
                    v-for="item in joinApplications"
                    :key="item.id"
                    class="club-item"
                  >
                    <div class="club-left">
                      <div class="club-title" @click="goClubDetail(item.clubId)">
                        {{ item.clubName }}
                      </div>
                      <div class="club-info">
                        <span class="info-item">申请时间：{{ formatTime(item.applyTime) }}</span>
                        <span class="info-item">
                          审核状态：
                          <el-tag :type="getStatusType(item.auditStatus)" size="small">
                            {{ getAuditStatusText(item.auditStatus) }}
                          </el-tag>
                        </span>
                      </div>
                      <div v-if="item.reason" class="reason">
                        申请理由：{{ item.reason }}
                      </div>
                      <div v-if="item.auditStatus === 2 && item.auditReply" class="audit-reply">
                        拒绝理由：{{ item.auditReply }}
                      </div>
                    </div>
                    <div class="club-right">
                      <el-button
                        v-if="item.auditStatus === 0"
                        type="warning"
                        size="small"
                        @click="handleCancelApply(item.id)"
                      >
                        取消申请
                      </el-button>
                      <template v-else-if="item.auditStatus === 1">
                        <el-button
                          size="small"
                          @click="goClubDetail(item.clubId)"
                        >
                          查看社团
                        </el-button>
                        <!-- <el-button
                          type="danger"
                          size="small"
                          @click="handleQuitClub(item)"
                        >
                          退出社团
                        </el-button> -->
                      </template>
                    </div>
                  </div>
                </div>
                <div v-else class="empty">
                  <p>暂无加入申请</p>
                </div>
              </el-tab-pane>
              <el-tab-pane label="退出申请" name="quit">
                <div v-if="quitApplications.length > 0" class="club-list">
                  <div
                    v-for="item in quitApplications"
                    :key="item.id"
                    class="club-item"
                  >
                    <div class="club-left">
                      <div class="club-title" @click="goClubDetail(item.clubId)">
                        {{ item.clubName }}
                      </div>
                      <div class="club-info">
                        <span class="info-item">申请时间：{{ formatTime(item.applyTime) }}</span>
                        <span class="info-item">
                          审核状态：
                          <el-tag :type="getStatusType(item.auditStatus)" size="small">
                            {{ getAuditStatusText(item.auditStatus) }}
                          </el-tag>
                        </span>
                      </div>
                      <div v-if="item.reason" class="reason">
                        退出理由：{{ item.reason }}
                      </div>
                      <div v-if="item.auditStatus === 2 && item.auditReply" class="audit-reply">
                        拒绝理由：{{ item.auditReply }}
                      </div>
                    </div>
                    <div class="club-right">
                      <el-button
                        v-if="item.auditStatus === 0"
                        type="warning"
                        size="small"
                        @click="handleCancelQuit(item.id)"
                      >
                        取消申请
                      </el-button>
                    </div>
                  </div>
                </div>
                <div v-else class="empty">
                  <p>暂无退出申请</p>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>

          <el-tab-pane label="我的帖子" name="posts">
            <div v-if="posts.length > 0" class="post-list">
              <div
                v-for="item in posts"
                :key="item.id"
                class="post-item"
              >
                <div class="post-left">
                  <div class="post-title" @click="goPostDetail(item.id)">
                    {{ item.title }}
                  </div>
                  <div class="post-info">
                    <span class="info-item">发布时间：{{ formatTime(item.createTime) }}</span>
                    <span class="info-item">
                      帖子状态：
                      <el-tag :type="getPostStatusType(item.status)" size="small">
                        {{ getPostStatusText(item.status) }}
                      </el-tag>
                    </span>
                  </div>
                  <div class="post-summary" v-html="getPostSummary(item.content)">
                  </div>
                </div>
                <div class="post-right">
                  <el-button
                    size="small"
                    @click="goPostDetail(item.id)"
                  >
                    查看详情
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    @click="handleDeletePost(item)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
            <div v-else class="empty">
              <p>还没有发布任何帖子</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 签到弹窗 -->
    <el-dialog
      v-model="checkinDialogVisible"
      title="活动签到"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="checkinForm" label-width="100px">
        <el-form-item label="签到人">
          <el-input :value="userInfo.realName" disabled />
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input :value="currentActivity?.actName" disabled />
        </el-form-item>
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

    <!-- 退出社团弹窗 -->
    <el-dialog
      v-model="quitDialogVisible"
      title="申请退出社团"
      width="500px"
    >
      <el-form :model="quitForm" label-width="100px">
        <el-form-item label="社团名称">
          <el-input :value="quitForm.clubName" disabled />
        </el-form-item>
        <el-form-item label="退出理由" required>
          <el-input
            v-model="quitForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入退出理由"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="quitDialogVisible = false">取消</el-button>
        <el-button type="danger" :loading="quitLoading" @click="handleSubmitQuit">
          提交申请
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import UploadImg from '@/components/common/UploadImg.vue'
import { useUserStore } from '@/stores/user'
import { formatAvatarUrl, formatImageUrl } from '@/utils/imageUtils'
import { getMyEnrolls, cancelEnroll } from '@/api/activityEnroll'
import { getMyApplies, cancelApply } from '@/api/club'
import { checkIn, getMySigns } from '@/api/activitySign'
import { submitQuit as submitQuitApi, getMyQuits, cancelQuit } from '@/api/clubQuit'
import { getMyPostList, deletePost } from '@/api/forumPost'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('activities')
const clubSubTab = ref('join')
const userInfo = ref({})
const activities = ref([])
const joinApplications = ref([])
const quitApplications = ref([])
const posts = ref([])
const signedActivityIds = ref(new Set())

const checkinDialogVisible = ref(false)
const checkinLoading = ref(false)
const currentActivity = ref(null)
const checkinForm = ref({
  actId: null,
  location: '',
  signImg: '',
  signInfo: ''
})

const quitDialogVisible = ref(false)
const quitLoading = ref(false)
const quitForm = ref({
  clubId: null,
  clubName: '',
  reason: ''
})

const isSigned = (actId) => {
  return signedActivityIds.value.has(actId)
}

const getActivityTimeStatus = (item) => {
  const actTime = item.actTime || item.act_time
  const actEndTime = item.actEndTime || item.act_end_time
  if (!actTime) return '未知'
  
  const now = new Date()
  const actTimeDate = new Date(actTime)
  
  if (now < actTimeDate) {
    return '未到活动时间'
  }
  
  if (actEndTime) {
    const actEndTimeDate = new Date(actEndTime)
    if (now >= actEndTimeDate) {
      return '活动已过期'
    }
  } else {
    const twoHoursAfter = new Date(actTimeDate.getTime() + 2 * 60 * 60 * 1000)
    if (now >= twoHoursAfter) {
      return '活动已过期'
    }
  }
  
  return '进行中'
}

const isActivityInProgress = (item) => {
  const actTime = item.actTime || item.act_time
  const actEndTime = item.actEndTime || item.act_end_time
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
}

const avatarUrl = computed(() => {
  return formatAvatarUrl(userInfo.value?.avatar)
})

const handleAvatarError = (event) => {
  event.target.src = formatImageUrl('/upload/default.png', true)
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    ElMessage({
      message: '请先登录或注册账号',
      type: 'warning',
      duration: 10000
    })
    return
  }
  loadUserInfo()
  await loadUserData()
  await loadSigns()
})

const loadUserInfo = () => {
  userInfo.value = userStore.userInfo || {}
}

const loadUserData = async () => {
  await Promise.all([loadActivities(), loadClubs(), loadPosts()])
}

const loadPosts = async () => {
  try {
    const res = await getMyPostList({ pageSize: 100 })
    posts.value = res.data?.records || []
  } catch (err) {
    console.error('加载我的帖子失败', err)
  }
}

const loadActivities = async () => {
  try {
    const res = await getMyEnrolls({ pageSize: 100 })
    activities.value = res.data?.records || []
  } catch (err) {
    console.error('加载我的活动失败', err)
  }
}

const loadClubs = async () => {
  try {
    const [joinRes, quitRes] = await Promise.all([
      getMyApplies({ pageSize: 100 }),
      getMyQuits({ pageSize: 100 })
    ])
    joinApplications.value = joinRes.data?.records || []
    quitApplications.value = quitRes.data?.records || []
  } catch (err) {
    console.error('加载我的社团失败', err)
  }
}

const loadSigns = async () => {
  try {
    const res = await getMySigns({ pageSize: 100 })
    const list = res.data?.records || []
    signedActivityIds.value = new Set(list.map(i => i.actId))
  } catch (err) {
    console.error('加载签到记录失败', err)
  }
}

const getStatusType = (status) => {
  if (status === 0) return 'warning'
  if (status === 1) return 'success'
  return 'danger'
}

const getAuditStatusText = (status) => {
  if (status === 0) return '待审核'
  if (status === 1) return '通过'
  return '拒绝'
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

const goEdit = () => {
  router.push('/user/edit')
}

const goActivityDetail = (actId) => {
  router.push(`/activity/detail/${actId}`)
}

const goClubDetail = (clubId) => {
  router.push(`/club/detail/${clubId}`)
}

const goPostDetail = (postId) => {
  router.push(`/forum/post/${postId}`)
}

const getPostStatusType = (status) => {
  if (status === 0) return 'danger'
  if (status === 1) return 'success'
  if (status === 2) return 'warning'
  return 'info'
}

const getPostStatusText = (status) => {
  if (status === 0) return '已禁用'
  if (status === 1) return '正常'
  if (status === 2) return '待审核'
  return '未知'
}

const getPostSummary = (content) => {
  if (!content) return ''
  // 移除HTML标签
  const text = content.replace(/<[^>]*>/g, '')
  // 截取前100字
  if (text.length > 100) {
    return text.substring(0, 100) + '...'
  }
  return text
}

const handleDeletePost = async (post) => {
  try {
    await ElMessageBox.confirm(`确定要删除帖子《${post.title}》吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deletePost(post.id)
    ElMessage.success('删除成功')
    await loadPosts()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || '删除失败')
    }
  }
}

const handleCancelEnroll = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消这个活动报名吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await cancelEnroll(id)
    ElMessage.success('取消报名成功')
    await loadActivities()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('操作失败')
  }
}

const handleCancelApply = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消这个社团申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await cancelApply(id)
    ElMessage.success('取消申请成功')
    await loadClubs()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('操作失败')
  }
}

const handleCheckin = (actId) => {
  if (signedActivityIds.value.has(actId)) {
    ElMessage.warning('已签到')
    return
  }
  const activity = activities.value.find(item => item.actId === actId)
  if (!activity) {
    ElMessage.error('活动信息不存在')
    return
  }
  currentActivity.value = activity
  checkinForm.value = {
    actId: actId,
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
    signedActivityIds.value.add(checkinForm.value.actId)
  } catch (err) {
    ElMessage.error(err.message || '签到失败')
  } finally {
    checkinLoading.value = false
  }
}

const handleQuitClub = async (item) => {
  try {
    await ElMessageBox.confirm(
      '确定要退出该社团吗？退出后需要重新申请才能加入',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    quitForm.value = {
      clubId: item.clubId,
      clubName: item.clubName,
      reason: ''
    }
    quitDialogVisible.value = true
  } catch {
    // 用户取消
  }
}

const handleSubmitQuit = async () => {
  if (!quitForm.value.reason) {
    ElMessage.warning('请输入退出理由')
    return
  }
  quitLoading.value = true
  try {
    await submitQuitApi({
      clubId: quitForm.value.clubId,
      reason: quitForm.value.reason
    })
    ElMessage.success('退社申请已提交，请等待审核')
    quitDialogVisible.value = false
    await loadClubs()
  } catch (err) {
    ElMessage.error(err.message || '提交失败')
  } finally {
    quitLoading.value = false
  }
}

const handleCancelQuit = async (id) => {
  try {
    await ElMessageBox.confirm('确定要取消这个退社申请吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await cancelQuit(id)
    ElMessage.success('取消申请成功')
    await loadClubs()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.user-center-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 36px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 30px;
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  margin-top: 80px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 0 20px;
}

.activity-list, .club-list, .post-list {
  padding: 20px 0;
}

.activity-item, .club-item, .post-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.activity-item:hover, .club-item:hover, .post-item:hover {
  background: #f0f0f0;
}

.activity-left, .club-left, .post-left {
  flex: 1;
}

.activity-title, .club-title, .post-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
  cursor: pointer;
}

.activity-title:hover, .club-title:hover, .post-title:hover {
  color: #409EFF;
}

.activity-info, .club-info, .post-info {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
}

.post-summary {
  font-size: 14px;
  color: #606266;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  margin-top: 6px;
  line-height: 1.6;
}

.activity-right, .club-right, .post-right {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 100px;
}

.reason, .audit-reply {
  font-size: 13px;
  color: #606266;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #e4e7ed;
  margin-top: 6px;
}

.activity-right, .club-right {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 100px;
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: #909399;
}

@media (max-width: 768px) {
  .user-profile {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  .activity-info, .club-info, .post-info {
    flex-direction: column;
    gap: 4px;
  }
}
</style>

