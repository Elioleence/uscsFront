<template>
  <div class="forum-list-page">
    <header-component />
    <sidebar-component />

    <div class="content">
      <div class="search-bar">
        <el-input 
          v-model="keyword" 
          placeholder="请输入帖子标题搜索"
          class="search-input"
          @keyup.enter="loadForumList"
        >
          <template #append>
            <el-button @click="loadForumList">搜索</el-button>
          </template>
        </el-input>
        <el-button type="primary" @click="goCreate">发布帖子</el-button>
      </div>
      
      <div class="forum-stats">
        <span>共 {{ total }} 条帖子</span>
      </div>
      
      <div class="forum-list">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="forum-item"
          @click="goPost(post.id)"
        >
          <div class="forum-content">
            <h3>{{ post.title }}</h3>
            <p class="forum-desc">{{ stripHtml(post.content) }}</p>
            <div class="forum-meta">
              <!-- {{ post }} -->
              <span class="author">{{ post.realName || getUserNameById(post.userId) }}</span>
              <span class="time">{{ formatTime(post.createTime) }}</span>
              <!-- <span class="views">阅读 {{ post.views }}</span> -->
              <!-- <span class="replies">评论 {{ post.replyCount }}</span> -->
            </div>
          </div>
          <div class="forum-image" v-if="post.img">
            <img :src="formatImageUrl(post.img)" alt="封面">
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
import { getPostList } from '@/api/index'
import { getUserNameById } from '@/utils/userUtils'
import { formatImageUrl } from '@/utils/imageUtils'

const router = useRouter()

const keyword = ref('')
const posts = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

onMounted(() => {
  loadForumList()
})

const loadForumList = async () => {
  try {
    const res = await getPostList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      keyword: keyword.value
    })
    posts.value = res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    console.error('加载论坛列表失败:', error)
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadForumList()
}

const goPost = (id) => {
  window.location.href = `/forum/post/${id}`
}

const goCreate = () => {
  router.push('/forum/create')
}

// 去除HTML标签
const stripHtml = (html) => {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.forum-list-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 106px;
}

.search-bar {
  margin-bottom: 15px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.forum-stats {
  margin-bottom: 15px;
  font-size: 14px;
  color: #909399;
}

.forum-list {
  margin-bottom: 30px;
}

.forum-item {
  display: flex;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.forum-item:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.forum-content {
  flex: 1;
}

.forum-content h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #303133;
}

.forum-desc {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.forum-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
}

.author {
  color: #409EFF;
}

.time {
  color: #909399;
}

.views, .replies {
  color: #909399;
}

.forum-image {
  width: 120px;
  flex-shrink: 0;
}

.forum-image img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.pagination {
  text-align: center;
}
</style>