<template>
  <div class="discounts-page">
    <!-- Page Header Section -->
    <header class="page-header">
      <div class="header-content">
        <div class="page-title-section">
          <h1 class="page-title">
            <i class="title-icon">💸</i>
            Quản lý Giảm giá
          </h1>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline" @click="exportToExcel">
            <i class="btn-icon">📊</i>
            Xuất Excel
          </button>
          <button class="btn btn-primary" @click="openAddModal">
            <i class="btn-icon">➕</i>
            Tạo giảm giá mới
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
              <input 
                v-model="searchTerm" 
                type="text" 
                placeholder="Tìm kiếm theo tên, mô tả..." 
                class="search-input"
              />
            </div>
          </div>
          
          <div class="filter-controls">
            <select v-model="selectedStatus" class="filter-select">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang áp dụng</option>
              <option value="scheduled">Chờ áp dụng</option>
              <option value="expired">Đã hết hạn</option>
              <option value="disabled">Đã tắt</option>
            </select>
            
            <select v-model="selectedType" class="filter-select">
              <option value="">Tất cả loại</option>
              <option value="percentage">Giảm phần trăm</option>
              <option value="fixed">Giảm tiền cố định</option>
            </select>
            
            <button v-if="hasActiveFilters" @click="clearFilters" class="clear-filters-btn">
              <i class="btn-icon">✕</i>
              Xóa bộ lọc
            </button>
          </div>
        </div>
        
        <div class="results-summary">
          Hiển thị {{ filteredDiscounts.length }} / {{ sampleDiscounts.length }} kết quả
        </div>
      </div>
    </section>

    <!-- Table Section -->
    <main class="table-section">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="hasError" class="error-state">
        <div class="error-icon">⚠️</div>
        <h3>Có lỗi xảy ra</h3>
        <p>{{ errorMessage }}</p>
        <button class="btn btn-primary" @click="loadDiscounts">
          <i class="btn-icon">🔄</i>
          Thử lại
        </button>
      </div>

      <div v-else-if="filteredDiscounts.length === 0" class="empty-state">
        <div class="empty-icon">💸</div>
        <h3>Không tìm thấy kết quả</h3>
        <p>{{ searchTerm || selectedStatus || selectedType ? 'Thử thay đổi bộ lọc để xem kết quả khác' : 'Tạo chương trình giảm giá đầu tiên của bạn' }}</p>
        <button v-if="!searchTerm && !selectedStatus && !selectedType" class="btn btn-primary" @click="openAddModal">
          <i class="btn-icon">➕</i>
          Tạo giảm giá đầu tiên
        </button>
      </div>

      <div v-else class="table-container">
        <table class="discounts-table">
          <thead>
            <tr>
              <th class="col-stt">STT</th>
              <th class="col-code">Mã</th>
              <th class="col-name">Tên</th>
              <th class="col-value">Giá trị</th>
              <th class="col-max">Giảm tối đa</th>
              <th class="col-status">Trạng thái</th>
              <th class="col-start">Thời gian bắt đầu</th>
              <th class="col-end">Thời gian kết thúc</th>
              <th class="col-actions">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(discount, index) in filteredDiscounts" :key="discount.id" class="discount-row" :data-discount-id="discount.id">
              <td class="col-stt">{{ index + 1 }}</td>
              
              <td class="col-code">
                <div class="discount-code">{{ discount.ma_dot_giam_gia || 'DGG' + discount.id }}</div>
              </td>
              
              <td class="col-name">
                <div class="discount-info">
                  <div class="discount-name">{{ discount.ten_dot_giam_gia || discount.name }}</div>
                  <div class="discount-description">{{ discount.description }}</div>
                </div>
              </td>
              
              <td class="col-value">
                <div class="discount-value">
                  <span class="value-number">{{ discount.value }}</span>
                  <span class="value-unit">{{ discount.type === 'percentage' ? '%' : 'VNĐ' }}</span>
                </div>
              </td>
              
              <td class="col-max">
                <div class="max-discount-amount">
                  <span v-if="discount.so_len_giam_toi_da || discount.maxDiscountAmount">
                    {{ formatCurrency(discount.so_len_giam_toi_da || discount.maxDiscountAmount) }}
                  </span>
                  <span v-else class="no-limit">Không giới hạn</span>
                </div>
              </td>
              
              <td class="col-status">
                <StatusBadge :status="getDiscountStatus(discount)" />
              </td>
              
              <td class="col-start">
                <div class="date-info">
                  <div class="date-main">{{ formatDate(discount.ngay_bat_dau || discount.startDate) }}</div>
                  <div class="date-status" :class="getStartDateStatusClass(discount)">
                    {{ getStartDateStatusText(discount) }}
                  </div>
                </div>
              </td>
              
              <td class="col-end">
                <div class="date-info">
                  <div class="date-main">{{ formatDate(discount.ngay_ket_thuc || discount.endDate) }}</div>
                  <div class="date-status" :class="getEndDateStatusClass(discount)">
                    {{ getEndDateStatusText(discount) }}
                  </div>
                </div>
              </td>
              
              <td class="col-actions">
                <div class="action-buttons">
                  <button class="action-btn edit-btn" @click="editDiscount(discount)" title="Chỉnh sửa">
                    <i class="btn-icon">✏️</i>
                  </button>
                  <button 
                    class="action-btn toggle-btn" 
                    :class="[
                      discount.isActive ? 'pause-btn' : 'play-btn',
                      { 'loading': uiState.toggleLoadingIds.has(discount.id) }
                    ]"
                    @click="toggleDiscountStatus(discount)"
                    :title="discount.isActive ? 'Tạm dừng' : 'Kích hoạt'"
                    :disabled="uiState.toggleLoadingIds.has(discount.id)"
                  >
                    <i class="btn-icon" v-if="!uiState.toggleLoadingIds.has(discount.id)">
                      {{ discount.isActive ? '⏸️' : '▶️' }}
                    </i>
                  </button>
                  <button class="action-btn delete-btn" @click="deleteDiscount(discount.id)" title="Xóa">
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
              {{ showAddModal ? 'Tạo chương trình giảm giá mới' : 'Chỉnh sửa chương trình giảm giá' }}
            </h3>
            <button class="modal-close" @click="closeModal">
              <i class="close-icon">✕</i>
            </button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="saveDiscount" class="discount-form">
              <div class="form-grid">
                <!-- Left Column -->
                <div class="form-column">
                  <div class="form-group">
                    <label for="name" class="form-label">
                      <i class="label-icon">🏷️</i>
                      Tên chương trình *
                    </label>
                    <input 
                      id="name" 
                      v-model="discountForm.name" 
                      type="text" 
                      required 
                      placeholder="Ví dụ: Flash Sale Cuối Tuần"
                      class="form-control" 
                    />
                  </div>

                  <div class="form-group">
                    <label for="description" class="form-label">
                      <i class="label-icon">📝</i>
                      Mô tả *
                    </label>
                    <textarea 
                      id="description" 
                      v-model="discountForm.description" 
                      required 
                      rows="3"
                      placeholder="Mô tả chi tiết về chương trình giảm giá..."
                      class="form-control"
                    ></textarea>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="type" class="form-label">
                        <i class="label-icon">🎯</i>
                        Loại giảm giá *
                      </label>
                      <select id="type" v-model="discountForm.type" required class="form-control">
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
                          v-model.number="discountForm.value" 
                          type="number" 
                          required 
                          :min="1"
                          :max="discountForm.type === 'percentage' ? 100 : undefined"
                          placeholder="0"
                          class="form-control" 
                        />
                        <span class="input-unit">
                          {{ discountForm.type === 'percentage' ? '%' : 'VNĐ' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="startDate" class="form-label">
                        <i class="label-icon">📅</i>
                        Ngày bắt đầu *
                      </label>
                      <input 
                        id="startDate" 
                        v-model="discountForm.startDate" 
                        type="datetime-local" 
                        required
                        class="form-control" 
                      />
                    </div>

                    <div class="form-group">
                      <label for="endDate" class="form-label">
                        <i class="label-icon">📅</i>
                        Ngày kết thúc *
                      </label>
                      <input 
                        id="endDate" 
                        v-model="discountForm.endDate" 
                        type="datetime-local" 
                        required
                        class="form-control" 
                      />
                    </div>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="form-column">
                  <div class="form-group">
                    <label for="applicableType" class="form-label">
                      <i class="label-icon">🎯</i>
                      Áp dụng cho *
                    </label>
                    <select id="applicableType" v-model="discountForm.applicableType" required class="form-control">
                      <option value="">Chọn phạm vi áp dụng</option>
                      <option value="all">Tất cả sản phẩm</option>
                      <option value="category">Danh mục cụ thể</option>
                      <option value="product">Sản phẩm cụ thể</option>
                    </select>
                  </div>

                  <div v-if="discountForm.applicableType === 'category'" class="form-group">
                    <label for="categories" class="form-label">
                      <i class="label-icon">📂</i>
                      Chọn danh mục
                    </label>
                    <div class="checkbox-group">
                      <label v-for="category in availableCategories" :key="category.id" class="checkbox-item">
                        <input 
                          type="checkbox" 
                          :value="category.id"
                          v-model="discountForm.applicableCategories"
                          class="checkbox-input"
                        />
                        <span class="checkbox-label">{{ category.name }}</span>
                      </label>
                    </div>
                  </div>

                  <div v-if="discountForm.applicableType === 'product'" class="form-group">
                    <label for="products" class="form-label">
                      <i class="label-icon">📦</i>
                      Chọn sản phẩm
                    </label>
                    <div class="product-selector">
                      <input 
                        type="text" 
                        v-model="productSearchTerm"
                        placeholder="Tìm kiếm sản phẩm..."
                        class="form-control"
                      />
                      <div class="product-list">
                        <label v-for="product in filteredProducts" :key="product.id" class="checkbox-item">
                          <input 
                            type="checkbox" 
                            :value="product.id"
                            v-model="discountForm.applicableProducts"
                            class="checkbox-input"
                          />
                          <span class="checkbox-label">{{ product.name }}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="minOrderValue" class="form-label">
                      <i class="label-icon">🛒</i>
                      Giá trị đơn hàng tối thiểu
                    </label>
                    <input 
                      id="minOrderValue" 
                      v-model.number="discountForm.minOrderValue" 
                      type="number" 
                      min="0"
                      placeholder="0" 
                      class="form-control" 
                    />
                    <div class="form-hint">Để trống nếu không yêu cầu giá trị tối thiểu</div>
                  </div>

                  <div v-if="discountForm.type === 'percentage'" class="form-group">
                    <label for="maxDiscountAmount" class="form-label">
                      <i class="label-icon">🎯</i>
                      Số tiền giảm tối đa
                    </label>
                    <input 
                      id="maxDiscountAmount" 
                      v-model.number="discountForm.maxDiscountAmount" 
                      type="number" 
                      min="0"
                      placeholder="Không giới hạn" 
                      class="form-control" 
                    />
                    <div class="form-hint">Giới hạn số tiền giảm tối đa cho phần trăm</div>
                  </div>
                </div>
              </div>

              <div class="form-status">
                <label class="checkbox-wrapper">
                  <input v-model="discountForm.isActive" type="checkbox" class="form-checkbox" />
                  <span class="checkbox-mark"></span>
                  <span class="checkbox-label">
                    <i class="checkbox-icon">✅</i>
                    Kích hoạt chương trình ngay sau khi tạo
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
            <button type="submit" class="btn btn-primary" @click="saveDiscount">
              <i class="btn-icon">{{ showAddModal ? '➕' : '💾' }}</i>
              {{ showAddModal ? 'Tạo chương trình' : 'Cập nhật' }}
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
import { exportDiscountsToExcel } from '@/utils/excelExport.js'

// Reactive state
const uiState = ref({
  isLoading: false,
  hasError: false,
  errorMessage: '',
  showAddModal: false,
  showEditModal: false,
  toggleLoadingIds: new Set() // Track which discounts are being toggled
})

const searchTerm = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const editingDiscount = ref(null)
const productSearchTerm = ref('')

const discountForm = ref({
  name: '',
  description: '',
  type: '',
  value: 0,
  startDate: '',
  endDate: '',
  applicableType: '',
  applicableCategories: [],
  applicableProducts: [],
  minOrderValue: 0,
  maxDiscountAmount: 0,
  isActive: true
})

// Sample data
const sampleDiscounts = ref([
  {
    id: 1,
    ma_dot_giam_gia: 'DGG001',
    ten_dot_giam_gia: 'Flash Sale Cuối Tuần',
    name: 'Flash Sale Cuối Tuần', // Keep for backward compatibility
    description: 'Giảm giá đặc biệt cho tất cả sản phẩm trong cuối tuần',
    type: 'percentage',
    value: 20,
    so_len_giam_toi_da: 200000,
    ngay_bat_dau: new Date('2024-12-21'),
    ngay_ket_thuc: new Date('2024-12-22'),
    startDate: new Date('2024-12-21'), // Keep for backward compatibility
    endDate: new Date('2024-12-22'), // Keep for backward compatibility
    applicableType: 'all',
    applicableCategories: [],
    applicableProducts: [],
    minOrderValue: 500000,
    maxDiscountAmount: 200000,
    trang_thai: 'active',
    isActive: true,
    deleted: false
  },
  {
    id: 2,
    ma_dot_giam_gia: 'DGG002',
    ten_dot_giam_gia: 'Giảm Giá Giày Thể Thao',
    name: 'Giảm Giá Giày Thể Thao', // Keep for backward compatibility
    description: 'Ưu đãi đặc biệt cho dòng giày thể thao Nike và Adidas',
    type: 'fixed',
    value: 150000,
    so_len_giam_toi_da: null,
    ngay_bat_dau: new Date('2024-12-20'),
    ngay_ket_thuc: new Date('2024-12-31'),
    startDate: new Date('2024-12-20'), // Keep for backward compatibility
    endDate: new Date('2024-12-31'), // Keep for backward compatibility
    applicableType: 'category',
    applicableCategories: [1, 2],
    applicableProducts: [],
    minOrderValue: 1000000,
    maxDiscountAmount: 0,
    trang_thai: 'active',
    isActive: true,
    deleted: false
  },
  {
    id: 3,
    ma_dot_giam_gia: 'DGG003',
    ten_dot_giam_gia: 'Siêu Sale Tết',
    name: 'Siêu Sale Tết', // Keep for backward compatibility
    description: 'Chương trình giảm giá lớn nhất trong năm',
    type: 'percentage',
    value: 50,
    so_len_giam_toi_da: 1000000,
    ngay_bat_dau: new Date('2024-01-15'),
    ngay_ket_thuc: new Date('2024-02-15'),
    startDate: new Date('2024-01-15'), // Keep for backward compatibility
    endDate: new Date('2024-02-15'), // Keep for backward compatibility
    applicableType: 'all',
    applicableCategories: [],
    applicableProducts: [],
    minOrderValue: 2000000,
    maxDiscountAmount: 1000000,
    trang_thai: 'disabled',
    isActive: false,
    deleted: false
  }
])

const availableCategories = ref([
  { id: 1, name: 'Giày Nike' },
  { id: 2, name: 'Giày Adidas' },
  { id: 3, name: 'Giày Puma' },
  { id: 4, name: 'Phụ kiện' }
])

const availableProducts = ref([
  { id: 1, name: 'Nike Air Max 270' },
  { id: 2, name: 'Adidas Ultraboost 22' },
  { id: 3, name: 'Puma RS-X' },
  { id: 4, name: 'Nike React Infinity' }
])

// Computed properties
const filteredDiscounts = computed(() => {
  let discounts = sampleDiscounts.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    discounts = discounts.filter(discount =>
      discount.name.toLowerCase().includes(search) ||
      discount.description.toLowerCase().includes(search)
    )
  }

  if (selectedStatus.value) {
    discounts = discounts.filter(discount => {
      const status = getDiscountStatus(discount)
      return status === selectedStatus.value
    })
  }

  if (selectedType.value) {
    discounts = discounts.filter(discount => discount.type === selectedType.value)
  }

  return discounts
})

const hasActiveFilters = computed(() => {
  return searchTerm.value || selectedStatus.value || selectedType.value
})

const showAddModal = computed(() => uiState.value.showAddModal)
const showEditModal = computed(() => uiState.value.showEditModal)
const isLoading = computed(() => uiState.value.isLoading)
const hasError = computed(() => uiState.value.hasError)
const errorMessage = computed(() => uiState.value.errorMessage)

const filteredProducts = computed(() => {
  if (!productSearchTerm.value) return availableProducts.value
  
  const search = productSearchTerm.value.toLowerCase()
  return availableProducts.value.filter(product =>
    product.name.toLowerCase().includes(search)
  )
})

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDateRange = (startDate, endDate) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  const start = new Date(startDate).toLocaleDateString('vi-VN', options)
  const end = new Date(endDate).toLocaleDateString('vi-VN', options)
  return `${start} - ${end}`
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

const isExpired = (endDate) => {
  return new Date(endDate) < new Date()
}

const isScheduled = (startDate) => {
  return new Date(startDate) > new Date()
}

const isActive = (discount) => {
  const now = new Date()
  const start = new Date(discount.startDate)
  const end = new Date(discount.endDate)
  return discount.isActive && now >= start && now <= end
}

const getDiscountStatus = (discount) => {
  // Check expired first - this takes priority over isActive
  if (isExpired(discount.endDate)) return 'expired'
  
  // Check if manually disabled via toggle
  if (!discount.isActive) return 'disabled'
  
  // Check if scheduled for future
  if (isScheduled(discount.startDate)) return 'scheduled'
  
  // Active and within date range
  return 'active'
}

const getDiscountTypeText = (type) => {
  return type === 'percentage' ? 'Giảm %' : 'Giảm tiền'
}

const getPeriodStatusClass = (discount) => {
  const status = getDiscountStatus(discount)
  return `period-${status}`
}

const getPeriodStatusText = (discount) => {
  const now = new Date()
  const start = new Date(discount.startDate)
  const end = new Date(discount.endDate)
  
  if (isExpired(end)) return 'Đã kết thúc'
  if (isScheduled(start)) return 'Chưa bắt đầu'
  if (now >= start && now <= end) return 'Đang diễn ra'
  return ''
}

const getStartDateStatusClass = (discount) => {
  const start = new Date(discount.ngay_bat_dau || discount.startDate)
  const now = new Date()
  
  if (now < start) return 'date-future'
  if (now.toDateString() === start.toDateString()) return 'date-today'
  return 'date-past'
}


const getStartDateStatusText = (discount) => {
  const start = new Date(discount.ngay_bat_dau || discount.startDate)
  const now = new Date()
  
  if (now < start) return 'Sắp diễn ra'
  if (now.toDateString() === start.toDateString()) return 'Bắt đầu hôm nay'
  return 'Đã bắt đầu'
}

const getEndDateStatusClass = (discount) => {
  const end = new Date(discount.ngay_ket_thuc || discount.endDate)
  const now = new Date()
  
  if (now > end) return 'date-expired'
  if (now.toDateString() === end.toDateString()) return 'date-today'
  return 'date-active'
}

const getEndDateStatusText = (discount) => {
  const end = new Date(discount.ngay_ket_thuc || discount.endDate)
  const now = new Date()
  
  if (now > end) return 'Đã hết hạn'
  if (now.toDateString() === end.toDateString()) return 'Hết hạn hôm nay'
  
  const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  if (daysLeft <= 7) return `Còn ${daysLeft} ngày`
  return 'Còn hiệu lực'
}

const getApplicableProductsText = (discount) => {
  switch (discount.applicableType) {
    case 'all':
      return 'Tất cả sản phẩm'
    case 'category':
      const categoryNames = availableCategories.value
        .filter(cat => discount.applicableCategories.includes(cat.id))
        .map(cat => cat.name)
      return categoryNames.length > 0 ? categoryNames.join(', ') : 'Không có danh mục'
    case 'product':
      return `${discount.applicableProducts.length} sản phẩm`
    default:
      return 'Chưa xác định'
  }
}

// Methods
const loadDiscounts = async () => {
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
      getDiscountStatusText,
      getApplicableProductsText
    }
    
    const result = exportDiscountsToExcel(filteredDiscounts.value, helpers)
    
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

const getDiscountStatusText = (discount) => {
  const status = getDiscountStatus(discount)
  const statusMap = {
    'active': 'Đang áp dụng',
    'scheduled': 'Chờ áp dụng', 
    'expired': 'Đã hết hạn',
    'disabled': 'Đã tắt'
  }
  return statusMap[status] || status
}

const openAddModal = () => {
  resetForm()
  uiState.value.showAddModal = true
}

const editDiscount = (discount) => {
  editingDiscount.value = discount
  discountForm.value = {
    ...discount,
    startDate: new Date(discount.startDate).toISOString().slice(0, 16),
    endDate: new Date(discount.endDate).toISOString().slice(0, 16)
  }
  uiState.value.showEditModal = true
}

const toggleDiscountStatus = async (discount) => {
  // Prevent multiple simultaneous toggles for the same discount
  if (uiState.value.toggleLoadingIds.has(discount.id)) {
    return
  }

  // Check if discount is expired before allowing activation
  if (!discount.isActive && isExpired(discount.endDate)) {
    alert('Không thể kích hoạt chương trình giảm giá đã hết hạn!')
    return
  }

  // Check if discount is scheduled for future before allowing activation
  if (!discount.isActive && isScheduled(discount.startDate)) {
    const confirmEarly = confirm(
      `Chương trình giảm giá "${discount.name}" được lên lịch bắt đầu từ ${formatDate(discount.startDate)}.\n\n` +
      'Bạn có muốn kích hoạt sớm không?'
    )
    if (!confirmEarly) {
      return
    }
  }

  // Show confirmation for deactivation of active discounts
  if (discount.isActive) {
    const confirmDeactivate = confirm(
      `Bạn có chắc chắn muốn tạm dừng chương trình giảm giá "${discount.name}"?\n\n` +
      'Khách hàng sẽ không thể sử dụng ưu đãi này nữa cho đến khi được kích hoạt lại.'
    )
    if (!confirmDeactivate) {
      return
    }
  }

  try {
    // Add loading state
    uiState.value.toggleLoadingIds.add(discount.id)
    
    // Simulate API call with loading state
    const previousState = discount.isActive
    discount.isActive = !discount.isActive

    // Show success notification
    const statusText = discount.isActive ? 'kích hoạt' : 'tạm dừng'
    console.log(`✅ Đã ${statusText} chương trình giảm giá "${discount.name}" thành công!`)
    
    // Add visual feedback by temporarily highlighting the row
    const rowElement = document.querySelector(`[data-discount-id="${discount.id}"]`)
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
    discount.isActive = !discount.isActive
    console.error('Lỗi khi cập nhật trạng thái chương trình giảm giá:', error)
    alert('Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại!')
  } finally {
    // Remove loading state
    uiState.value.toggleLoadingIds.delete(discount.id)
  }
}

const deleteDiscount = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa chương trình giảm giá này?')) {
    sampleDiscounts.value = sampleDiscounts.value.filter(d => d.id !== id)
  }
}

