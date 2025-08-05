<template>
  <div class="orders-page">
    <div class="page-header">
      <h2>Quản lý Hóa đơn</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <span class="icon">➕</span>
        Tạo hóa đơn
      </button>
    </div>
    
    <div class="filters">
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
              <span class="status-badge" :class="order.status">
                {{ getStatusText(order.status) }}
              </span>
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
import { ref, computed } from 'vue'

const searchTerm = ref('')
const selectedStatus = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const showAddModal = ref(false)
const showDetailModal = ref(false)
const selectedOrder = ref(null)

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
  
  return orders
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
}

.page-header h2 {
  margin: 0;
  color: #2c3e50;
}

.btn {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
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
  margin-bottom: 30px;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
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
}

.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-width: 120px;
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

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.shipping {
  background: #d4edda;
  color: #155724;
}

.status-badge.completed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
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
</style>
