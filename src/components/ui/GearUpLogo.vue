<template>
  <div class="gearup-logo" :class="variant">
    <img 
      :src="logoSrc" 
      alt="GearUp Logo" 
      :class="logoClass"
      :style="logoStyle"
    />
    <span v-if="showText" class="logo-text">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import logoSrc from '@/assets/logo.svg'

const props = defineProps({
  variant: {
    type: String,
    default: 'default', // 'default', 'white', 'small', 'large'
    validator: (value) => ['default', 'white', 'small', 'large'].includes(value)
  },
  showText: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: 'Admin'
  },
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  }
})

const logoClass = computed(() => {
  return {
    'logo-image': true,
    [`logo-${props.variant}`]: true
  }
})

const logoStyle = computed(() => {
  const style = {}
  if (props.width) {
    style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  return style
})
</script>

<style scoped>
.gearup-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gearup-logo.small {
  flex-direction: row;
}

.gearup-logo.default,
.gearup-logo.large {
  flex-direction: column;
  text-align: center;
}

.logo-image {
  height: auto;
  transition: all 0.3s ease;
}

.logo-default {
  width: 140px;
}

.logo-small {
  width: 80px;
}

.logo-large {
  width: 200px;
}

.logo-white {
  filter: brightness(0) invert(1);
}

.logo-text {
  font-weight: 600;
  color: inherit;
}

.small .logo-text {
  font-size: 14px;
}

.default .logo-text {
  font-size: 16px;
}

.large .logo-text {
  font-size: 20px;
}
</style>
