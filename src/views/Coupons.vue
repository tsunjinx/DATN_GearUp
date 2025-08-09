<template>
  <div class="coupons-page">
    <!-- Page Header Section -->
    <header class="page-header">
      <div class="header-content">
        <div class="page-title-section">
          <h1 class="page-title">
            <i class="title-icon">🎫</i>
            Quản lý Phiếu giảm giá
          </h1>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" @click="exportToExcel">
            <i class="btn-icon">📊</i>
            Xuất Excel
          </button>
          <button class="btn btn-primary" @click="openAddModal">
            <i class="btn-icon">➕</i>
            Tạo phiếu giảm giá mới
          </button>
        </div>
      </div>
    </header>

    <!-- Filters & Search Section -->
    <section class="filters-section">
      <div class="filters-wrapper">
        <div class="search-filter-row">
          <div class="search-group">
            <div class="search-input-wrapper">
              <i class="search-icon">🔍</i>
              <input v-model="searchTerm" type="text" placeholder="Tìm kiếm theo mã, mô tả..." class="search-input" />
            </div>
          </div>

          <div class="filter-controls">
            <select v-model="selectedStatus" class="filter-select">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Có thể sử dụng</option>
              <option value="used">Đã hết lượt</option>
              <option value="expired">Đã hết hạn</option>
              <option value="disabled">Đã vô hiệu hóa</option>
            </select>

            <select v-model="selectedType" class="filter-select">
              <option value="">Tất cả loại</option>
              <option value="percentage">Giảm phần trăm</option>
              <option value="fixed">Giảm tiền cố định</option>
            </select>

            <button v-if="hasActiveFilters" class="clear-filters-btn" @click="clearFilters">
              <i class="btn-icon">✕</i>
              Xóa bộ lọc
            </button>
          </div>
        </div>

        <div class="results-summary">Hiển thị {{ filteredCoupons.length }} / {{ sampleCoupons.length }} kết quả</div>
      </div>
    </section>

    <!-- Table Section -->
    <main class="table-section">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="hasError" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Có lỗi xảy ra</h3>
        <p>{{ errorMessage }}</p>
        <button class="btn btn-primary" @click="loadCoupons">
          <i class="btn-icon">🔄</i>
          Thử lại
        </button>
      </div>

      <div v-else-if="filteredCoupons.length === 0" class="empty-state">
        <div class="empty-icon">🎫</div>
        <h3>Không tìm thấy kết quả</h3>
        <p>
          {{
            searchTerm || selectedStatus || selectedType
              ? 'Thử thay đổi bộ lọc để xem kết quả khác'
              : 'Tạo phiếu giảm giá đầu tiên của bạn'
          }}
        </p>
        <button v-if="!searchTerm && !selectedStatus && !selectedType" class="btn btn-primary" @click="openAddModal">
          <i class="btn-icon">➕</i>
          Tạo phiếu giảm giá đầu tiên
        </button>
      </div>

      <div v-else class="table-container">
        <table class="coupons-table">
          <thead>
            <tr>
              <th class="col-stt">STT</th>
              <th class="col-code">Mã</th>
              <th class="col-name">Tên</th>
              <th class="col-value">Giá trị</th>
              <th class="col-quantity">Số lượng</th>
              <th class="col-start">Ngày bắt đầu</th>
              <th class="col-end">Ngày kết thúc</th>
              <th class="col-status">Trạng thái</th>
              <th class="col-actions">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(coupon, index) in filteredCoupons"
              :key="coupon.id"
              class="coupon-row"
              :data-coupon-id="coupon.id"
            >
              <td class="col-stt">
                {{ index + 1 }}
              </td>

              <td class="col-code">
                <div class="coupon-code">
                  {{ coupon.code }}
                </div>
              </td>

              <td class="col-name">
                <div class="coupon-name-info">
                  <div class="coupon-name">
                    {{ coupon.ten_phieu_giam_gia || coupon.description }}
                  </div>
                  <div class="coupon-description">
                    {{ coupon.description }}
                  </div>
                </div>
              </td>

              <td class="col-value">
                <div class="coupon-value">
                  <span class="value-number">{{ coupon.chi_phieu_giam_gia || coupon.value }}</span>
                  <span class="value-unit">{{ coupon.type === 'percentage' ? '%' : 'VNĐ' }}</span>
                </div>
                <div v-if="coupon.maxDiscountAmount && coupon.type === 'percentage'" class="max-discount">
                  Tối đa: {{ formatCurrency(coupon.maxDiscountAmount) }}
                </div>
              </td>

              <td class="col-quantity">
                <div class="quantity-info">
                  <div class="quantity-text">
                    {{ coupon.usedCount || 0 }}/{{ coupon.so_luong || coupon.maxUses || '∞' }}
                  </div>
                  <div class="quantity-progress">
                    <div class="progress-bar" :style="{ width: getUsagePercentage(coupon) + '%' }" />
                  </div>
                </div>
              </td>

              <td class="col-start">
                <div class="date-info">
                  <div class="date-main">
                    {{ formatDate(coupon.ngay_bat_dau || coupon.startDate) }}
                  </div>
                  <div class="date-status" :class="getCouponStartDateStatusClass(coupon)">
                    {{ getCouponStartDateStatusText(coupon) }}
                  </div>
                </div>
              </td>

              <td class="col-end">
                <div class="date-info">
                  <div class="date-main">
                    {{ formatDate(coupon.ngay_ket_thuc || coupon.expiryDate) }}
                  </div>
                  <div class="date-status" :class="getCouponEndDateStatusClass(coupon)">
                    {{ getCouponEndDateStatusText(coupon) }}
                  </div>
                </div>
              </td>

              <td class="col-status">
                <StatusBadge :status="getCouponStatus(coupon)" />
              </td>

              <td class="col-actions">
                <div class="action-buttons">
                  <button class="action-btn copy-btn" title="Sao chép mã" @click="copyCouponCode(coupon.code)">
                    <i class="btn-icon">📋</i>
                  </button>
                  <button class="action-btn edit-btn" title="Chỉnh sửa" @click="editCoupon(coupon)">
                    <i class="btn-icon">✏️</i>
                  </button>
                  <button
                    class="action-btn toggle-btn"
                    :class="[
                      coupon.isActive ? 'pause-btn' : 'play-btn',
                      { loading: uiState.toggleLoadingIds.has(coupon.id) }
                    ]"
                    :title="coupon.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'"
                    :disabled="uiState.toggleLoadingIds.has(coupon.id)"
                    @click="toggleCouponStatus(coupon)"
                  >
                    <i v-if="!uiState.toggleLoadingIds.has(coupon.id)" class="btn-icon">
                      {{ coupon.isActive ? '🚫' : '✅' }}
                    </i>
                  </button>
                  <button class="action-btn delete-btn" title="Xóa" @click="deleteCoupon(coupon.id)">
                    <i class="btn-icon">🗑️</i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Add/Edit Modal -->
    <teleport to="body">
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
            <form class="coupon-form" @submit.prevent="saveCoupon">
              <div class="form-grid">
                <!-- Left Column -->
                <div class="form-column">
                  <div class="form-group">
                    <label for="code" class="form-label">
                      <i class="label-icon">🎫</i>
                      Mã phiếu giảm giá *
                    </label>
                    <div class="input-group">
                      <input
                        id="code"
                        v-model="couponForm.code"
                        type="text"
                        required
                        placeholder="Ví dụ: SUMMER2024"
                        class="form-control"
                      />
                      <button type="button" class="btn btn-outline btn-sm" @click="generateCode">
                        <i class="btn-icon">🎲</i>
                        Tự động
                      </button>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="description" class="form-label">
                      <i class="label-icon">📝</i>
                      Mô tả *
                    </label>
                    <textarea
                      id="description"
                      v-model="couponForm.description"
                      required
                      rows="3"
                      placeholder="Mô tả chi tiết về phiếu giảm giá..."
                      class="form-control"
                    />
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
                        <input
                          id="value"
                          v-model.number="couponForm.value"
                          type="number"
                          required
                          :min="1"
                          :max="couponForm.type === 'percentage' ? 100 : undefined"
                          placeholder="0"
                          class="form-control"
                        />
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
                    <input
                      id="expiryDate"
                      v-model="couponForm.expiryDate"
                      type="datetime-local"
                      required
                      class="form-control"
                    />
                  </div>

                  <div class="form-group">
                    <label for="maxUses" class="form-label">
                      <i class="label-icon">📊</i>
                      Số lượt sử dụng tối đa
                    </label>
                    <input
                      id="maxUses"
                      v-model.number="couponForm.maxUses"
                      type="number"
                      min="1"
                      placeholder="Không giới hạn"
                      class="form-control"
                    />
                    <div class="form-hint">Để trống nếu không giới hạn số lượt sử dụng</div>
                  </div>

                  <div class="form-group">
                    <label for="minOrderValue" class="form-label">
                      <i class="label-icon">🛒</i>
                      Giá trị đơn hàng tối thiểu
                    </label>
                    <input
                      id="minOrderValue"
                      v-model.number="couponForm.minOrderValue"
                      type="number"
                      min="0"
                      placeholder="0"
                      class="form-control"
                    />
                    <div class="form-hint">Đơn hàng phải có giá trị tối thiểu để áp dụng</div>
                  </div>

                  <div v-if="couponForm.type === 'percentage'" class="form-group">
                    <label for="maxDiscountAmount" class="form-label">
                      <i class="label-icon">🎯</i>
                      Số tiền giảm tối đa
                    </label>
                    <input
                      id="maxDiscountAmount"
                      v-model.number="couponForm.maxDiscountAmount"
                      type="number"
                      min="0"
                      placeholder="Không giới hạn"
                      class="form-control"
                    />
                    <div class="form-hint">Giới hạn số tiền giảm tối đa cho phiếu giảm theo %</div>
                  </div>
                </div>
              </div>

              <div class="form-status">
                <label class="checkbox-wrapper">
                  <input v-model="couponForm.isActive" type="checkbox" class="form-checkbox" />
                  <span class="checkbox-mark" />
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
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { exportCouponsToExcel } from '@/utils/excelExport.js'

