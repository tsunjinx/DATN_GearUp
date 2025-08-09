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

    <!-- Enhanced Filters Section - As requested by team -->
    <div class="filters-section card fade-in" style="animation-delay: 0.3s">
      <div class="card-body">
        <div class="filters-header">
          <h3 class="filters-title">
            <i class="filter-icon">🔍</i>
            Bộ Lọc & Tìm Kiếm Nhân viên
          </h3>
        </div>

        <div class="filters-content">
          <div class="search-section">
            <div class="search-box">
              <i class="search-icon">🔍</i>
              <input v-model="searchTerm" type="text" placeholder="Tìm kiếm theo tên, email, mã nhân viên..."
                class="search-input" />
            </div>
          </div>

          <div class="filter-controls">
            <div class="filter-group">
              <label>Chức vụ</label>
              <select v-model="selectedRole" class="form-control">
                <option value="">Tất cả chức vụ</option>
                <option value="admin">Quản trị viên</option>
                <option value="manager">Quản lý</option>
                <option value="staff">Nhân viên</option>
                <option value="intern">Thực tập sinh</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Trạng thái</label>
              <select v-model="selectedStatus" class="form-control">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm nghỉ</option>
                <option value="terminated">Đã nghỉ việc</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Phòng ban</label>
              <select v-model="selectedDepartment" class="form-control">
                <option value="">Tất cả phòng ban</option>
                <option value="sales">Kinh doanh</option>
                <option value="marketing">Marketing</option>
                <option value="warehouse">Kho bãi</option>
                <option value="finance">Kế toán</option>
                <option value="hr">Nhân sự</option>
                <option value="it">Công nghệ thông tin</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Mức lương</label>
              <div class="salary-range">
                <input v-model.number="salaryRange.min" type="number" placeholder="Từ" 
                  class="form-control salary-input" step="1000000" />
                <span class="salary-separator">-</span>
                <input v-model.number="salaryRange.max" type="number" placeholder="Đến" 
                  class="form-control salary-input" step="1000000" />
              </div>
            </div>

            <div class="filter-group">
              <label>Ngày vào làm</label>
              <div class="date-range">
                <input v-model="joinDateRange.from" type="date" class="form-control date-input" placeholder="Từ ngày" />
                <span class="date-separator">-</span>
                <input v-model="joinDateRange.to" type="date" class="form-control date-input" placeholder="Đến ngày" />
              </div>
            </div>
          </div>
        </div>

        <div class="filters-summary">
          <div class="summary-stats">
            <span class="summary-item">
              Tổng nhân viên: <strong>{{ filteredEmployees.length }}</strong>
            </span>
            <span class="summary-item">
              Đang hoạt động: <strong>{{ activeEmployeesCount }}</strong>
            </span>
            <span class="summary-item">
              Tổng lương tháng: <strong>{{ formatCurrency(totalMonthlySalary) }}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons Section - Below Filters -->
    <div class="actions-section card fade-in" style="animation-delay: 0.35s">
      <div class="card-body">
        <div class="action-buttons">
          <div class="action-group">
            <label class="action-label">📊 Quản lý dữ liệu</label>
            <div class="action-buttons-row">
              <button class="btn btn-outline" @click="exportEmployeesToCSV">
                <i class="btn-icon">📤</i>
                Xuất danh sách
              </button>
              <button class="btn btn-outline" @click="importEmployeesCSV">
                <i class="btn-icon">📥</i>
                Nhập từ CSV
              </button>
              <button class="btn btn-outline" @click="resetFilters">
                <i class="btn-icon">🔄</i>
                Đặt lại bộ lọc
              </button>
            </div>
          </div>
          
          <div class="action-group">
            <label class="action-label">💼 Quản lý nhân sự</label>
            <div class="action-buttons-row">
              <button class="btn btn-outline" @click="generatePayroll">
                <i class="btn-icon">💰</i>
                Tính lương
              </button>
              <button class="btn btn-outline" @click="generateAttendanceReport">
                <i class="btn-icon">📅</i>
                Báo cáo chấm công
              </button>
              <button class="btn btn-outline" @click="generateEmployeeReport">
                <i class="btn-icon">📊</i>
                Báo cáo nhân viên
              </button>
            </div>
          </div>
        </div>
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
// Enhanced filter variables - as requested by team
const selectedStatus = ref('')
const selectedDepartment = ref('')
const salaryRange = ref({ min: null, max: null })
const joinDateRange = ref({ from: '', to: '' })

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
    department: 'sales',
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
    department: 'warehouse',
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
    department: 'it',
    salary: 35000000,
    startDate: new Date('2022-06-10'),
    status: 'active'
  },
  {
    id: 4,
    fullName: 'Lê Thị Marketing',
    email: 'marketing@gearup.com',
    phone: '0914567890',
    role: 'staff',
    department: 'marketing',
    salary: 15000000,
    startDate: new Date('2024-02-01'),
    status: 'active'
  },
  {
    id: 5,
    fullName: 'Hoàng Văn Finance',
    email: 'finance@gearup.com',
    phone: '0915678901',
    role: 'manager',
    department: 'finance',
    salary: 22000000,
    startDate: new Date('2023-08-15'),
    status: 'inactive'
  },
  {
    id: 6,
    fullName: 'Ngô Thị HR',
    email: 'hr@gearup.com',
    phone: '0916789012',
    role: 'staff',
    department: 'hr',
    salary: 18000000,
    startDate: new Date('2023-11-20'),
    status: 'active'
  },
  {
    id: 7,
    fullName: 'Đặng Văn Intern',
    email: 'intern@gearup.com',
    phone: '0917890123',
    role: 'intern',
    department: 'marketing',
    salary: 5000000,
    startDate: new Date('2024-10-01'),
    status: 'active'
  },
  {
    id: 8,
    fullName: 'Võ Thị Former',
    email: 'former@gearup.com',
    phone: '0918901234',
    role: 'staff',
    department: 'sales',
    salary: 13000000,
    startDate: new Date('2022-03-10'),
    status: 'terminated'
  }
])

