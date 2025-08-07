# 🛠️ DATN_GearUp - Implementation Checklist

## 🚀 Week 1-2: Immediate Actions

### ✅ Step 1: Development Environment Setup

#### Install Essential Packages
```bash
# Core Vue ecosystem enhancements
npm install @vueuse/core @vueuse/head
npm install vee-validate @vee-validate/rules
npm install vue-toastification
npm install @headlessui/vue @heroicons/vue

# State management & routing enhancements
npm install pinia-plugin-persistedstate

# Development tools
npm install -D vitest @vue/test-utils
npm install -D @typescript-eslint/parser
npm install -D eslint-plugin-vue-a11y
npm install -D cypress

# UI & styling (choose one)
npm install tailwindcss @tailwindcss/forms @tailwindcss/typography
# OR
npm install vuetify
```

#### Update package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "e2e": "cypress open",
    "lint": "eslint . --ext .vue,.js,.ts",
    "lint:fix": "eslint . --ext .vue,.js,.ts --fix"
  }
}
```

### ✅ Step 2: Project Structure Enhancement

#### Create Enhanced Directory Structure
```bash
mkdir -p src/{admin,customer,shared}/{components,views,stores,services,composables}
mkdir -p src/shared/{utils,constants,types}
mkdir -p tests/{unit,integration,e2e}
mkdir -p docs
```

#### Updated src/ Structure
```
src/
├── admin/                    # Admin dashboard (existing)
│   ├── components/
│   ├── views/               ✅ (exists)
│   ├── stores/              ✅ (exists) 
│   ├── services/            ✅ (exists)
│   ├── composables/         ✅ (exists)
│   └── router/
├── customer/                # Customer e-commerce (new)
│   ├── components/
│   │   ├── common/
│   │   ├── product/
│   │   ├── cart/
│   │   └── checkout/
│   ├── views/
│   ├── stores/
│   ├── services/
│   └── router/
├── shared/                  # Shared resources
│   ├── components/
│   │   ├── ui/              ✅ (exists)
│   │   └── forms/
│   ├── services/
│   ├── composables/
│   ├── utils/               ✅ (exists)
│   ├── constants/
│   └── types/
└── main.js                  ✅ (exists)
```

### ✅ Step 3: Enhanced API Service Layer

#### Create Base API Service
```javascript
// src/shared/services/apiClient.js
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'vue-toastification'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        await authStore.refreshToken()
        // Retry original request
        return apiClient.request(error.config)
      } catch (refreshError) {
        authStore.logout()
        toast.error('Session expired. Please login again.')
        return Promise.reject(refreshError)
      }
    }
    
    // Handle other errors
    const message = error.response?.data?.message || 'An error occurred'
    toast.error(message)
    
    return Promise.reject(error)
  }
)

export default apiClient
```

#### Enhanced Product Service
```javascript
// src/shared/services/productService.js
import apiClient from './apiClient'

export class ProductService {
  // Get products with advanced filtering
  async getProducts(params = {}) {
    const response = await apiClient.get('/products', { params })
    return response.data
  }
  
  // Get single product with variants
  async getProduct(id) {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  }
  
  // Create product with variants
  async createProduct(productData) {
    const response = await apiClient.post('/products', productData)
    return response.data
  }
  
  // Update product
  async updateProduct(id, productData) {
    const response = await apiClient.put(`/products/${id}`, productData)
    return response.data
  }
  
  // Delete product
  async deleteProduct(id) {
    const response = await apiClient.delete(`/products/${id}`)
    return response.data
  }
  
  // Bulk operations
  async bulkUpdateProducts(products) {
    const response = await apiClient.patch('/products/bulk', { products })
    return response.data
  }
  