// Reactive state
const uiState = ref({
  isLoading: false,
  hasError: false,
  errorMessage: '',
  showAddModal: false,
  showEditModal: false,
  toggleLoadingIds: new Set() // Track which coupons are being toggled
})

const searchTerm = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
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

// Sample data
const sampleCoupons = ref([
  {
    id: 1,
    code: 'SUMMER2024',
    ten_phieu_giam_gia: 'Giảm giá mùa hè 2024',
    description: 'Giảm 15% cho mùa hè',
    type: 'percentage',
    value: 15,
    chi_phieu_giam_gia: 15,
    so_luong: 100,
    maxUses: 100, // Keep for backward compatibility
    usedCount: 25,
    ngay_bat_dau: new Date('2024-06-01'),
    ngay_ket_thuc: new Date('2024-08-31'),
    startDate: new Date('2024-06-01'), // Keep for backward compatibility
    expiryDate: new Date('2024-08-31'), // Keep for backward compatibility
    minOrderValue: 1000000,
    maxDiscountAmount: 500000,
    trang_thai: 'active',
    isActive: true,
    deleted: false
  },
  {
    id: 2,
    code: 'NEWCUSTOMER',
    ten_phieu_giam_gia: 'Ưu đãi khách hàng mới',
    description: 'Giảm 200,000 VNĐ cho khách hàng mới',
    type: 'fixed',
    value: 200000,
    chi_phieu_giam_gia: 200000,
    so_luong: 50,
    maxUses: 50, // Keep for backward compatibility
    usedCount: 12,
    ngay_bat_dau: new Date('2024-01-01'),
    ngay_ket_thuc: new Date('2024-12-31'),
    startDate: new Date('2024-01-01'), // Keep for backward compatibility
    expiryDate: new Date('2024-12-31'), // Keep for backward compatibility
    minOrderValue: 1500000,
    maxDiscountAmount: 0,
    trang_thai: 'active',
    isActive: true,
    deleted: false
  },
  {
    id: 3,
    code: 'FLASHSALE50',
    ten_phieu_giam_gia: 'Flash Sale 50%',
    description: 'Flash sale giảm 50%',
    type: 'percentage',
    value: 50,
    chi_phieu_giam_gia: 50,
    so_luong: 10,
    maxUses: 10, // Keep for backward compatibility
    usedCount: 10,
    ngay_bat_dau: new Date('2024-07-01'),
    ngay_ket_thuc: new Date('2024-07-31'),
    startDate: new Date('2024-07-01'), // Keep for backward compatibility
    expiryDate: new Date('2024-07-31'), // Keep for backward compatibility
    minOrderValue: 2000000,
    maxDiscountAmount: 1000000,
    trang_thai: 'used',
    isActive: false,
    deleted: false
  },
  {
    id: 4,
    code: 'WEEKEND20',
    ten_phieu_giam_gia: 'Giảm giá cuối tuần',
    description: 'Giảm giá cuối tuần',
    type: 'percentage',
    value: 20,
    chi_phieu_giam_gia: 20,
    so_luong: 200,
    maxUses: 200, // Keep for backward compatibility
    usedCount: 45,
    ngay_bat_dau: new Date('2024-12-01'),
    ngay_ket_thuc: new Date('2024-12-25'),
    startDate: new Date('2024-12-01'), // Keep for backward compatibility
    expiryDate: new Date('2024-12-25'), // Keep for backward compatibility
    minOrderValue: 0,
    maxDiscountAmount: 300000,
    trang_thai: 'active',
    isActive: true,
    deleted: false
  }
])

