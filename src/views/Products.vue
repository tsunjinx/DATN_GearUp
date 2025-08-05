<template>
  <div class="products-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h2 class="page-title">
            <i class="page-icon">📦</i>
            Quản Lý Sản Phẩm
          </h2>
          <p class="page-description">Quản lý toàn bộ sản phẩm trong hệ thống</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-success" @click="showAddModal = true">
            <i class="btn-icon">➕</i>
            Thêm Sản Phẩm
          </button>
          <button class="btn btn-outline">
            <i class="btn-icon">📤</i>
            Xuất Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="filters-section card">
      <div class="card-body">
        <div class="filters-header">
          <h3 class="filters-title">
            <i class="filter-icon">🔍</i>
            Bộ Lọc & Tìm Kiếm
          </h3>
          <button class="btn btn-sm btn-outline" @click="resetFilters">
            <i class="btn-icon">🔄</i>
            Đặt lại
          </button>
        </div>
        
        <div class="filters-content">
          <div class="search-section">
            <div class="search-box">
              <i class="search-icon">🔍</i>
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Tìm kiếm theo tên sản phẩm, mã sản phẩm..."
                class="search-input"
              />
            </div>
          </div>
          
          <div class="filter-controls">
            <div class="filter-group">
              <label>Danh mục</label>
              <select v-model="selectedCategory" class="form-control">
                <option value="">Tất cả danh mục</option>
                <option value="sneakers">Giày thể thao</option>
                <option value="boots">Giày boot</option>
                <option value="sandals">Dép sandal</option>
                <option value="formal">Giày tây</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Thương hiệu</label>
              <select v-model="selectedBrand" class="form-control">
                <option value="">Tất cả thương hiệu</option>
                <option value="nike">Nike</option>
                <option value="adidas">Adidas</option>
                <option value="puma">Puma</option>
                <option value="converse">Converse</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Trạng thái</label>
              <select v-model="selectedStatus" class="form-control">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang bán</option>
                <option value="inactive">Ngừng bán</option>
                <option value="low-stock">Sắp hết hàng</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>Khoảng giá</label>
              <div class="price-range">
                <input
                  v-model.number="priceRange.min"
                  type="number"
                  placeholder="Từ"
                  class="form-control price-input"
                />
                <span class="price-separator">-</span>
                <input
                  v-model.number="priceRange.max"
                  type="number"
                  placeholder="Đến"
                  class="form-control price-input"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="filters-summary">
          <div class="summary-stats">
            <span class="summary-item">
              Tổng sản phẩm: <strong>{{ filteredProducts.length }}</strong>
            </span>
            <span class="summary-item">
              Đang hiển thị: <strong>{{ paginatedProducts.length }}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Products Table -->
    <div class="products-table-section card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="table-icon">📋</i>
          Danh Sách Sản Phẩm
        </h3>
        <div class="table-actions">
          <div class="view-options">
            <button 
              class="btn btn-sm" 
              :class="{ 'btn-primary': viewMode === 'table', 'btn-outline': viewMode !== 'table' }"
              @click="viewMode = 'table'"
            >
              <i class="btn-icon">📋</i>
              Bảng
            </button>
            <button 
              class="btn btn-sm" 
              :class="{ 'btn-primary': viewMode === 'grid', 'btn-outline': viewMode !== 'grid' }"
              @click="viewMode = 'grid'"
            >
              <i class="btn-icon">🔲</i>
              Lưới
            </button>
          </div>
        </div>
      </div>
      
      <div class="card-body" v-if="viewMode === 'table'">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th width="50">
                  <input type="checkbox" class="checkbox" />
                </th>
                <th width="80">Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th width="120">Mã SP</th>
                <th width="120">Thương hiệu</th>
                <th width="120">Danh mục</th>
                <th width="130">Giá bán</th>
                <th width="80">Tồn kho</th>
                <th width="100">Trạng thái</th>
                <th width="80">Đánh giá</th>
                <th width="120">Ngày tạo</th>
                <th width="120">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in paginatedProducts" :key="product.id">
                <td>
                  <input type="checkbox" class="checkbox" />
                </td>
                <td>
                  <div class="product-image-cell">
                    <img 
                      :src="product.image || '/placeholder-shoe.jpg'" 
                      :alt="product.name"
                      class="product-thumbnail"
                    />
                  </div>
                </td>
                <td>
                  <div class="product-name-cell">
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-description">{{ truncateText(product.description, 50) }}</div>
                  </div>
                </td>
                <td>
                  <span class="product-code">#{{ product.code }}</span>
                </td>
                <td>
                  <span class="brand-badge" :class="getBrandClass(product.brand)">
                    {{ getBrandName(product.brand) }}
                  </span>
                </td>
                <td>
                  <span class="category-badge">{{ getCategoryName(product.category) }}</span>
                </td>
                <td>
                  <div class="price-cell">
                    <span class="current-price">{{ formatCurrency(product.price) }}</span>
                    <span v-if="product.originalPrice" class="original-price">
                      {{ formatCurrency(product.originalPrice) }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="stock-cell">
                    <span class="stock-number" :class="getStockClass(product.stock)">
                      {{ product.stock }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="getStatusClass(product.status)">
                    {{ getStatusText(product.status) }}
                  </span>
                </td>
                <td>
                  <div class="rating-cell">
                    <div class="rating-stars">
                      <span class="rating-value">{{ product.rating || 0 }}</span>
                      <i class="rating-icon">⭐</i>
                    </div>
                    <div class="rating-count">({{ product.reviewCount || 0 }})</div>
                  </div>
                </td>
                <td>
                  <span class="date-text">{{ formatDate(product.createdAt) }}</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button 
                      class="btn btn-sm btn-outline" 
                      @click="viewProduct(product)"
                      title="Xem chi tiết"
                    >
                      <i class="btn-icon">👁️</i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline" 
                      @click="editProduct(product)"
                      title="Chỉnh sửa"
                    >
                      <i class="btn-icon">✏️</i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline btn-danger" 
                      @click="deleteProduct(product.id)"
                      title="Xóa"
                    >
                      <i class="btn-icon">🗑️</i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="pagination-section">
          <div class="pagination-info">
            Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - 
            {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} 
            của {{ filteredProducts.length }} sản phẩm
          </div>
          <div class="pagination-controls">
            <button 
              class="btn btn-sm btn-outline" 
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              ← Trước
            </button>
            <span class="page-numbers">
              <button 
                v-for="page in visiblePages" 
                :key="page"
                class="btn btn-sm"
                :class="{ 'btn-primary': page === currentPage, 'btn-outline': page !== currentPage }"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </span>
            <button 
              class="btn btn-sm btn-outline" 
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Tiếp →
            </button>
          </div>
        </div>
      </div>
      
      <!-- Grid View -->
      <div class="card-body" v-else>
        <div class="products-grid">
          <div
            v-for="product in paginatedProducts"
            :key="product.id"
            class="product-grid-card"
          >
            <div class="product-image">
              <img :src="product.image || '/placeholder-shoe.jpg'" :alt="product.name" />
              <div class="product-overlay">
                <button class="btn btn-sm btn-primary" @click="viewProduct(product)">
                  <i class="btn-icon">👁️</i>
                </button>
                <button class="btn btn-sm btn-outline" @click="editProduct(product)">
                  <i class="btn-icon">✏️</i>
                </button>
              </div>
            </div>
            <div class="product-grid-info">
              <h4 class="product-grid-name">{{ product.name }}</h4>
              <p class="product-grid-brand">{{ getBrandName(product.brand) }}</p>
              <div class="product-grid-price">{{ formatCurrency(product.price) }}</div>
              <div class="product-grid-meta">
                <span class="stock-info">Kho: {{ product.stock }}</span>
                <span class="badge badge-sm" :class="getStatusClass(product.status)">
                  {{ getStatusText(product.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal modal-lg" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="modal-icon">{{ showAddModal ? '➕' : '✏️' }}</i>
            {{ showAddModal ? 'Thêm Sản Phẩm Mới' : 'Chỉnh Sửa Sản Phẩm' }}
          </h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct" class="product-form">
            <div class="form-row">
              <div class="form-group">
                <label class="required">Tên sản phẩm</label>
                <input 
                  v-model="productForm.name" 
                  type="text" 
                  class="form-control"
                  placeholder="Nhập tên sản phẩm"
                  required 
                />
              </div>
              <div class="form-group">
                <label class="required">Mã sản phẩm</label>
                <input 
                  v-model="productForm.code" 
                  type="text" 
                  class="form-control"
                  placeholder="Mã tự động hoặc nhập thủ công"
                  required 
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="required">Thương hiệu</label>
                <select v-model="productForm.brand" class="form-control" required>
                  <option value="">Chọn thương hiệu</option>
                  <option value="nike">Nike</option>
                  <option value="adidas">Adidas</option>
                  <option value="puma">Puma</option>
                  <option value="converse">Converse</option>
                </select>
              </div>
              <div class="form-group">
                <label class="required">Danh mục</label>
                <select v-model="productForm.category" class="form-control" required>
                  <option value="">Chọn danh mục</option>
                  <option value="sneakers">Giày thể thao</option>
                  <option value="boots">Giày boot</option>
                  <option value="sandals">Dép sandal</option>
                  <option value="formal">Giày tây</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="required">Giá bán</label>
                <div class="input-group">
                  <input 
                    v-model.number="productForm.price" 
                    type="number" 
                    class="form-control"
                    placeholder="0"
                    required 
                  />
                  <span class="input-suffix">₫</span>
                </div>
              </div>
              <div class="form-group">
                <label>Giá gốc</label>
                <div class="input-group">
                  <input 
                    v-model.number="productForm.originalPrice" 
                    type="number" 
                    class="form-control"
                    placeholder="0"
                  />
                  <span class="input-suffix">₫</span>
                </div>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="required">Số lượng tồn kho</label>
                <input 
                  v-model.number="productForm.stock" 
                  type="number" 
                  class="form-control"
                  placeholder="0"
                  required 
                />
              </div>
              <div class="form-group">
                <label>Trạng thái</label>
                <select v-model="productForm.status" class="form-control">
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>Mô tả sản phẩm</label>
              <textarea 
                v-model="productForm.description" 
                class="form-control"
                rows="4"
                placeholder="Nhập mô tả chi tiết về sản phẩm"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label>Hình ảnh sản phẩm</label>
              <div class="image-upload">
                <input type="file" accept="image/*" class="form-control" />
                <p class="upload-hint">Chọn hình ảnh JPG, PNG (tối đa 5MB)</p>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                <i class="btn-icon">❌</i>
                Hủy bỏ
              </button>
              <button type="submit" class="btn btn-success">
                <i class="btn-icon">💾</i>
                {{ showAddModal ? 'Thêm sản phẩm' : 'Cập nhật' }}
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

const searchTerm = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')
const selectedStatus = ref('')
const priceRange = ref({ min: null, max: null })
const viewMode = ref('table')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const showAddModal = ref(false)
const showEditModal = ref(false)
const editingProduct = ref(null)

const productForm = ref({
  name: '',
  code: '',
  brand: '',
  category: '',
  price: 0,
  originalPrice: 0,
  stock: 0,
  status: 'active',
  description: '',
  image: ''
})

// Sample data with Vietnamese product names
const sampleProducts = ref([
  {
    id: 1,
    name: 'Nike Air Max 270 - Trắng Đen',
    code: 'SPO001',
    brand: 'nike',
    category: 'sneakers',
    price: 2850000,
    originalPrice: 3200000,
    stock: 45,
    status: 'active',
    description: 'Giày thể thao Nike Air Max 270 với thiết kế hiện đại, đệm khí tối ưu',
    image: '/placeholder-shoe.jpg',
    rating: 4.5,
    reviewCount: 128,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Adidas Ultra Boost 22 - Xanh Navy',
    code: 'SPO002',
    brand: 'adidas',
    category: 'sneakers',
    price: 3200000,
    stock: 8,
    status: 'active',
    description: 'Giày chạy bộ Adidas Ultra Boost với công nghệ Boost mới nhất',
    image: '/placeholder-shoe.jpg',
    rating: 4.8,
    reviewCount: 89,
    createdAt: new Date('2024-02-01')
  },
  {
    id: 3,
    name: 'Puma RS-X Reinvention - Đa Màu',
    code: 'SPO003',
    brand: 'puma',
    category: 'sneakers',
    price: 1890000,
    stock: 0,
    status: 'inactive',
    description: 'Giày lifestyle Puma RS-X với phong cách retro hiện đại',
    image: '/placeholder-shoe.jpg',
    rating: 4.2,
    reviewCount: 56,
    createdAt: new Date('2024-01-28')
  },
  {
    id: 4,
    name: 'Converse Chuck Taylor All Star - Đen Classic',
    code: 'SPO004',
    brand: 'converse',
    category: 'sneakers',
    price: 1290000,
    stock: 120,
    status: 'active',
    description: 'Giày Converse Chuck Taylor All Star phiên bản classic',
    image: '/placeholder-shoe.jpg',
    rating: 4.6,
    reviewCount: 203,
    createdAt: new Date('2024-02-10')
  }
])

const filteredProducts = computed(() => {
  let products = sampleProducts.value
  
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    products = products.filter(product =>
      product.name.toLowerCase().includes(search) ||
      product.code.toLowerCase().includes(search)
    )
  }
  
  if (selectedCategory.value) {
    products = products.filter(product => product.category === selectedCategory.value)
  }
  
  if (selectedBrand.value) {
    products = products.filter(product => product.brand === selectedBrand.value)
  }
  
  if (selectedStatus.value) {
    if (selectedStatus.value === 'low-stock') {
      products = products.filter(product => product.stock <= 10)
    } else {
      products = products.filter(product => product.status === selectedStatus.value)
    }
  }
  
  if (priceRange.value.min !== null) {
    products = products.filter(product => product.price >= priceRange.value.min)
  }
  
  if (priceRange.value.max !== null) {
    products = products.filter(product => product.price <= priceRange.value.max)
  }
  
  return products
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, '...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...', total)
    }
  }
  
  return pages
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date(date))
}

const getBrandName = (brand) => {
  const brands = {
    nike: 'Nike',
    adidas: 'Adidas',
    puma: 'Puma',
    converse: 'Converse'
  }
  return brands[brand] || brand
}

const getBrandClass = (brand) => {
  return `brand-${brand}`
}

const getCategoryName = (category) => {
  const categories = {
    sneakers: 'Giày thể thao',
    boots: 'Giày boot',
    sandals: 'Dép sandal',
    formal: 'Giày tây'
  }
  return categories[category] || category
}

const getStatusText = (status) => {
  const statusMap = {
    active: 'Đang bán',
    inactive: 'Ngừng bán'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    active: 'badge-success',
    inactive: 'badge-error'
  }
  return classMap[status] || 'badge-secondary'
}

const getStockClass = (stock) => {
  if (stock === 0) return 'stock-out'
  if (stock <= 10) return 'stock-low'
  return 'stock-good'
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const resetFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = ''
  selectedBrand.value = ''
  selectedStatus.value = ''
  priceRange.value = { min: null, max: null }
}

const viewProduct = (product) => {
  console.log('Viewing product:', product)
}

const editProduct = (product) => {
  editingProduct.value = product
  productForm.value = { ...product }
  showEditModal.value = true
}

const deleteProduct = (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
    sampleProducts.value = sampleProducts.value.filter(p => p.id !== id)
  }
}

