<!-- Attribute Management - Manages all footwear attributes from ERD -->
<template>
  <div class="attribute-management">
    <!-- Header Section -->
    <div class="attribute-header">
      <div class="header-content">
        <h1 class="attribute-title">
          <span class="icon">🏷️</span>
          Quản lý Thuộc tính Giày
        </h1>
        <div class="header-actions">
          <Button variant="secondary" :loading="loading" @click="refreshData">
            <span class="icon">🔄</span>
            Làm mới
          </Button>
          <Button variant="success" @click="openCreateAttributeModal">
            <span class="icon">➕</span>
            Thêm thuộc tính
          </Button>
          <Button variant="primary" @click="exportAttributes">
            <span class="icon">📊</span>
            Xuất dữ liệu
          </Button>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card fade-in" style="animation-delay: 0.1s">
        <div class="stat-icon">🎨</div>
        <div class="stat-info">
          <h3>{{ attributeStore.getAllColors.length }}</h3>
          <p>Màu sắc</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.2s">
        <div class="stat-icon">📏</div>
        <div class="stat-info">
          <h3>{{ attributeStore.getAllSizes.length }}</h3>
          <p>Kích thước</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.3s">
        <div class="stat-icon">🧵</div>
        <div class="stat-info">
          <h3>{{ attributeStore.getAllMaterials.length }}</h3>
          <p>Chất liệu</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.4s">
        <div class="stat-icon">⚙️</div>
        <div class="stat-info">
          <h3>{{ totalAttributes }}</h3>
          <p>Tổng thuộc tính</p>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <button
        v-for="tab in attributeTabs"
        :key="tab.key"
        class="tab-button"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        {{ tab.label }}
        <span class="tab-count">({{ getAttributeCount(tab.key) }})</span>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Filters Section -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="search-box">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="`Tìm kiếm ${getCurrentTabLabel()}...`"
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>

          <Button variant="outline" @click="clearFilters"> Xóa bộ lọc </Button>

          <Button variant="success" @click="openCreateAttributeModal">
            <span class="icon">➕</span>
            Thêm {{ getCurrentTabLabel() }}
          </Button>
        </div>
      </div>

      <!-- Attributes Table -->
      <div class="table-container">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên</th>
                <th v-if="activeTab === 'colors'">Mẫu màu</th>
                <th v-if="activeTab === 'sizes'">Size EU</th>
                <th v-if="activeTab === 'materials'">Loại</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredAttributes" :key="item.id" class="attribute-row">
                <td>
                  <div class="attribute-code">
                    {{ getAttributeCode(item) }}
                  </div>
                </td>
                <td>
                  <div class="attribute-name">
                    {{ getAttributeName(item) }}
                  </div>
                </td>
                <td v-if="activeTab === 'colors'">
                  <div class="color-preview">
                    <div class="color-swatch" :style="{ backgroundColor: item.ma_mau_sac }" />
                    <span class="color-code">{{ item.ma_mau_sac }}</span>
                  </div>
                </td>
                <td v-if="activeTab === 'sizes'">
                  <span class="size-eu">{{ getSizeEU(item) }}</span>
                </td>
                <td v-if="activeTab === 'materials'">
                  <span class="material-type">{{ getMaterialType(item) }}</span>
                </td>
                <td>
                  <span class="date">{{ formatDate(item.created_at) }}</span>
                </td>
                <td>
                  <span class="status-badge" :class="item.deleted ? 'inactive' : 'active'">
                    {{ item.deleted ? 'Không hoạt động' : 'Hoạt động' }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <Button variant="outline" size="sm" @click="editAttribute(item)"> Sửa </Button>
                    <Button variant="outline" size="sm" @click="viewAttributeUsage(item)"> Sử dụng </Button>
                    <Button v-if="!item.deleted" variant="danger" size="sm" @click="deleteAttribute(item)">
                      Xóa
                    </Button>
                    <Button v-else variant="success" size="sm" @click="restoreAttribute(item)"> Khôi phục </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAttributes.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">
            {{ getCurrentTabIcon() }}
          </div>
          <h3>Chưa có {{ getCurrentTabLabel().toLowerCase() }} nào</h3>
          <p>Hãy thêm {{ getCurrentTabLabel().toLowerCase() }} đầu tiên cho sản phẩm</p>
          <Button variant="primary" @click="openCreateAttributeModal"> Thêm {{ getCurrentTabLabel() }} </Button>
        </div>
      </div>
    </div>

    <!-- Bulk Operations Bar -->
    <div v-if="selectedAttributes.length > 0" class="bulk-actions-bar">
      <div class="selected-count">Đã chọn {{ selectedAttributes.length }} thuộc tính</div>
      <div class="bulk-actions">
        <Button variant="outline" @click="bulkEdit"> Sửa hàng loạt </Button>
        <Button variant="danger" @click="bulkDelete"> Xóa đã chọn </Button>
      </div>
    </div>

    <!-- Attribute Usage Modal -->
    <div v-if="showUsageModal" class="modal-overlay" @click="closeUsageModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Thuộc tính được sử dụng</h3>
          <button class="modal-close" @click="closeUsageModal">×</button>
        </div>
        <div class="modal-body">
          <div class="usage-stats">
            <div class="usage-stat">
              <span class="usage-label">Tổng sản phẩm sử dụng:</span>
              <span class="usage-value">{{ attributeUsage.totalProducts }}</span>
            </div>
            <div class="usage-stat">
              <span class="usage-label">Tổng biến thể sử dụng:</span>
              <span class="usage-value">{{ attributeUsage.totalVariants }}</span>
            </div>
          </div>

          <div class="usage-products">
            <h4>Sản phẩm sử dụng thuộc tính này:</h4>
            <div class="product-list">
              <div v-for="product in attributeUsage.products" :key="product.id" class="product-item">
                <div class="product-name">
                  {{ product.name }}
                </div>
                <div class="product-variants">{{ product.variantCount }} biến thể</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAttributeStore } from '@/stores/enhanced/attributeStore.js'
