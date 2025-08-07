<template>
  <div class="employees-page">
    <!-- Employees Header with Action Buttons -->
    <div class="employees-header">
      <div class="header-content">
        <h1 class="employees-title">
          <img class="employees-icon" src="@/assets/employees.png" alt="Employees" />
          Quản lý Nhân viên
        </h1>
        <div class="header-actions">
          <button class="btn btn-success" @click="openAddModal">
            <span class="icon">➕</span>
            Thêm nhân viên
          </button>
        </div>
      </div>
    </div>

    <div class="filters fade-in" style="animation-delay: 0.3s">
      <div class="search-box">
        <input v-model="searchTerm" type="text" placeholder="Tìm kiếm nhân viên..." class="search-input" />
      </div>
      <div class="filter-controls">
        <select v-model="selectedRole" class="filter-select">
          <option value="">Tất cả chức vụ</option>
          <option value="admin">Quản trị viên</option>
          <option value="manager">Quản lý</option>
          <option value="staff">Nhân viên</option>
        </select>
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
            <th>Chức vụ</th>
            <th>Lương</th>
            <th>Ngày vào làm</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <td>#{{ employee.id }}</td>
            <td>{{ employee.fullName }}</td>
            <td>{{ employee.email }}</td>
            <td>{{ employee.phone }}</td>
            <td>
              <StatusBadge :status="employee.role" :size="isMobile ? 'small' : 'normal'" variant="outline"
                :custom-text="getRoleText(employee.role)" />
            </td>
            <td>{{ formatCurrency(employee.salary) }}</td>
            <td>{{ formatDate(employee.startDate) }}</td>
            <td>
              <StatusBadge :status="employee.status" :size="isMobile ? 'small' : 'normal'" />
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline" @click="editEmployee(employee)">
                  Sửa
                </button>
                <button class="btn btn-sm btn-danger" @click="deleteEmployee(employee.id)">
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Employee Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm nhân viên mới' : 'Chỉnh sửa nhân viên' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEmployee">
            <div class="form-group">
              <label>Họ và tên</label>
              <input v-model="employeeForm.fullName" type="text" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="employeeForm.email" type="email" required />
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input v-model="employeeForm.phone" type="tel" required />
            </div>
            <div class="form-group">
              <label>Chức vụ</label>
              <select v-model="employeeForm.role" required>
                <option value="">Chọn chức vụ</option>
                <option value="admin">Quản trị viên</option>
                <option value="manager">Quản lý</option>
                <option value="staff">Nhân viên</option>
              </select>
            </div>
            <div class="form-group">
              <label>Lương</label>
              <input v-model.number="employeeForm.salary" type="number" required />
            </div>
            <div class="form-group">
              <label>Ngày vào làm</label>
              <input v-model="employeeForm.startDate" type="date" required />
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="employeeForm.status" required>
                <option value="active">Hoạt động</option>
                <option value="inactive">Nghỉ việc</option>
                <option value="suspended">Đình chỉ</option>
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
const { staggeredFadeIn, withLoadingAnimation } = useButtonAnimations()
import StatusBadge from '@/components/ui/StatusBadge.vue'

const searchTerm = ref('')
const selectedRole = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingEmployee = ref(null)
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
    return 'Add employee modal opened!'
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

const employeeForm = ref({
  fullName: '',
  email: '',
  phone: '',
  role: '',
  salary: 0,
  startDate: '',
  status: 'active'
})

const sampleEmployees = ref([
  {
    id: 1,
    fullName: 'Phạm Văn Manager',
    email: 'manager@gearup.com',
    phone: '0911234567',
    role: 'manager',
    salary: 25000000,
    startDate: new Date('2023-01-15'),
    status: 'active'
  },
  {
    id: 2,
    fullName: 'Nguyễn Thị Staff',
    email: 'staff1@gearup.com',
    phone: '0912345678',
    role: 'staff',
    salary: 12000000,
    startDate: new Date('2023-03-20'),
    status: 'active'
  },
  {
    id: 3,
    fullName: 'Trần Văn Admin',
    email: 'admin@gearup.com',
    phone: '0913456789',
    role: 'admin',
    salary: 35000000,
    startDate: new Date('2022-06-10'),
    status: 'active'
  }
])

const filteredEmployees = computed(() => {
  let employees = sampleEmployees.value

  if (searchTerm.value) {
    employees = employees.filter(employee =>
      employee.fullName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (selectedRole.value) {
    employees = employees.filter(employee => employee.role === selectedRole.value)
  }

  return employees
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(date))
}

const getRoleText = (role) => {
  const roleMap = {
    admin: 'Quản trị viên',
    manager: 'Quản lý',
    staff: 'Nhân viên'
  }
  return roleMap[role] || role
}

const getStatusText = (status) => {
  const statusMap = {
    active: 'Hoạt động',
    inactive: 'Nghỉ việc',
    suspended: 'Đình chỉ'
  }
  return statusMap[status] || status
}

const editEmployee = (employee) => {
  editingEmployee.value = employee
  employeeForm.value = {
    ...employee,
    startDate: new Date(employee.startDate).toISOString().split('T')[0]
  }
  showEditModal.value = true
}

const deleteEmployee = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
    sampleEmployees.value = sampleEmployees.value.filter(e => e.id !== id)
  }
}

const saveEmployee = () => {
  if (showAddModal.value) {
    const newEmployee = {
      ...employeeForm.value,
      id: Date.now(),
      startDate: new Date(employeeForm.value.startDate)
    }
    sampleEmployees.value.push(newEmployee)
  } else {
    const index = sampleEmployees.value.findIndex(e => e.id === editingEmployee.value.id)
    if (index !== -1) {
      sampleEmployees.value[index] = {
        ...employeeForm.value,
        startDate: new Date(employeeForm.value.startDate)
      }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingEmployee.value = null
  employeeForm.value = {
    fullName: '',
    email: '',
    phone: '',
    role: '',
    salary: 0,
    startDate: '',
    status: 'active'
  }
}
</script>

<style scoped>
/* Employees Header */
.employees-header {
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

.employees-title {
  margin: 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.employees-icon {
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.employees-title:hover .employees-icon {
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  transform: scale(1.1);
}

/* Reuse most styles from previous components */
.employees-page {
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
  .employees-page {
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

  .employee-info {
    min-width: 200px;
  }

  .employee-contact {
    min-width: 180px;
  }

  .action-buttons {
    gap: 1rem;
    min-width: 140px;
  }

  .btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.9375rem;
  }
}

@media (min-width: 1920px) {
  .employees-page {
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

  .employee-info {
    min-width: 250px;
  }

  .employee-contact {
    min-width: 200px;
  }

  .action-buttons {
    min-width: 160px;
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
  .employees-page {
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

  .table {
    min-width: 900px;
  }

  .employee-info {
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

  .table th,
  .table td {
    padding: 10px 6px;
    font-size: 13px;
  }

  .action-buttons {
    min-width: 80px;
  }
}

@media (max-width: 900px) {
  .table {
    min-width: 800px;
  }

  .table th,
  .table td {
    padding: 8px 5px;
    font-size: 12px;
  }

  .employee-info {
    min-width: 100px;
  }

  .employee-contact {
    min-width: 90px;
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
}

@media (max-width: 768px) {
  .employees-page {
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

  .table th:nth-child(6),
  .table td:nth-child(6) {
    min-width: 100px;
  }

  .action-buttons {
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
  .employees-page {
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
  .employees-page {
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
    min-width: 1100px;
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

  .search-input,
  .filter-select {
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
