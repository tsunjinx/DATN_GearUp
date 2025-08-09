// Dịch vụ khách hàng/nhân viên (Customer/Employee): nhóm API CRUD cho người dùng trong hệ thống.
import api from './api.js'

export const customerService = {
  // Lấy danh sách khách hàng
  getCustomers(params = {}) {
    return api.get('/customers', { params })
  },
  
  // Lấy chi tiết khách hàng
  getCustomer(id) {
    return api.get(`/customers/${id}`)
  },
  
  // Tạo khách hàng mới
  createCustomer(customer) {
    return api.post('/customers', customer)
  },
  
  // Cập nhật khách hàng
  updateCustomer(id, customer) {
    return api.put(`/customers/${id}`, customer)
  },
  
  // Xóa khách hàng
  deleteCustomer(id) {
    return api.delete(`/customers/${id}`)
  }
}

export const employeeService = {
  // Lấy danh sách nhân viên
  getEmployees(params = {}) {
    return api.get('/employees', { params })
  },
  
  // Lấy chi tiết nhân viên
  getEmployee(id) {
    return api.get(`/employees/${id}`)
  },
  
  // Tạo nhân viên mới
  createEmployee(employee) {
    return api.post('/employees', employee)
  },
  
  // Cập nhật nhân viên
  updateEmployee(id, employee) {
    return api.put(`/employees/${id}`, employee)
  },
  
  // Xóa nhân viên
  deleteEmployee(id) {
    return api.delete(`/employees/${id}`)
  }
}