import { useProductVariantStore } from '@/stores/enhanced/productVariantStore.js'
import Button from '@/components/ui/Button.vue'

// Stores
const attributeStore = useAttributeStore()
const variantStore = useProductVariantStore()

// State
const activeTab = ref('colors')
const searchQuery = ref('')
const selectedAttributes = ref([])
const showUsageModal = ref(false)
const attributeUsage = ref({
  totalProducts: 0,
  totalVariants: 0,
  products: []
})

// Loading state
const loading = computed(() => attributeStore.loading)

// Tab configuration
const attributeTabs = [
  { key: 'colors', label: 'Màu sắc', icon: '🎨' },
  { key: 'sizes', label: 'Kích thước', icon: '📏' },
  { key: 'materials', label: 'Chất liệu', icon: '🧵' },
  { key: 'soleTypes', label: 'Đế giày', icon: '👟' },
  { key: 'insoleTypes', label: 'Đệm giày', icon: '🦶' },
  { key: 'weights', label: 'Trọng lượng', icon: '⚖️' },
  { key: 'sportsSeasons', label: 'Mùa thể thao', icon: '🏃' },
  { key: 'rainTypes', label: 'Loại mưa', icon: '🌧️' },
  { key: 'durabilities', label: 'Độ bền', icon: '💪' },
  { key: 'waterproofLevels', label: 'Chống nước', icon: '💧' }
]

// Computed properties
const totalAttributes = computed(() => {
  return (
    attributeStore.getAllColors.length +
    attributeStore.getAllSizes.length +
    attributeStore.getAllMaterials.length +
    attributeStore.getAllSoleTypes.length +
    attributeStore.getAllInsoleTypes.length +
    attributeStore.getAllWeights.length +
    attributeStore.getAllSportsSeasons.length +
    attributeStore.getAllRainTypes.length +
    attributeStore.getAllDurabilities.length +
    attributeStore.getAllWaterproofLevels.length
  )
})

