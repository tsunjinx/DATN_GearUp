<template>
  <div class="gearup-logo" :class="variant">
    <img 
      :src="logoSrc" 
      alt="GearUp Logo" 
      :class="logoClass"
      :style="logoStyle"
    />
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
  } else {
    // Make logo slightly larger by default
    const sizeMultiplier = 1.2
    if (props.variant === 'small') {
      style.width = `${100 * sizeMultiplier}px`
    } else if (props.variant === 'default') {
      style.width = `${180 * sizeMultiplier}px`
    } else if (props.variant === 'large') {
      style.width = `${240 * sizeMultiplier}px`
    }
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
  width: 180px;
}

.logo-small {
  width: 100px;
}

.logo-large {
  width: 240px;
}

.logo-white {
  filter: brightness(0) invert(1);
}
</style>
