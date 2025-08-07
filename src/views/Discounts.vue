<template>
  <div class="discounts-page">
    <!-- Discounts Header with Action Buttons -->
    <div class="discounts-header">
      <div class="header-content">
        <h1 class="discounts-title">
          <img class="discounts-icon" src="@/assets/discounts.png" alt="Discounts" />
          Quản lý Đợt giảm giá
        </h1>
        <div class="header-actions">
          <button class="btn btn-success" @click="openAddModal">
            <span class="icon">➕</span>
            Tạo đợt giảm giá
          </button>
        </div>
      </div>
    </div>

    <div class="filters fade-in" style="animation-delay: 0.3s">
      <div class="search-box">
        <input v-model="searchTerm" type="text" placeholder="Tìm kiếm đợt giảm giá..." class="search-input" />
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

    <div class="discounts-grid fade-in" style="animation-delay: 0.5s">
      <div v-for="discount in filteredDiscounts" :key="discount.id" class="discount-card"
        :class="{ expired: isExpired(discount.endDate) }">
        <div class="discount-header">
          <h3>{{ discount.name }}</h3>
          <StatusBadge :status="getDiscountStatus(discount)" :size="isMobile ? 'small' : 'normal'" />
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
          <button class="btn btn-sm" :class="discount.isActive ? 'btn-warning' : 'btn-success'"
            @click="toggleStatus(discount)">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useButtonAnimations } from '@/composables/useButtonAnimations.js'
import StatusBadge from '@/components/ui/StatusBadge.vue'

// Button animations composable
const { staggeredFadeIn, withLoadingAnimation } = useButtonAnimations()

