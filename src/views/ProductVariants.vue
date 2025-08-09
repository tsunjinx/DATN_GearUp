<!-- Product Variant Management - Matches ERD sản_phẩm_chi_tiết -->
<template>
  <div class="product-variants">
    <!-- Header Section -->
    <div class="variants-header">
      <div class="header-content">
        <h1 class="variants-title">
          <span class="icon">🏷️</span>
          Quản lý Biến thể Sản phẩm
        </h1>
        <div class="header-actions">
          <Button 
            variant="secondary" 
            @click="refreshData"
            :loading="loading"
          >
            <span class="icon">🔄</span>
            Làm mới
          </Button>
          <Button 
            variant="success" 
            @click="openCreateVariantModal"
          >
            <span class="icon">➕</span>
            Tạo biến thể
          </Button>
          <Button 
            variant="primary" 
            @click="openBulkUpdateModal"
          >
            <span class="icon">📊</span>
            Cập nhật hàng loạt
          </Button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card fade-in" style="animation-delay: 0.1s">
        <div class="stat-icon">🏷️</div>
        <div class="stat-info">
          <h3>{{ variantStats.totalVariants }}</h3>
          <p>Tổng biến thể</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.2s">
        <div class="stat-icon">⚠️</div>
        <div class="stat-info">
          <h3>{{ variantStats.lowStockVariants }}</h3>
          <p>Sắp hết hàng</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.3s">
        <div class="stat-icon">❌</div>
        <div class="stat-info">
          <h3>{{ variantStats.outOfStockVariants }}</h3>
          <p>Hết hàng</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.4s">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <h3>{{ formatCurrency(variantStats.totalValue) }}</h3>
          <p>Giá trị tồn kho</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-row">
        <div class="search-box">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm kiếm biến thể..."
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>
        
        <select v-model="selectedProduct" class="filter-select">
          <option value="">Tất cả sản phẩm</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>

        <select v-model="stockFilter" class="filter-select">
          <option value="">Tất cả trạng thái</option>
          <option value="in-stock">Còn hàng</option>
          <option value="low-stock">Sắp hết hàng</option>
          <option value="out-of-stock">Hết hàng</option>
        </select>

        <Button 
          variant="outline" 
          @click="clearFilters"
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>

    <!-- Variants Table -->
    <div class="variants-table-container">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="checkbox"
                >
              </th>
              <th>Mã biến thể</th>
              <th>Tên sản phẩm</th>
              <th>Màu sắc</th>
              <th>Kích thước</th>
              <th>Chất liệu</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="variant in filteredVariants" :key="variant.id" class="variant-row">
              <td>
                <input 
                  type="checkbox" 
                  v-model="selectedVariants"
                  :value="variant.id"
                  class="checkbox"
                >
              </td>
              <td>
                <div class="variant-code">{{ variant.ma_san_pham }}</div>
              </td>
              <td>
                <div class="product-info">
                  <div class="product-name">{{ variant.ten_san_pham }}</div>
                </div>
              </td>
              <td>
                <div class="color-info">
                  <div 
                    class="color-swatch"
                    :style="{ backgroundColor: getColorCode(variant.id_mau_sac) }"
                  ></div>
                  <span>{{ getColorName(variant.id_mau_sac) }}</span>
                </div>
              </td>
              <td>
                <span class="size-badge">{{ getSizeName(variant.id_kich_thuoc) }}</span>
              </td>
              <td>
                <span class="material-name">{{ getMaterialName(variant.id_chat_lieu) }}</span>
              </td>
              <td>
                <span class="price">{{ formatCurrency(variant.price) }}</span>
              </td>
              <td>
                <div class="stock-info">
                  <span 
                    class="stock-count"
                    :class="getStockClass(variant.stock)"
                  >
                    {{ variant.stock }}
                  </span>
                </div>
              </td>
              <td>
                <span 
                  class="status-badge"
                  :class="getStockStatus(variant.stock)"
                >
                  {{ getStockStatusText(variant.stock) }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <Button 
                    variant="outline" 
                    size="sm"
                    @click="editVariant(variant)"
                  >
                    Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    @click="viewVariantDetails(variant)"
                  >
                    Chi tiết
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    @click="deleteVariant(variant.id)"
                  >
                    Xóa
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredVariants.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>Không có biến thể nào</h3>
        <p>Chưa có biến thể sản phẩm nào được tạo</p>
        <Button variant="primary" @click="openCreateVariantModal">
          Tạo biến thể đầu tiên
        </Button>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <Button 
        variant="outline" 
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        Trước
      </Button>
      
      <span class="page-info">
        Trang {{ currentPage }} / {{ totalPages }}
      </span>
      
      <Button 
        variant="outline" 
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Sau
      </Button>
    </div>

    <!-- Bulk Actions Bar -->
    <div v-if="selectedVariants.length > 0" class="bulk-actions-bar">
      <div class="selected-count">
        Đã chọn {{ selectedVariants.length }} biến thể
      </div>
      <div class="bulk-actions">
        <Button variant="outline" @click="bulkUpdateStock">
          Cập nhật tồn kho
        </Button>
        <Button variant="outline" @click="bulkUpdatePrice">
          Cập nhật giá
        </Button>
        <Button variant="danger" @click="bulkDeleteVariants">
          Xóa đã chọn
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductVariantStore } from '@/stores/enhanced/productVariantStore.js'
import { useAttributeStore } from '@/stores/enhanced/attributeStore.js'
import { useProductStore } from '@/stores/productStore.js'
import Button from '@/components/ui/Button.vue'

