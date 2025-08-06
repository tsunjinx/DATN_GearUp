# GearUp Vue.js Project Rules & Guidelines

## 🎯 Project Overview
GearUp is a sports shoe e-commerce website built with Vue.js 3 + Composition API, Pinia state management, and Vue Router 4.

## 📋 Core Development Principles

### 1. Vue.js Composition API Standards

#### ✅ REQUIRED PRACTICES:
- **Use `<script setup>`** for all components
- **Group related reactive data** in a single ref object instead of multiple separate refs
- **Use computed properties** for derived state instead of watchers
- **Name functions by business logic** (createProduct, updateOrderStatus, loadCustomers)
- **Limit to maximum 5-7 functions** per component
- **Extract reusable logic** into composables

```vue
<!-- ✅ GOOD EXAMPLE -->
<script setup>
import { ref, computed } from 'vue'

const formState = ref({
  product: {
    name: '',
    price: 0,
    category: ''
  },
  isSubmitting: false,
  errors: {}
})

const isValidForm = computed(() => {
  return formState.value.product.name && 
         formState.value.product.price > 0
})

const saveProduct = async () => {
  // Single responsibility function
  formState.value.isSubmitting = true
  // Save logic here
}
</script>
```

#### ❌ AVOID:
- **Creating too many separate refs** - group related data together
- **Writing functions longer than 30 lines** - break them down
- **Mixing Options API with Composition API** - stick to Composition API
- **Using watchers when computed would work** - prefer computed for derived state

### 2. Component Architecture Standards

#### Template Structure (Required Order):
```vue
<template>
  <!-- 1. Page Header Section -->
  <header class="page-header">
    <h1>{{ pageTitle }}</h1>
    <nav class="header-actions">
      <button @click="openCreateModal" class="btn-primary">
        Add New
      </button>
    </nav>
  </header>
  
  <!-- 2. Search & Filter Controls -->
  <section class="filters-section">
    <input v-model="searchQuery" placeholder="Search..." />
    <select v-model="selectedFilter">
      <option value="">All Categories</option>
    </select>
  </section>
  
  <!-- 3. Main Content Area -->
  <main class="main-content">
    <!-- Data Display: Table, Grid, or List -->
    <div v-if="isLoading" class="loading-state">Loading...</div>
    <div v-else-if="hasError" class="error-state">{{ errorMessage }}</div>
    <div v-else class="content-grid">
      <!-- Content here -->
    </div>
  </main>
  
  <!-- 4. Modals & Overlays (Always Last) -->
  <teleport to="body">
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <!-- Modal content -->
      </div>
    </div>
  </teleport>
</template>
```

#### Script Organization (Required Order):
```vue
<script setup>
// 1. Vue & External Imports
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// 2. Internal Imports (Stores, Services, Composables)
import { useProductStore } from '@/stores/productStore'
import { productService } from '@/services/productService'
import { useForm } from '@/composables/useForm'

// 3. Props & Emits Definition
const props = defineProps({
  productId: {
    type: String,
    required: false,
    default: null
  }
})

const emit = defineEmits(['productUpdated', 'modalClosed'])

// 4. Store & Router Setup
const productStore = useProductStore()
const router = useRouter()

// 5. Reactive State (Group Related Data)
const uiState = ref({
  isLoading: false,
  hasError: false,
  errorMessage: '',
  showModal: false,
  selectedTab: 'details'
})

const formData = ref({
  name: '',
  price: 0,
  category: '',
  description: ''
})

// 6. Computed Properties
const isValidForm = computed(() => {
  return formData.value.name.trim() && 
         formData.value.price > 0 &&
         formData.value.category
})

const filteredProducts = computed(() => {
  return productStore.products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 7. Business Logic Methods (Max 5-7 functions)
const loadProducts = async () => {
  try {
    uiState.value.isLoading = true
    uiState.value.hasError = false
    await productStore.fetchProducts()
  } catch (error) {
    handleError(error, 'loading products')
  } finally {
    uiState.value.isLoading = false
  }
}

const saveProduct = async () => {
  if (!isValidForm.value) return
  
  try {
    uiState.value.isLoading = true
    const result = await productService.create(formData.value)
    emit('productUpdated', result)
    closeModal()
  } catch (error) {
    handleError(error, 'saving product')
  } finally {
    uiState.value.isLoading = false
  }
}

const openModal = () => {
  uiState.value.showModal = true
  resetForm()
}

const closeModal = () => {
  uiState.value.showModal = false
  emit('modalClosed')
}

const resetForm = () => {
  formData.value = {
    name: '',
    price: 0,
    category: '',
    description: ''
  }
}

const handleError = (error, context) => {
  console.error(`Error ${context}:`, error)
  uiState.value.hasError = true
  uiState.value.errorMessage = error.message || 'An unexpected error occurred'
}

// 8. Lifecycle Hooks
onMounted(() => {
  loadProducts()
})

// 9. Watchers (Use Sparingly)
watch(() => props.productId, (newId) => {
  if (newId) {
    loadProductDetails(newId)
  }
})
</script>
```

