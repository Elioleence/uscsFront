<template>
  <div class="forum-post-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="post-header">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <span class="author">{{ post.realName || getUserNameById(post.userId) }}</span>
          <span class="time">{{ formatTime(post.createTime) }}</span>
        </div>
      </div>
      
      <div class="post-cover" v-if="post.img">
        <img :src="formatImageUrl(post.img)" alt="封面">
      </div>
      
      <div class="post-content">
        <div v-html="post.content"></div>
      </div>
      
      <div class="comment-section">
        <h2>评论 ({{ comments.length }})</h2>
        
        <div v-if="comments.length > 0" class="comment-list">
          <div 
            v-for="comment in comments" 
            :key="comment.id" 
            class="comment-item"
            :class="{ 'is-reply': comment.parentId !== post.id }"
          >
            <div class="comment-header">
              <span class="comment-author">{{ comment.realName || getUserNameById(comment.userId) }}</span>
              <div class="comment-actions">
                <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
                <el-button type="text" size="small" @click="toggleReplyInput(comment)">回复</el-button>
              </div>
            </div>
            <div class="comment-content" v-html="comment.content"></div>
            
            <!-- 回复输入框 -->
            <div v-if="replyTargetId === comment.id" class="reply-input-section">
              <QuillEditor
                v-model="replyContent"
                :placeholder="replyPlaceholder"
                height="100px"
              />
              <div class="reply-buttons">
                <el-button type="primary" size="small" @click="handleReply(comment)">发送</el-button>
                <el-button size="small" @click="cancelReply">取消</el-button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty">
          <p>暂无评论，快来发表第一条评论吧</p>
        </div>
        
        <div class="comment-input-section">
          <QuillEditor
            v-model="commentContent"
            placeholder="请输入评论内容..."
            height="150px"
          />
          <el-button type="primary" @click="handleComment">发表评论</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import HeaderComponent from '@/components/header/header.vue'
import SidebarComponent from '@/components/sidebar/sidebar.vue'
import QuillEditor from '@/components/common/QuillEditor.vue'
import { getPostDetail, getReplies, createPost } from '@/api/forumPost'
import { getUserNameById } from '@/utils/userUtils'
import { formatImageUrl } from '@/utils/imageUtils'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const post = ref({})
const comments = ref([])
const commentContent = ref('')
const replyTargetId = ref(null) // 当前回复的评论 id
const replyContent = ref('')
const replyPlaceholder = ref('') // 回复的 placeholder

onMounted(async () => {
  const id = window.location.pathname.split('/').pop()
  await loadPost(id)
})

const loadPost = async (id) => {
  try {
    const res = await getPostDetail(id)
    post.value = res.data || {}
    await loadComments(id)
  } catch (error) {
    console.error('加载帖子详情失败:', error)
  }
}

const loadComments = async (postId) => {
  try {
    const res = await getReplies(postId)
    comments.value = res.data || []
  } catch (error) {
    console.error('加载评论失败:', error)
  }
}

const handleComment = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    window.location.href = '/login'
    return
  }
  
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  try {
    await createPost({
            parentId: post.value.id,
            content: commentContent.value
          })
          ElMessage.success('评论成功')
          commentContent.value = ''
          await loadComments(post.value.id)
  } catch (error) {
    ElMessage.error(error.message || '评论失败')
  }
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 切换回复输入框
const toggleReplyInput = (comment) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    window.location.href = '/login'
    return
  }
  if (replyTargetId.value === comment.id) {
    // 关闭
    replyTargetId.value = null
    replyContent.value = ''
  } else {
    // 打开
    replyTargetId.value = comment.id
    replyContent.value = ''
    const userName = comment.realName || getUserNameById(comment.userId)
    replyPlaceholder.value = `回复 @${userName}：`
  }
}

// 取消回复
const cancelReply = () => {
  replyTargetId.value = null
  replyContent.value = ''
}

// 发送回复
const handleReply = async (comment) => {
  if (!replyContent.value.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  
  try {
    await createPost({
      parentId: comment.id,
      content: replyContent.value
    })
    ElMessage.success('回复成功')
    cancelReply()
    await loadComments(post.value.id)
  } catch (error) {
    ElMessage.error(error.message || '回复失败')
  }
}
</script>

<style scoped>
.forum-post-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.post-header {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.post-header h1 {
  margin: 0 0 15px;
  font-size: 24px;
  color: #303133;
}

.post-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
}

.author {
  color: #409EFF;
}

.time, .views {
  color: #909399;
}

.post-cover {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.post-cover img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  object-fit: contain;
}

.post-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.post-content div {
  font-size: 15px;
  line-height: 1.8;
  color: #606266;
}

.comment-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.comment-section h2 {
  margin: 0 0 20px;
  font-size: 18px;
  color: #303133;
}

.comment-list {
  margin-bottom: 20px;
}

.comment-item {
  padding: 15px 0;
  border-bottom: 1px dashed #ebeef5;
}

.comment-item.is-reply {
  padding-left: 30px;
  border-left: 2px solid #e4e7ed;
  margin-left: 10px;
  border-bottom: none;
  padding-bottom: 0;
  padding-top: 10px;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.comment-author {
  font-size: 14px;
  color: #409EFF;
}

.comment-time {
  font-size: 13px;
  color: #909399;
}

.comment-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.comment-content :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}

.empty {
  text-align: center;
  padding: 30px;
  color: #909399;
}

.comment-input-section {
  margin-top: 20px;
}

.comment-input-section :deep(.el-button) {
  margin-top: 10px;
}

.comment-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.reply-input-section {
  margin-top: 15px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.reply-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>