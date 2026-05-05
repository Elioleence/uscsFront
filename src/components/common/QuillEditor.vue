<template>
  <div class="quill-editor-wrapper">
    <QuillEditor
      ref="quillEditor"
      v-model:content="content"
      contentType="html"
      :theme="theme"
      :toolbar="toolbarOptions"
      :placeholder="placeholder"
      @update:content="onContentChange"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  theme: {
    type: String,
    default: 'snow'
  },
  height: {
    type: String,
    default: '300px'
  }
})

const emit = defineEmits(['update:modelValue'])

const quillEditor = ref(null)
const content = ref(props.modelValue)

// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  ['blockquote', 'code-block'], // 引用 代码块
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ indent: '-1' }, { indent: '+1' }], // 缩进
  [{ header: [1, 2, 3, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、背景颜色
  [{ align: [] }], // 对齐方式
  ['link', 'image'], // 链接、图片
  ['clean'] // 清除格式
]

const onContentChange = (val) => {
  emit('update:modelValue', val)
}

watch(() => props.modelValue, (val) => {
  if (val !== content.value) {
    content.value = val
  }
})
</script>

<style scoped>
.quill-editor-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.quill-editor-wrapper :deep(.ql-editor) {
  min-height: v-bind(height);
  font-size: 14px;
}

.quill-editor-wrapper :deep(.ql-editor.ql-blank::before) {
  color: #909399;
}
</style>
