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
        <div class="swiper-pagination"></div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Swiper from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const carouselImages = [
  '/img/swipper1.jpg',
  '/img/swipper2.jpg',
  '/img/swipper3.jpg'
]

onMounted(() => {
  new Swiper('.mySwiper3', {
    modules: [Navigation, Pagination, Autoplay],
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    }
  })
})
</script>

<style scoped>
.swiper-container-wrapper {
  width: 100%;
  margin-top: 86px;
}

.swiper3 {
  padding: 0;
  margin: 0 auto;
  overflow: hidden;
  background: #f0f0f0;
  display: block;
  width: 100%;
  height: 400px;
}

.swiper-container {
  width: 100%;
  height: 100%;
}

.slide-img-box {
  width: 100%;
  margin: 0 auto;
  height: 400px;
}

.slide-img-box img {
  object-fit: cover;
  width: 100%;
  height: 400px;
}

.swiper-pagination {
  width: 100%;
  left: 0;
  bottom: 20px;
}

.swiper-pagination span.swiper-pagination-bullet {
  border-radius: 100%;
  margin: 0 6px;
  background: rgba(255, 255, 255, 0.7);
  display: inline-block;
  width: 10px;
  opacity: 1;
  height: 10px;
  transition: all 0.3s;
}

.swiper-pagination span.swiper-pagination-bullet:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.2);
}

.swiper-pagination span.swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: #fff;
  width: 24px;
  border-radius: 5px;
}

.swiper-button-next,
.swiper-button-prev {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.swiper-button-next {
  right: 20px;
}

.swiper-button-prev {
  left: 20px;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
  background: rgba(0, 0, 0, 0.5);
}

.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 18px;
  color: #fff;
  font-weight: bold;
}
</style>