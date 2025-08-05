<template>
  <div class="customers-page">
    <div class="page-header">
      <h2>Quản lý Khách hàng</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <span class="icon">➕</span>
        Thêm khách hàng
      </button>
    </div>
    
    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          class="search-input"
        />
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
              <span class="status-badge" :class="customer.status">
                {{ getStatusText(customer.status) }}
              </span>
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
import { ref, computed } from 'vue'

const searchTerm = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCustomer = ref(null)

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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.status-badge.blocked {
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
