<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="error-icon">404</div>
      <h1>页面未找到</h1>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
const goHome = () => {
  window.location.href = '/'
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
}

.not-found-container {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 80px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 10px;
}

p {
  color: #909399;
  margin-bottom: 30px;
}

.el-button {
  padding: 10px 30px;
  font-size: 16px;
}
</style>