  // Upload product images
  async uploadImages(productId, files) {
    const formData = new FormData()
    files.forEach(file => formData.append('images[]', file))
    
    const response = await apiClient.post(
      `/products/${productId}/images`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response.data
  }
  
  // Search products
  async searchProducts(query, filters = {}) {
    const params = { q: query, ...filters }
    const response = await apiClient.get('/products/search', { params })
    return response.data
  }
}

export const productService = new ProductService()
```

### ✅ Step 4: Enhanced State Management

#### Create Auth Store with Persistence
```javascript
// src/shared/stores/authStore.js
import { defineStore } from 'pinia'
import apiClient from '@/shared/services/apiClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    permissions: [],
    loading: false
  }),
  
  getters: {
    userRole: (state) => state.user?.user_type,
    hasPermission: (state) => (permission) => {
      return state.permissions.includes(permission)
    },
    isAdmin: (state) => state.user?.user_type === 'admin',
    isEmployee: (state) => ['admin', 'manager', 'staff'].includes(state.user?.user_type)
  },
  
  actions: {
    async login(credentials) {
      this.loading = true
      try {
        const response = await apiClient.post('/auth/login', credentials)
        const { user, token, refresh_token, permissions } = response.data
        
        this.user = user
        this.token = token
        this.refreshToken = refresh_token
        this.permissions = permissions
        this.isAuthenticated = true
        
        // Store in localStorage for persistence
        localStorage.setItem('auth_token', token)
        localStorage.setItem('refresh_token', refresh_token)
        
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async refreshToken() {
      if (!this.refreshToken) throw new Error('No refresh token available')
      
      const response = await apiClient.post('/auth/refresh', {
        refresh_token: this.refreshToken
      })
      
      const { token, refresh_token } = response.data
      this.token = token
      this.refreshToken = refresh_token
      
      localStorage.setItem('auth_token', token)
      localStorage.setItem('refresh_token', refresh_token)
      
      return response.data
    },
    
    async logout() {
      try {
        await apiClient.post('/auth/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.refreshToken = null
        this.isAuthenticated = false
        this.permissions = []
        
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
      }
    },
    
    async getCurrentUser() {
      if (!this.token) return null
      
      try {
        const response = await apiClient.get('/auth/me')
        this.user = response.data.user
        this.permissions = response.data.permissions
        this.isAuthenticated = true
        return response.data
      } catch (error) {
        this.logout()
        throw error
      }
    },
    
    // Initialize auth state from localStorage
    initializeAuth() {
      const token = localStorage.getItem('auth_token')
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (token && refreshToken) {
        this.token = token
        this.refreshToken = refreshToken
        // Verify token by getting current user
        this.getCurrentUser().catch(() => {
          this.logout()
        })
      }
    }
  },
  
  persist: {
    key: 'datn-gearup-auth',
    storage: localStorage,
    paths: ['user', 'isAuthenticated', 'permissions']
  }
})
```

#### Enhanced Product Store
```javascript
// src/admin/stores/productStore.js
import { defineStore } from 'pinia'
import { productService } from '@/shared/services/productService'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    selectedProduct: null,
    categories: [],
    brands: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    },
    filters: {
      search: '',
      category: '',
      brand: '',
      status: '',
      priceRange: [0, 10000000]
    }
  }),
  
  getters: {
    filteredProducts: (state) => {
      let filtered = state.products
      
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(search) ||
          product.code.toLowerCase().includes(search)
        )
      }
      
      if (state.filters.category) {
        filtered = filtered.filter(product => 
          product.category_id === state.filters.category
        )
      }
      
      if (state.filters.brand) {
        filtered = filtered.filter(product => 
          product.brand_id === state.filters.brand
        )
      }
      
      if (state.filters.status) {
        filtered = filtered.filter(product => 
          product.status === state.filters.status
        )
      }
      
      return filtered
    },
    
    lowStockProducts: (state) => {
      return state.products.filter(product => 
        product.stock_quantity <= product.min_stock_level
      )
    },
    
    productById: (state) => (id) => {
      return state.products.find(product => product.id === id)
    }
  },
  
  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      try {
        const response = await productService.getProducts({
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.filters,
          ...params
        })
        
        this.products = response.data
        this.pagination = {
          page: response.current_page,
          limit: response.per_page,
          total: response.total,
          totalPages: response.last_page
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async fetchProduct(id) {
      this.loading = true
      try {
        const response = await productService.getProduct(id)
        this.selectedProduct = response.data
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async createProduct(productData) {
      this.loading = true
      try {
        const response = await productService.createProduct(productData)
        this.products.unshift(response.data)
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async updateProduct(id, productData) {
      this.loading = true
      try {
        const response = await productService.updateProduct(id, productData)
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        return response.data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    async deleteProduct(id) {
      this.loading = true
      try {
        await productService.deleteProduct(id)
        this.products = this.products.filter(p => p.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // Filter actions
    setFilter(key, value) {
      this.filters[key] = value
    },
    
    resetFilters() {
      this.filters = {
        search: '',
        category: '',
        brand: '',
        status: '',
        priceRange: [0, 10000000]
      }
    },
    
    // Pagination actions
    setPage(page) {
      this.pagination.page = page
      this.fetchProducts()
    },
    
    setLimit(limit) {
      this.pagination.limit = limit
      this.pagination.page = 1
      this.fetchProducts()
    }
  }
})
```

### ✅ Step 5: Enhanced Components with Composition API

#### Create Reusable DataTable Component
```vue
<!-- src/shared/components/ui/DataTable.vue -->
<template>
  <div class="data-table">
    <!-- Search and Filters -->
    <div class="table-header">
      <div class="search-section">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="search-input"
          @input="debouncedSearch"
        />
      </div>
      
      <div class="actions-section">
        <slot name="actions" />
      </div>
    </div>
    
    <!-- Table -->
    <div class="table-container" :class="{ 'loading': loading }">
      <table class="table">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="column.class"
              @click="column.sortable && sort(column.key)"
            >
              {{ column.title }}
              <span v-if="column.sortable" class="sort-icon">
                {{ getSortIcon(column.key) }}
              </span>
            </th>
            <th v-if="$slots.actions" class="actions-column">Actions</th>
          </tr>
        </thead>
        
        <tbody>
          <tr
            v-for="item in paginatedData"
            :key="item.id"
            @click="$emit('row-click', item)"
            class="table-row"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="column.class"
            >
              <slot
                :name="column.key"
                :item="item"
                :value="getNestedValue(item, column.key)"
              >
                {{ formatValue(getNestedValue(item, column.key), column) }}
              </slot>
            </td>
            
            <td v-if="$slots.actions" class="actions-cell">
              <slot name="actions" :item="item" />
            </td>
          </tr>
          
          <!-- Empty state -->
          <tr v-if="paginatedData.length === 0 && !loading">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="empty-state">
              <slot name="empty">
                <div class="empty-message">
                  <span class="empty-icon">📦</span>
                  <p>No data available</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Loading overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner" />
      </div>
    </div>
    
    <!-- Pagination -->
    <div v-if="showPagination && totalPages > 1" class="pagination">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        Previous
      </button>
      
      <div class="pagination-pages">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['pagination-btn', { active: page === currentPage }]"
          :disabled="page === '...'"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { debounce } from '@/shared/utils/helpers'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  showPagination: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['row-click', 'sort', 'search'])

// Reactive state
const searchQuery = ref('')
const sortKey = ref('')
const sortOrder = ref('asc')
const currentPage = ref(1)

// Computed properties
const filteredData = computed(() => {
  if (!searchQuery.value) return props.data
  
  const query = searchQuery.value.toLowerCase()
  return props.data.filter(item =>
    props.columns.some(column => {
      const value = getNestedValue(item, column.key)
      return String(value).toLowerCase().includes(query)
    })
  )
})

const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value
  
  return [...filteredData.value].sort((a, b) => {
    const aVal = getNestedValue(a, sortKey.value)
    const bVal = getNestedValue(b, sortKey.value)
    
    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const totalPages = computed(() => 
  Math.ceil(sortedData.value.length / props.itemsPerPage)
)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return sortedData.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...', total)
    }
  }
  
  return pages
})

// Methods
const getNestedValue = (obj, key) => {
  return key.split('.').reduce((o, k) => o?.[k], obj)
}

const formatValue = (value, column) => {
  if (column.format && typeof column.format === 'function') {
    return column.format(value)
  }
  return value
}

const sort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  emit('sort', { key, order: sortOrder.value })
}

const getSortIcon = (key) => {
  if (sortKey.value !== key) return '↕️'
  return sortOrder.value === 'asc' ? '⬆️' : '⬇️'
}

const debouncedSearch = debounce(() => {
  emit('search', searchQuery.value)
  currentPage.value = 1
}, 300)

const goToPage = (page) => {
  if (page !== '...' && page !== currentPage.value) {
    currentPage.value = page
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Watchers
watch(() => props.data, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.data-table {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.table-header {
  @apply flex justify-between items-center p-4 border-b border-gray-200;
}

.search-input {
  @apply px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none;
  min-width: 300px;
}

.table-container {
  @apply relative overflow-x-auto;
}

.table {
  @apply w-full;
}

.table th {
  @apply bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer;
}

.table td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200;
}

.table-row {
  @apply hover:bg-gray-50 transition-colors duration-150 cursor-pointer;
}

.actions-column {
  @apply w-32;
}

.actions-cell {
  @apply text-right;
}

.sort-icon {
  @apply ml-2 text-gray-400;
}

.empty-state {
  @apply text-center py-12;
}

.empty-message {
  @apply flex flex-col items-center text-gray-500;
}

.empty-icon {
  @apply text-4xl mb-2;
}

.loading-overlay {
  @apply absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center;
}

.loading-spinner {
  @apply animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500;
}

.pagination {
  @apply flex items-center justify-between px-4 py-3 border-t border-gray-200;
}

.pagination-pages {
  @apply flex space-x-1;
}

.pagination-btn {
  @apply px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.pagination-btn.active {
  @apply bg-blue-500 text-white border-blue-500;
}
</style>
```

### ✅ Step 6: Environment Configuration

#### Create Environment Files
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=DATN GearUp
VITE_APP_ENV=development
VITE_DEBUG=true

# .env.production
VITE_API_BASE_URL=https://api.gearup.com/api
VITE_APP_NAME=DATN GearUp
VITE_APP_ENV=production
VITE_DEBUG=false
```

### ✅ Step 7: Testing Setup

#### Create Test Configuration
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

```javascript
// tests/setup.js
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/',
    name: 'Home'
  })
}))

// Global test configuration
config.global = {
  plugins: [],
  stubs: {
    // Add component stubs if needed
  }
}
```

#### Example Component Test
```javascript
// tests/unit/components/DataTable.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DataTable from '@/shared/components/ui/DataTable.vue'

describe('DataTable', () => {
  const mockData = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 }
  ]
  
  const mockColumns = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'price', title: 'Price', sortable: true }
  ]
  
  it('renders data correctly', () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockData,
        columns: mockColumns
      }
    })
    
    expect(wrapper.text()).toContain('Product 1')
    expect(wrapper.text()).toContain('Product 2')
  })
  
  it('filters data when searching', async () => {
    const wrapper = mount(DataTable, {
      props: {
        data: mockData,
        columns: mockColumns
      }
    })
    
    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('Product 1')
    
    expect(wrapper.text()).toContain('Product 1')
    expect(wrapper.text()).not.toContain('Product 2')
  })
})
```

## 📋 Implementation Priority Queue

### 🔥 High Priority (Complete First)
1. ✅ Environment setup and package installation
2. ✅ Enhanced API service layer with error handling
3. ✅ Authentication store with token management
4. ✅ Enhanced product store with filtering
5. ✅ Reusable DataTable component
6. ✅ Testing framework setup

### ⚡ Medium Priority (Next 2 Weeks)
1. Real-time WebSocket integration
2. Customer e-commerce architecture
3. Shopping cart functionality
4. Payment gateway integration
5. Mobile PWA optimization

### 💎 Nice to Have (Later Phases)
1. Advanced analytics dashboard
2. AI-powered recommendations
3. Multi-language support
4. Native mobile app
5. Advanced SEO optimization

## 🚨 Common Pitfalls to Avoid

1. **Not implementing proper error handling** - Always wrap API calls in try-catch
2. **Skipping authentication state persistence** - Users expect to stay logged in
3. **Ignoring loading states** - Provide feedback for all async operations
4. **Not testing components** - Write tests as you develop
5. **Hardcoding API endpoints** - Use environment variables
6. **Missing accessibility features** - Consider screen readers and keyboard navigation
7. **Not optimizing bundle size** - Use code splitting and lazy loading

Start with Step 1 and work through each section systematically. This will give you a solid foundation for completing your DATN_GearUp project successfully! 🚀