const saveProduct = () => {
  if (showAddModal.value) {
    const newProduct = {
      ...productForm.value,
      id: Date.now(),
      rating: 0,
      reviewCount: 0,
      createdAt: new Date()
    }
    sampleProducts.value.push(newProduct)
  } else {
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
    code: '',
    brand: '',
    category: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    status: 'active',
    description: '',
    image: ''
  }
}

onMounted(() => {
  console.log('Products page loaded')
})
</script>

<style scoped>
.products-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Page Header */
.page-header {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid var(--border-light);
  padding: 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-info {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 0.5rem 0;
}

.page-icon {
  font-size: 1.75rem;
}

.page-description {
  color: var(--gray-600);
  margin: 0;
  font-size: 0.9375rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

/* Filters Section */
.filters-section {
  background: white;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
}

.filter-icon {
  font-size: 1.25rem;
}

.filters-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-section {
  flex: 1;
}

.search-box {
  position: relative;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: var(--primary-500);
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-100);
}

.filter-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-700);
  font-size: 0.875rem;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  flex: 1;
}

.price-separator {
  color: var(--gray-500);
  font-weight: 500;
}

.filters-summary {
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.summary-stats {
  display: flex;
  gap: 2rem;
}

.summary-item {
  font-size: 0.875rem;
  color: var(--gray-600);
}

/* Table Section */
.products-table-section {
  background: white;
}

.table-actions {
  display: flex;
  gap: 1rem;
}

.view-options {
  display: flex;
  gap: 0.5rem;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.table th {
  background: var(--gray-50);
  color: var(--gray-700);
  font-weight: 600;
  padding: 1rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.table td {
  padding: 1rem 0.75rem;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
}

.table tbody tr:hover {
  background: var(--gray-25);
}

.checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: var(--primary-500);
}

.product-image-cell {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--gray-100);
}

.product-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name-cell {
  max-width: 250px;
}

.product-name {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
}

.product-description {
  color: var(--gray-600);
  font-size: 0.8125rem;
}

.product-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--primary-600);
  background: var(--primary-50);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.brand-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.brand-nike {
  background: #ff6b35;
  color: white;
}