const saveDiscount = () => {
  if (uiState.value.showAddModal) {
    const newDiscount = {
      ...discountForm.value,
      id: Date.now(),
      startDate: new Date(discountForm.value.startDate),
      endDate: new Date(discountForm.value.endDate)
    }
    sampleDiscounts.value.push(newDiscount)
  } else {
    const index = sampleDiscounts.value.findIndex(d => d.id === editingDiscount.value.id)
    if (index !== -1) {
      sampleDiscounts.value[index] = {
        ...discountForm.value,
        id: editingDiscount.value.id,
        startDate: new Date(discountForm.value.startDate),
        endDate: new Date(discountForm.value.endDate)
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  uiState.value.showAddModal = false
  uiState.value.showEditModal = false
  editingDiscount.value = null
  resetForm()
}

const resetForm = () => {
  discountForm.value = {
    name: '',
    description: '',
    type: '',
    value: 0,
    startDate: '',
    endDate: '',
    applicableType: '',
    applicableCategories: [],
    applicableProducts: [],
    minOrderValue: 0,
    maxDiscountAmount: 0,
    isActive: true
  }
  productSearchTerm.value = ''
}

// Lifecycle
onMounted(() => {
  loadDiscounts()
})
</script>

<style scoped>
/* Page Layout */
.discounts-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
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
  display: flex;
  color: white;
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
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
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
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
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
  width: 100%;
}

.discounts-table {
  width: 100%;
  min-width: 1200px; /* Ensure table has enough space */
  border-collapse: collapse;
  background: white;
  table-layout: fixed; /* Fixed layout for better control */
}

.discounts-table thead {
  background: #f9fafb;
}

.discounts-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.discounts-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.discount-row:hover {
  background: #f9fafb;
}

/* Column Specific Styles */
.col-stt {
  width: 60px;
}

.col-code {
  width: 100px;
}

.col-name {
  width: 250px;
}

.col-value {
  width: 120px;
}

.col-max {
  width: 130px;
}

.col-status {
  width: 120px;
}

.col-start {
  width: 160px;
}

.col-end {
  width: 160px;
}

.col-actions {
  width: 120px;
}

.discount-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #6366f1;
  font-size: 13px;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.max-discount-amount {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.no-limit {
  color: #6b7280;
  font-style: italic;
  font-size: 13px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-main {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
  line-height: 1.2;
}

.date-status {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
  width: fit-content;
  text-align: center;
}

.date-future {
  background: #dbeafe;
  color: #1e40af;
}

.date-today {
  background: #fbbf24;
  color: #92400e;
}

.date-past {
  background: #dcfce7;
  color: #166534;
}

.date-active {
  background: #dcfce7;
  color: #166534;
}

.date-expired {
  background: #fee2e2;
  color: #991b1b;
}

.discount-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.discount-name {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  line-height: 1.3;
}

.discount-description {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.discount-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.value-number {
  font-size: 18px;
  font-weight: 700;
  color: #22c55e;
}

.value-unit {
  font-size: 14px;
  font-weight: 600;
  color: #16a34a;
}

.action-buttons {
  display: flex;
  gap: 8px;
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
  border-left: 4px solid #22c55e !important;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  border-top: 4px solid #22c55e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
  color: white;
}

.btn-outline:hover {
  background: #22c55e;
  color: white;
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
  max-width: 900px;
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
.discount-form {
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

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.checkbox-item:hover {
  background: #f9fafb;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  margin: 0;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
}

.product-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-list {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px;
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
@media (max-width: 1400px) {
  .discounts-page {
    max-width: 100%;
    padding: 20px;
  }
  
  .discounts-table {
    min-width: 1100px; /* Reduce minimum width slightly */
  }
}

@media (max-width: 1200px) {
  .discounts-table {
    font-size: 13px;
    min-width: 1000px;
  }
  
  .discounts-table th,
  .discounts-table td {
    padding: 10px 12px;
  }
  
  /* Adjust column widths for medium screens */
  .col-name {
    width: 200px;
  }
  
  .col-start,
  .col-end {
    width: 140px;
  }
}

@media (max-width: 768px) {
  .discounts-page {
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
