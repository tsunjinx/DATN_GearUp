<template>
  <!-- 1. Page Header -->
  <div class="page-header">
    <h1>{{ pageTitle }}</h1>
    <div class="actions">
      <button class="btn btn-primary" @click="openCreateModal">
        Thêm mới
      </button>
    </div>
  </div>

  <!-- 2. Filters -->
  <div class="filters">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Tìm kiếm..."
      class="search-input"
    />
    <select v-model="selectedCategory" class="filter-select">
      <option value="">Tất cả danh mục</option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.name }}
      </option>
    </select>
  </div>

  <!-- 3. Loading State -->
  <div v-if="loading" class="loading">
    Đang tải...
  </div>

  <!-- 4. Error State -->
  <div v-else-if="error" class="error">
    {{ error }}
    <button @click="loadData">Thử lại</button>
  </div>

  <!-- 5. Main Content -->
  <div v-else class="main-content">
    <div v-if="filteredItems.length === 0" class="empty-state">
      Không có dữ liệu
    </div>
    
    <div v-else class="items-grid">
      <div v-for="item in filteredItems" :key="item.id" class="item-card">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
        <div class="item-actions">
          <button @click="editItem(item)">Sửa</button>
          <button @click="deleteItem(item.id)">Xóa</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 6. Modals (cuối cùng) -->
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <!-- Form content -->
      </div>
    </div>
  </div>
</template>

<script setup>
// 1. Imports - group theo loại
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { useForm } from '@/composables/useForm'
import { productService } from '@/services/productService'

// 2. Props & Emits
const props = defineProps({
  category: String
})

const emit = defineEmits(['update'])

// 3. Composables
const { loading, error, execute } = useApi()
const { formData, validate, reset } = useForm({
  name: '',
  description: '',
  category: ''
})

// 4. Reactive State - group related data
const state = ref({
  items: [],
  categories: [],
  showModal: false,
  editingItem: null
})

const filters = ref({
  searchTerm: '',
  selectedCategory: ''
})

// 5. Computed Properties - derived state only
const pageTitle = computed(() => {
  return props.category ? `Danh mục: ${props.category}` : 'Tất cả sản phẩm'
})

const modalTitle = computed(() => {
  return state.value.editingItem ? 'Chỉnh sửa' : 'Thêm mới'
})

const filteredItems = computed(() => {
  let items = state.value.items
  
  if (filters.value.searchTerm) {
    items = items.filter(item =>
      item.name.toLowerCase().includes(filters.value.searchTerm.toLowerCase())
    )
  }
  
  if (filters.value.selectedCategory) {
    items = items.filter(item => item.categoryId === filters.value.selectedCategory)
  }
  
  return items
})

// 6. Methods - max 7 functions, single responsibility
const loadData = async () => {
  await execute(async () => {
    const [items, categories] = await Promise.all([
      productService.getAll(),
      productService.getCategories()
    ])
    
    state.value.items = items.data
    state.value.categories = categories.data
  })
}

const openCreateModal = () => {
  state.value.editingItem = null
  state.value.showModal = true
  reset()
}

const editItem = (item) => {
  state.value.editingItem = item
  state.value.showModal = true
  Object.assign(formData.value, item)
}

const closeModal = () => {
  state.value.showModal = false
  state.value.editingItem = null
  reset()
}

const saveItem = async () => {
  if (!validate()) return
  
  await execute(async () => {
    if (state.value.editingItem) {
      await productService.update(state.value.editingItem.id, formData.value)
    } else {
      await productService.create(formData.value)
    }
    
    await loadData()
    closeModal()
    emit('update')
  })
}

const deleteItem = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa?')) return
  
  await execute(async () => {
    await productService.delete(id)
    await loadData()
  })
}

// 7. Lifecycle
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Component-specific styles */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.main-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.item-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