### 3. Function Standards & Limits

#### Component Function Limits:
- **Page Components**: Maximum 7 functions
- **Modal Components**: Maximum 5 functions  
- **UI Components**: Maximum 4 functions
- **Utility Functions**: Extract to separate files

#### Function Categories & Naming:
```javascript
// ✅ CRUD Operations (Business Logic)
const createProduct = async (productData) => {}
const updateProduct = async (id, updates) => {}
const deleteProduct = async (productId) => {}
const loadProducts = async (filters = {}) => {}

// ✅ UI State Management
const openModal = () => {}
const closeModal = () => {}
const toggleSidebar = () => {}
const resetForm = () => {}

// ✅ Data Transformation
const filterProducts = (searchTerm) => {}
const sortProducts = (sortBy, direction) => {}
const formatPrice = (amount) => {}

// ✅ Event Handlers
const handleSubmit = async (event) => {}
const handleInputChange = (field, value) => {}
const handleFileUpload = (files) => {}

// ❌ AVOID Generic Names
const doSomething = () => {}          // Too vague
const handleClick = () => {}          // Not descriptive
const update = () => {}               // Missing context
```

#### Function Length Guidelines:
- **Maximum 30 lines** per function
- **Single responsibility** - one function, one purpose
- **Extract complex logic** into helper functions or composables

### 4. State Management Architecture

#### Pinia Store Structure (Standardized):
```javascript
// stores/productStore.js
export const useProductStore = defineStore('product', {
  state: () => ({
    // Core Data
    items: [],
    currentItem: null,
    
    // UI State
    isLoading: false,
    hasError: false,
    errorMessage: '',
    
    // Pagination & Filtering
    pagination: {
      page: 1,
      limit: 20,
      total: 0
    },
    filters: {
      category: '',
      priceRange: [0, 1000],
      sortBy: 'name',
      sortDirection: 'asc'
    }
  }),
  
  getters: {
    // Maximum 5 getters per store
    totalItems: (state) => state.items.length,
    
    activeItems: (state) => state.items.filter(item => item.status === 'active'),
    
    itemById: (state) => (id) => state.items.find(item => item.id === id),
    
    isEmptyState: (state) => !state.isLoading && state.items.length === 0,
    
    formattedItems: (state) => state.items.map(item => ({
      ...item,
      formattedPrice: `$${item.price.toFixed(2)}`
    }))
  },
  
  actions: {
    // CRUD Operations (Core Business Logic)
    async fetchItems(params = {}) {
      this.isLoading = true
      this.hasError = false
      
      try {
        const response = await productService.getAll(params)
        this.items = response.data
        this.pagination.total = response.total
      } catch (error) {
        this.handleError(error)
      } finally {
        this.isLoading = false
      }
    },
    
    async createItem(itemData) {
      try {
        const newItem = await productService.create(itemData)
        this.items.unshift(newItem)
        return newItem
      } catch (error) {
        this.handleError(error)
        throw error
      }
    },
    
    async updateItem(id, updates) {
      try {
        const updatedItem = await productService.update(id, updates)
        const index = this.items.findIndex(item => item.id === id)
        if (index !== -1) {
          this.items[index] = updatedItem
        }
        return updatedItem
      } catch (error) {
        this.handleError(error)
        throw error
      }
    },
    
    async deleteItem(id) {
      try {
        await productService.delete(id)
        this.items = this.items.filter(item => item.id !== id)
      } catch (error) {
        this.handleError(error)
        throw error
      }
    },
    
    // UI State Management
    setCurrentItem(item) {
      this.currentItem = item
    },
    
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },
    
    resetFilters() {
      this.filters = {
        category: '',
        priceRange: [0, 1000],
        sortBy: 'name',
        sortDirection: 'asc'
      }
    },
    
    // Error Handling
    handleError(error) {
      this.hasError = true
      this.errorMessage = error.message || 'An unexpected error occurred'
      console.error('Store Error:', error)
    },
    
    clearError() {
      this.hasError = false
      this.errorMessage = ''
    }
  }
})
```