const searchTerm = ref('')
const selectedStatus = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingDiscount = ref(null)
const isMobile = ref(false)

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// Enhanced header action methods with animations
const openAddModal = async (event) => {
  await withLoadingAnimation(event, async () => {
    // Simulate modal preparation
    await new Promise(resolve => setTimeout(resolve, 600))
    showAddModal.value = true
    return 'Add discount modal opened!'
  }, {
    onSuccess: (result) => console.log(result),
    onError: (error) => console.error('Open modal failed:', error)
  })
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // Add staggered animations to header buttons
  staggeredFadeIn('.page-header', 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

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
/* Discounts Header */
.discounts-header {
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

.discounts-title {
  margin: 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.discounts-icon {
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.discounts-title:hover .discounts-icon {
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  transform: scale(1.1);
}

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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* Responsive Design */
/* Large Screen Optimizations */
@media (min-width: 1600px) {
  .discounts-page {
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

  .search-input {
    padding: 1rem;
    font-size: 1rem;
  }

  .discounts-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
  }

  .discount-card {
    padding: 2rem;
  }

  .discount-header h3 {
    font-size: 1.5rem;
  }

  .discount-value .value {
    font-size: 2.5rem;
  }

  .discount-value .type {
    font-size: 1rem;
  }

  .discount-details p {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .discount-actions {
    gap: 1rem;
  }

  .btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.9375rem;
  }
}

@media (min-width: 1920px) {
  .discounts-page {
    max-width: 2000px;
    padding: 2.5rem;
  }

  .filters {
    padding: 2.5rem;
  }

  .discounts-grid {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2.5rem;
  }

  .discount-card {
    padding: 2.5rem;
  }

  .discount-header h3 {
    font-size: 1.75rem;
  }

  .discount-value .value {
    font-size: 3rem;
  }

  .discount-value .type {
    font-size: 1.125rem;
  }

  .btn {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
}

@media (min-width: 1400px) {
  .discounts-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .discount-card {
    padding: 1.5rem;
  }
}

@media (max-width: 1400px) {
  .discounts-page {
    max-width: 100%;
  }

  .discounts-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 18px;
  }
}

@media (max-width: 1200px) {
  .discounts-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .discount-card {
    padding: 18px;
  }

  .discount-value .value {
    font-size: 2rem;
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

  .filters {
    padding: 15px;
  }

  .filter-controls {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .filter-select {
    width: 100%;
  }

  .discounts-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 18px;
  }

  .discount-card {
    padding: 16px;
  }

  .discount-value .value {
    font-size: 1.8rem;
  }

  .discount-actions {
    flex-direction: column;
    gap: 8px;
  }

  .discount-actions .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 900px) {
  .discounts-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }

  .discount-card {
    padding: 14px;
  }

  .discount-header h3 {
    font-size: 1.1rem;
  }

  .discount-description {
    font-size: 13px;
  }

  .discount-conditions {
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .discounts-page {
    padding: 0 10px;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }

  .filters {
    padding: 12px;
    margin-bottom: 20px;
  }

  .search-input {
    margin-bottom: 10px;
  }

  .discounts-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .discount-card {
    padding: 15px;
  }

  .discount-header h3 {
    font-size: 1.2rem;
  }

  .discount-value .value {
    font-size: 1.6rem;
  }

  .discount-value .type {
    font-size: 12px;
  }

  .discount-details p {
    font-size: 13px;
    margin-bottom: 8px;
  }

  .btn-sm {
    padding: 6px 12px;
    font-size: 12px;
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

  .form-group {
    margin-bottom: 15px;
  }

  .form-actions {
    flex-direction: column;
    gap: 8px;
  }

  .form-actions .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .discounts-page {
    padding: 0 5px;
  }

  .page-header h2 {
    font-size: 1.3rem;
  }

  .discount-card {
    padding: 12px;
  }

  .discount-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .discount-header h3 {
    font-size: 1.1rem;
  }

  .discount-value .value {
    font-size: 1.4rem;
  }

  .discount-details p {
    font-size: 12px;
  }

  .btn {
    font-size: 13px;
    padding: 8px 12px;
  }

  .btn-sm {
    padding: 5px 10px;
    font-size: 11px;
  }

  .search-input,
  .filter-select {
    padding: 8px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .discounts-page {
    padding: 0;
  }

  .page-header {
    margin-bottom: 15px;
  }

  .page-header h2 {
    font-size: 1.2rem;
  }

  .filters {
    padding: 10px;
    margin-bottom: 15px;
  }

  .discounts-grid {
    gap: 12px;
  }

  .discount-card {
    padding: 10px;
  }

  .discount-header h3 {
    font-size: 1rem;
  }

  .discount-value .value {
    font-size: 1.3rem;
  }

  .discount-value .type {
    font-size: 11px;
  }

  .discount-details p {
    font-size: 11px;
    margin-bottom: 6px;
  }

  .btn {
    font-size: 12px;
    padding: 6px 10px;
  }

  .btn-sm {
    padding: 4px 8px;
    font-size: 10px;
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

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 8px;
    font-size: 16px;
    /* Prevents zoom on iOS */
  }
}

/* Touch devices optimizations */
@media (hover: none) and (pointer: coarse) {
  .btn {
    min-height: 44px;
    min-width: 44px;
  }

  .discount-card {
    cursor: pointer;
  }

  .discount-card:active {
    transform: scale(0.98);
  }

  .search-input,
  .filter-select {
    min-height: 44px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
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

  .discounts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Grid improvements for very small screens */
@media (max-width: 360px) {
  .discount-actions {
    gap: 6px;
  }

  .discount-actions .btn {
    font-size: 10px;
    padding: 4px 6px;
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

/* Smooth button transitions */
/* Enhanced Button Animations */
.page-header .btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0) scale(1);
  position: relative;
  overflow: hidden;
}

.page-header .btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.page-header .btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.page-header .btn:hover::before {
  width: 300px;
  height: 300px;
}

.page-header .btn:active {
  transform: translateY(-1px) scale(0.98);
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Success ripple effect for action buttons */
.page-header .btn.success-ripple {
  animation: successPulse 0.6s ease-out;
}

@keyframes successPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}
</style>
