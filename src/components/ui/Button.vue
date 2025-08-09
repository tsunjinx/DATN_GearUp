<!-- Thành phần nút dùng chung (Button) cho toàn dự án. Mục đích: thống nhất kiểu dáng, trạng thái (loading/disabled), kích cỡ và biến thể. -->
<template>
  <button
    :type="type"
    class="gu-button"
    :class="[variantClass, sizeClass, { 'is-loading': loading }]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loading-spinner" aria-hidden="true"></span>
    <slot />
  </button>
  
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'outline', 'success', 'danger'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const variantClass = computed(() => `gu-button--${props.variant}`)
const sizeClass = computed(() => `gu-button--${props.size}`)
</script>

<style scoped>
.gu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  background: var(--gray-100);
  color: var(--gray-800);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
}

.gu-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.gu-button:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Variants */
.gu-button--primary {
  background: var(--primary-500);
  color: #fff;
}
.gu-button--primary:not(:disabled):hover { background: var(--primary-600); box-shadow: 0 4px 12px rgba(34,197,94,.25); }

.gu-button--secondary {
  background: var(--gray-100);
  border-color: var(--border);
  color: var(--gray-800);
}
.gu-button--secondary:not(:disabled):hover { background: var(--gray-200); }

.gu-button--outline {
  background: transparent;
  border-color: var(--primary-300);
  color: var(--primary-700);
}
.gu-button--outline:not(:disabled):hover { background: var(--primary-50); }

.gu-button--success {
  background: var(--success);
  color: #fff;
}
.gu-button--success:not(:disabled):hover { filter: brightness(0.95); }

.gu-button--danger {
  background: var(--error);
  color: #fff;
}
.gu-button--danger:not(:disabled):hover { filter: brightness(0.95); }

/* Sizes */
.gu-button--sm { padding: 0.375rem 0.75rem; font-size: 0.8125rem; }
.gu-button--md { padding: 0.5rem 1rem; font-size: 0.875rem; }
.gu-button--lg { padding: 0.625rem 1.25rem; font-size: 1rem; }

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>


