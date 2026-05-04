<template>
  <div class="swiper-container-wrapper">
    <div class="swiper3">
      <div class="swiper-container mySwiper3">
        <div class="swiper-wrapper">
          <div
            class="swiper-slide"
            v-for="(img, index) in carouselImages"
            :key="index"
          >
            <div class="slide-img-box">
              <img :src="img" alt="轮播图片" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Swiper from 'swiper'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const carouselImages = [
  '/img/swipper1.jpg',
  '/img/swipper2.jpg',
  '/img/swipper3.jpg'
]

onMounted(() => {
  new Swiper('.mySwiper3', {
    modules: [Autoplay],
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    }
  })
})
</script>

<style scoped>
/* ========== 轮播容器高度 你可以自由调 ========== */
.mySwiper3 {
  width: 100%;
  height: 560px; /* 👈 想多高就多高，不用800px！ */
  overflow: hidden;
  border-radius: 12px;
  margin: 0 auto;
  background: #f5f5f5; /* 图片没铺满的地方用浅灰底色，非常好看 */
}

/* ========== 核心：让图片完整显示、等比缩放、不变形 ========== */
.slide-img-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-img-box img {
  width: 100%;
  height: auto;    /* 自动等高，等比缩小 */
  max-height: 100%;/* 不超出容器 */
  object-fit: cover; /* 👈 关键：完整显示图片，不裁切 */
}

/* 顶部间距 */
.swiper-container-wrapper {
  margin-top: 90px;
  width: 100%;
}
</style>