### 5. Project Structure & File Organization

#### Directory Structure (Enforced):
```
src/
├── components/              # Reusable UI components only
│   ├── ui/                 # Basic UI elements (Button, Input, Modal, Card)
│   │   ├── Button.vue      # Generic button component
│   │   ├── Modal.vue       # Reusable modal wrapper
│   │   └── FormInput.vue   # Form input component
│   └── shared/             # Business-specific reusable components
│       ├── ProductCard.vue # Product display card
│       └── OrderSummary.vue# Order summary component
├── composables/            # Reusable logic (one responsibility per file)
│   ├── useApi.js          # API request handling
│   ├── useAuth.js         # Authentication logic
│   ├── useForm.js         # Form validation & state
│   └── useLocalStorage.js # Local storage operations
├── layouts/               # Page layout components
│   ├── AdminLayout.vue    # Admin dashboard layout
│   └── PublicLayout.vue   # Public website layout
├── pages/                 # Page components (renamed from views)
│   ├── admin/             # Admin pages
│   │   ├── Dashboard.vue
│   │   ├── Products.vue
│   │   └── Orders.vue
│   └── public/            # Public pages
│       ├── Home.vue
│       └── ProductDetail.vue
├── services/              # API communication only
│   ├── api.js            # Base API configuration
│   ├── productService.js # Product-related API calls
│   ├── orderService.js   # Order-related API calls
│   └── userService.js    # User-related API calls
├── stores/               # Pinia state stores
│   ├── authStore.js      # Authentication state
│   ├── productStore.js   # Product management state
│   └── orderStore.js     # Order management state
└── utils/                # Pure utility functions
    ├── formatters.js     # Data formatting functions
    ├── validators.js     # Validation helpers
    └── constants.js      # Application constants
```

#### File Naming Conventions:
- **Components**: PascalCase (ProductCard.vue, OrderSummary.vue)
- **Pages**: PascalCase (Dashboard.vue, ProductDetail.vue)
- **Composables**: camelCase with 'use' prefix (useAuth.js, useForm.js)
- **Services**: camelCase with 'Service' suffix (productService.js)
- **Stores**: camelCase with 'Store' suffix (authStore.js)
- **Utils**: camelCase descriptive names (formatters.js, validators.js)

### 6. Service Layer Standards

