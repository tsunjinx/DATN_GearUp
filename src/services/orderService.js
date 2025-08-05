import api from './api.js'

export const orderService = {
  // Lấy danh sách hóa đơn
  getOrders(params = {}) {
    return api.get('/orders', { params })
  },
  
  // Lấy chi tiết hóa đơn
  getOrder(id) {
    return api.get(`/orders/${id}`)
  },
  
  // Tạo hóa đơn mới
  createOrder(order) {
    return api.post('/orders', order)
  },
  
  // Cập nhật trạng thái hóa đơn
  updateOrderStatus(id, status) {
    return api.patch(`/orders/${id}/status`, { status })
  },
  
  // Hủy hóa đơn
  cancelOrder(id) {
    return api.delete(`/orders/${id}`)
  }
}

export const discountService = {
  // Lấy danh sách đợt giảm giá
  getDiscounts(params = {}) {
    return api.get('/discounts', { params })
  },
  
  // Lấy chi tiết đợt giảm giá
  getDiscount(id) {
    return api.get(`/discounts/${id}`)
  },
  
  // Tạo đợt giảm giá mới
  createDiscount(discount) {
    return api.post('/discounts', discount)
  },
  
  // Cập nhật đợt giảm giá
  updateDiscount(id, discount) {
    return api.put(`/discounts/${id}`, discount)
  },
  
  // Xóa đợt giảm giá
  deleteDiscount(id) {
    return api.delete(`/discounts/${id}`)
  }
}

export const couponService = {
  // Lấy danh sách phiếu giảm giá
  getCoupons(params = {}) {
    return api.get('/coupons', { params })
  },
  
  // Lấy chi tiết phiếu giảm giá
  getCoupon(id) {
    return api.get(`/coupons/${id}`)
  },
  
  // Tạo phiếu giảm giá mới
  createCoupon(coupon) {
    return api.post('/coupons', coupon)
  },
  
  // Cập nhật phiếu giảm giá
  updateCoupon(id, coupon) {
    return api.put(`/coupons/${id}`, coupon)
  },
  
  // Xóa phiếu giảm giá
  deleteCoupon(id) {
    return api.delete(`/coupons/${id}`)
  },
  
  // Kiểm tra tính hợp lệ của mã giảm giá
  validateCoupon(code) {
    return api.post('/coupons/validate', { code })
  }
}