// Stores
const variantStore = useProductVariantStore()
const attributeStore = useAttributeStore()
const productStore = useProductStore()

// State
const searchQuery = ref('')
const selectedProduct = ref('')
const stockFilter = ref('')
const selectedVariants = ref([])
const selectAll = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(20)

// Loading state
const loading = computed(() => variantStore.loading)

// Stats
const variantStats = computed(() => variantStore.variantStats)

// Products for filter
const products = computed(() => productStore.products || [])

// Filtered variants
const filteredVariants = computed(() => {
  let filtered = variantStore.searchVariants(searchQuery.value)
  
  if (selectedProduct.value) {
    filtered = filtered.filter(v => v.id_sản_phẩm === parseInt(selectedProduct.value))
  }
  
  if (stockFilter.value) {
    switch (stockFilter.value) {
      case 'in-stock':
        filtered = filtered.filter(v => v.stock > 10)
        break
      case 'low-stock':
        filtered = filtered.filter(v => v.stock <= 10 && v.stock > 0)
        break
      case 'out-of-stock':
        filtered = filtered.filter(v => v.stock === 0)
        break
    }
  }
  
  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filtered.slice(start, end)
})

// Pagination
const totalPages = computed(() => {
  const total = variantStore.searchVariants(searchQuery.value).length
  return Math.ceil(total / itemsPerPage.value)
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0)
}

const getColorName = (colorId) => {
  const color = attributeStore.getAllColors.find(c => c.id === colorId)
  return color?.ten_mau_sac || 'N/A'
}

const getColorCode = (colorId) => {
  const color = attributeStore.getAllColors.find(c => c.id === colorId)
  return color?.ma_mau_sac || '#cccccc'
}

const getSizeName = (sizeId) => {
  const size = attributeStore.getAllSizes.find(s => s.id === sizeId)
  return size?.ten_kich_thuoc || 'N/A'
}

const getMaterialName = (materialId) => {
  const material = attributeStore.getAllMaterials.find(m => m.id === materialId)
  return material?.ten_chat_lieu || 'N/A'
}

const getStockClass = (stock) => {
  if (stock === 0) return 'out-of-stock'
  if (stock <= 10) return 'low-stock'
  return 'in-stock'
}

const getStockStatus = (stock) => {
  if (stock === 0) return 'out-of-stock'
  if (stock <= 10) return 'low-stock'
  return 'in-stock'
}

const getStockStatusText = (stock) => {
  if (stock === 0) return 'Hết hàng'
  if (stock <= 10) return 'Sắp hết'
  return 'Còn hàng'
}

// Actions
const refreshData = async () => {
  await Promise.all([
    variantStore.fetchVariants(),
    attributeStore.fetchAllAttributes(),
    productStore.fetchProducts()
  ])
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedProduct.value = ''
  stockFilter.value = ''
  currentPage.value = 1
}