#### API Service Structure (Single Responsibility):
```javascript
// services/productService.js
import { api } from './api'

export const productService = {
  // READ Operations
  getAll: (params = {}) => {
    return api.get('/products', { params })
  },
  
  getById: (id) => {
    return api.get(`/products/${id}`)
  },
  
  getByCategory: (category, params = {}) => {
    return api.get(`/products/category/${category}`, { params })
  },
  
  // WRITE Operations
  create: (productData) => {
    return api.post('/products', productData)
  },
  
  update: (id, updates) => {
    return api.put(`/products/${id}`, updates)
  },
  
  delete: (id) => {
    return api.delete(`/products/${id}`)
  },
  
  // BULK Operations
  bulkUpdate: (products) => {
    return api.patch('/products/bulk', { products })
  },
  
  bulkDelete: (ids) => {
    return api.delete('/products/bulk', { data: { ids } })
  }
}

// ❌ DON'T mix different resource types in one service
// ❌ DON'T add business logic in services
// ❌ DON'T handle UI state in services
```

#### Error Handling in Services:
```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Centralized error handling
    const errorMessage = error.response?.data?.message || error.message
    const statusCode = error.response?.status
    
    // Log error for debugging
    console.error('API Error:', {
      message: errorMessage,
      status: statusCode,
      url: error.config?.url
    })
    
    // Return standardized error
    return Promise.reject({
      message: errorMessage,
      status: statusCode,
      originalError: error
    })
  }
)

export { api }
```

### 7. Composables Best Practices

#### When to Create Composables:
- **Reusability**: Logic used in 2+ components
- **Testability**: Logic can be tested independently
- **Complexity**: Complex state management
- **Separation of Concerns**: Business logic separate from UI

#### Composable Structure Template:
```javascript
// composables/useProductForm.js
import { ref, computed, reactive } from 'vue'
import { productService } from '@/services/productService'

export function useProductForm(initialProduct = null) {
  // 1. Reactive State
  const formData = ref({
    name: initialProduct?.name || '',
    price: initialProduct?.price || 0,
    category: initialProduct?.category || '',
    description: initialProduct?.description || '',
    images: initialProduct?.images || []
  })
  
  const formState = ref({
    isSubmitting: false,
    hasError: false,
    errorMessage: '',
    isValid: false
  })
  
  // 2. Computed Properties
  const isValidForm = computed(() => {
    return formData.value.name.trim() && 
           formData.value.price > 0 && 
           formData.value.category
  })
  
  const hasChanges = computed(() => {
    if (!initialProduct) return true
    
    return Object.keys(formData.value).some(key => 
      formData.value[key] !== initialProduct[key]
    )
  })
  
  // 3. Methods
  const validateField = (field) => {
    const validators = {
      name: (value) => value.trim().length >= 2,
      price: (value) => value > 0,
      category: (value) => value.trim().length > 0
    }
    
    return validators[field]?.(formData.value[field]) ?? true
  }
  
  const resetForm = () => {
    formData.value = {
      name: initialProduct?.name || '',
      price: initialProduct?.price || 0,
      category: initialProduct?.category || '',
      description: initialProduct?.description || '',
      images: initialProduct?.images || []
    }
    formState.value.hasError = false
    formState.value.errorMessage = ''
  }
  
  const submitForm = async () => {
    if (!isValidForm.value) {
      formState.value.hasError = true
      formState.value.errorMessage = 'Please fill in all required fields'
      return null
    }
    
    try {
      formState.value.isSubmitting = true
      formState.value.hasError = false
      
      const result = initialProduct 
        ? await productService.update(initialProduct.id, formData.value)
        : await productService.create(formData.value)
      
      return result
    } catch (error) {
      formState.value.hasError = true
      formState.value.errorMessage = error.message
      throw error
    } finally {
      formState.value.isSubmitting = false
    }
  }
  
  // 4. Return API
  return {
    // State (readonly for external components)
    formData: readonly(formData),
    formState: readonly(formState),
    
    // Computed
    isValidForm,
    hasChanges,
    
    // Methods
    validateField,
    resetForm,
    submitForm,
    
    // Direct access for v-model binding
    updateField: (field, value) => {
      formData.value[field] = value
    }
  }
}
```

