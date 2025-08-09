<!-- Warranty Management System - Matches ERD phiếu_bảo_hành & kích_thử_bảo_hành -->
<template>
  <div class="warranty-management">
    <!-- Header Section -->
    <div class="warranty-header">
      <div class="header-content">
        <h1 class="warranty-title">
          <span class="icon">🛡️</span>
          Quản lý Bảo hành
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
            @click="openCreateWarrantyModal"
          >
            <span class="icon">➕</span>
            Tạo phiếu bảo hành
          </Button>
          <Button 
            variant="primary" 
            @click="exportWarrantyReport"
          >
            <span class="icon">📊</span>
            Xuất báo cáo
          </Button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card fade-in" style="animation-delay: 0.1s">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <h3>{{ warrantyStats.total }}</h3>
          <p>Tổng phiếu bảo hành</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.2s">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <h3>{{ warrantyStats.active }}</h3>
          <p>Đang hiệu lực</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.3s">
        <div class="stat-icon">⚠️</div>
        <div class="stat-info">
          <h3>{{ warrantyStats.expiringSoon }}</h3>
          <p>Sắp hết hạn</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.4s">
        <div class="stat-icon">🔧</div>
        <div class="stat-info">
          <h3>{{ warrantyStats.totalRepairs }}</h3>
          <p>Lượt sửa chữa</p>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="tab-navigation">
      <button 
        class="tab-button"
        :class="{ active: activeTab === 'warranties' }"
        @click="activeTab = 'warranties'"
      >
        Phiếu bảo hành
      </button>
      <button 
        class="tab-button"
        :class="{ active: activeTab === 'repairs' }"
        @click="activeTab = 'repairs'"
      >
        Sửa chữa bảo hành
      </button>
      <button 
        class="tab-button"
        :class="{ active: activeTab === 'expiring' }"
        @click="activeTab = 'expiring'"
      >
        Sắp hết hạn
      </button>
    </div>

    <!-- Warranties Tab -->
    <div v-if="activeTab === 'warranties'" class="tab-content">
      <!-- Filters Section -->
      <div class="filters-section">
        <div class="filters-row">
          <div class="search-box">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Tìm kiếm phiếu bảo hành..."
              class="search-input"
            >
            <span class="search-icon">🔍</span>
          </div>
          
          <select v-model="statusFilter" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hiệu lực</option>
            <option value="expired">Đã hết hạn</option>
            <option value="used">Đã sử dụng</option>
          </select>

          <Button variant="outline" @click="clearFilters">
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      <!-- Warranties Table -->
      <div class="table-container">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Mã bảo hành</th>
                <th>Sản phẩm</th>
                <th>Ngày bắt đầu</th>
                <th>Ngày hết hạn</th>
                <th>Thời gian còn lại</th>
                <th>Trạng thái</th>
                <th>Lượt sửa chữa</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="warranty in filteredWarranties" :key="warranty.id" class="warranty-row">
                <td>
                  <div class="warranty-code">{{ warranty.ma_bao_hanh }}</div>
                </td>
                <td>
                  <div class="product-info">
                    <div class="product-name">{{ getProductName(warranty.id_chi_tiet_san_pham) }}</div>
                  </div>
                </td>
                <td>
                  <span class="date">{{ formatDate(warranty.ngày_bat_đau) }}</span>
                </td>
                <td>
                  <span class="date">{{ formatDate(warranty.ngày_hết_han) }}</span>
                </td>
                <td>
                  <span 
                    class="time-remaining"
                    :class="getTimeRemainingClass(warranty.ngày_hết_han)"
                  >
                    {{ getTimeRemaining(warranty.ngày_hết_han) }}
                  </span>
                </td>
                <td>
                  <span 
                    class="status-badge"
                    :class="getWarrantyStatus(warranty)"
                  >
                    {{ getWarrantyStatusText(warranty) }}
                  </span>
                </td>
                <td>
                  <span class="repair-count">
                    {{ getRepairCount(warranty.id) }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <Button 
                      variant="outline" 
                      size="sm"
                      @click="viewWarrantyDetails(warranty)"
                    >
                      Chi tiết
                    </Button>
                    <Button 
                      variant="success" 
                      size="sm"
                      @click="createRepair(warranty)"
                      :disabled="isWarrantyExpired(warranty)"
                    >
                      Sửa chữa
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      @click="deleteWarranty(warranty.id)"
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
        <div v-if="filteredWarranties.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">🛡️</div>
          <h3>Không có phiếu bảo hành nào</h3>
          <p>Chưa có phiếu bảo hành nào được tạo</p>
          <Button variant="primary" @click="openCreateWarrantyModal">
            Tạo phiếu bảo hành đầu tiên
          </Button>
        </div>
      </div>
    </div>

    <!-- Repairs Tab -->
    <div v-if="activeTab === 'repairs'" class="tab-content">
      <!-- Repairs Table -->
      <div class="table-container">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Mã bảo hành</th>
                <th>Ngày sửa chữa</th>
                <th>Chi tiết</th>
                <th>Phương thức</th>
                <th>Chi phí</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="repair in filteredRepairs" :key="repair.id" class="repair-row">
                <td>
                  <div class="warranty-code">{{ getWarrantyCode(repair.id_phieu_bao_hanh) }}</div>
                </td>
                <td>
                  <span class="date">{{ formatDate(repair.ngày_bảo_hành) }}</span>
                </td>
                <td>
                  <div class="repair-details">{{ repair.chi_zin }}</div>
                </td>
                <td>
                  <span class="repair-method">{{ repair.phương_thục_sửa_chữa }}</span>
                </td>
                <td>
                  <span class="repair-cost">{{ formatCurrency(repair.chi_phi) }}</span>
                </td>
                <td>
                  <span 
                    class="status-badge"
                    :class="repair.trang_thai"
                  >
                    {{ getRepairStatusText(repair.trang_thai) }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <Button 
                      variant="outline" 
                      size="sm"
                      @click="editRepair(repair)"
                    >
                      Sửa
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      @click="deleteRepair(repair.id)"
                    >
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Expiring Tab -->
    <div v-if="activeTab === 'expiring'" class="tab-content">
      <div class="expiring-warning">
        <div class="warning-icon">⚠️</div>
        <div class="warning-text">
          <h3>Phiếu bảo hành sắp hết hạn</h3>
          <p>Các phiếu bảo hành dưới đây sẽ hết hạn trong vòng 30 ngày tới</p>
        </div>
      </div>

      <div class="table-container">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Mã bảo hành</th>
                <th>Sản phẩm</th>
                <th>Ngày hết hạn</th>
                <th>Ngày còn lại</th>
                <th>Mức độ ưu tiên</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="warranty in expiringWarranties" :key="warranty.id" class="expiring-row">
                <td>
                  <div class="warranty-code urgent">{{ warranty.ma_bao_hanh }}</div>
                </td>
                <td>
                  <div class="product-info">
                    <div class="product-name">{{ getProductName(warranty.id_chi_tiet_san_pham) }}</div>
                  </div>
                </td>
                <td>
                  <span class="date urgent">{{ formatDate(warranty.ngày_hết_han) }}</span>
                </td>
                <td>
                  <span 
                    class="days-remaining"
                    :class="getDaysRemainingClass(warranty.ngày_hết_han)"
                  >
                    {{ getDaysRemaining(warranty.ngày_hết_han) }}
                  </span>
                </td>
                <td>
                  <span 
                    class="priority-badge"
                    :class="getPriorityClass(warranty.ngày_hết_han)"
                  >
                    {{ getPriorityText(warranty.ngày_hết_han) }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <Button 
                      variant="primary" 
                      size="sm"
                      @click="extendWarranty(warranty)"
                    >
                      Gia hạn
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      @click="notifyCustomer(warranty)"
                    >
                      Thông báo
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWarrantyStore } from '@/stores/enhanced/warrantyStore.js'
import { useProductVariantStore } from '@/stores/enhanced/productVariantStore.js'
import Button from '@/components/ui/Button.vue'

// Stores
const warrantyStore = useWarrantyStore()
const variantStore = useProductVariantStore()

// State
const activeTab = ref('warranties')
const searchQuery = ref('')
const statusFilter = ref('')

// Loading state
const loading = computed(() => warrantyStore.loading)

// Stats
const warrantyStats = computed(() => warrantyStore.warrantyStats)

// Filtered data
const filteredWarranties = computed(() => {
  let filtered = warrantyStore.searchWarranties(searchQuery.value)
  
  if (statusFilter.value) {
    filtered = warrantyStore.filterWarrantiesByStatus(statusFilter.value)
  }
  
  return filtered
})

const filteredRepairs = computed(() => warrantyStore.getAllWarrantyRepairs)

const expiringWarranties = computed(() => warrantyStore.getExpiringWarranties)

// Helper functions
const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(dateString))
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0)
}

