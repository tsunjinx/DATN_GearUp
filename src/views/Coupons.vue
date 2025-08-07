<template>
  <div class="coupons-page">
    <!-- Coupons Header with Action Buttons -->
    <div class="coupons-header">
      <div class="header-content">
        <h1 class="coupons-title">
          <img class="coupons-icon" src="@/assets/coupons.png" alt="Coupons" />
          Quản lý Phiếu giảm giá
        </h1>
        <div class="header-actions">
          <button class="btn btn-success" @click="showAddModal = true">
            <i class="btn-icon">➕</i>
            Tạo phiếu giảm giá
          </button>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section card fade-in" style="animation-delay: 0.3s">
      <div class="card-body">
        <div class="filter-header">
          <h3 class="filter-title">
            <i class="filter-icon">🔍</i>
            Bộ lọc & Tìm kiếm
          </h3>
        </div>

        <div class="filter-controls">
          <div class="search-group">
            <label>Tìm kiếm phiếu giảm giá</label>
            <div class="search-input-wrapper">
              <input v-model="searchTerm" type="text" placeholder="Nhập mã hoặc mô tả phiếu giảm giá..."
                class="form-control search-input" />
              <i class="search-icon">🔍</i>
            </div>
          </div>

          <div class="filter-group">
            <label>Trạng thái</label>
            <select v-model="selectedStatus" class="form-control filter-select">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Có thể sử dụng</option>
              <option value="used">Đã hết lượt</option>
              <option value="expired">Đã hết hạn</option>
              <option value="disabled">Đã vô hiệu hóa</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Loại giảm giá</label>
            <select v-model="selectedType" class="form-control filter-select">
              <option value="">Tất cả loại</option>
              <option value="percentage">Giảm phần trăm</option>
              <option value="fixed">Giảm tiền cố định</option>
            </select>
          </div>
        </div>

        <div class="filter-summary">
          <span class="summary-text">
            Hiển thị {{ filteredCoupons.length }} trong tổng số {{ sampleCoupons.length }} phiếu giảm giá
          </span>
          <button v-if="hasActiveFilters" @click="clearFilters" class="btn btn-outline btn-sm">
            <i class="btn-icon">🗑️</i>
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Coupons Grid -->
    <div class="coupons-grid fade-in" style="animation-delay: 0.5s">
      <div v-for="coupon in filteredCoupons" :key="coupon.id" class="coupon-card" :class="{
        'coupon-expired': isExpired(coupon.expiryDate),
        'coupon-disabled': !coupon.isActive,
        'coupon-used': coupon.maxUses && coupon.usedCount >= coupon.maxUses
      }">
        <!-- Coupon Header -->
        <div class="coupon-header">
          <div class="coupon-code-section">
            <div class="coupon-code">{{ coupon.code }}</div>
            <div class="coupon-type-badge" :class="`type-${coupon.type}`">
              {{ coupon.type === 'percentage' ? 'Giảm %' : 'Giảm tiền' }}
            </div>
          </div>
          <div class="status-badge-wrapper">
            <span class="status-badge" :class="`status-${getCouponStatus(coupon)}`">
              {{ getStatusText(getCouponStatus(coupon)) }}
            </span>
          </div>
        </div>

        <!-- Coupon Body -->
        <div class="coupon-body">
          <div class="coupon-value-section">
            <div class="discount-value">
              <span class="value-number">{{ coupon.value }}</span>
              <span class="value-unit">{{ coupon.type === 'percentage' ? '%' : 'VNĐ' }}</span>
            </div>
            <div class="coupon-description">{{ coupon.description }}</div>
          </div>

          <div class="coupon-details">
            <div class="detail-row">
              <div class="detail-item">
                <i class="detail-icon">📅</i>
                <div class="detail-content">
                  <span class="detail-label">Hạn sử dụng</span>
                  <span class="detail-value">{{ formatDate(coupon.expiryDate) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-row">
              <div class="detail-item">
                <i class="detail-icon">📊</i>
                <div class="detail-content">
                  <span class="detail-label">Đã sử dụng</span>
                  <span class="detail-value">{{ coupon.usedCount }}/{{ coupon.maxUses || '∞' }}</span>
                </div>
              </div>

              <div class="usage-progress">
                <div class="progress-bar" :style="{ width: getUsagePercentage(coupon) + '%' }"></div>
              </div>
            </div>

            <div v-if="coupon.minOrderValue" class="detail-row">
              <div class="detail-item">
                <i class="detail-icon">💰</i>
                <div class="detail-content">
                  <span class="detail-label">Đơn tối thiểu</span>
                  <span class="detail-value">{{ formatCurrency(coupon.minOrderValue) }}</span>
                </div>
              </div>
            </div>

            <div v-if="coupon.maxDiscountAmount && coupon.type === 'percentage'" class="detail-row">
              <div class="detail-item">
                <i class="detail-icon">🎯</i>
                <div class="detail-content">
                  <span class="detail-label">Giảm tối đa</span>
                  <span class="detail-value">{{ formatCurrency(coupon.maxDiscountAmount) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coupon Actions -->
        <div class="coupon-actions">
          <button class="btn btn-outline btn-sm" @click="editCoupon(coupon)">
            <i class="btn-icon">✏️</i>
            Chỉnh sửa
          </button>
          <button class="btn btn-sm" :class="coupon.isActive ? 'btn-warning' : 'btn-success'"
            @click="toggleStatus(coupon)">
            <i class="btn-icon">{{ coupon.isActive ? '🚫' : '✅' }}</i>
            {{ coupon.isActive ? 'Vô hiệu hóa' : 'Kích hoạt' }}
          </button>
          <button class="btn btn-sm btn-danger" @click="deleteCoupon(coupon.id)">
            <i class="btn-icon">🗑️</i>
            Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredCoupons.length === 0" class="empty-state">
      <div class="empty-icon">🎫</div>
      <h3>Không tìm thấy phiếu giảm giá</h3>
      <p>{{ searchTerm || selectedStatus ? 'Thử thay đổi bộ lọc để xem kết quả khác' : 'Tạo phiếu giảm giá đầu tiên của bạn' }}</p>
      <button v-if="!searchTerm && !selectedStatus" class="btn btn-primary" @click="showAddModal = true">
        <i class="btn-icon">➕</i>
        Tạo phiếu giảm giá đầu tiên
      </button>
    </div>

    <!-- Add/Edit Coupon Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="modal-icon">{{ showAddModal ? '➕' : '✏️' }}</i>
            {{ showAddModal ? 'Tạo phiếu giảm giá mới' : 'Chỉnh sửa phiếu giảm giá' }}
          </h3>
          <button class="modal-close" @click="closeModal">
            <i class="close-icon">✕</i>
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveCoupon" class="coupon-form">
            <div class="form-grid">
              <!-- Left Column -->
              <div class="form-column">
                <div class="form-group">
                  <label for="code" class="form-label">
                    <i class="label-icon">🎫</i>
                    Mã phiếu giảm giá *
                  </label>
                  <div class="input-group">
                    <input id="code" v-model="couponForm.code" type="text" required placeholder="Ví dụ: SUMMER2024"
                      class="form-control" />
                    <button type="button" class="btn btn-outline btn-sm" @click="generateCode">
                      <i class="btn-icon">🎲</i>
                      Tạo tự động
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label for="description" class="form-label">
                    <i class="label-icon">📝</i>
                    Mô tả *
                  </label>
                  <textarea id="description" v-model="couponForm.description" required rows="3"
                    placeholder="Mô tả chi tiết về phiếu giảm giá..." class="form-control"></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="type" class="form-label">
                      <i class="label-icon">🏷️</i>
                      Loại giảm giá *
                    </label>
                    <select id="type" v-model="couponForm.type" required class="form-control">
                      <option value="">Chọn loại giảm giá</option>
                      <option value="percentage">Giảm phần trăm (%)</option>
                      <option value="fixed">Giảm tiền cố định (VNĐ)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="value" class="form-label">
                      <i class="label-icon">💰</i>
                      Giá trị giảm *
                    </label>
                    <div class="input-with-unit">
                      <input id="value" v-model.number="couponForm.value" type="number" required :min="1"
                        :max="couponForm.type === 'percentage' ? 100 : undefined" placeholder="0"
                        class="form-control" />
                      <span class="input-unit">
                        {{ couponForm.type === 'percentage' ? '%' : 'VNĐ' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="form-column">
                <div class="form-group">
                  <label for="expiryDate" class="form-label">
                    <i class="label-icon">📅</i>
                    Ngày hết hạn *
                  </label>
                  <input id="expiryDate" v-model="couponForm.expiryDate" type="datetime-local" required
                    class="form-control" />
                </div>

                <div class="form-group">
                  <label for="maxUses" class="form-label">
                    <i class="label-icon">📊</i>
                    Số lượt sử dụng tối đa
                  </label>
                  <input id="maxUses" v-model.number="couponForm.maxUses" type="number" min="1"
                    placeholder="Không giới hạn" class="form-control" />
                  <div class="form-hint">Để trống nếu không giới hạn số lượt sử dụng</div>
                </div>

                <div class="form-group">
                  <label for="minOrderValue" class="form-label">
                    <i class="label-icon">🛒</i>
                    Giá trị đơn hàng tối thiểu
                  </label>
                  <input id="minOrderValue" v-model.number="couponForm.minOrderValue" type="number" min="0"
                    placeholder="0" class="form-control" />
                  <div class="form-hint">Đơn hàng phải có giá trị tối thiểu để áp dụng</div>
                </div>

                <div v-if="couponForm.type === 'percentage'" class="form-group">
                  <label for="maxDiscountAmount" class="form-label">
                    <i class="label-icon">🎯</i>
                    Số tiền giảm tối đa
                  </label>
                  <input id="maxDiscountAmount" v-model.number="couponForm.maxDiscountAmount" type="number" min="0"
                    placeholder="Không giới hạn" class="form-control" />
                  <div class="form-hint">Giới hạn số tiền giảm tối đa cho phiếu giảm theo %</div>
                </div>
              </div>
            </div>

            <div class="form-status">
              <label class="checkbox-wrapper">
                <input v-model="couponForm.isActive" type="checkbox" class="form-checkbox" />
                <span class="checkbox-mark"></span>
                <span class="checkbox-label">
                  <i class="checkbox-icon">✅</i>
                  Kích hoạt phiếu giảm giá ngay sau khi tạo
                </span>
              </label>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-outline" @click="closeModal">
            <i class="btn-icon">❌</i>
            Hủy
          </button>
          <button type="submit" class="btn btn-primary" @click="saveCoupon">
            <i class="btn-icon">{{ showAddModal ? '➕' : '💾' }}</i>
            {{ showAddModal ? 'Tạo phiếu giảm giá' : 'Cập nhật' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useButtonAnimations } from '@/composables/useButtonAnimations.js'

// Button animations composable
const { staggeredFadeIn } = useButtonAnimations()

const searchTerm = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCoupon = ref(null)

const couponForm = ref({
  code: '',
  description: '',
  type: '',
  value: 0,
  maxUses: null,
  expiryDate: '',
  minOrderValue: 0,
  maxDiscountAmount: 0,
  isActive: true
})

// Computed properties
const filteredCoupons = computed(() => {
  let coupons = sampleCoupons.value

  if (searchTerm.value) {
    coupons = coupons.filter(coupon =>
      coupon.code.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (selectedStatus.value) {
    coupons = coupons.filter(coupon => {
      const status = getCouponStatus(coupon)
      return status === selectedStatus.value
    })
  }

  if (selectedType.value) {
    coupons = coupons.filter(coupon => coupon.type === selectedType.value)
  }

  return coupons
})

const hasActiveFilters = computed(() => {
  return searchTerm.value || selectedStatus.value || selectedType.value
})

const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const sampleCoupons = ref([
  {
    id: 1,
    code: 'SUMMER2024',
    description: 'Giảm 15% cho mùa hè',
    type: 'percentage',
    value: 15,
    maxUses: 100,
    usedCount: 25,
    expiryDate: new Date('2024-08-31'),
    minOrderValue: 1000000,
    maxDiscountAmount: 500000,
    isActive: true
  },
  {
    id: 2,
    code: 'NEWCUSTOMER',
    description: 'Giảm 200,000 VNĐ cho khách hàng mới',
    type: 'fixed',
    value: 200000,
    maxUses: 50,
    usedCount: 12,
    expiryDate: new Date('2024-12-31'),
    minOrderValue: 1500000,
    maxDiscountAmount: 0,
    isActive: true
  },
  {
    id: 3,
    code: 'FLASHSALE50',
    description: 'Flash sale giảm 50%',
    type: 'percentage',
    value: 50,
    maxUses: 10,
    usedCount: 10,
    expiryDate: new Date('2024-07-31'),
    minOrderValue: 2000000,
    maxDiscountAmount: 1000000,
    isActive: false
  }
])

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const isExpired = (expiryDate) => {
  return new Date(expiryDate) < new Date()
}

const getCouponStatus = (coupon) => {
  if (isExpired(coupon.expiryDate)) return 'expired'
  if (!coupon.isActive) return 'disabled'
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return 'used'
  return 'active'
}

const getStatusText = (status) => {
  const statusMap = {
    active: 'Có thể sử dụng',
    used: 'Đã hết lượt',
    expired: 'Đã hết hạn',
    disabled: 'Đã vô hiệu hóa'
  }
  return statusMap[status] || status
}

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  couponForm.value.code = code
}

const getUsagePercentage = (coupon) => {
  if (!coupon.maxUses) return 0
  return Math.round((coupon.usedCount / coupon.maxUses) * 100)
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedStatus.value = ''
  selectedType.value = ''
}

const editCoupon = (coupon) => {
  editingCoupon.value = coupon
  couponForm.value = {
    ...coupon,
    expiryDate: new Date(coupon.expiryDate).toISOString().slice(0, 16)
  }
  showEditModal.value = true
}

const toggleStatus = (coupon) => {
  coupon.isActive = !coupon.isActive
}

const deleteCoupon = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa phiếu giảm giá này?')) {
    sampleCoupons.value = sampleCoupons.value.filter(c => c.id !== id)
  }
}

const saveCoupon = () => {
  if (showAddModal.value) {
    const newCoupon = {
      ...couponForm.value,
      id: Date.now(),
      usedCount: 0,
      expiryDate: new Date(couponForm.value.expiryDate)
    }
    sampleCoupons.value.push(newCoupon)
  } else {
    const index = sampleCoupons.value.findIndex(c => c.id === editingCoupon.value.id)
    if (index !== -1) {
      sampleCoupons.value[index] = {
        ...couponForm.value,
        usedCount: sampleCoupons.value[index].usedCount,
        expiryDate: new Date(couponForm.value.expiryDate)
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCoupon.value = null
  couponForm.value = {
    code: '',
    description: '',
    type: '',
    value: 0,
    maxUses: null,
    expiryDate: '',
    minOrderValue: 0,
    maxDiscountAmount: 0,
    isActive: true
  }
}

// Add lifecycle hook
onMounted(() => {
  // Add staggered animations to header buttons
  staggeredFadeIn('.page-header', 100)
})
</script>

<style scoped>
/* Coupons Header */
.coupons-header {
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

.coupons-title {
  margin: 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.coupons-icon {
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.coupons-title:hover .coupons-icon {
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  transform: scale(1.1);
}

/* Modern Green Theme Styles */
.coupons-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
}

.header-content .page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
}

.page-subtitle {
  margin: 8px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
  font-weight: 400;
}

/* Button Styles */
.btn {
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(34, 197, 94, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 rgba(34, 197, 94, 0.4);
}

.btn-outline {
  background: transparent;
  color: #22c55e;
  border: 2px solid #22c55e;
}

.btn-outline:hover {
  background: #22c55e;
  color: white;
}

.btn-success {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.btn-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.btn-icon {
  font-size: 16px;
}

/* Card Styles */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.card-body {
  padding: 24px;
}

/* Filters Section */
.filter-header {
  margin-bottom: 20px;
}

.filter-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-icon {
  font-size: 20px;
}

.filter-controls {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 16px;
}

.search-group,
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-group label,
.filter-group label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.search-input-wrapper {
  position: relative;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 18px;
}

.filter-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.summary-text {
  color: #6b7280;
  font-size: 14px;
}

/* Coupons Grid */
.coupons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.coupon-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  position: relative;
}

.coupon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
}

.coupon-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.coupon-expired::before {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
}

.coupon-disabled::before {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.coupon-used::before {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Coupon Header */
.coupon-header {
  padding: 20px 20px 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.coupon-code-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.coupon-code {
  font-size: 20px;
  font-weight: 700;
  color: #22c55e;
  font-family: 'Monaco', 'Consolas', monospace;
  letter-spacing: 1px;
}

.coupon-type-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-percentage {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.type-fixed {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

/* Status Badges */
.status-badge-wrapper {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-active {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.status-used {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.status-expired {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
}

.status-disabled {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

/* Coupon Body */
.coupon-body {
  padding: 16px 20px;
}

.coupon-value-section {
  margin-bottom: 16px;
}

.discount-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.value-number {
  font-size: 32px;
  font-weight: 800;
  color: #22c55e;
}

.value-unit {
  font-size: 18px;
  font-weight: 600;
  color: #16a34a;
}

.coupon-description {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

/* Coupon Details */
.coupon-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.detail-icon {
  font-size: 16px;
  color: #22c55e;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: #374151;
  font-weight: 600;
}

/* Usage Progress */
.usage-progress {
  width: 100px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  transition: width 0.3s ease;
}

/* Coupon Actions */
.coupon-actions {
  padding: 16px 20px 20px 20px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #374151;
}

.empty-state p {
  margin: 0 0 24px 0;
  font-size: 16px;
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.modal-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  font-size: 28px;
  color: #22c55e;
}

.modal-close {
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f3f4f6;
}

.close-icon {
  font-size: 24px;
  color: #6b7280;
}

.modal-body {
  padding: 0 24px 24px 24px;
}

.modal-footer {
  padding: 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Form Styles */
.coupon-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-icon {
  font-size: 16px;
  color: #22c55e;
}

.form-control {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.form-control.is-invalid {
  border-color: #ef4444;
}

.input-group {
  display: flex;
  gap: 8px;
}

.input-group .form-control {
  flex: 1;
}

.input-with-unit {
  position: relative;
}

.input-unit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-weight: 600;
  font-size: 14px;
}

.form-hint {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

.form-error {
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
}

/* Checkbox Styles */
.form-status {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  margin: 0;
}

.checkbox-label {
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-icon {
  font-size: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .filter-controls {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .coupons-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
}

@media (max-width: 480px) {
  .coupons-page {
    padding: 16px;
  }

  .page-header {
    padding: 20px;
  }

  .header-content .page-title {
    font-size: 24px;
  }

  .coupon-actions {
    flex-direction: column;
  }

  .coupon-actions .btn {
    justify-content: center;
  }
}

/* Page Animations */
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

.fade-in {
  animation: fadeInUp 0.6s ease-out both;
}

/* Override notification icon positioning for better alignment */
:deep(.notifications-btn) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 12px !important;
}

:deep(.notification-icon-wrapper) {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 24px !important;
  height: 24px !important;
}

:deep(.notification-icon) {
  display: block !important;
  margin: 0 auto !important;
}

:deep(.notification-pulse) {
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  width: 8px !important;
  height: 8px !important;
  background: var(--error) !important;
  border-radius: 50% !important;
  animation: simplePulse 2s infinite !important;
  pointer-events: none !important;
}

/* Smooth button transitions */
.page-header .btn {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.page-header .btn:hover {
  transform: translateY(-2px) scale(1.05);
}
</style>

.coupon-card:hover {
transform: translateY(-5px);
}

.coupon-card.expired {
opacity: 0.7;
border-left-color: #e74c3c;
}

.coupon-card.disabled {
opacity: 0.6;
border-left-color: #95a5a6;
}

.coupon-header {
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
padding: 20px;
display: flex;
justify-content: space-between;
align-items: center;
}

.coupon-code {
font-size: 20px;
font-weight: bold;
letter-spacing: 2px;
}

.coupon-body {
padding: 20px;
}

.coupon-value {
text-align: center;
margin-bottom: 20px;
}

.coupon-value .value {
display: block;
font-size: 28px;
font-weight: bold;
color: #2c3e50;
}

.coupon-value .description {
color: #7f8c8d;
font-size: 14px;
}

.coupon-details {
margin-bottom: 20px;
}

.detail-item {
display: flex;
justify-content: space-between;
margin-bottom: 8px;
font-size: 14px;
}

.detail-item .label {
font-weight: 500;
color: #2c3e50;
}

.coupon-actions {
display: flex;
gap: 8px;
flex-wrap: wrap;
}

.status-badge {
padding: 4px 12px;
border-radius: 20px;
font-size: 12px;
font-weight: 500;
}

.status-badge.active {
background: #d4edda;
color: #155724;
}

.status-badge.used {
background: #fff3cd;
color: #856404;
}

.status-badge.expired {
background: #f8d7da;
color: #721c24;
}

.status-badge.disabled {
background: #e2e3e5;
color: #495057;
}

.modal-overlay {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0,0,0,0.5);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
}

.modal {
background: white;
border-radius: 8px;
width: 90%;
max-width: 600px;
max-height: 90vh;
overflow-y: auto;
}

.modal-header {
padding: 20px;
border-bottom: 1px solid #dee2e6;
display: flex;
justify-content: space-between;
align-items: center;
}

.modal-header h3 {
margin: 0;
}

.close-btn {
background: none;
border: none;
font-size: 24px;
cursor: pointer;
color: #6c757d;
}

.modal-body {
padding: 20px;
}