#### Composable Naming Conventions:
```javascript
// ✅ GOOD Examples
useAuth()          // Authentication logic
useApi()           // API request handling
useForm()          // Form validation & state
useLocalStorage()  // Local storage operations
useProductSearch() // Product search functionality
useOrderManagement() // Order management logic

// ❌ AVOID Generic Names
useUtils()         // Too vague
useHelpers()       // Not descriptive
useStuff()         // Meaningless
```

### 8. Performance Optimization Guidelines

#### ✅ REQUIRED Optimizations:

**1. List Rendering Optimization:**
```vue
<template>
  <!-- Use v-memo for expensive list items -->
  <div 
    v-for="product in products" 
    :key="product.id"
    v-memo="[product.id, product.price, product.status]"
    class="product-card"
  >
    <ProductCard :product="product" />
  </div>
  
  <!-- Use v-once for static content -->
  <div v-once class="static-content">
    {{ staticHelpText }}
  </div>
</template>
```

**2. Component Lazy Loading:**
```javascript
// Router lazy loading
const routes = [
  {
    path: '/products',
    component: () => import('@/pages/Products.vue')
  }
]

// Component lazy loading
const ProductModal = defineAsyncComponent(() => 
  import('@/components/modals/ProductModal.vue')
)
```

**3. Reactive Data Optimization:**
```javascript
// Use shallowRef for large objects that don't need deep reactivity
const productList = shallowRef([])

// Use markRaw for objects that should never be reactive
const chartConfig = markRaw({
  type: 'line',
  options: { /* large config object */ }
})

// Use shallowReactive for objects with only top-level reactivity
const filters = shallowReactive({
  category: '',
  priceRange: [0, 1000]
})
```

#### ❌ PERFORMANCE ANTI-PATTERNS:
- **Creating reactive objects in templates**: `{{ { name: product.name } }}`
- **Function calls in templates**: `{{ formatPrice(product.price) }}`
- **Too many watchers**: Prefer computed properties
- **Large object mutations**: Use immutable updates
- **Unnecessary re-renders**: Use proper keys and memoization

### 9. Error Handling Standards

#### Centralized Error Handling:
```javascript
// composables/useErrorHandler.js
export function useErrorHandler() {
  const handleError = (error, context = '', fallbackMessage = 'An error occurred') => {
    // Log error with context
    console.error(`Error in ${context}:`, {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
    
    // Determine user-friendly message
    const userMessage = getUserFriendlyMessage(error, fallbackMessage)
    
    // Show notification or update UI state
    showErrorNotification(userMessage)
    
    // Report to error tracking service (if implemented)
    if (import.meta.env.PROD) {
      reportError(error, context)
    }
    
    return userMessage
  }
  
  const getUserFriendlyMessage = (error, fallback) => {
    const errorMessages = {
      'Network Error': 'Please check your internet connection',
      'Request timeout': 'The request took too long. Please try again',
      '401': 'Please log in to continue',
      '403': 'You do not have permission to perform this action',
      '404': 'The requested resource was not found',
      '500': 'Server error. Please try again later'
    }
    
    return errorMessages[error.message] || 
           errorMessages[error.status] || 
           error.message || 
           fallback
  }
  
  return { handleError }
}
```

#### Component Error Handling Pattern:
```vue
<script setup>
import { useErrorHandler } from '@/composables/useErrorHandler'

const { handleError } = useErrorHandler()

const uiState = ref({
  isLoading: false,
  hasError: false,
  errorMessage: ''
})

const loadData = async () => {
  try {
    uiState.value.isLoading = true
    uiState.value.hasError = false
    uiState.value.errorMessage = ''
    
    const data = await dataService.fetchData()
    // Handle success
  } catch (error) {
    const message = handleError(error, 'loadData', 'Failed to load data')
    uiState.value.hasError = true
    uiState.value.errorMessage = message
  } finally {
    uiState.value.isLoading = false
  }
}
</script>
```