const getProductName = (variantId) => {
  const variant = variantStore.getVariantWithDetails(variantId)
  return variant?.ten_san_pham || 'N/A'
}

const getWarrantyCode = (warrantyId) => {
  const warranty = warrantyStore.getWarrantyById(warrantyId)
  return warranty?.ma_bao_hanh || 'N/A'
}

const getRepairCount = (warrantyId) => {
  return warrantyStore.getRepairsByWarrantyId(warrantyId).length
}

const getTimeRemaining = (expireDate) => {
  const now = new Date()
  const expire = new Date(expireDate)
  const diffTime = expire - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'Đã hết hạn'
  if (diffDays === 0) return 'Hết hạn hôm nay'
  if (diffDays === 1) return '1 ngày'
  return `${diffDays} ngày`
}

const getTimeRemainingClass = (expireDate) => {
  const now = new Date()
  const expire = new Date(expireDate)
  const diffDays = Math.ceil((expire - now) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'expired'
  if (diffDays <= 7) return 'urgent'
  if (diffDays <= 30) return 'warning'
  return 'normal'
}

const getDaysRemaining = (expireDate) => {
  const now = new Date()
  const expire = new Date(expireDate)
  const diffDays = Math.ceil((expire - now) / (1000 * 60 * 60 * 24))
  return `${diffDays} ngày`
}

const getDaysRemainingClass = (expireDate) => {
  const now = new Date()
  const expire = new Date(expireDate)
  const diffDays = Math.ceil((expire - now) / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 7) return 'urgent'
  if (diffDays <= 14) return 'warning'
  return 'normal'
}

const getPriorityClass = (expireDate) => {
  const now = new Date()
  const expire = new Date(expireDate)
  const diffDays = Math.ceil((expire - now) / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 7) return 'high'
  if (diffDays <= 14) return 'medium'
  return 'low'
}

const getPriorityText = (expireDate) => {
  const now = new Date()
  const expire = new Date(expireDate)
  const diffDays = Math.ceil((expire - now) / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 7) return 'Cao'
  if (diffDays <= 14) return 'Trung bình'
  return 'Thấp'
}

const getWarrantyStatus = (warranty) => {
  const now = new Date()
  const expire = new Date(warranty.ngày_hết_han)
  
  if (expire < now) return 'expired'
  if (warranty.trang_thai === 'used') return 'used'
  return 'active'
}

const getWarrantyStatusText = (warranty) => {
  const status = getWarrantyStatus(warranty)
  const statusMap = {
    active: 'Đang hiệu lực',
    expired: 'Đã hết hạn',
    used: 'Đã sử dụng'
  }
  return statusMap[status] || status
}

const getRepairStatusText = (status) => {
  const statusMap = {
    pending: 'Đang xử lý',
    in_progress: 'Đang sửa chữa',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  }
  return statusMap[status] || status
}

const isWarrantyExpired = (warranty) => {
  const now = new Date()
  const expire = new Date(warranty.ngày_hết_han)
  return expire < now
}

// Actions
const refreshData = async () => {
  await Promise.all([
    warrantyStore.fetchAll(),
    variantStore.fetchVariants()
  ])
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

const openCreateWarrantyModal = () => {
  // TODO: Implement create warranty modal
  console.log('Open create warranty modal')
}

const exportWarrantyReport = () => {
  // TODO: Implement warranty report export
  console.log('Export warranty report')
}

const viewWarrantyDetails = (warranty) => {
  // TODO: Implement warranty details modal
  console.log('View warranty details:', warranty)
}

const createRepair = (warranty) => {
  // TODO: Implement create repair modal
  console.log('Create repair for warranty:', warranty)
}

const deleteWarranty = async (warrantyId) => {
  if (confirm('Bạn có chắc chắn muốn xóa phiếu bảo hành này?')) {
    try {
      await warrantyStore.deleteWarranty(warrantyId)
    } catch (error) {
      console.error('Failed to delete warranty:', error)
    }
  }
}

const editRepair = (repair) => {
  // TODO: Implement edit repair modal
  console.log('Edit repair:', repair)
}

const deleteRepair = async (repairId) => {
  if (confirm('Bạn có chắc chắn muốn xóa sửa chữa này?')) {
    try {
      await warrantyStore.deleteWarrantyRepair(repairId)
    } catch (error) {
      console.error('Failed to delete repair:', error)
    }
  }
}

const extendWarranty = (warranty) => {
  // TODO: Implement extend warranty functionality
  console.log('Extend warranty:', warranty)
}

const notifyCustomer = (warranty) => {
  // TODO: Implement customer notification
  console.log('Notify customer about warranty:', warranty)
}

// Lifecycle
onMounted(() => {
  refreshData()
})
</script>

<style scoped>
/* Use same styles as ProductVariants.vue for consistency */
.warranty-management {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0;
}

.warranty-header {
  margin-bottom: var(--spacing-3xl);
  background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
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

.warranty-title {
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

.tab-navigation {
  display: flex;
  gap: 0;
  margin-bottom: var(--spacing-xl);
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xs);
  box-shadow: var(--shadow-sm);
}

.tab-button {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  background: transparent;
  color: var(--gray-600);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
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

.filter-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  font-size: var(--font-size-sm);
  min-width: 150px;
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

.warranty-row:hover,
.repair-row:hover,
.expiring-row:hover {
  background: var(--gray-50);
}

.warranty-code {
  font-family: monospace;
  font-weight: var(--font-weight-bold);
  color: var(--primary-600);
}

.warranty-code.urgent {
  color: var(--error-600);
}

.date {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}

.date.urgent {
  color: var(--error-600);
  font-weight: var(--font-weight-bold);
}

.time-remaining.expired {
  color: var(--error-600);
  font-weight: var(--font-weight-bold);
}

.time-remaining.urgent {
  color: var(--warning-600);
  font-weight: var(--font-weight-bold);
}

.time-remaining.warning {
  color: var(--warning-600);
}

.time-remaining.normal {
  color: var(--success-600);
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

.status-badge.expired {
  background: var(--error-100);
  color: var(--error-800);
}

.status-badge.used {
  background: var(--gray-100);
  color: var(--gray-800);
}

.status-badge.pending {
  background: var(--warning-100);
  color: var(--warning-800);
}

.status-badge.in_progress {
  background: var(--info-100);
  color: var(--info-800);
}

.status-badge.completed {
  background: var(--success-100);
  color: var(--success-800);
}

.status-badge.cancelled {
  background: var(--error-100);
  color: var(--error-800);
}

.days-remaining.urgent {
  color: var(--error-600);
  font-weight: var(--font-weight-bold);
}

.days-remaining.warning {
  color: var(--warning-600);
  font-weight: var(--font-weight-semibold);
}

.days-remaining.normal {
  color: var(--info-600);
}

.priority-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.priority-badge.high {
  background: var(--error-100);
  color: var(--error-800);
}

.priority-badge.medium {
  background: var(--warning-100);
  color: var(--warning-800);
}

.priority-badge.low {
  background: var(--info-100);
  color: var(--info-800);
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

.expiring-warning {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  background: var(--warning-50);
  border: 1px solid var(--warning-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.warning-icon {
  font-size: 3rem;
  color: var(--warning-600);
  flex-shrink: 0;
}

.warning-text h3 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--warning-800);
  font-weight: var(--font-weight-bold);
}

.warning-text p {
  margin: 0;
  color: var(--warning-700);
}

.repair-details {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.repair-cost {
  font-weight: var(--font-weight-semibold);
  color: var(--primary-600);
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
    flex-direction: column;
  }
  
  .expiring-warning {
    flex-direction: column;
    text-align: center;
  }
}
</style>