<!-- 通用图片组件：自动识别本地/OSS，自动拼接，兜底 -->
<template>
  <img
    :src="currentSrc"
    :alt="alt"
    :class="className"
    @error="handleError"
  />
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: '图片'
  },
  className: {
    type: String,
    default: ''
  },
  defaultImg: {
    type: String,
    default: '/upload/default.png'
  }
})

const baseUrl = import.meta.env.VITE_SERVER_URL
const isError = ref(false)

const currentSrc = computed(() => {
  if (isError.value) {
    return baseUrl + props.defaultImg
  }

  // 最终图片路径
  let path = props.src?.trim() || props.defaultImg

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // 本地图片，才拼接
  return baseUrl + path
})

// 图片加载失败 → 显示默认图
const handleError = () => {
  isError.value = true
}
</script>

<style scoped>
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>