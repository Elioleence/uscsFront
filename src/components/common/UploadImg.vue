<template>
  <div>
    <!-- 🔥 地址改成：相对路径 /api/file/upload -->
    <el-upload
      action="/api/file/upload"
      :show-file-list="false"
      :on-success="handleSuccess"
      :on-error="handleError"
      accept="image/*"
    >
      <div v-if="modelValue" class="preview-box">
        <CommonImg :src="modelValue" class="preview-img" />
        <div class="mask">
          <el-icon size="24" color="#fff"><Picture /></el-icon>
          <div class="text">更换图片</div>
        </div>
      </div>

      <div v-else class="upload-box">
        <el-icon size="30" color="#ccc"><Plus /></el-icon>
        <div class="text">点击上传</div>
      </div>
    </el-upload>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Picture } from '@element-plus/icons-vue'
import CommonImg from './CommonImg.vue'

const props = defineProps({
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

// ==============================================
// ❌ 删掉这一行！！！不要用绝对地址！！！
// const uploadUrl = import.meta.env.VITE_SERVER_URL + '/file/upload'
// ==============================================

// ❌ 删掉 headers！！！
// const headers = { Authorization: ... }

const handleSuccess = (res) => {
  if (res.code === 200) {
    const url = res.data.url
    emit('update:modelValue', url)
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(res.msg || '上传失败')
  }
}

const handleError = () => {
  ElMessage.error('上传失败，请检查服务')
}
</script>

<style scoped>
.upload-box,
.preview-box {
  width: 120px;
  height: 120px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: 0.3s;
}
.preview-box:hover .mask {
  opacity: 1;
}
.text {
  font-size: 12px;
  margin-top: 4px;
}
</style>