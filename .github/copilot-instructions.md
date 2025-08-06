# GearUp Vue.js Project Rules & Guidelines

## 🎯 Project Overview
GearUp is a sports shoe e-commerce admin dashboard built with Vue.js 3 + Composition API, Pinia state management, Vue Router 4, and JavaScript.

## ⚠️ CRITICAL: Code Efficiency Principles

### MANDATORY RULES - ZERO TOLERANCE FOR VIOLATIONS:
1. **NO DEAD CODE** - Every line must have a purpose
2. **NO DUPLICATE LOGIC** - Use composables for repeated patterns
3. **NO UNNECESSARY FUNCTIONS** - If used once, inline it
4. **NO OVER-ENGINEERING** - Solve today's problem, not tomorrow's
5. **NO COMMENTED CODE** - Delete it or use version control
6. **NO CONSOLE LOGS IN PRODUCTION** - Use proper debugging tools
7. **NO MAGIC NUMBERS** - Use named constants

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
├── views/                 # Page components
│   ├── Dashboard.vue      # Dashboard page
│   ├── Products.vue       # Product management
│   ├── Orders.vue         # Order management
│   ├── Customers.vue      # Customer management
│   ├── Employees.vue      # Employee management
│   ├── Discounts.vue      # Discount campaigns
│   ├── Coupons.vue        # Coupon management
│   ├── Login.vue          # Authentication
│   └── NotFound.vue       # 404 page
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

## 🎨 TailwindCSS Implementation Guidelines (Future Use)

### Installation & Configuration
```bash
# Install TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install TailwindCSS Forms & Typography
npm install -D @tailwindcss/forms @tailwindcss/typography
```

### TailwindCSS Configuration
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // GearUp brand colors
        'primary': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'gray': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### ✅ TailwindCSS STRICT RULES

#### 1. Class Organization (MANDATORY ORDER)
```vue
<template>
  <!-- ✅ CORRECT: Classes in specific order -->
  <div class="
    <!-- 1. Layout -->
    flex items-center justify-between
    
    <!-- 2. Spacing -->
    p-4 m-2
    
    <!-- 3. Sizing -->
    w-full h-64
    
    <!-- 4. Typography -->
    text-sm font-medium
    
    <!-- 5. Colors -->
    bg-white text-gray-900
    
    <!-- 6. Borders -->
    border border-gray-200 rounded-lg
    
    <!-- 7. Effects -->
    shadow-sm hover:shadow-md
    
    <!-- 8. Transitions -->
    transition-all duration-200
    
    <!-- 9. Responsive -->
    md:p-6 lg:p-8
  ">
    Content
  </div>
  
  <!-- ❌ WRONG: Random class order -->
  <div class="shadow-sm p-4 flex bg-white rounded-lg text-sm w-full">
    Content
  </div>
</template>
```

#### 2. Component Utility Classes (NO CUSTOM CSS)
```vue
<!-- ❌ NEVER write custom CSS when Tailwind has the utility -->
<style scoped>
.custom-button {
  padding: 0.5rem 1rem;
  background-color: #22c55e;
  color: white;
  border-radius: 0.5rem;
}
</style>

<!-- ✅ Use Tailwind utilities -->
<button class="px-4 py-2 bg-primary-500 text-white rounded-lg">
  Click Me
</button>
```

#### 3. Responsive Design Pattern
```vue
<template>
  <!-- Mobile-first approach (REQUIRED) -->
  <div class="
    grid grid-cols-1 gap-4 p-4
    sm:grid-cols-2 sm:gap-6 sm:p-6
    md:grid-cols-3
    lg:grid-cols-4 lg:gap-8 lg:p-8
    xl:grid-cols-5
    2xl:grid-cols-6
  ">
    <!-- Content -->
  </div>
</template>
```

#### 4. State-based Styling (Use Vue Bindings)
```vue
<script setup>
const isActive = ref(false)
const isError = ref(false)
</script>

<template>
  <!-- ✅ Dynamic classes with Vue -->
  <button 
    :class="[
      'px-4 py-2 rounded-lg transition-colors',
      isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700',
      isError && 'border-2 border-red-500',
      'hover:opacity-90'
    ]"
  >
    Dynamic Button
  </button>
  
  <!-- ❌ AVOID: Inline ternary in template -->
  <button :class="`px-4 py-2 ${isActive ? 'bg-primary-500' : 'bg-gray-100'}`">
    Bad Example
  </button>
</template>
```

#### 5. Reusable Component Classes
```javascript
// utils/tailwindClasses.js
export const buttonClasses = {
  base: 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  },
  variants: {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500'
  }
}

// Use in component
import { buttonClasses } from '@/utils/tailwindClasses'

const getButtonClass = (size = 'md', variant = 'primary') => {
  return [
    buttonClasses.base,
    buttonClasses.sizes[size],
    buttonClasses.variants[variant]
  ].join(' ')
}
```

#### 6. Form Styling Pattern
```vue
<template>
  <form class="space-y-6">
    <!-- Text Input -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Product Name
      </label>
      <input 
        type="text"
        class="
          w-full px-3 py-2 
          border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          placeholder-gray-400
          disabled:bg-gray-50 disabled:text-gray-500
        "
        placeholder="Enter product name"
      >
      <p v-if="errors.name" class="mt-1 text-sm text-red-600">
        {{ errors.name }}
      </p>
    </div>
    
    <!-- Select -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Category
      </label>
      <select class="
        w-full px-3 py-2
        border border-gray-300 rounded-lg
        focus:ring-2 focus:ring-primary-500 focus:border-transparent
      ">
        <option>Select category</option>
        <option>Shoes</option>
        <option>Accessories</option>
      </select>
    </div>
  </form>
</template>
```

