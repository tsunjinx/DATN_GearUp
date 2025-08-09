<!-- Khối trạng thái dùng chung: loading / error / empty -->
<template>
  <div class="state" :class="type">
    <div class="icon" aria-hidden="true">{{ icon }}</div>
    <div class="message">{{ messageToShow }}</div>
    <div v-if="$slots.action" class="action"><slot name="action" /></div>
  </div>
  
</template>

<script setup>
import { computed } from 'vue'
// Props
const props = defineProps({
  // 'loading' | 'error' | 'empty'
  type: { type: String, default: 'empty' },
  message: { type: String, default: '' }
})

// Derived
const icon = computed(() => {
  if (props.type === 'loading') return '⏳'
  if (props.type === 'error') return '⚠️'
  return '📦'
})

const messageToShow = computed(() => {
  if (props.message) return props.message
  if (props.type === 'loading') return 'Đang tải...'
  if (props.type === 'error') return 'Đã xảy ra lỗi'
  return 'Không có dữ liệu'
})
</script>

<style scoped>
.state { text-align:center; color: var(--gray-600); padding: var(--spacing-lg) }
.icon { font-size: 32px; margin-bottom: 8px }
.message { font-weight: 600 }
.action { margin-top: var(--spacing-sm) }
</style>


