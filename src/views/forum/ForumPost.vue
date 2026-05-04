<template>
  <div class="forum-post-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="post-header">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <span class="author">{{ getUserNameById(post.authorId) }}</span>
          <span class="time">{{ formatTime(post.createTime) }}</span>
          <span class="views">阅读 {{ post.views }}</span>
        </div>
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
          >
            <div class="comment-header">
              <span class="comment-author">{{ getUserNameById(comment.userId) }}</span>
              <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
          </div>
        </div>
        <div v-else class="empty">
          <p>暂无评论，快来发表第一条评论吧</p>
        </div>
        
        <div class="comment-input-section">
          <el-textarea 
            v-model="commentContent" 
            placeholder="请输入评论内容"
            :rows="3"
            class="comment-input"
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
import { getForumPost, addComment } from '@/api/index'
import { getUserNameById } from '@/utils/userUtils'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const post = ref({})
const comments = ref([])
const commentContent = ref('')

onMounted(async () => {
  const id = window.location.pathname.split('/').pop()
  await loadPost(id)
})

const loadPost = async (id) => {
  try {
    const res = await getForumPost(id)
    post.value = res.data || {}
    comments.value = res.data.comments || []
  } catch (error) {
    console.error('加载帖子详情失败:', error)
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
    await addComment({
      postId: post.value.id,
      content: commentContent.value
    })
    ElMessage.success('评论成功')
    commentContent.value = ''
    await loadPost(post.value.id)
  } catch (error) {
    ElMessage.error(error.message || '评论失败')
  }
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.forum-post-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 800px;
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

.empty {
  text-align: center;
  padding: 30px;
  color: #909399;
}

.comment-input-section {
  margin-top: 20px;
}

.comment-input {
  width: 100%;
  margin-bottom: 15px;
}
</style>