#### 7. Table Styling Pattern
```vue
<template>
  <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
    <table class="min-w-full divide-y divide-gray-300">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price
          </th>
          <th class="relative px-6 py-3">
            <span class="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ item.name }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ item.price }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-primary-600 hover:text-primary-900">
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```

#### 8. Card Component Pattern
```vue
<template>
  <div class="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
    <!-- Card Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <h3 class="text-lg font-semibold text-gray-900">
        Card Title
      </h3>
    </div>
    
    <!-- Card Body -->
    <div class="px-6 py-4">
      <p class="text-gray-600">
        Card content goes here
      </p>
    </div>
    
    <!-- Card Footer -->
    <div class="px-6 py-3 bg-gray-50 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">Updated 2 hours ago</span>
        <button class="text-sm text-primary-600 hover:text-primary-500 font-medium">
          View Details
        </button>
      </div>
    </div>
  </div>
</template>
```

### ❌ TailwindCSS ANTI-PATTERNS TO AVOID

```vue
<!-- ❌ DON'T: Use arbitrary values excessively -->
<div class="w-[423px] h-[67px] mt-[13px]"></div>

<!-- ✅ DO: Use standard spacing scale -->
<div class="w-96 h-16 mt-3"></div>

<!-- ❌ DON'T: Mix Tailwind with inline styles -->
<div class="p-4" style="background-color: #22c55e;"></div>

<!-- ✅ DO: Use only Tailwind -->
<div class="p-4 bg-primary-500"></div>

<!-- ❌ DON'T: Create deeply nested selectors -->
<style>
.container .wrapper .item .content { /* Bad */ }
</style>

<!-- ✅ DO: Use Tailwind utilities directly -->
<div class="space-y-4"></div>

<!-- ❌ DON'T: Use !important -->
<div class="!bg-red-500"></div>

<!-- ✅ DO: Fix specificity issues properly -->
<div class="bg-red-500"></div>
```

### Tailwind Component Abstraction
```vue
<!-- BaseButton.vue -->
<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'danger', 'ghost'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  loading: Boolean,
  disabled: Boolean
})
</script>

<template>
  <button
    :disabled="disabled || loading"
    :class="[
      // Base styles
      'inline-flex items-center justify-center font-medium rounded-lg',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      
      // Size variants
      size === 'sm' && 'px-3 py-1.5 text-sm',
      size === 'md' && 'px-4 py-2 text-base',
      size === 'lg' && 'px-6 py-3 text-lg',
      
      // Color variants
      variant === 'primary' && 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
      variant === 'secondary' && 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
      variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
      variant === 'ghost' && 'bg-transparent hover:bg-gray-100 focus:ring-gray-500'
    ]"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
    </span>
    <slot />
  </button>
</template>
```

## 🔐 Security Best Practices

### Input Validation & Sanitization
```javascript
// composables/useValidation.js
export function useValidation() {
  const sanitizeInput = (input) => {
    // Remove HTML tags and scripts
    return input.replace(/<[^>]*>?/gm, '').trim()
  }
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  const validatePhone = (phone) => {
    const phoneRegex = /^(\+84|0)[3-9][0-9]{8}$/ // Vietnam phone format
    return phoneRegex.test(phone)
  }
  
  const validatePrice = (price) => {
    return !isNaN(price) && price > 0 && price < 1000000000
  }
  
  return {
    sanitizeInput,
    validateEmail,
    validatePhone,
    validatePrice
  }
}
```

### Authentication & Authorization
```javascript
// Guards for protected routes
const requireAuth = (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // Check role-based access
  if (to.meta.requiredRole && authStore.user.role !== to.meta.requiredRole) {
    next('/unauthorized')
    return
  }
  
  next()
}

// Token management
const tokenManager = {
  setToken: (token) => {
    // Use httpOnly cookies in production
    if (import.meta.env.PROD) {
      // Server should set httpOnly cookie
    } else {
      localStorage.setItem('token', token)
    }
  },
  
  getToken: () => {
    return localStorage.getItem('token')
  },
  
  removeToken: () => {
    localStorage.removeItem('token')
  }
}
```

### XSS Prevention
```vue
<template>
  <!-- ❌ NEVER use v-html with user input -->
  <div v-html="userInput"></div>
  
  <!-- ✅ Use text interpolation or v-text -->
  <div>{{ sanitizedUserInput }}</div>
  <div v-text="sanitizedUserInput"></div>
</template>

<script setup>
import { computed } from 'vue'
import { useValidation } from '@/composables/useValidation'

const { sanitizeInput } = useValidation()

const sanitizedUserInput = computed(() => 
  sanitizeInput(props.userInput)
)
</script>
```

### Environment Variables Security
```javascript
// ❌ NEVER commit sensitive data
// .env (should be in .gitignore)
VITE_API_KEY=your-secret-key
VITE_DB_PASSWORD=secret-password

// ✅ Use placeholders in committed files
// .env.example (safe to commit)
VITE_API_KEY=your-api-key-here
VITE_API_BASE_URL=http://localhost:8080/api
```

### CORS Configuration
```javascript
// services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // CSRF protection
  }
})
```

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