.brand-adidas {
  background: #000;
  color: white;
}

.brand-puma {
  background: #ffd100;
  color: #000;
}

.brand-converse {
  background: #e31e24;
  color: white;
}

.category-badge {
  background: var(--gray-100);
  color: var(--gray-700);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.price-cell {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.current-price {
  font-weight: 700;
  color: var(--gray-900);
}

.original-price {
  font-size: 0.75rem;
  color: var(--gray-500);
  text-decoration: line-through;
}

.stock-cell {
  text-align: center;
}

.stock-number {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.stock-good {
  background: var(--success-100);
  color: var(--success-700);
}

.stock-low {
  background: var(--warning-100);
  color: var(--warning-700);
}

.stock-out {
  background: var(--error-100);
  color: var(--error-700);
}

.rating-cell {
  text-align: center;
}

.rating-stars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.125rem;
}

.rating-value {
  font-weight: 600;
  color: var(--gray-900);
}

.rating-icon {
  color: #fbbf24;
  font-size: 0.875rem;
}

.rating-count {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.date-text {
  color: var(--gray-600);
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

/* Grid View */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-grid-card {
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.2s ease;
}

.product-grid-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--gray-100);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.product-grid-card:hover .product-overlay {
  opacity: 1;
}

.product-grid-info {
  padding: 1rem;
}

.product-grid-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 0.5rem 0;
}

.product-grid-brand {
  color: var(--gray-600);
  font-size: 0.875rem;
  margin: 0 0 0.5rem 0;
}

.product-grid-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--primary-600);
  margin-bottom: 0.5rem;
}

.product-grid-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stock-info {
  font-size: 0.75rem;
  color: var(--gray-600);
}

.badge-sm {
  padding: 0.125rem 0.375rem;
  font-size: 0.625rem;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-top: 1px solid var(--border-light);
}

.pagination-info {
  color: var(--gray-600);
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

/* Modal */
.modal-lg {
  max-width: 800px;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.modal-icon {
  font-size: 1.25rem;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label.required::after {
  content: ' *';
  color: var(--error-500);
}

.input-group {
  position: relative;
}

.input-suffix {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
  font-weight: 500;
}

.image-upload {
  text-align: center;
  padding: 2rem;
  border: 2px dashed var(--border);
  border-radius: 0.5rem;
  background: var(--gray-25);
}

.upload-hint {
  margin: 0.5rem 0 0 0;
  color: var(--gray-500);
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .filter-controls {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.75rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