const filteredAttributes = computed(() => {
  const attributeMap = {
    colors: attributeStore.getAllColors,
    sizes: attributeStore.getAllSizes,
    materials: attributeStore.getAllMaterials,
    soleTypes: attributeStore.getAllSoleTypes,
    insoleTypes: attributeStore.getAllInsoleTypes,
    weights: attributeStore.getAllWeights,
    sportsSeasons: attributeStore.getAllSportsSeasons,
    rainTypes: attributeStore.getAllRainTypes,
    durabilities: attributeStore.getAllDurabilities,
    waterproofLevels: attributeStore.getAllWaterproofLevels
  }

  let attributes = attributeMap[activeTab.value] || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    attributes = attributes.filter(
      attr =>
        getAttributeName(attr).toLowerCase().includes(query) || getAttributeCode(attr).toLowerCase().includes(query)
    )
  }

  return attributes
})

// Helper functions
const getCurrentTabLabel = () => {
  const tab = attributeTabs.find(t => t.key === activeTab.value)
  return tab?.label || ''
}

const getCurrentTabIcon = () => {
  const tab = attributeTabs.find(t => t.key === activeTab.value)
  return tab?.icon || '🏷️'
}

const getAttributeCount = tabKey => {
  const attributeMap = {
    colors: attributeStore.getAllColors.length,
    sizes: attributeStore.getAllSizes.length,
    materials: attributeStore.getAllMaterials.length,
    soleTypes: attributeStore.getAllSoleTypes.length,
    insoleTypes: attributeStore.getAllInsoleTypes.length,
    weights: attributeStore.getAllWeights.length,
    sportsSeasons: attributeStore.getAllSportsSeasons.length,
    rainTypes: attributeStore.getAllRainTypes.length,
    durabilities: attributeStore.getAllDurabilities.length,
    waterproofLevels: attributeStore.getAllWaterproofLevels.length
  }
  return attributeMap[tabKey] || 0
}

const getAttributeCode = item => {
  const codeMap = {
    colors: item.ma_mau_sac,
    sizes: item.ma_kich_thuoc,
    materials: item.ma_chat_lieu,
    soleTypes: item.ma_de_giay,
    insoleTypes: item.ma_dem_giay,
    weights: item.ma_trong_luong,
    sportsSeasons: item.ma_mon_the_thao,
    rainTypes: item.ma_loai_mua,
    durabilities: item.ma_do_ben,
    waterproofLevels: item.ma_chong_nuoc
  }
  return codeMap[activeTab.value] || item.id
}

const getAttributeName = item => {
  const nameMap = {
    colors: item.ten_mau_sac,
    sizes: item.ten_kich_thuoc,
    materials: item.ten_chat_lieu,
    soleTypes: item.ten_de_giay,
    insoleTypes: item.ten_dem_giay,
    weights: item.ten_trong_luong,
    sportsSeasons: item.ten_mon_the_thao,
    rainTypes: item.ten_loai_mua,
    durabilities: item.ten_do_ben,
    waterproofLevels: item.ten_chong_nuoc
  }
  return nameMap[activeTab.value] || 'N/A'
}

const getSizeEU = sizeItem => {
  // Convert VN size to EU size (placeholder logic)
  const vnSize = parseInt(sizeItem.ten_kich_thuoc)
  return vnSize ? vnSize + 1 : 'N/A'
}

const getMaterialType = materialItem => {
  // Determine material type based on name (placeholder logic)
  const name = materialItem.ten_chat_lieu.toLowerCase()
  if (name.includes('da')) return 'Da thật'
  if (name.includes('canvas')) return 'Vải canvas'
  if (name.includes('mesh')) return 'Lưới'
  return 'Khác'
}

const formatDate = dateString => {
  if (!dateString) return 'N/A'
  return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString))
}

// Actions
const refreshData = async () => {
  await Promise.all([attributeStore.fetchAllAttributes(), variantStore.fetchVariants()])
}

const clearFilters = () => {
  searchQuery.value = ''
}

const openCreateAttributeModal = () => {
  // TODO: Implement create attribute modal
  console.log('Open create attribute modal for:', activeTab.value)
}

const exportAttributes = () => {
  // TODO: Implement export functionality
  console.log('Export attributes')
}

const editAttribute = attribute => {
  // TODO: Implement edit attribute modal
  console.log('Edit attribute:', attribute)
}