### 10. Testing Strategy & Guidelines

#### Testing Pyramid for GearUp:

**1. Unit Tests (70% coverage target):**
```javascript
// tests/unit/composables/useProductForm.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { useProductForm } from '@/composables/useProductForm'

describe('useProductForm', () => {
  let productForm
  
  beforeEach(() => {
    productForm = useProductForm()
  })
  
  it('should initialize with empty form data', () => {
    expect(productForm.formData.value.name).toBe('')
    expect(productForm.formData.value.price).toBe(0)
  })
  
  it('should validate form correctly', () => {
    productForm.updateField('name', 'Test Product')
    productForm.updateField('price', 100)
    productForm.updateField('category', 'shoes')
    
    expect(productForm.isValidForm.value).toBe(true)
  })
  
  it('should handle form submission errors', async () => {
    const mockError = new Error('Validation failed')
    vi.spyOn(productService, 'create').mockRejectedValue(mockError)
    
    await expect(productForm.submitForm()).rejects.toThrow('Validation failed')
    expect(productForm.formState.value.hasError).toBe(true)
  })
})
```

**2. Component Tests (20% coverage target):**
```javascript
// tests/component/ProductCard.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ProductCard from '@/components/shared/ProductCard.vue'

describe('ProductCard', () => {
  const mockProduct = {
    id: 1,
    name: 'Nike Air Max',
    price: 150,
    category: 'shoes',
    image: '/image.jpg'
  }
  
  it('renders product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    })
    
    expect(wrapper.text()).toContain('Nike Air Max')
    expect(wrapper.text()).toContain('$150')
    expect(wrapper.find('img').attributes('src')).toBe('/image.jpg')
  })
  
  it('emits edit event when edit button clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockProduct }
    })
    
    await wrapper.find('[data-test="edit-button"]').trigger('click')
    
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')[0]).toEqual([mockProduct])
  })
})
```

**3. Integration Tests (10% coverage target):**
```javascript
// tests/integration/ProductManagement.test.js
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import ProductsPage from '@/pages/admin/Products.vue'

describe('Product Management Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('should load and display products on mount', async () => {
    const wrapper = mount(ProductsPage)
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(wrapper.find('[data-test="products-table"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-test="product-row"]').length).toBeGreaterThan(0)
  })
})
```

#### Testing Requirements:
- **All composables must be unit tested**
- **Critical business logic must have tests**
- **Error handling paths must be covered**
- **API services must have mock tests**
- **Complex components require component tests**

#### Test File Organization:
```
tests/
├── unit/
│   ├── composables/
│   ├── services/
│   ├── stores/
│   └── utils/
├── component/
│   ├── ui/
│   └── shared/
├── integration/
│   └── pages/
└── e2e/
    └── critical-flows/
```

## 🚫 Anti-Patterns & Code Smells to Avoid

### 1. Component Anti-Patterns:
```javascript
// ❌ BAD: Too many functions (>7)
const Component = {
  // 12 functions - too many!
  create, update, delete, load, filter, sort, 
  validate, reset, submit, export, import, backup
}

// ❌ BAD: Functions too long (>30 lines)
const saveProduct = async () => {
  // 50+ lines of complex logic
  // Should be broken down into smaller functions
}

// ❌ BAD: Not grouping related reactive data
const name = ref('')
const price = ref(0)
const category = ref('')
const isLoading = ref(false)
const hasError = ref(false)

// ✅ GOOD: Grouped reactive data
const productData = ref({
  name: '',
  price: 0,
  category: ''
})

const uiState = ref({
  isLoading: false,
  hasError: false
})
```

### 2. State Management Anti-Patterns:
```javascript
// ❌ BAD: Too many actions in store (>8)
// ❌ BAD: Mixing UI state with business data
// ❌ BAD: No error handling in actions
// ❌ BAD: Direct state mutation outside actions

// ✅ GOOD: Follow the standardized store structure above
```

