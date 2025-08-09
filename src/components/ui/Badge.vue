<!-- Huy hiệu (Badge) hiển thị trạng thái/ngữ nghĩa (success, warning, error...). Dùng để nhấn mạnh thông tin nhỏ. -->
<template>
  <span class="gu-badge" :class="`gu-badge--${variant}`">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'secondary',
    validator: (v) => ['secondary', 'success', 'warning', 'error', 'info', 'primary'].includes(v)
  }
})
</script>

<style scoped>
.gu-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
}

.gu-badge--secondary { background: var(--gray-100); color: var(--gray-700); }
.gu-badge--success { background: var(--primary-100); color: var(--primary-800); }
.gu-badge--warning { background: #fef3c7; color: #92400e; }
.gu-badge--error { background: #fecaca; color: #991b1b; }
.gu-badge--info { background: #dbeafe; color: #1d4ed8; }
.gu-badge--primary { background: var(--primary-100); color: var(--primary-800); }
</style>


