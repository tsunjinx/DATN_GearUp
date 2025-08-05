<template>
  <div class="discounts-page">
    <div class="page-header">
      <h2>Quản lý Đợt giảm giá</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <span class="icon">➕</span>
        Tạo đợt giảm giá
      </button>
    </div>
    
    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Tìm kiếm đợt giảm giá..."
          class="search-input"
        />
      </div>
      <div class="filter-controls">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Không hoạt động</option>
          <option value="expired">Đã hết hạn</option>
        </select>
      </div>
    </div>
    
    <div class="discounts-grid">
      <div
        v-for="discount in filteredDiscounts"
        :key="discount.id"
        class="discount-card"
        :class="{ expired: isExpired(discount.endDate) }"
      >
        <div class="discount-header">
          <h3>{{ discount.name }}</h3>
          <span class="status-badge" :class="getDiscountStatus(discount)">
            {{ getStatusText(getDiscountStatus(discount)) }}
          </span>
        </div>
        
        <div class="discount-info">
          <div class="discount-value">
            <span class="value">{{ discount.value }}{{ discount.type === 'percentage' ? '%' : ' VNĐ' }}</span>
            <span class="type">{{ discount.type === 'percentage' ? 'Giảm %' : 'Giảm tiền' }}</span>
          </div>
          
          <div class="discount-details">
            <p><strong>Mô tả:</strong> {{ discount.description }}</p>
            <p><strong>Ngày bắt đầu:</strong> {{ formatDate(discount.startDate) }}</p>
            <p><strong>Ngày kết thúc:</strong> {{ formatDate(discount.endDate) }}</p>
            <p><strong>Áp dụng cho:</strong> {{ getApplicableText(discount.applicableType) }}</p>
            <p v-if="discount.minOrderValue">
              <strong>Giá trị đơn hàng tối thiểu:</strong> {{ formatCurrency(discount.minOrderValue) }}
            </p>
          </div>
        </div>
        
        <div class="discount-actions">
          <button class="btn btn-sm btn-outline" @click="editDiscount(discount)">
            Sửa
          </button>
          <button 
            class="btn btn-sm"
            :class="discount.isActive ? 'btn-warning' : 'btn-success'"
            @click="toggleStatus(discount)"
          >
            {{ discount.isActive ? 'Tạm dừng' : 'Kích hoạt' }}
          </button>
          <button class="btn btn-sm btn-danger" @click="deleteDiscount(discount.id)">
            Xóa
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Discount Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Tạo đợt giảm giá mới' : 'Chỉnh sửa đợt giảm giá' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveDiscount">
            <div class="form-group">
              <label>Tên đợt giảm giá</label>
              <input v-model="discountForm.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="discountForm.description" rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Loại giảm giá</label>
                <select v-model="discountForm.type" required>
                  <option value="">Chọn loại</option>
                  <option value="percentage">Giảm phần trăm (%)</option>
                  <option value="fixed">Giảm tiền cố định</option>
                </select>
              </div>
              <div class="form-group">
                <label>Giá trị</label>
                <input v-model.number="discountForm.value" type="number" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Ngày bắt đầu</label>
                <input v-model="discountForm.startDate" type="datetime-local" required />
              </div>
              <div class="form-group">
                <label>Ngày kết thúc</label>
                <input v-model="discountForm.endDate" type="datetime-local" required />
              </div>
            </div>
            <div class="form-group">
              <label>Áp dụng cho</label>
              <select v-model="discountForm.applicableType" required>
                <option value="">Chọn đối tượng áp dụng</option>
                <option value="all">Tất cả sản phẩm</option>
                <option value="category">Danh mục sản phẩm</option>
                <option value="product">Sản phẩm cụ thể</option>
              </select>
            </div>
            <div class="form-group">
              <label>Giá trị đơn hàng tối thiểu</label>
              <input v-model.number="discountForm.minOrderValue" type="number" />
            </div>
            <div class="form-group">
              <label>
                <input v-model="discountForm.isActive" type="checkbox" />
                Kích hoạt ngay
              </label>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Hủy
              </button>
              <button type="submit" class="btn btn-primary">
                {{ showAddModal ? 'Tạo' : 'Cập nhật' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchTerm = ref('')
const selectedStatus = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingDiscount = ref(null)

const discountForm = ref({
  name: '',
  description: '',
  type: '',
  value: 0,
  startDate: '',
  endDate: '',
  applicableType: '',
  minOrderValue: 0,
  isActive: true
})

const sampleDiscounts = ref([
  {
    id: 1,
    name: 'Khuyến mãi mùa hè',
    description: 'Giảm giá 20% cho tất cả giày thể thao',
    type: 'percentage',
    value: 20,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    applicableType: 'category',
    minOrderValue: 1000000,
    isActive: true
  },
  {
    id: 2,
    name: 'Flash Sale',
    description: 'Giảm 500,000 VNĐ cho đơn hàng từ 3 triệu',
    type: 'fixed',
    value: 500000,
    startDate: new Date('2024-08-01'),
    endDate: new Date('2024-08-15'),
    applicableType: 'all',
    minOrderValue: 3000000,
    isActive: true
  },
  {
    id: 3,
    name: 'Giảm giá Nike',
    description: 'Giảm 15% cho tất cả sản phẩm Nike',
    type: 'percentage',
    value: 15,
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-31'),
    applicableType: 'product',
    minOrderValue: 0,
    isActive: false
  }
])

const filteredDiscounts = computed(() => {
  let discounts = sampleDiscounts.value
  
  if (searchTerm.value) {
    discounts = discounts.filter(discount =>
      discount.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      discount.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  
  if (selectedStatus.value) {
    discounts = discounts.filter(discount => {
      const status = getDiscountStatus(discount)
      return status === selectedStatus.value
    })
  }
  
  return discounts
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

const isExpired = (endDate) => {
  return new Date(endDate) < new Date()
}

const getDiscountStatus = (discount) => {
  const now = new Date()
  const start = new Date(discount.startDate)
  const end = new Date(discount.endDate)
  
  if (end < now) return 'expired'
  if (!discount.isActive) return 'inactive'
  if (start <= now && end >= now) return 'active'
  return 'inactive'
}

const getStatusText = (status) => {
  const statusMap = {
    active: 'Đang hoạt động',
    inactive: 'Không hoạt động',
    expired: 'Đã hết hạn'
  }
  return statusMap[status] || status
}

const getApplicableText = (type) => {
  const typeMap = {
    all: 'Tất cả sản phẩm',
    category: 'Danh mục sản phẩm',
    product: 'Sản phẩm cụ thể'
  }
  return typeMap[type] || type
}

const editDiscount = (discount) => {
  editingDiscount.value = discount
  discountForm.value = {
    ...discount,
    startDate: new Date(discount.startDate).toISOString().slice(0, 16),
    endDate: new Date(discount.endDate).toISOString().slice(0, 16)
  }
  showEditModal.value = true
}

const toggleStatus = (discount) => {
  discount.isActive = !discount.isActive
}

const deleteDiscount = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa đợt giảm giá này?')) {
    sampleDiscounts.value = sampleDiscounts.value.filter(d => d.id !== id)
  }
}

const saveDiscount = () => {
  if (showAddModal.value) {
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
        startDate: new Date(discountForm.value.startDate),
        endDate: new Date(discountForm.value.endDate)
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingDiscount.value = null
  discountForm.value = {
    name: '',
    description: '',
    type: '',
    value: 0,
    startDate: '',
    endDate: '',
    applicableType: '',
    minOrderValue: 0,
    isActive: true
  }
}
</script>

<style scoped>
.discounts-page {
  max-width: 1200px;
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

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-danger {
  background: #e74c3c;
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
}

.search-box {
  flex: 1;
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
}

.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  min-width: 150px;
}

.discounts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.discount-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  transition: transform 0.3s;
}

.discount-card:hover {
  transform: translateY(-5px);
}

.discount-card.expired {
  opacity: 0.7;
  background: #f8f9fa;
}

.discount-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.discount-header h3 {
  margin: 0;
  color: #2c3e50;
}

.discount-value {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 15px;
}

.discount-value .value {
  display: block;
  font-size: 24px;
  font-weight: bold;
}

.discount-value .type {
  font-size: 14px;
  opacity: 0.9;
}

.discount-details p {
  margin: 8px 0;
  font-size: 14px;
}

.discount-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
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

.status-badge.inactive {
  background: #fff3cd;
  color: #856404;
}

.status-badge.expired {
  background: #f8d7da;
  color: #721c24;
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

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #495057;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>