### 3. Template Anti-Patterns:
```vue
<!-- ❌ BAD: Creating objects in template -->
<ProductCard :metadata="{ id: product.id, type: 'product' }" />

<!-- ❌ BAD: Function calls in template -->
<div>{{ formatPrice(product.price) }}</div>

<!-- ❌ BAD: Complex logic in template -->
<div v-if="user.role === 'admin' && user.permissions.includes('create') && !isReadOnly">
  Admin Content
</div>

<!-- ✅ GOOD: Use computed properties -->
<ProductCard :metadata="productMetadata" />
<div>{{ formattedPrice }}</div>
<div v-if="canCreateContent">Admin Content</div>
```

### 4. Service Layer Anti-Patterns:
```javascript
// ❌ BAD: Mixing different resources
export const mixedService = {
  getProducts: () => api.get('/products'),
  getUsers: () => api.get('/users'),        // Different resource!
  getOrders: () => api.get('/orders')       // Different resource!
}

// ❌ BAD: Business logic in service
export const productService = {
  create: (data) => {
    // Validation logic should be in store/composable
    if (!data.name) throw new Error('Name required')
    return api.post('/products', data)
  }
}
```

## 📝 Code Review Checklist

### Component Review:
- [ ] **Function count**: ≤7 functions per component?
- [ ] **Function length**: ≤30 lines per function?
- [ ] **Reactive data grouping**: Related data grouped together?
- [ ] **Computed vs watch**: Using computed instead of watch where possible?
- [ ] **Error handling**: All async operations have try-catch?
- [ ] **Loading states**: UI shows loading indicators?
- [ ] **Component cleanup**: Event listeners and timers cleaned up?

### Architecture Review:
- [ ] **File naming**: Follows PascalCase/camelCase conventions?
- [ ] **Directory structure**: Files in correct directories?
- [ ] **Single responsibility**: Each file has one clear purpose?
- [ ] **Import organization**: Imports properly organized and grouped?
- [ ] **Props validation**: Props have proper types and validation?
- [ ] **Emit documentation**: Events properly documented?

### Performance Review:
- [ ] **List optimization**: Large lists use v-memo or virtualization?
- [ ] **Lazy loading**: Heavy components loaded asynchronously?
- [ ] **Template optimization**: No reactive objects or function calls in templates?
- [ ] **Memory leaks**: Proper cleanup of watchers and event listeners?

### Testing Review:
- [ ] **Unit tests**: Critical business logic has unit tests?
- [ ] **Error coverage**: Error handling paths covered?
- [ ] **Mock usage**: External dependencies properly mocked?

## 🎯 Project Quality Goals

### 1. **Maintainability** (Primary Goal)
- **Clean, readable code** that new developers can understand quickly
- **Consistent patterns** across all components and features
- **Self-documenting code** with clear naming and structure
- **Modular architecture** that allows easy feature additions

### 2. **Performance** (Secondary Goal)
- **Fast initial load** with code splitting and lazy loading
- **Smooth interactions** with optimized rendering
- **Efficient state management** without unnecessary re-renders
- **Minimal bundle size** through tree-shaking and optimization

### 3. **Scalability** (Long-term Goal)
- **Easy feature additions** without breaking existing code
- **Team collaboration** with clear coding standards
- **Future-proof architecture** that can adapt to requirements
- **Reusable components** and composables

### 4. **Developer Experience** (Continuous Goal)
- **Fast development cycles** with hot reload and good tooling
- **Clear error messages** and debugging information
- **Comprehensive testing** for confidence in changes
- **Good documentation** and examples

## 📚 Additional Resources

### Recommended Vue.js Resources:
- [Vue 3 Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Pinia State Management](https://pinia.vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/)
- [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/)

### Code Quality Tools:
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Vite**: Build tool and dev server
- **Vitest**: Unit testing framework
- **TypeScript**: Type safety (future consideration)
