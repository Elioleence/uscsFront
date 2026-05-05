<template>
  <div class="nav-container">
    <el-menu
      class="nav-menu"
      mode="horizontal"
      :default-active="activeMenu"
      :router="true"
      background-color="#ffffff"
      text-color="#303133"
      active-text-color="#409EFF"
    >
      <el-menu-item index="/">
        <span>首页</span>
      </el-menu-item>

      <el-menu-item index="/activity/list">
        <span>活动列表</span>
      </el-menu-item>

      <el-menu-item index="/club/list">
        <span>社团列表</span>
      </el-menu-item>

      <el-menu-item index="/achievement/list">
        <span>社团成果</span>
      </el-menu-item>

      <el-menu-item index="/forum/list">
        <span>交流论坛</span>
      </el-menu-item>

      <el-menu-item index="/notice/list">
        <span>系统公告</span>
      </el-menu-item>

      <el-menu-item v-if="userStore.isLoggedIn" index="/user/center">
        <span>个人中心</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const activeMenu = computed(() => {
  return route.path
})
</script>

<style scoped>
.nav-container {
  position: fixed;
  top: 36px;
  left: 0;
  right: 0;
  z-index: 1001;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  background: #fff;
}

.nav-menu {
  max-width: 1200px;
  margin: 0 auto;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: center;
}

.nav-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  padding: 0 30px;
  transition: all 0.3s;
}

.nav-menu :deep(.el-menu-item:hover) {
  background-color: #f5f7fa;
  color: #409EFF;
}

.nav-menu :deep(.el-menu-item.is-active) {
  border-bottom: 3px solid #409EFF;
  color: #409EFF;
  background-color: #ecf5ff;
}

.nav-menu :deep(.el-menu-item span) {
  font-weight: 500;
}
</style>