// Dịch vụ sản phẩm (ProductService): gom các API thao tác với sản phẩm (CRUD, upload ảnh).
// Lưu ý: Backend chưa sẵn sàng → dùng mock để phát triển UI
// Khi backend sẵn sàng, chuyển về api thật bằng cách thay thế các hàm bên dưới
// import api from './api.js'
import { mockProducts, applyProductFilters, mockOk, delay } from '@/mocks/products'

export const productService = {
  // Lấy danh sách sản phẩm
  getProducts(params = {}, config = {}) {
    const filtered = applyProductFilters(mockProducts, params)
    return delay(200).then(() => mockOk(filtered))
  },
  
  // Lấy chi tiết sản phẩm
  getProduct(id) {
    const found = mockProducts.find(p => String(p.id) === String(id))
    return delay(200).then(() => mockOk(found))
  },
  
  // Tạo sản phẩm mới
  createProduct(product) {
    return delay(200).then(() => mockOk({ id: crypto.randomUUID?.() || Date.now(), ...product }))
  },
  
  // Cập nhật sản phẩm
  updateProduct(id, product) {
    return delay(200).then(() => mockOk({ id, ...product }))
  },
  
  // Xóa sản phẩm
  deleteProduct(id) {
    return delay(200).then(() => mockOk(true))
  },
  
  // Upload hình ảnh sản phẩm
  uploadImage(file) {
    return delay(200).then(() => mockOk({ url: URL.createObjectURL(file) }))
  }
}