const viewAttributeUsage = attribute => {
  // TODO: Calculate actual usage from variants
  // This is placeholder data
  attributeUsage.value = {
    totalProducts: Math.floor(Math.random() * 50) + 1,
    totalVariants: Math.floor(Math.random() * 200) + 10,
    products: [
      { id: 1, name: 'Nike Air Force 1', variantCount: 12 },
      { id: 2, name: 'Adidas Ultraboost', variantCount: 8 },
      { id: 3, name: 'Converse Chuck Taylor', variantCount: 6 }
    ]
  }
  showUsageModal.value = true
}

const closeUsageModal = () => {
  showUsageModal.value = false
}

const deleteAttribute = async attribute => {
  if (confirm(`Bạn có chắc chắn muốn xóa ${getCurrentTabLabel().toLowerCase()} "${getAttributeName(attribute)}"?`)) {
    try {
      await attributeStore.deleteAttribute(activeTab.value, attribute.id)
    } catch (error) {
      console.error('Failed to delete attribute:', error)
    }
  }
}

const restoreAttribute = async attribute => {
  try {
    await attributeStore.updateAttribute(activeTab.value, attribute.id, { deleted: false })
  } catch (error) {
    console.error('Failed to restore attribute:', error)
  }
}

const bulkEdit = () => {
  // TODO: Implement bulk edit functionality
  console.log('Bulk edit attributes:', selectedAttributes.value)
}

const bulkDelete = async () => {
  if (confirm(`Bạn có chắc chắn muốn xóa ${selectedAttributes.value.length} thuộc tính đã chọn?`)) {
    try {
      await Promise.all(selectedAttributes.value.map(id => attributeStore.deleteAttribute(activeTab.value, id)))
      selectedAttributes.value = []
    } catch (error) {
      console.error('Failed to bulk delete attributes:', error)
    }
  }
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
/* Use same base styles as other admin views */
.attribute-management {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0;
}

.attribute-header {
  margin-bottom: var(--spacing-3xl);
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
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

.attribute-title {
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

.tab-navigation {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xl);
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
  box-shadow: var(--shadow-sm);
}

.tab-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border: none;
  background: transparent;
  color: var(--gray-600);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-xs);
}

.tab-button.active {
  background: var(--primary-500);
  color: white;
  box-shadow: var(--shadow-sm);
}

.tab-button:hover:not(.active) {
  background: var(--gray-100);
  color: var(--gray-800);
}

.tab-icon {
  font-size: var(--font-size-lg);
}

.tab-count {
  font-size: var(--font-size-xs);
  opacity: 0.8;
}

.tab-content {
  min-height: 400px;
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

.table-container {
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

.attribute-row:hover {
  background: var(--gray-50);
}

.attribute-code {
  font-family: monospace;
  font-weight: var(--font-weight-bold);
  color: var(--primary-600);
}

.attribute-name {
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

.color-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.color-swatch {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid var(--border);
  box-shadow: var(--shadow-sm);
}

.color-code {
  font-family: monospace;
  font-size: var(--font-size-xs);
  color: var(--gray-600);
}

.size-eu {
  background: var(--gray-100);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.material-type {
  background: var(--info-100);
  color: var(--info-800);
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

.status-badge.active {
  background: var(--success-100);
  color: var(--success-800);
}

.status-badge.inactive {
  background: var(--error-100);
  color: var(--error-800);
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

/* Modal Styles */
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

.modal-content {
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border);
}

.modal-header h3 {
  margin: 0;
  color: var(--gray-900);
  font-weight: var(--font-weight-bold);
}

.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--gray-500);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
}

.modal-close:hover {
  background: var(--gray-100);
}

.modal-body {
  padding: var(--spacing-lg);
  max-height: 60vh;
  overflow-y: auto;
}

.usage-stats {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--gray-50);
  border-radius: var(--radius-lg);
}

.usage-stat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.usage-label {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}

.usage-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-600);
}

.usage-products h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--gray-900);
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.product-name {
  font-weight: var(--font-weight-semibold);
  color: var(--gray-900);
}

.product-variants {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
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

  .tab-navigation {
    grid-template-columns: repeat(2, 1fr);
  }

  .usage-stats {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .modal-content {
    width: 95%;
    margin: var(--spacing-md);
  }
}
</style>
