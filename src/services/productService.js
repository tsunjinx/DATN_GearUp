import api from './api.js'

export const productService = {
  // Lấy danh sách sản phẩm
  getProducts(params = {}) {
    return api.get('/products', { params })
  },
  
  // Lấy chi tiết sản phẩm
  getProduct(id) {
    return api.get(`/products/${id}`)
  },
  
  // Tạo sản phẩm mới
  createProduct(product) {
    return api.post('/products', product)
  },
  
  // Cập nhật sản phẩm
  updateProduct(id, product) {
    return api.put(`/products/${id}`, product)
  },
  
  // Xóa sản phẩm
  deleteProduct(id) {
    return api.delete(`/products/${id}`)
  },
  
  // Upload hình ảnh sản phẩm
  uploadImage(file) {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
