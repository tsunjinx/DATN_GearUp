<template>
  <div class="products-page">
    <div class="page-header">
      <h2>Quản lý Sản phẩm</h2>
      <button class="btn btn-primary" @click="showAddModal = true">
        <span class="icon">➕</span>
        Thêm sản phẩm
      </button>
    </div>
    
    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          class="search-input"
        />
      </div>
      <div class="filter-controls">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">Tất cả danh mục</option>
          <option value="sneakers">Giày thể thao</option>
          <option value="boots">Giày boot</option>
          <option value="sandals">Dép sandal</option>
        </select>
        <select v-model="selectedBrand" class="filter-select">
          <option value="">Tất cả thương hiệu</option>
          <option value="nike">Nike</option>
          <option value="adidas">Adidas</option>
          <option value="puma">Puma</option>
        </select>
      </div>
    </div>
    
    <div class="products-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
      >
        <div class="product-image">
          <img :src="product.image || '/placeholder-shoe.jpg'" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="brand">{{ product.brand }}</p>
          <p class="price">{{ formatCurrency(product.price) }}</p>
          <p class="stock">Kho: {{ product.stock }}</p>
          <div class="product-actions">
            <button class="btn btn-sm btn-outline" @click="editProduct(product)">
              Sửa
            </button>
            <button class="btn btn-sm btn-danger" @click="deleteProduct(product.id)">
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Product Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showAddModal ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="form-group">
              <label>Tên sản phẩm</label>
              <input v-model="productForm.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Thương hiệu</label>
              <select v-model="productForm.brand" required>
                <option value="">Chọn thương hiệu</option>
                <option value="nike">Nike</option>
                <option value="adidas">Adidas</option>
                <option value="puma">Puma</option>
              </select>
            </div>
            <div class="form-group">
              <label>Danh mục</label>
              <select v-model="productForm.category" required>
                <option value="">Chọn danh mục</option>
                <option value="sneakers">Giày thể thao</option>
                <option value="boots">Giày boot</option>
                <option value="sandals">Dép sandal</option>
              </select>
            </div>
            <div class="form-group">
              <label>Giá</label>
              <input v-model.number="productForm.price" type="number" required />
            </div>
            <div class="form-group">
              <label>Số lượng</label>
              <input v-model.number="productForm.stock" type="number" required />
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="productForm.description" rows="4"></textarea>
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
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../stores/productStore.js'

const productStore = useProductStore()

const searchTerm = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingProduct = ref(null)

const productForm = ref({
  name: '',
  brand: '',
  category: '',
  price: 0,
  stock: 0,
  description: '',
  image: ''
})

// Sample data - replace with API calls
const sampleProducts = ref([
  {
    id: 1,
    name: 'Nike Air Max 270',
    brand: 'nike',
    category: 'sneakers',
    price: 2500000,
    stock: 50,
    description: 'Giày thể thao Nike Air Max 270',
    image: '/placeholder-shoe.jpg'
  },
  {
    id: 2,
    name: 'Adidas Ultra Boost',
    brand: 'adidas',
    category: 'sneakers',
    price: 3200000,
    stock: 30,
    description: 'Giày chạy bộ Adidas Ultra Boost',
    image: '/placeholder-shoe.jpg'
  },
  {
    id: 3,
    name: 'Puma RS-X',
    brand: 'puma',
    category: 'sneakers',
    price: 1800000,
    stock: 25,
    description: 'Giày lifestyle Puma RS-X',
    image: '/placeholder-shoe.jpg'
  }
])

const filteredProducts = computed(() => {
  let products = sampleProducts.value
  
  if (searchTerm.value) {
    products = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }
  
  if (selectedCategory.value) {
    products = products.filter(product => product.category === selectedCategory.value)
  }
  
  if (selectedBrand.value) {
    products = products.filter(product => product.brand === selectedBrand.value)
  }
  
  return products
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const editProduct = (product) => {
  editingProduct.value = product
  productForm.value = { ...product }
  showEditModal.value = true
}

const deleteProduct = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
    sampleProducts.value = sampleProducts.value.filter(p => p.id !== id)
  }
}

const saveProduct = () => {
  if (showAddModal.value) {
    // Add new product
    const newProduct = {
      ...productForm.value,
      id: Date.now() // Simple ID generation
    }
    sampleProducts.value.push(newProduct)
  } else {
    // Update existing product
    const index = sampleProducts.value.findIndex(p => p.id === editingProduct.value.id)
    if (index !== -1) {
      sampleProducts.value[index] = { ...productForm.value }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    brand: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    image: ''
  }
}

onMounted(() => {
  productStore.fetchProducts()
})
</script>

<style scoped>
.products-page {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.page-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.brand {
  color: #7f8c8d;
  font-size: 14px;
  margin: 5px 0;
}

.price {
  color: #e74c3c;
  font-weight: bold;
  font-size: 18px;
  margin: 10px 0;
}

.stock {
  color: #27ae60;
  font-size: 14px;
  margin: 5px 0;
}

.product-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
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
.form-group select,
.form-group textarea {
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
