<template>
  <div class="employees-page">
    <div class="page-header">
      <h2>Quản lý Nhân viên</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <span class="icon">➕</span>
        Thêm nhân viên
      </button>
    </div>
    
    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Tìm kiếm nhân viên..."
          class="search-input"
        />
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
    
    <div class="table-container">
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
              <span class="role-badge" :class="employee.role">
                {{ getRoleText(employee.role) }}
              </span>
            </td>
            <td>{{ formatCurrency(employee.salary) }}</td>
            <td>{{ formatDate(employee.startDate) }}</td>
            <td>
              <span class="status-badge" :class="employee.status">
                {{ getStatusText(employee.status) }}
              </span>
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
import { ref, computed } from 'vue'

const searchTerm = ref('')
const selectedRole = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingEmployee = ref(null)

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

.role-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.admin {
  background: #e1f5fe;
  color: #01579b;
}

.role-badge.manager {
  background: #f3e5f5;
  color: #4a148c;
}

.role-badge.staff {
  background: #e8f5e8;
  color: #1b5e20;
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

.status-badge.suspended {
  background: #f8d7da;
  color: #721c24;
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
</style>
