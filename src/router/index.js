import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/index',
    redirect: '/'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/activity/list',
    name: 'ActivityList',
    component: () => import('@/views/activity/ActivityList.vue')
  },
  {
    path: '/activity/detail/:id',
    name: 'ActivityDetail',
    component: () => import('@/views/activity/ActivityDetail.vue')
  },
  {
    path: '/club/list',
    name: 'ClubList',
    component: () => import('@/views/club/ClubList.vue')
  },
  {
    path: '/club/detail/:id',
    name: 'ClubDetail',
    component: () => import('@/views/club/ClubDetail.vue')
  },
  {
    path: '/achievement/list',
    name: 'AchievementList',
    component: () => import('@/views/achievement/AchievementList.vue')
  },
  {
    path: '/achievement/detail/:id',
    name: 'AchievementDetail',
    component: () => import('@/views/achievement/AchievementDetail.vue')
  },
  {
    path: '/forum/list',
    name: 'ForumList',
    component: () => import('@/views/forum/ForumList.vue')
  },
  {
    path: '/forum/post/:id',
    name: 'ForumPost',
    component: () => import('@/views/forum/ForumPost.vue')
  },
  {
    path: '/forum/create',
    name: 'ForumCreate',
    component: () => import('@/views/forum/ForumCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/center',
    name: 'UserCenter',
    component: () => import('@/views/user/UserCenter.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/edit',
    name: 'UserEdit',
    component: () => import('@/views/user/UserEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notice/list',
    name: 'NoticeList',
    component: () => import('@/views/notice/NoticeList.vue')
  },
  {
    path: '/notice/detail/:id',
    name: 'NoticeDetail',
    component: () => import('@/views/notice/NoticeDetail.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    next('/login')
  } else {
    next()
  }
})

export default router