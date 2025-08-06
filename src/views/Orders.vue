<template>
  <div class="orders-page">
    <div class="page-header">
      <h2>Quản lý Hóa đơn</h2>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="resetAllFilters">
          <span class="icon">🔄</span>
          Đặt lại bộ lọc
        </button>
        <button class="btn btn-success" @click="exportToExcel">
          <span class="icon">📊</span>
          Xuất Excel
        </button>
        <button class="btn btn-info" @click="scanQR">
          <span class="icon">📱</span>
          Quét QR
        </button>
        <button class="btn btn-primary" @click="showAddModal = true">
          <span class="icon">➕</span>
          Tạo hóa đơn
        </button>
      </div>
    </div>
    
    <div class="filters">
      <div class="filter-row">
        <div class="search-box">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Tìm kiếm hóa đơn..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
          <input
            v-model="dateFrom"
            type="date"
            class="filter-select"
            placeholder="Từ ngày"
          />
          <input
            v-model="dateTo"
            type="date"
            class="filter-select"
            placeholder="Đến ngày"
          />
          
          <!-- Modern Price Range Filter -->
          <div class="price-range-modern">
            <div class="price-range-header">
              <span class="price-label">Khoảng giá</span>
              <button 
                type="button" 
                class="price-reset-btn" 
                @click="resetPriceRange"
                v-if="priceRange.min > 0 || priceRange.max < 10000000"
              >
                Reset
              </button>
            </div>
            <div class="price-inputs-modern">
              <div class="price-input-group">
                <label class="input-label">Từ</label>
                <input
                  v-model.number="priceRange.min"
                  type="number"
                  placeholder="0"
                  class="price-input-modern"
                  @input="updatePriceRange"
                />
              </div>
              <div class="price-separator-modern">-</div>
              <div class="price-input-group">
                <label class="input-label">Đến</label>
                <input
                  v-model.number="priceRange.max"
                  type="number"
                  placeholder="10,000,000"
                  class="price-input-modern"
                  @input="updatePriceRange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modern Price Range Slider -->
      <div class="price-slider-section">
        <div class="slider-track-container">
          <div class="slider-track"></div>
          <div 
            class="slider-range" 
            :style="sliderRangeStyle"
          ></div>
          <input
            v-model.number="priceRange.min"
            type="range"
            :min="0"
            :max="10000000"
            :step="100000"
            class="slider-input slider-min"
            @input="updatePriceRange"
          />
          <input
            v-model.number="priceRange.max"
            type="range"
            :min="0"
            :max="10000000"
            :step="100000"
            class="slider-input slider-max"
            @input="updatePriceRange"
          />
        </div>
        <div class="price-display">
          <span class="price-min">{{ formatCurrency(priceRange.min) }}</span>
          <span class="price-max">{{ formatCurrency(priceRange.max) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Order Statistics -->
    <div class="order-statistics">
      <div class="stat-item">
        <span class="stat-label">Tổng số hóa đơn:</span>
        <span class="stat-value">{{ filteredOrders.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Tổng giá trị:</span>
        <span class="stat-value total-value">{{ formatCurrency(totalOrderValue) }}</span>
      </div>
    </div>
    
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>
              <div class="customer-info">
                <strong>{{ order.customerName }}</strong>
                <small>{{ order.customerPhone }}</small>
              </div>
            </td>
            <td>
              <div class="products-list">
                <div v-for="item in order.items" :key="item.id" class="product-item">
                  {{ item.productName }} x{{ item.quantity }}
                </div>
              </div>
            </td>
            <td class="price">{{ formatCurrency(order.total) }}</td>
            <td>
              <StatusBadge 
                :status="order.status" 
                :size="isMobile ? 'small' : 'normal'"
              />
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline" @click="viewOrder(order)">
                  Xem
                </button>
                <select 
                  v-if="order.status !== 'completed' && order.status !== 'cancelled'"
                  @change="updateStatus(order.id, $event.target.value)"
                  class="status-select"
                >
                  <option value="">Cập nhật</option>
                  <option value="confirmed">Xác nhận</option>
                  <option value="shipping">Giao hàng</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Hủy</option>
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Order Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <h3>Chi tiết hóa đơn #{{ selectedOrder?.id }}</h3>
          <button class="close-btn" @click="closeDetailModal">×</button>
        </div>
        <div class="modal-body">
          <div v-if="selectedOrder" class="order-detail">
            <div class="detail-section">
              <h4>Thông tin khách hàng</h4>
              <p><strong>Tên:</strong> {{ selectedOrder.customerName }}</p>
              <p><strong>SĐT:</strong> {{ selectedOrder.customerPhone }}</p>
              <p><strong>Địa chỉ:</strong> {{ selectedOrder.customerAddress }}</p>
            </div>
            
            <div class="detail-section">
              <h4>Sản phẩm</h4>
              <table class="detail-table">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.items" :key="item.id">
                    <td>{{ item.productName }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ formatCurrency(item.price) }}</td>
                    <td>{{ formatCurrency(item.quantity * item.price) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3"><strong>Tổng cộng:</strong></td>
                    <td><strong>{{ formatCurrency(selectedOrder.total) }}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div class="detail-section">
              <h4>Thông tin đơn hàng</h4>
              <p><strong>Trạng thái:</strong> 
                <span class="status-badge" :class="selectedOrder.status">
                  {{ getStatusText(selectedOrder.status) }}
                </span>
              </p>
              <p><strong>Ngày tạo:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
              <p><strong>Ghi chú:</strong> {{ selectedOrder.note || 'Không có' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const searchTerm = ref('')
const selectedStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedOrder = ref(null)
const isMobile = ref(false)

// Price range filter
const priceRange = ref({
  min: 0,
  max: 10000000
})

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const sampleOrders = ref([
  {
    id: 1001,
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    customerAddress: 'Hà Nội',
    items: [
      { id: 1, productName: 'Nike Air Max 270', quantity: 1, price: 2500000 },
      { id: 2, productName: 'Adidas Ultra Boost', quantity: 1, price: 3200000 }
    ],
    total: 5700000,
    status: 'pending',
    createdAt: new Date('2024-08-01'),
    note: 'Giao hàng trong giờ hành chính'
  },
  {
    id: 1002,
    customerName: 'Trần Thị B',
    customerPhone: '0902345678',
    customerAddress: 'TP.HCM',
    items: [
      { id: 3, productName: 'Puma RS-X', quantity: 2, price: 1800000 }
    ],
    total: 3600000,
    status: 'shipping',
    createdAt: new Date('2024-08-02'),
    note: ''
  },
  {
    id: 1003,
    customerName: 'Lê Văn C',
    customerPhone: '0903456789',
    customerAddress: 'Đà Nẵng',
    items: [
      { id: 4, productName: 'Nike Air Force 1', quantity: 1, price: 2200000 }
    ],
    total: 2200000,
    status: 'completed',
    createdAt: new Date('2024-07-30'),
    note: 'Khách hàng VIP'
  }
])

const filteredOrders = computed(() => {
  let orders = sampleOrders.value
  
  if (searchTerm.value) {
    orders = orders.filter(order =>
      order.id.toString().includes(searchTerm.value) ||
      order.customerName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      order.customerPhone.includes(searchTerm.value)
    )
  }
  
  if (selectedStatus.value) {
    orders = orders.filter(order => order.status === selectedStatus.value)
  }
  
  if (dateFrom.value) {
    orders = orders.filter(order => 
      new Date(order.createdAt) >= new Date(dateFrom.value)
    )
  }
  
  if (dateTo.value) {
    orders = orders.filter(order => 
      new Date(order.createdAt) <= new Date(dateTo.value)
    )
  }
  
  // Price range filter
  orders = orders.filter(order => 
    order.total >= priceRange.value.min && order.total <= priceRange.value.max
  )
  
  return orders
})

// Calculate total value of filtered orders
const totalOrderValue = computed(() => {
  return filteredOrders.value.reduce((total, order) => total + order.total, 0)
})

// Calculate slider range style for visual feedback
const sliderRangeStyle = computed(() => {
  const min = priceRange.value.min
  const max = priceRange.value.max
  const minPercent = (min / 10000000) * 100
  const maxPercent = (max / 10000000) * 100
  
  return {
    left: `${minPercent}%`,
    right: `${100 - maxPercent}%`
  }
})

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

const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  }
  return statusMap[status] || status
}

const viewOrder = (order) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

const updateStatus = (orderId, newStatus) => {
  if (!newStatus) return
  
  const orderIndex = sampleOrders.value.findIndex(o => o.id === orderId)
  if (orderIndex !== -1) {
    sampleOrders.value[orderIndex].status = newStatus
  }
}

const updatePriceRange = () => {
  // Ensure min is not greater than max
  if (priceRange.value.min > priceRange.value.max) {
    const temp = priceRange.value.min
    priceRange.value.min = priceRange.value.max
    priceRange.value.max = temp
  }
}

const resetPriceRange = () => {
  priceRange.value.min = 0
  priceRange.value.max = 10000000
}

const resetAllFilters = () => {
  searchTerm.value = ''
  selectedStatus.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  resetPriceRange()
}

const exportToExcel = () => {
  // TODO: Implement Excel export functionality
  console.log('Exporting to Excel...', filteredOrders.value)
  // Here you would typically use a library like xlsx or call an API endpoint
  alert('Tính năng xuất Excel sẽ được triển khai!')
}

const scanQR = () => {
  // TODO: Implement QR scanning functionality
  console.log('Opening QR scanner...')
  // Here you would typically open a QR scanner modal or call a scanning API
  alert('Tính năng quét QR sẽ được triển khai!')
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}
</script>

<style scoped>
.orders-page {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.page-header h2 {
  margin: 0;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2980b9 0%, #1f618d 100%);
}

.btn-secondary {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  color: white;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, #7f8c8d 0%, #6c7b7d 100%);
}

.btn-success {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  color: white;
}

.btn-success:hover {
  background: linear-gradient(135deg, #229954 0%, #1e8449 100%);
}

.btn-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
}

.btn-info:hover {
  background: linear-gradient(135deg, #138496 0%, #0f6674 100%);
}

.btn-outline {
  background: transparent;
  color: #3498db;
  border: 1px solid #3498db;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 14px;
}

.filters {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.filter-controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-width: 120px;
}

/* Modern Price Range Filter */
.price-range-modern {
  background: linear-gradient(135deg, #f8fafb 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.price-range-modern:hover {
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.1);
}

.price-range-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.price-label {
  font-weight: 600;
  color: #334155;
  font-size: 14px;
  letter-spacing: 0.025em;
}

.price-reset-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
}

.price-reset-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
}

.price-inputs-modern {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.price-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.input-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 2px;
}

.price-input-modern {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  background: white;
  transition: all 0.2s ease;
  text-align: center;
}

.price-input-modern:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  transform: translateY(-1px);
}

.price-separator-modern {
  color: #64748b;
  font-weight: 600;
  font-size: 16px;
  padding: 0 4px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

/* Modern Price Slider Section */
.price-slider-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.slider-track-container {
  position: relative;
  height: 40px;
  margin: 0 12px;
}

.slider-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #e2e8f0 0%, #cbd5e1 100%);
  border-radius: 2px;
  transform: translateY(-50%);
}

.slider-range {
  position: absolute;
  top: 50%;
  height: 4px;
  background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
  border-radius: 2px;
  transform: translateY(-50%);
  transition: all 0.3s ease;
}

.slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  background: transparent;
  pointer-events: none;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
}

.slider-input::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
  pointer-events: auto;
  transition: all 0.2s ease;
}

.slider-input::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.slider-input::-webkit-slider-thumb:active {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.5);
}

.slider-input::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
  pointer-events: auto;
  transition: all 0.2s ease;
}

