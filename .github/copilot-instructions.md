# GearUp Vue.js Project Rules & Guidelines

## 🎯 Project Overview
Dự án website bán giày thể thao GearUp sử dụng Vue.js 3 + Composition API, Pinia, Vue Router 4.

## 📋 Code Standards & Rules

### 1. Vue.js Composition API Rules

#### ✅ DO:
- **Sử dụng `<script setup>`** cho tất cả components
- **Group related reactive data** trong 1 ref object thay vì nhiều ref riêng lẻ
- **Sử dụng computed cho derived state** thay vì watch
- **Đặt tên function theo nghiệp vụ** (createProduct, updateOrderStatus)
- **Giới hạn tối đa 5-7 functions** trong 1 component
- **Sử dụng composables** cho logic tái sử dụng

```vue
<!-- GOOD -->
<script setup>
import { ref, computed } from 'vue'

const form = ref({
  name: '',
  price: 0,
  category: ''
})

const isValidForm = computed(() => {
  return form.value.name && form.value.price > 0
})

const saveProduct = () => {
  // Single responsibility
}
</script>
```

#### ❌ DON'T:
- **Không tạo quá nhiều ref riêng lẻ**
- **Không viết functions quá dài** (>30 lines)
- **Không mix Options API với Composition API**
- **Không sử dụng watch khi có thể dùng computed**

### 2. Component Structure Rules

#### Template Organization:
```vue
<template>
  <!-- 1. Page header -->
  <div class="page-header">
    <h1>{{ pageTitle }}</h1>
    <div class="actions">
      <button @click="openCreateModal">Thêm mới</button>
    </div>
  </div>
  
  <!-- 2. Filters/Search -->
  <div class="filters">
    <!-- Search và filter controls -->
  </div>
  
  <!-- 3. Main content -->
  <div class="main-content">
    <!-- Table, Grid, hoặc List -->
  </div>
  
  <!-- 4. Modals (cuối cùng) -->
  <div v-if="showModal" class="modal">
    <!-- Modal content -->
  </div>
</template>
```

#### Script Organization:
```vue
<script setup>
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/stores/productStore'

// 2. Props & Emits
const props = defineProps(['id'])
const emit = defineEmits(['update'])

// 3. Store & Services
const store = useStore()

// 4. Reactive Data (group related data)
const state = ref({
  loading: false,
  error: null,
  showModal: false
})

const formData = ref({
  name: '',
  price: 0
})

// 5. Computed Properties
const filteredItems = computed(() => {
  // logic here
})

// 6. Methods (max 5-7 functions)
const loadData = async () => {
  // logic here
}

const saveItem = async () => {
  // logic here
}

// 7. Lifecycle
onMounted(() => {
  loadData()
})
</script>
```

### 3. Function Guidelines

#### Giới hạn số lượng functions:
- **Component chính**: Tối đa 7 functions
- **Modal components**: Tối đa 5 functions
- **Utility functions**: Tách ra file riêng

#### Function naming conventions:
```javascript
// CRUD Operations
const createProduct = () => {}
const updateProduct = () => {}
const deleteProduct = () => {}

// UI Actions
const openModal = () => {}
const closeModal = () => {}
const toggleStatus = () => {}

// Data Operations
const loadProducts = () => {}
const filterProducts = () => {}
const searchProducts = () => {}
```

### 4. State Management Rules

#### Pinia Store Structure:
```javascript
export const useProductStore = defineStore('product', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    currentItem: null
  }),
  
  getters: {
    // Tối đa 5 getters
    totalItems: (state) => state.items.length,
    activeItems: (state) => state.items.filter(item => item.active)
  },
  
  actions: {
    // Tối đa 8 actions, group theo chức năng
    // CRUD actions
    async fetchItems() {},
    async createItem() {},
    async updateItem() {},
    async deleteItem() {},
    
    // UI actions
    setCurrentItem() {},
    clearError() {}
  }
})
```

### 5. File Organization Rules

```
src/
├── components/          # Reusable components only
│   ├── ui/             # Basic UI components (Button, Input, Modal)
│   └── shared/         # Business logic components
├── composables/        # Reusable logic (max 1 responsibility per file)
├── layouts/           # Layout components
├── pages/             # Page components (rename from views)
├── services/          # API calls only
├── stores/            # Pinia stores
└── utils/             # Pure functions only
```

### 6. API Service Rules

#### Single Responsibility:
```javascript
// productService.js - CHỈ handle product API
export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
}
```

### 7. Composables Rules

#### Tạo composable khi:
- Logic được sử dụng ở 2+ components
- Logic có thể test riêng biệt
- Logic có state phức tạp

```javascript
// useProductForm.js
export function useProductForm() {
  const form = ref({
    name: '',
    price: 0,
    category: ''
  })
  
  const isValid = computed(() => {
    return form.value.name && form.value.price > 0
  })
  
  const reset = () => {
    form.value = { name: '', price: 0, category: '' }
  }
  
  return {
    form,
    isValid,
    reset
  }
}
```

### 8. Performance Rules

#### ✅ DO:
- Sử dụng `v-memo` cho lists lớn
- Lazy load components với `defineAsyncComponent`
- Sử dụng `shallowRef` cho data không cần deep reactivity
- Optimize với `v-once` cho static content

#### ❌ DON'T:
- Tạo reactive objects trong template
- Sử dụng function calls trong template
- Tạo quá nhiều watchers

### 9. Error Handling Rules

```javascript
// Centralized error handling
const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error)
  state.value.error = error.message || 'Có lỗi xảy ra'
  state.value.loading = false
}

const loadData = async () => {
  try {
    state.value.loading = true
    state.value.error = null
    const data = await service.getData()
    state.value.items = data
  } catch (error) {
    handleError(error, 'loadData')
  } finally {
    state.value.loading = false
  }
}
```

### 10. Testing Guidelines

#### Unit Tests cho:
- Composables
- Utility functions
- Store actions
- Components với complex logic

#### Integration Tests cho:
- Page workflows
- API integrations

## 🚫 Common Anti-patterns to Avoid

1. **Quá nhiều functions trong 1 component** (>7)
2. **Functions quá dài** (>30 lines)
3. **Không group related reactive data**
4. **Sử dụng watch thay vì computed**
5. **Mutate props trực tiếp**
6. **Không handle loading states**
7. **Không cleanup eventListeners/timers**
8. **Inline styles thay vì CSS classes**

## 📝 Code Review Checklist

- [ ] Component có quá 7 functions không?
- [ ] Functions có dài quá 30 lines không?
- [ ] Có sử dụng computed thay vì watch được không?
- [ ] Có group related reactive data không?
- [ ] Có handle error states không?
- [ ] Có cleanup side effects không?
- [ ] Component name có follow PascalCase không?
- [ ] File structure có đúng convention không?

## 🎯 Project Goals

1. **Maintainability**: Code dễ đọc, dễ sửa
2. **Performance**: Fast loading, smooth interactions
3. **Scalability**: Dễ thêm features mới
4. **Consistency**: Coding style thống nhất
5. **Testability**: Logic có thể test được
