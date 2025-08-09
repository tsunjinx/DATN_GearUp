<template>
  <span class="status-badge" :class="[variant, size, { compact: compact }]" :data-status="status">
    <span v-if="showIcon" class="status-icon">{{ statusIcon }}</span>
    <span class="status-text">{{ displayText }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'dot', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'normal',
    validator: value => ['small', 'normal', 'large'].includes(value)
  },
  compact: {
    type: Boolean,
    default: false
  },
  showIcon: {
    type: Boolean,
    default: false
  },
  customText: {
    type: String,
    default: ''
  }
})

// Status configurations
const statusConfig = {
  active: {
    text: 'Hoạt động',
    icon: '✅',
    color: 'success'
  },
  inactive: {
    text: 'Không hoạt động',
    icon: '⏸️',
    color: 'warning'
  },
  blocked: {
    text: 'Bị khóa',
    icon: '🚫',
    color: 'danger'
  },
  suspended: {
    text: 'Tạm dừng',
    icon: '⏸️',
    color: 'danger'
  },
  pending: {
    text: 'Chờ xử lý',
    icon: '⏳',
    color: 'info'
  },
  confirmed: {
    text: 'Đã xác nhận',
    icon: '✅',
    color: 'success'
  },
  shipping: {
    text: 'Đang giao',
    icon: '🚚',
    color: 'info'
  },
  completed: {
    text: 'Hoàn thành',
    icon: '✅',
    color: 'success'
  },
  cancelled: {
    text: 'Đã hủy',
    icon: '❌',
    color: 'danger'
  },
  expired: {
    text: 'Đã hết hạn',
    icon: '⏰',
    color: 'danger'
  },
  terminated: {
    text: 'Đã nghỉ việc',
    icon: '🚫',
    color: 'danger'
  },
  'low-stock': {
    text: 'Sắp hết hàng',
    icon: '⚠️',
    color: 'warning'
  }
}

const currentConfig = computed(() => {
  return (
    statusConfig[props.status] || {
      text: props.status,
      icon: '❓',
      color: 'default'
    }
  )
})

const displayText = computed(() => {
  if (props.customText) return props.customText
  return currentConfig.value.text
})

const statusIcon = computed(() => {
  return currentConfig.value.icon
})
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  border-radius: 9999px;
  transition: all 0.2s ease;
  white-space: nowrap;
  line-height: 1;
  vertical-align: middle;
}

/* Size variants */
.status-badge.small {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  min-height: 1.25rem;
}

.status-badge.normal {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  min-height: 1.5rem;
}

.status-badge.large {
  padding: 0.375rem 1rem;
  font-size: 1rem;
  min-height: 1.75rem;
}

/* Compact mode */
.status-badge.compact {
  padding: 0.125rem 0.375rem;
  font-size: 0.625rem;
  min-height: 1rem;
}

.status-badge.compact .status-icon {
  font-size: 0.75rem;
}

/* Color schemes */
.status-badge[data-status='active'],
.status-badge[data-status='confirmed'],
.status-badge[data-status='completed'] {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-badge[data-status='inactive'],
.status-badge[data-status='pending'],
.status-badge[data-status='low-stock'] {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.status-badge[data-status='blocked'],
.status-badge[data-status='suspended'],
.status-badge[data-status='cancelled'],
.status-badge[data-status='expired'],
.status-badge[data-status='terminated'] {
  background: #fecaca;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.status-badge[data-status='shipping'] {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

/* Variant styles */
.status-badge.dot {
  position: relative;
  padding-left: 1rem;
}

.status-badge.dot::before {
  content: '';
  position: absolute;
  left: 0.375rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background: currentColor;
}

.status-badge.outline {
  background: transparent;
  border-width: 1px;
  border-style: solid;
}

.status-badge.outline[data-status='active'],
.status-badge.outline[data-status='confirmed'],
.status-badge.outline[data-status='completed'] {
  border-color: #22c55e;
  color: #22c55e;
}

.status-badge.outline[data-status='inactive'],
.status-badge.outline[data-status='pending'],
.status-badge.outline[data-status='low-stock'] {
  border-color: #f59e0b;
  color: #f59e0b;
}

.status-badge.outline[data-status='blocked'],
.status-badge.outline[data-status='suspended'],
.status-badge.outline[data-status='cancelled'],
.status-badge.outline[data-status='expired'],
.status-badge.outline[data-status='terminated'] {
  border-color: #ef4444;
  color: #ef4444;
}

.status-badge.outline[data-status='shipping'] {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Responsive behavior */
@media (max-width: 768px) {
  .status-badge.normal {
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    min-height: 1.25rem;
  }

  .status-badge.large {
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    min-height: 1.5rem;
  }
}

@media (max-width: 480px) {
  .status-badge.normal {
    padding: 0.125rem 0.375rem;
    font-size: 0.6875rem;
    min-height: 1.125rem;
  }

  .status-badge.large {
    padding: 0.125rem 0.5rem;
    font-size: 0.75rem;
    min-height: 1.25rem;
  }

  .status-badge.small {
    padding: 0.0625rem 0.25rem;
    font-size: 0.625rem;
    min-height: 1rem;
  }
}

/* Hover effects for interactive badges */
.status-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Focus states for accessibility */
.status-badge:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Animation for status changes */
.status-badge {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