const filteredEmployees = computed(() => {
  let employees = sampleEmployees.value

  // Text search filter
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    employees = employees.filter(employee =>
      employee.fullName.toLowerCase().includes(search) ||
      employee.email.toLowerCase().includes(search) ||
      employee.phone.includes(search) ||
      employee.id.toString().includes(search)
    )
  }

  // Role filter
  if (selectedRole.value) {
    employees = employees.filter(employee => employee.role === selectedRole.value)
  }

  // Status filter
  if (selectedStatus.value) {
    employees = employees.filter(employee => employee.status === selectedStatus.value)
  }

  // Department filter
  if (selectedDepartment.value) {
    employees = employees.filter(employee => employee.department === selectedDepartment.value)
  }

  // Salary range filter
  if (salaryRange.value.min !== null && salaryRange.value.min !== '') {
    employees = employees.filter(employee => employee.salary >= salaryRange.value.min)
  }
  if (salaryRange.value.max !== null && salaryRange.value.max !== '') {
    employees = employees.filter(employee => employee.salary <= salaryRange.value.max)
  }

  // Join date range filter
  if (joinDateRange.value.from) {
    const fromDate = new Date(joinDateRange.value.from)
    employees = employees.filter(employee => new Date(employee.startDate) >= fromDate)
  }
  if (joinDateRange.value.to) {
    const toDate = new Date(joinDateRange.value.to)
    toDate.setHours(23, 59, 59, 999) // End of day
    employees = employees.filter(employee => new Date(employee.startDate) <= toDate)
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
    staff: 'Nhân viên',
    intern: 'Thực tập sinh'
  }
  return roleMap[role] || role
}

const getStatusText = (status) => {
  const statusMap = {
    active: 'Hoạt động',
    inactive: 'Tạm nghỉ',
    terminated: 'Đã nghỉ việc',
    suspended: 'Đình chỉ'
  }
  return statusMap[status] || status
}