const goToPage = (page) => {
  currentPage.value = page
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedVariants.value = filteredVariants.value.map(v => v.id)
  } else {
    selectedVariants.value = []
  }
}

const openCreateVariantModal = () => {
  // TODO: Implement create variant modal
  console.log('Open create variant modal')
}

const openBulkUpdateModal = () => {
  // TODO: Implement bulk update modal
  console.log('Open bulk update modal')
}

const editVariant = (variant) => {
  // TODO: Implement edit variant modal
  console.log('Edit variant:', variant)
}

const viewVariantDetails = (variant) => {
  // TODO: Implement variant details modal
  console.log('View variant details:', variant)
}

const deleteVariant = async (variantId) => {
  if (confirm('Bạn có chắc chắn muốn xóa biến thể này?')) {
    try {
      await variantStore.deleteVariant(variantId)
    } catch (error) {
      console.error('Failed to delete variant:', error)
    }
  }
}

const bulkUpdateStock = () => {
  // TODO: Implement bulk stock update
  console.log('Bulk update stock for:', selectedVariants.value)
}

const bulkUpdatePrice = () => {
  // TODO: Implement bulk price update
  console.log('Bulk update price for:', selectedVariants.value)
}

const bulkDeleteVariants = async () => {
  if (confirm(`Bạn có chắc chắn muốn xóa ${selectedVariants.value.length} biến thể đã chọn?`)) {
    try {
      await Promise.all(
        selectedVariants.value.map(id => variantStore.deleteVariant(id))
      )
      selectedVariants.value = []
      selectAll.value = false
    } catch (error) {
      console.error('Failed to bulk delete variants:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
/* Use same styles as Dashboard.vue for consistency */
.product-variants {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0;
}

.variants-header {
  margin-bottom: var(--spacing-3xl);
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl) var(--spacing-3xl);
  color: var(--white);
  box-shadow: var(--shadow-lg);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
}

.variants-title {
  margin: 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(16px, 3vw, 32px);
  margin-bottom: var(--spacing-3xl);
  padding: 0 8px;
}

.stat-card {
  background: var(--surface);
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  display: flex;
  align-items: center;
  transition: all var(--transition-slow);
}

.stat-icon {
  font-size: var(--font-size-5xl);
  margin-right: var(--spacing-xl);
  flex-shrink: 0;
}

.stat-info h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-4xl);
  color: var(--gray-900);
  font-weight: var(--font-weight-bold);
}

.stat-info p {
  margin: 0;
  color: var(--gray-700);
  font-weight: var(--font-weight-semibold);
}

.filters-section {
  background: var(--surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.filters-row {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-sm) 2.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
}

.search-icon {
  position: absolute;
  left: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
}

.filter-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  font-size: var(--font-size-sm);
  min-width: 150px;
}

.variants-table-container {
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: var(--spacing-xl);
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.table th {
  background: var(--gray-50);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  font-size: var(--font-size-sm);
}

.variant-row:hover {
  background: var(--gray-50);
}

.color-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.color-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border);
}

.size-badge {
  background: var(--gray-100);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.status-badge.in-stock {
  background: var(--success-100);
  color: var(--success-800);
}

.status-badge.low-stock {
  background: var(--warning-100);
  color: var(--warning-800);
}

.status-badge.out-of-stock {
  background: var(--error-100);
  color: var(--error-800);
}

.stock-count.out-of-stock {
  color: var(--error-600);
  font-weight: var(--font-weight-bold);
}

.stock-count.low-stock {
  color: var(--warning-600);
  font-weight: var(--font-weight-bold);
}

.stock-count.in-stock {
  color: var(--success-600);
  font-weight: var(--font-weight-bold);
}

.actions {
  display: flex;
  gap: var(--spacing-xs);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--gray-600);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-lg);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.page-info {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}

.bulk-actions-bar {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  background: var(--surface);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  z-index: 100;
}

.selected-count {
  font-weight: var(--font-weight-semibold);
  color: var(--gray-700);
}

.bulk-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.fade-in {
  animation: fadeInUp 0.6s ease-out both;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .bulk-actions-bar {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>

