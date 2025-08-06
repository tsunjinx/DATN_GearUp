# 🎨 GearUp Logo Implementation Guide

## Current Implementation
The GearUpLogo component is already image-ready and located at `src/components/ui/GearUpLogo.vue`.

## Quick Logo Updates

### Option 1: Static Logo Replacement
1. Save your logo file as: `src/assets/logo.svg` (or .png, .jpg)
2. Update the import in GearUpLogo.vue:
```javascript
// Change this line in the component
import logoSrc from '@/assets/your-new-logo.png'
```

### Option 2: Dynamic Logo from Backend
When your backend is ready, modify GearUpLogo.vue:

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore' // You'll create this

const settingsStore = useSettingsStore()

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'white', 'small', 'large'].includes(value)
  },
  width: { type: [String, Number], default: null },
  height: { type: [String, Number], default: null }
})

// Dynamic logo source from backend/settings
const logoSrc = computed(() => {
  return settingsStore.companyLogo || '/fallback-logo.svg'
})

onMounted(() => {
  // Load company settings including logo
  settingsStore.loadSettings()
})
</script>
```

### Option 3: Multiple Logo Variants
For different themes/contexts:

```vue
<script setup>
const logoVariants = {
  light: '/assets/logo-light.svg',
  dark: '/assets/logo-dark.svg',
  white: '/assets/logo-white.svg',
  color: '/assets/logo-color.svg'
}

const logoSrc = computed(() => {
  return logoVariants[props.variant] || logoVariants.color
})
</script>
```

## Usage Examples

### Current Usage (Already Working)
```vue
<!-- In AdminLayout.vue -->
<GearUpLogo variant="small" />

<!-- In headers -->
<GearUpLogo variant="default" />

<!-- Custom sizing -->
<GearUpLogo :width="200" :height="60" />
```

### Future Backend Integration
```vue
<!-- Will automatically load from settings -->
<GearUpLogo variant="small" />

<!-- With fallback -->
<GearUpLogo 
  variant="default" 
  :fallback-src="/default-logo.svg"
/>
```

## Settings Store Example (For Backend Integration)

Create `src/stores/settingsStore.js`:

```javascript
import { defineStore } from 'pinia'
import { settingsService } from '@/services/settingsService'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    companyInfo: {
      name: 'GearUp',
      logo: null,
      logoWhite: null,
      logoDark: null
    },
    isLoading: false
  }),
  
  getters: {
    companyLogo: (state) => state.companyInfo.logo,
    companyLogoWhite: (state) => state.companyInfo.logoWhite,
    companyLogoDark: (state) => state.companyInfo.logoDark
  },
  
  actions: {
    async loadSettings() {
      this.isLoading = true
      try {
        const settings = await settingsService.getCompanySettings()
        this.companyInfo = settings
      } catch (error) {
        console.error('Failed to load company settings:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    async updateLogo(logoFile) {
      try {
        const response = await settingsService.uploadLogo(logoFile)
        this.companyInfo.logo = response.logoUrl
        return response
      } catch (error) {
        console.error('Failed to update logo:', error)
        throw error
      }
    }
  }
})
```

## Logo File Formats Supported
- ✅ SVG (recommended - scalable)
- ✅ PNG (with transparency)
- ✅ JPG/JPEG
- ✅ WebP (modern format)

## Recommended Logo Specs
- **Format**: SVG or PNG with transparency
- **Dimensions**: 200x60px (ratio 10:3)
- **File Size**: < 50KB for optimal loading
- **Colors**: Include both light and dark variants

## Ready for Backend Integration
The component is already structured to easily accept:
- Dynamic logo URLs from API
- Multiple logo variants (light/dark themes)
- Custom sizing and styling
- Fallback images
- Loading states

Simply update the `logoSrc` import when your backend is ready!