// Enhanced statistics - as requested by team
const activeEmployeesCount = computed(() => 
  sampleEmployees.value.filter(employee => employee.status === 'active').length
)

const totalMonthlySalary = computed(() => {
  return filteredEmployees.value
    .filter(employee => employee.status === 'active')
    .reduce((total, employee) => total + employee.salary, 0)
})

// Reset filters function
const resetFilters = () => {
  searchTerm.value = ''
  selectedRole.value = ''
  selectedStatus.value = ''
  selectedDepartment.value = ''
  salaryRange.value = { min: null, max: null }
  joinDateRange.value = { from: '', to: '' }
}

// Enhanced action functions - as requested by team
const exportEmployeesToCSV = async () => {
  try {
    console.log('Exporting employees to CSV...')
    alert('Đang xuất danh sách nhân viên ra file CSV. Chức năng sẽ được hoàn thiện.')
  } catch (error) {
    console.error('Export error:', error)
  }
}

const importEmployeesCSV = async () => {
  try {
    console.log('Importing employees from CSV...')
    alert('Chức năng nhập nhân viên từ CSV sẽ được tích hợp.')
  } catch (error) {
    console.error('Import error:', error)
  }
}

const generatePayroll = async () => {
  try {
    console.log('Generating payroll...')
    const activeEmployees = filteredEmployees.value.filter(e => e.status === 'active')
    const totalPayroll = activeEmployees.reduce((total, emp) => total + emp.salary, 0)
    alert(`Tính lương cho ${activeEmployees.length} nhân viên.\nTổng lương tháng: ${formatCurrency(totalPayroll)}`)
  } catch (error) {
    console.error('Payroll error:', error)
  }
}

const generateAttendanceReport = async () => {
  try {
    console.log('Generating attendance report...')
    alert('Đang tạo báo cáo chấm công cho tháng hiện tại. Chức năng sẽ được hoàn thiện.')
  } catch (error) {
    console.error('Attendance report error:', error)
  }
}

const generateEmployeeReport = async () => {
  try {
    console.log('Generating employee report...')
    alert('Đang tạo báo cáo tổng hợp nhân viên. Chức năng sẽ được hoàn thiện.')
  } catch (error) {
    console.error('Employee report error:', error)
  }
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

/* Enhanced Filters Section Styling - As requested by team */
.filters-section {
  margin-bottom: var(--spacing-lg);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.filters-title {
  margin: 0;
  color: var(--gray-900);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.filter-icon {
  font-size: var(--font-size-lg);
}

.filters-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.search-section {
  position: relative;
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
  font-size: var(--font-size-sm);
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--spacing-md);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-group label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-700);
}

.salary-range,
.date-range {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  max-width: 100%;
  overflow: hidden;
}

.salary-input,
.date-input {
  flex: 1;
  min-width: 0; /* Allow flex items to shrink below content size */
  max-width: 120px; /* Prevent individual inputs from getting too wide */
}

.salary-separator,
.date-separator {
  color: var(--gray-500);
  font-weight: var(--font-weight-semibold);
}

.filters-summary {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

.summary-stats {
  display: flex;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.summary-item {
  font-size: var(--font-size-sm);
  color: var(--gray-600);
}

.summary-item strong {
  color: var(--primary-600);
  font-weight: var(--font-weight-bold);
}

/* Actions Section Styling - Below Filters as requested */
.actions-section {
  margin-bottom: var(--spacing-lg);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.action-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-width: 280px;
}

.action-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--gray-700);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.action-buttons-row {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.action-buttons-row .btn {
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.action-buttons-row .btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Responsive design for enhanced filters */
@media (max-width: 768px) {
  .filter-controls {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
  
  .action-group {
    min-width: auto;
  }
  
  .action-buttons-row {
    justify-content: center;
  }
  
  .action-buttons-row .btn {
    flex: 1;
    min-width: 120px;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .salary-range,
  .date-range {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .salary-input,
  .date-input {
    max-width: 100%;
  }
}
</style>
