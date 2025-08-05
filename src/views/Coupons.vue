<template>
  <div class="coupons-page">
    <div class="page-header">
      <h2>Quản lý Phiếu giảm giá</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <span class="icon">➕</span>
        Tạo phiếu giảm giá
      </button>
    </div>
    
    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Tìm kiếm phiếu giảm giá..."
          class="search-input"
        />
      </div>
      <div class="filter-controls">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Có thể sử dụng</option>
          <option value="used">Đã sử dụng</option>
          <option value="expired">Đã hết hạn</option>
          <option value="disabled">Đã vô hiệu hóa</option>
        </select>
      </div>
    </div>
    
    <div class="coupons-grid">
      <div
        v-for="coupon in filteredCoupons"
        :key="coupon.id"
        class="coupon-card"
        :class="{ expired: isExpired(coupon.expiryDate), disabled: !coupon.isActive }"
      >
        <div class="coupon-header">
          <div class="coupon-code">{{ coupon.code }}</div>
          <span class="status-badge" :class="getCouponStatus(coupon)">
            {{ getStatusText(getCouponStatus(coupon)) }}
          </span>
        </div>
        
        <div class="coupon-body">
          <div class="coupon-value">
            <span class="value">{{ coupon.value }}{{ coupon.type === 'percentage' ? '%' : ' VNĐ' }}</span>
            <span class="description">{{ coupon.description }}</span>
          </div>
          
          <div class="coupon-details">
            <div class="detail-item">
              <span class="label">Loại:</span>
              <span>{{ coupon.type === 'percentage' ? 'Giảm %' : 'Giảm tiền' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Hạn sử dụng:</span>
              <span>{{ formatDate(coupon.expiryDate) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Số lượng:</span>
              <span>{{ coupon.usedCount }}/{{ coupon.maxUses || '∞' }}</span>
            </div>
            <div v-if="coupon.minOrderValue" class="detail-item">
              <span class="label">Đơn tối thiểu:</span>
              <span>{{ formatCurrency(coupon.minOrderValue) }}</span>
            </div>
            <div v-if="coupon.maxDiscountAmount" class="detail-item">
              <span class="label">Giảm tối đa:</span>
              <span>{{ formatCurrency(coupon.maxDiscountAmount) }}</span>
            </div>
          </div>
        </div>
        
        <div class="coupon-actions">
          <button class="btn btn-sm btn-outline" @click="editCoupon(coupon)">
            Sửa
          </button>
          <button 
            class="btn btn-sm"
            :class="coupon.isActive ? 'btn-warning' : 'btn-success'"
            @click="toggleStatus(coupon)"
          >
            {{ coupon.isActive ? 'Vô hiệu hóa' : 'Kích hoạt' }}
          </button>
          <button class="btn btn-sm btn-danger" @click="deleteCoupon(coupon.id)">
            Xóa
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Coupon Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Tạo phiếu giảm giá mới' : 'Chỉnh sửa phiếu giảm giá' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCoupon">
            <div class="form-group">
              <label>Mã phiếu giảm giá</label>
              <div class="code-input-group">
                <input v-model="couponForm.code" type="text" required />
                <button type="button" class="btn btn-secondary" @click="generateCode">
                  Tạo mã
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <input v-model="couponForm.description" type="text" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Loại giảm giá</label>
                <select v-model="couponForm.type" required>
                  <option value="">Chọn loại</option>
                  <option value="percentage">Giảm phần trăm (%)</option>
                  <option value="fixed">Giảm tiền cố định</option>
                </select>
              </div>
              <div class="form-group">
                <label>Giá trị</label>
                <input v-model.number="couponForm.value" type="number" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Số lượng tối đa</label>
                <input v-model.number="couponForm.maxUses" type="number" />
                <small>Để trống nếu không giới hạn</small>
              </div>
              <div class="form-group">
                <label>Ngày hết hạn</label>
                <input v-model="couponForm.expiryDate" type="datetime-local" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Giá trị đơn hàng tối thiểu</label>
                <input v-model.number="couponForm.minOrderValue" type="number" />
              </div>
              <div class="form-group" v-if="couponForm.type === 'percentage'">
                <label>Số tiền giảm tối đa</label>
                <input v-model.number="couponForm.maxDiscountAmount" type="number" />
              </div>
            </div>
            <div class="form-group">
              <label>
                <input v-model="couponForm.isActive" type="checkbox" />
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
  
  return coupons
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
</script>

<style scoped>
.coupons-page {
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

.coupons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.coupon-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s;
  border-left: 4px solid #3498db;
}

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
.form-group select {
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

.form-group small {
  color: #6c757d;
  font-size: 12px;
}

.code-input-group {
  display: flex;
  gap: 10px;
}

.code-input-group input {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>
