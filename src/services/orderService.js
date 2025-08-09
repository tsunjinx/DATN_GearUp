// Dịch vụ hóa đơn/giảm giá/mã giảm (Order/Discount/Coupon): nhóm API liên quan đến đơn hàng và khuyến mãi.
// Backend chưa sẵn sàng → thay tạm bằng mock để demo UI
// import api from './api.js'
const mockOrders = [
  { id: 'o1', code: 'INV-001', status: 'pending', total: 12990000, createdAt: Date.now() - 86400000 },
  { id: 'o2', code: 'INV-002', status: 'paid', total: 2590000, createdAt: Date.now() - 172800000 },
]
const ok = (data) => Promise.resolve({ status: 200, data })
const wait = (ms=250)=>new Promise(r=>setTimeout(r,ms))

export const orderService = {
  // Lấy danh sách hóa đơn
  getOrders(params = {}, config = {}) {
    return wait().then(()=> ok(mockOrders))
  },
  
  // Lấy chi tiết hóa đơn
  getOrder(id) {
    return wait().then(()=> ok(mockOrders.find(o=>String(o.id)===String(id))))
  },
  
  // Tạo hóa đơn mới
  createOrder(order) {
    return wait().then(()=> ok({ id: `o${Date.now()}`, ...order }))
  },
  
  // Cập nhật trạng thái hóa đơn
  updateOrderStatus(id, status) {
    return wait().then(()=> ok({ id, status }))
  },
  
  // Hủy hóa đơn
  cancelOrder(id) {
    return wait().then(()=> ok(true))
  }
}

export const discountService = {
  // Lấy danh sách đợt giảm giá
  getDiscounts(params = {}) {
    return wait().then(()=> ok([]))
  },
  
  // Lấy chi tiết đợt giảm giá
  getDiscount(id) {
    return wait().then(()=> ok(null))
  },
  
  // Tạo đợt giảm giá mới
  createDiscount(discount) {
    return wait().then(()=> ok({ id: `d${Date.now()}`, ...discount }))
  },
  
  // Cập nhật đợt giảm giá
  updateDiscount(id, discount) {
    return wait().then(()=> ok({ id, ...discount }))
  },
  
  // Xóa đợt giảm giá
  deleteDiscount(id) {
    return wait().then(()=> ok(true))
  }
}

export const couponService = {
  // Lấy danh sách phiếu giảm giá
  getCoupons(params = {}) {
    return wait().then(()=> ok([]))
  },
  
  // Lấy chi tiết phiếu giảm giá
  getCoupon(id) {
    return wait().then(()=> ok(null))
  },
  
  // Tạo phiếu giảm giá mới
  createCoupon(coupon) {
    return wait().then(()=> ok({ id: `c${Date.now()}`, ...coupon }))
  },
  
  // Cập nhật phiếu giảm giá
  updateCoupon(id, coupon) {
    return wait().then(()=> ok({ id, ...coupon }))
  },
  
  // Xóa phiếu giảm giá
  deleteCoupon(id) {
    return wait().then(()=> ok(true))
  },
  
  // Kiểm tra tính hợp lệ của mã giảm giá
  validateCoupon(code) {
    return wait().then(()=> ok({ valid: code === 'GEARUP10', discount: 0.1 }))
  }
}