.slider-input::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.slider-min {
  z-index: 1;
}

.slider-max {
  z-index: 2;
}

.price-display {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8fafb 0%, #f1f5f9 100%);
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.price-min,
.price-max {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  padding: 4px 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Order Statistics Styles */
.order-statistics {
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-weight: 500;
  color: #6c757d;
}

.stat-value {
  font-weight: 700;
  font-size: 1.1em;
  color: #2c3e50;
}

.total-value {
  color: #27ae60;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.table tbody tr:hover {
  background: #f8f9fa;
}

.customer-info strong {
  display: block;
}

.customer-info small {
  color: #6c757d;
}

.products-list {
  max-width: 200px;
}

.product-item {
  font-size: 14px;
  margin-bottom: 2px;
}

.price {
  color: #e74c3c;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-select {
  padding: 6px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  color: #495057;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
}

.status-select:hover {
  border-color: #3498db;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
  transform: translateY(-1px);
}

.status-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.status-select option {
  padding: 8px 12px;
  background: white;
  color: #495057;
  font-weight: 500;
}

.status-select option:first-child {
  color: #6c757d;
  font-style: italic;
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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.large-modal {
  max-width: 900px;
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

.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.detail-section p {
  margin: 8px 0;
}

.detail-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.detail-table th,
.detail-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.detail-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.detail-table tfoot td {
  font-weight: bold;
  background: #f8f9fa;
}

/* Responsive Design */
/* Large Screen Optimizations */
@media (min-width: 1600px) {
  .orders-page {
    max-width: 1800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .page-header {
    margin-bottom: 2.5rem;
  }
  
  .filters {
    padding: 2rem;
    margin-bottom: 2rem;
  }
  
  .filter-controls {
    gap: 1.5rem;
  }
  
  .search-input,
  .filter-select {
    padding: 1rem;
    font-size: 1rem;
  }
  
  .table th,
  .table td {
    padding: 1rem;
    font-size: 0.9375rem;
  }
  
  .product-info {
    font-size: 0.9375rem;
  }
  
  .actions {
    gap: 1rem;
  }
  
  .btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.9375rem;
  }
}

@media (min-width: 1920px) {
  .orders-page {
    max-width: 2000px;
    padding: 2.5rem;
  }
  
  .filters {
    padding: 2.5rem;
  }
  
  .table th,
  .table td {
    padding: 1.25rem;
    font-size: 1rem;
  }
  
  .btn {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
}

@media (min-width: 1400px) {
  .filter-controls {
    display: flex;
    gap: 1rem;
    max-width: none;
  }
  
  .table-container {
    overflow-x: visible;
  }
  
  .table {
    min-width: auto;
  }
}

@media (max-width: 1400px) {
  .orders-page {
    max-width: 100%;
  }
  
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 1200px) {
  .table th,
  .table td {
    padding: 12px 8px;
    font-size: 14px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 5px;
  }
  
  .products-list {
    max-width: 180px;
  }
  
  .customer-info {
    min-width: 120px;
  }
}

@media (max-width: 1024px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .page-header h2 {
    text-align: center;
  }
  
  .header-actions {
    justify-content: center;
    gap: 8px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .filters {
    padding: 15px;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .filter-controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .price-range-modern {
    margin-top: 15px;
    padding: 12px;
  }
  
  .price-inputs-modern {
    gap: 8px;
  }
  
  .price-input-modern {
    padding: 8px 10px;
    font-size: 13px;
  }
  
  .price-slider-section {
    padding: 16px;
    margin-top: 10px;
  }
  
  .slider-track-container {
    height: 36px;
    margin: 0 8px;
  }
  
  .price-display {
    margin-top: 12px;
    padding: 10px 12px;
  }
  
  .price-min,
  .price-max {
    font-size: 13px;
  }
  
  .order-statistics {
    padding: 12px 15px;
    gap: 20px;
    flex-direction: column;
    align-items: stretch;
  }
  
  .stat-item {
    justify-content: space-between;
  }
  
  .table th,
  .table td {
    padding: 10px 6px;
    font-size: 13px;
  }
  
  .customer-info {
    font-size: 13px;
    min-width: 100px;
  }
  
  .customer-info small {
    font-size: 11px;
  }
  
  .products-list {
    font-size: 12px;
    max-width: 150px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 4px;
    min-width: 80px;
  }
  
  .btn-sm {
    width: 100%;
    justify-content: center;
  }
  
  .status-select {
    width: 100%;
    min-width: 100px;
    padding: 5px 10px;
    font-size: 12px;
    border-radius: 6px;
  }
}

@media (max-width: 900px) {
  .filter-controls {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table {
    min-width: 900px;
  }
  
  .products-list {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .product-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 768px) {
  .orders-page {
    padding: 0 10px;
  }
  
  .page-header {
    margin-bottom: 20px;
    gap: 12px;
  }
  
  .page-header h2 {
    font-size: 1.5rem;
  }
  
  .header-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .filters {
    padding: 12px;
    margin-bottom: 15px;
  }
  
  .filter-row {
    gap: 12px;
  }
  
  .search-input {
    margin-bottom: 0;
  }
  
  .price-range-modern {
    padding: 10px;
    border-radius: 8px;
  }
  
  .price-range-header {
    margin-bottom: 8px;
  }
  
  .price-label {
    font-size: 13px;
  }
  
  .price-reset-btn {
    padding: 3px 8px;
    font-size: 11px;
  }
  
  .price-inputs-modern {
    gap: 6px;
  }
  
  .price-input-modern {
    padding: 8px 10px;
    font-size: 13px;
  }
  
  .input-label {
    font-size: 11px;
  }
  
  .price-slider-section {
    padding: 12px;
  }
  
  .slider-track-container {
    height: 32px;
    margin: 0 6px;
  }
  
  .slider-input::-webkit-slider-thumb {
    height: 16px;
    width: 16px;
  }
  
  .slider-input::-moz-range-thumb {
    height: 16px;
    width: 16px;
  }
  
  .price-display {
    margin-top: 10px;
    padding: 8px 10px;
  }
  
  .price-min,
  .price-max {
    font-size: 12px;
  }
  
  .order-statistics {
    padding: 10px 12px;
    margin-bottom: 20px;
    gap: 15px;
  }
  
  .stat-item {
    font-size: 14px;
  }
  
  .stat-value {
    font-size: 1em;
  }
  
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .table {
    min-width: 900px;
  }
  
  .table th,
  .table td {
    padding: 8px 5px;
    font-size: 12px;
    white-space: nowrap;
  }
  
  .customer-info {
    min-width: 120px;
  }
  
  .customer-info strong {
    display: block;
    font-size: 12px;
  }
  
  .customer-info small {
    font-size: 10px;
    color: #666;
  }
  
  .products-list {
    max-width: 150px;
    overflow: hidden;
  }
  
  .product-item {
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .price {
    font-weight: bold;
    color: #22c55e;
  }
  
  .action-buttons {
    min-width: 100px;
  }
  
  .btn-sm {
    padding: 4px 8px;
    font-size: 11px;
  }
  
  .status-select {
    font-size: 11px;
    padding: 4px 8px;
    min-width: 90px;
    border-radius: 5px;
    background-size: 10px;
    background-position: right 6px center;
  }
  
  .modal {
    width: 95%;
    margin: 10px;
  }
  
  .modal-header {
    padding: 15px;
  }
  
  .modal-header h3 {
    font-size: 1.2rem;
  }
  
  .modal-body {
    padding: 15px;
  }
  
  .detail-section {
    margin-bottom: 20px;
  }
  
  .detail-section h4 {
    font-size: 1.1rem;
  }
  
  .detail-table th,
  .detail-table td {
    padding: 8px 6px;
    font-size: 12px;
  }
}

@media (max-width: 640px) {
  .orders-page {
    padding: 0 5px;
  }
  
  .page-header h2 {
    font-size: 1.3rem;
  }
  
  .table {
    min-width: 1000px;
  }
  
  .table th,
  .table td {
    padding: 6px 4px;
    font-size: 11px;
  }
  
  .btn {
    font-size: 13px;
    padding: 8px 12px;
  }
  
  .btn-sm {
    padding: 4px 6px;
    font-size: 10px;
  }
  
  .search-input,
  .filter-select {
    padding: 8px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .orders-page {
    padding: 0;
  }
  
  .page-header {
    margin-bottom: 15px;
    gap: 10px;
  }
  
  .page-header h2 {
    font-size: 1.2rem;
  }
  
  .header-actions {
    gap: 6px;
  }
  
  .btn {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .btn .icon {
    font-size: 14px;
  }
  
  .filters {
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .filter-row {
    gap: 10px;
  }
  
  .price-range-modern {
    padding: 8px;
    border-radius: 6px;
  }
  
  .price-range-header {
    margin-bottom: 6px;
  }
  
  .price-label {
    font-size: 12px;
  }
  
  .price-reset-btn {
    padding: 2px 6px;
    font-size: 10px;
  }
  
  .price-inputs-modern {
    gap: 4px;
  }
  
  .price-input-modern {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .input-label {
    font-size: 10px;
  }
  
  .price-separator-modern {
    font-size: 14px;
  }
  
  .price-slider-section {
    padding: 10px;
  }
  
  .slider-track-container {
    height: 28px;
    margin: 0 4px;
  }
  
  .slider-track,
  .slider-range {
    height: 3px;
  }
  
  .slider-input {
    height: 28px;
  }
  
  .slider-input::-webkit-slider-thumb {
    height: 14px;
    width: 14px;
    border: 2px solid white;
  }
  
  .slider-input::-moz-range-thumb {
    height: 14px;
    width: 14px;
    border: 2px solid white;
  }
  
  .price-display {
    margin-top: 8px;
    padding: 6px 8px;
  }
  
  .price-min,
  .price-max {
    font-size: 11px;
    padding: 3px 6px;
  }
  
  .order-statistics {
    padding: 8px 10px;
    margin-bottom: 15px;
    gap: 12px;
  }
  
  .stat-item {
    font-size: 13px;
  }
  
  .stat-label {
    font-size: 12px;
  }
  
  .stat-value {
    font-size: 14px;
  }
  
  .table {
    min-width: 1100px;
  }
  
  .table th,
  .table td {
    padding: 5px 3px;
    font-size: 10px;
  }
  
  .customer-info {
    min-width: 100px;
  }
  
  .customer-info strong {
    font-size: 11px;
  }
  
  .customer-info small {
    font-size: 9px;
  }
  
  .products-list {
    max-width: 120px;
  }
  
  .product-item {
    font-size: 10px;
  }
  
  .btn {
    font-size: 12px;
    padding: 6px 10px;
  }
  
  .btn-sm {
    padding: 3px 5px;
    font-size: 9px;
  }
  
  .status-select {
    font-size: 10px;
    padding: 3px 6px;
    min-width: 80px;
    border-radius: 4px;
    background-size: 8px;
    background-position: right 4px center;
    border-width: 1px;
  }
  
  .modal {
    width: 98%;
    margin: 5px;
  }
  
  .modal-header {
    padding: 12px;
  }
  
  .modal-header h3 {
    font-size: 1.1rem;
  }
  
  .modal-body {
    padding: 12px;
  }
  
  .detail-table th,
  .detail-table td {
    padding: 6px 4px;
    font-size: 11px;
  }
}

/* Touch devices optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn {
    min-height: 44px;
    min-width: 44px;
  }
  
  .table tbody tr {
    cursor: pointer;
  }
  
  .table tbody tr:active {
    background: #f8f9fa;
  }
  
  .search-input,
  .filter-select {
    min-height: 44px;
  }
  
  .status-select {
    min-height: 44px;
  }
}

/* Landscape orientation on small devices */
@media (max-width: 768px) and (orientation: landscape) {
  .modal {
    max-height: 95vh;
  }
  
  .modal-body {
    max-height: calc(95vh - 120px);
    overflow-y: auto;
  }
}
</style>
