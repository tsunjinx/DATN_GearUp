<template>
  <div class="customers-page">
    <!-- Customers Header with Action Buttons -->
    <div class="customers-header">
      <div class="header-content">
        <h1 class="customers-title">
          <img class="customers-icon" src="@/assets/customers.png" alt="Customers" />
          Quản lý Khách hàng
        </h1>
        <div class="header-actions">
          <button class="btn btn-success" @click="showAddModal = true">
            <span class="icon">➕</span>
            Thêm khách hàng
          </button>
        </div>
      </div>
    </div>

    <div class="filters fade-in" style="animation-delay: 0.3s">
      <div class="search-box">
        <input v-model="searchTerm" type="text" placeholder="Tìm kiếm khách hàng..." class="search-input" />
      </div>
    </div>

    <div class="table-container fade-in" style="animation-delay: 0.5s">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Ngày đăng ký</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.id">
            <td>#{{ customer.id }}</td>
            <td>{{ customer.fullName }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.address }}</td>
            <td>{{ formatDate(customer.createdAt) }}</td>
            <td>
              <StatusBadge :status="customer.status" :size="isMobile ? 'small' : 'normal'" />
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline" @click="editCustomer(customer)">
                  Sửa
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteCustomer(customer.id)">
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Customer Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm khách hàng mới' : 'Chỉnh sửa khách hàng' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCustomer">
            <div class="form-group">
              <label>Họ và tên</label>
              <input v-model="customerForm.fullName" type="text" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="customerForm.email" type="email" required />
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input v-model="customerForm.phone" type="tel" required />
            </div>
            <div class="form-group">
              <label>Địa chỉ</label>
              <input v-model="customerForm.address" type="text" required />
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="customerForm.status" required>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="blocked">Bị khóa</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                Hủy
              </button>
              <button type="submit" class="btn btn-primary">
                {{ showAddModal ? 'Thêm' : 'Cập nhật' }}
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

// Button animations composable
const { staggeredFadeIn } = useButtonAnimations()
import StatusBadge from '@/components/ui/StatusBadge.vue'

const searchTerm = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCustomer = ref(null)
const isMobile = ref(false)

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
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

const customerForm = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  status: 'active'
})

const sampleCustomers = ref([
  {
    id: 1,
    fullName: 'Nguyễn Văn A',
    email: 'nguyen.van.a@email.com',
    phone: '0901234567',
    address: 'Hà Nội',
    status: 'active',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    fullName: 'Trần Thị B',
    email: 'tran.thi.b@email.com',
    phone: '0902345678',
    address: 'TP.HCM',
    status: 'active',
    createdAt: new Date('2024-02-20')
  },
  {
    id: 3,
    fullName: 'Lê Văn C',
    email: 'le.van.c@email.com',
    phone: '0903456789',
    address: 'Đà Nẵng',
    status: 'inactive',
    createdAt: new Date('2024-03-10')
  }
])

const filteredCustomers = computed(() => {
  if (!searchTerm.value) return sampleCustomers.value

  return sampleCustomers.value.filter(customer =>
    customer.fullName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    customer.phone.includes(searchTerm.value)
  )
})

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(date))
}

const getStatusText = (status) => {
  const statusMap = {
    active: 'Hoạt động',
    inactive: 'Không hoạt động',
    blocked: 'Bị khóa'
  }
  return statusMap[status] || status
}

const editCustomer = (customer) => {
  editingCustomer.value = customer
  customerForm.value = { ...customer }
  showEditModal.value = true
}

const deleteCustomer = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
    sampleCustomers.value = sampleCustomers.value.filter(c => c.id !== id)
  }
}

const saveCustomer = () => {
  if (showAddModal.value) {
    const newCustomer = {
      ...customerForm.value,
      id: Date.now(),
      createdAt: new Date()
    }
    sampleCustomers.value.push(newCustomer)
  } else {
    const index = sampleCustomers.value.findIndex(c => c.id === editingCustomer.value.id)
    if (index !== -1) {
      sampleCustomers.value[index] = { ...customerForm.value }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCustomer.value = null
  customerForm.value = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    status: 'active'
  }
}
</script>

<style scoped>
/* Customers Header */
.customers-header {
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

.customers-title {
  margin: 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.customers-icon {
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.customers-title:hover .customers-icon {
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  transform: scale(1.1);
}

/* Reuse styles from Products.vue with some modifications */
.customers-page {
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

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #6c757d;
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
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.action-buttons {
  display: flex;
  gap: 8px;
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
  max-width: 500px;
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

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 30px;
}

/* Responsive Design */
/* Large Screen Optimizations */
@media (min-width: 1600px) {
  .customers-page {
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

  .customer-info {
    min-width: 200px;
  }

  .customer-contact {
    min-width: 180px;
  }

  .actions {
    gap: 1rem;
    min-width: 120px;
  }

  .btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.9375rem;
  }
}

@media (min-width: 1920px) {
  .customers-page {
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

  .customer-info {
    min-width: 250px;
  }

  .customer-contact {
    min-width: 200px;
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
  .customers-page {
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
    padding: 12px 10px;
    font-size: 14px;
  }

  .table {
    min-width: 800px;
  }

  .action-buttons {
    min-width: 100px;
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

  .search-input {
    max-width: 100%;
  }

  .table th,
  .table td {
    padding: 10px 8px;
    font-size: 13px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 5px;
    min-width: 80px;
  }

  .btn-sm {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 900px) {
  .table {
    min-width: 700px;
  }

  .table th,
  .table td {
    padding: 8px 6px;
    font-size: 12px;
  }

  .customer-name {
    min-width: 120px;
  }

  .customer-contact {
    min-width: 100px;
  }
}

@media (max-width: 768px) {
  .customers-page {
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

  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table {
    min-width: 800px;
  }

  .table th,
  .table td {
    padding: 8px 6px;
    font-size: 12px;
    white-space: nowrap;
  }

  .table th:nth-child(5),
  .table td:nth-child(5) {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .action-buttons {
    flex-direction: column;
    gap: 3px;
    min-width: 80px;
  }

  .btn-sm {
    padding: 4px 8px;
    font-size: 11px;
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
  .customers-page {
    padding: 0 5px;
  }

  .page-header h2 {
    font-size: 1.3rem;
  }

  .table {
    min-width: 900px;
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

  .search-input {
    padding: 8px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .customers-page {
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

  .table {
    min-width: 1000px;
  }

  .table th,
  .table td {
    padding: 5px 3px;
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
  .form-group select {
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

  .table tbody tr {
    cursor: pointer;
  }

  .table tbody tr:active {
    background: #e9ecef;
  }

  .search-input {
    min-height: 44px;
  }

  .form-group input,
  .form-group select {
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
.page-header .btn {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.page-header .btn:hover {
  transform: translateY(-2px) scale(1.05);
}
</style>