// Computed properties
const filteredCoupons = computed(() => {
  let coupons = sampleCoupons.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    coupons = coupons.filter(
      coupon => coupon.code.toLowerCase().includes(search) || coupon.description.toLowerCase().includes(search)
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

const showAddModal = computed(() => uiState.value.showAddModal)
const showEditModal = computed(() => uiState.value.showEditModal)
const isLoading = computed(() => uiState.value.isLoading)
const hasError = computed(() => uiState.value.hasError)
const errorMessage = computed(() => uiState.value.errorMessage)

// Helper functions
const formatCurrency = amount => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = date => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const isExpired = expiryDate => {
  return new Date(expiryDate) < new Date()
}

const getCouponStatus = coupon => {
  // Check expired first - this takes priority over isActive
  if (isExpired(coupon.expiryDate)) return 'expired'

  // Check if manually disabled via toggle
  if (!coupon.isActive) return 'disabled'

  // Check usage limit reached
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return 'used'

  // Active and available
  return 'active'
}

const getCouponTypeText = type => {
  return type === 'percentage' ? 'Giảm %' : 'Giảm tiền'
}

const getUsagePercentage = coupon => {
  const maxUses = coupon.so_luong || coupon.maxUses
  if (!maxUses) return 0
  return Math.round((coupon.usedCount / maxUses) * 100)
}

const getExpiryStatusClass = coupon => {
  if (isExpired(coupon.expiryDate)) return 'expired'

  const now = new Date()
  const expiry = new Date(coupon.expiryDate)
  const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

  if (diffDays <= 7) return 'expiring-soon'
  return 'valid'
}

const getExpiryStatusText = coupon => {
  if (isExpired(coupon.expiryDate)) return 'Đã hết hạn'

  const now = new Date()
  const expiry = new Date(coupon.expiryDate)
  const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

  if (diffDays <= 1) return 'Hết hạn hôm nay'
  if (diffDays <= 7) return `Còn ${diffDays} ngày`
  return 'Còn hiệu lực'
}

const getCouponStartDateStatusClass = coupon => {
  const start = new Date(coupon.ngay_bat_dau || coupon.startDate)
  const now = new Date()

  if (now < start) return 'date-future'
  if (now.toDateString() === start.toDateString()) return 'date-today'
  return 'date-past'
}

const getCouponStartDateStatusText = coupon => {
  const start = new Date(coupon.ngay_bat_dau || coupon.startDate)
  const now = new Date()

  if (now < start) return 'Sắp có hiệu lực'
  if (now.toDateString() === start.toDateString()) return 'Có hiệu lực hôm nay'
  return 'Đã có hiệu lực'
}

const getCouponEndDateStatusClass = coupon => {
  const end = new Date(coupon.ngay_ket_thuc || coupon.expiryDate)
  const now = new Date()

  if (now > end) return 'date-expired'
  if (now.toDateString() === end.toDateString()) return 'date-today'
  return 'date-active'
}

const getCouponEndDateStatusText = coupon => {
  const end = new Date(coupon.ngay_ket_thuc || coupon.expiryDate)
  const now = new Date()

  if (now > end) return 'Đã hết hạn'
  if (now.toDateString() === end.toDateString()) return 'Hết hạn hôm nay'

  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  if (daysLeft <= 7) return `Còn ${daysLeft} ngày`
  return 'Còn hiệu lực'
}

// Methods
const loadCoupons = async () => {
  try {
    uiState.value.isLoading = true
    uiState.value.hasError = false
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    uiState.value.hasError = true
    uiState.value.errorMessage = error.message || 'Có lỗi xảy ra khi tải dữ liệu'
  } finally {
    uiState.value.isLoading = false
  }
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedStatus.value = ''
  selectedType.value = ''
}

const exportToExcel = () => {
  try {
    const helpers = {
      getCouponStatusText
    }

    const result = exportCouponsToExcel(filteredCoupons.value, helpers)

    if (result.success) {
      console.log(`✅ ${result.message}`)
      // You could also show a toast notification here
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error)
    alert('Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại!')
  }
}

const getCouponStatusText = coupon => {
  const status = getCouponStatus(coupon)
  const statusMap = {
    active: 'Có thể sử dụng',
    used: 'Đã hết lượt',
    expired: 'Đã hết hạn',
    disabled: 'Đã vô hiệu hóa'
  }
  return statusMap[status] || status
}

const openAddModal = () => {
  resetForm()
  uiState.value.showAddModal = true
}

const editCoupon = coupon => {
  editingCoupon.value = coupon
  couponForm.value = {
    ...coupon,
    expiryDate: new Date(coupon.expiryDate).toISOString().slice(0, 16)
  }
  uiState.value.showEditModal = true
}

const toggleCouponStatus = async coupon => {
  // Prevent multiple simultaneous toggles for the same coupon
  if (uiState.value.toggleLoadingIds.has(coupon.id)) {
    return
  }

  // Check if coupon is expired before allowing activation
  if (!coupon.isActive && isExpired(coupon.expiryDate)) {
    alert('Không thể kích hoạt phiếu giảm giá đã hết hạn!')
    return
  }

  // Check if coupon is fully used before allowing activation
  if (!coupon.isActive && coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    alert('Không thể kích hoạt phiếu giảm giá đã hết lượt sử dụng!')
    return
  }

  // Show confirmation for deactivation
  if (coupon.isActive) {
    const confirmDeactivate = confirm(
      `Bạn có chắc chắn muốn vô hiệu hóa phiếu giảm giá "${coupon.code}"?\n\n` +
        'Khách hàng sẽ không thể sử dụng mã này nữa cho đến khi được kích hoạt lại.'
    )
    if (!confirmDeactivate) {
      return
    }
  }

  try {
    // Add loading state
    uiState.value.toggleLoadingIds.add(coupon.id)

    // Simulate API call with loading state
    const previousState = coupon.isActive
    coupon.isActive = !coupon.isActive

    // Show success notification (you could replace this with a proper toast notification)
    const statusText = coupon.isActive ? 'kích hoạt' : 'vô hiệu hóa'
    console.log(`✅ Đã ${statusText} phiếu giảm giá "${coupon.code}" thành công!`)

    // Optional: Add visual feedback by temporarily highlighting the row
    const rowElement = document.querySelector(`[data-coupon-id="${coupon.id}"]`)
    if (rowElement) {
      rowElement.classList.add('status-updated')
      setTimeout(() => {
        rowElement.classList.remove('status-updated')
      }, 2000)
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
  } catch (error) {
    // Revert state on error
    coupon.isActive = !coupon.isActive
    console.error('Lỗi khi cập nhật trạng thái phiếu giảm giá:', error)
    alert('Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại!')
  } finally {
    // Remove loading state
    uiState.value.toggleLoadingIds.delete(coupon.id)
  }
}

const deleteCoupon = id => {
  if (confirm('Bạn có chắc chắn muốn xóa phiếu giảm giá này?')) {
    sampleCoupons.value = sampleCoupons.value.filter(c => c.id !== id)
  }
}

const copyCouponCode = async code => {
  try {
    await navigator.clipboard.writeText(code)
    // You could show a toast notification here
    console.log('Đã sao chép mã:', code)
  } catch (error) {
    console.error('Không thể sao chép mã:', error)
  }
}

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  couponForm.value.code = code
}

const saveCoupon = () => {
  if (uiState.value.showAddModal) {
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
        id: editingCoupon.value.id,
        usedCount: sampleCoupons.value[index].usedCount,
        expiryDate: new Date(couponForm.value.expiryDate)
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  uiState.value.showAddModal = false
  uiState.value.showEditModal = false
  editingCoupon.value = null
  resetForm()
}

const resetForm = () => {
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

// Lifecycle
onMounted(() => {
  loadCoupons()
})
</script>

<style scoped>
/* Page Layout */
.coupons-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #16a34a 0%, #16a34a 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.page-title-section {
  flex: 1;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 36px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.header-actions .btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-actions .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.filters-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-filter-row {
  display: flex;
  gap: 24px;
  align-items: center;
}

.search-group {
  flex: 1;
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.filter-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 140px;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}

.clear-filters-btn {
  padding: 10px 16px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-filters-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.results-summary {
  font-size: 14px;
  color: #6b7280;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* Table Section */
.table-section {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.table-container {
  overflow-x: auto;
}

.coupons-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.coupons-table thead {
  background: #f9fafb;
}

.coupons-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.coupons-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.coupon-row:hover {
  background: #f9fafb;
}

/* Column Specific Styles */
.col-code {
  min-width: 200px;
}

.coupon-code-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.coupon-code {
  font-weight: 700;
  color: #7c3aed;
  font-family: 'Monaco', 'Consolas', monospace;
  letter-spacing: 1px;
  font-size: 14px;
}

.coupon-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

.col-value {
  min-width: 120px;
}

.coupon-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.value-number {
  font-size: 18px;
  font-weight: 700;
  color: #7c3aed;
}

.value-unit {
  font-size: 14px;
  font-weight: 600;
  color: #5b21b6;
}

.max-discount {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.col-type {
  min-width: 100px;
}

.type-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-percentage {
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
  color: white;
}

.type-fixed {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
}

.col-usage {
  min-width: 120px;
}

.usage-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.usage-text {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.usage-progress {
  width: 80px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
  transition: width 0.3s ease;
}

.col-expiry {
  min-width: 140px;
}

.expiry-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.expiry-date {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.expiry-status {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
  width: fit-content;
}

.expiry-status.valid {
  background: #dcfce7;
  color: #166534;
}

.expiry-status.expiring-soon {
  background: #fef3c7;
  color: #92400e;
}

.expiry-status.expired {
  background: #fee2e2;
  color: #991b1b;
}

.col-conditions {
  min-width: 120px;
}

.conditions-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.condition-icon {
  font-size: 14px;
}

.no-condition {
  font-style: italic;
  color: #9ca3af;
}

.col-status {
  min-width: 120px;
}

.col-actions {
  min-width: 140px;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 14px;
}

.copy-btn {
  background: #dbeafe;
  color: #1e40af;
}

.copy-btn:hover {
  background: #bfdbfe;
}

.edit-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.edit-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

/* Enhanced toggle button animations and feedback */
.toggle-btn {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1);
}

.toggle-btn:active {
  transform: scale(0.95);
}

.toggle-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

/* Row highlighting for status updates */
.status-updated {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%) !important;
  animation: statusUpdatePulse 2s ease-in-out;
  border-left: 4px solid #7d26da !important;
}

@keyframes statusUpdatePulse {
  0% {
    background: rgba(34, 197, 94, 0.2);
    transform: translateX(0);
  }
  50% {
    background: rgba(34, 197, 94, 0.1);
    transform: translateX(2px);
  }
  100% {
    background: rgba(34, 197, 94, 0.05);
    transform: translateX(0);
  }
}

/* Loading state for toggle button */
.toggle-btn.loading {
  pointer-events: none;
  opacity: 0.7;
}

.toggle-btn.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.toggle-btn.play-btn {
  background: #dcfce7;
  color: #166534;
}

.toggle-btn.play-btn:hover {
  background: #bbf7d0;
}

.toggle-btn.pause-btn {
  background: #fef3c7;
  color: #92400e;
}

.toggle-btn.pause-btn:hover {
  background: #fde68a;
}

.delete-btn {
  background: #fee2e2;
  color: #991b1b;
}

.delete-btn:hover {
  background: #fecaca;
}

/* States */
.loading-state,
.error-state,
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #7c3aed;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-icon,
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.error-state h3,
.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #374151;
}

.error-state p,
.empty-state p {
  margin: 0 0 24px 0;
  font-size: 16px;
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
  background: linear-gradient(135deg, #22c55e 0%, #22c55e 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(111, 39, 236, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 rgba(117, 13, 235, 0.4);
}

.btn-outline {
  background: transparent;
  color: #22c55e;
  border: 2px solid #22c55e;
  color: white;
}

.btn-outline:hover {
  background: #22c55e;
  color: white;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.btn-icon {
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
  color: #7c3aed;
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
  color: #7c3aed;
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
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
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

.checkbox-wrapper .checkbox-label {
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
@media (max-width: 1200px) {
  .coupons-table {
    font-size: 13px;
  }

  .coupons-table th,
  .coupons-table td {
    padding: 12px 16px;
  }
}

@media (max-width: 768px) {
  .coupons-page {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .search-filter-row {
    flex-direction: column;
    gap: 16px;
  }

  .filter-controls {
    flex-wrap: wrap;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .table-container {
    font-size: 12px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }

  .modal-content {
    margin: 20px;
    max-height: calc(100vh - 40px);
  }
}
</style>
