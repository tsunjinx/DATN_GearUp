<!-- Trang Quản lý Sản phẩm (Admin): tìm kiếm/lọc (debounce), bảng/lưới hiển thị, modal thêm/sửa, và trạng thái loading/error/empty. -->
<template>
  <div class="products-page">
    <!-- Products Header with Action Buttons -->
    <div class="products-header">
      <div class="header-content">
        <h1 class="products-title">
          <img class="products-icon" src="@/assets/products.svg" alt="Products" />
          Quản Lý Sản Phẩm
        </h1>
        <div class="header-actions">
          <button class="btn btn-success" @click="openAddModal">
            <i class="btn-icon">➕</i>
            Thêm Sản Phẩm
          </button>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="filters-section card fade-in" style="animation-delay: 0.3s">
      <div class="card-body">
        <div class="filters-header">
          <h3 class="filters-title">
            <i class="filter-icon">🔍</i>
            Bộ Lọc & Tìm Kiếm
          </h3>
        </div>

        <div class="filters-content">
          <div class="search-section">
            <div class="search-box">
              <i class="search-icon">🔍</i>
              <input v-model="searchTerm" type="text" placeholder="Tìm kiếm theo tên sản phẩm, mã sản phẩm..."
                class="search-input" />
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
                <input v-model.number="priceRange.min" type="number" placeholder="Từ"
                  class="form-control price-input" />
                <span class="price-separator">-</span>
                <input v-model.number="priceRange.max" type="number" placeholder="Đến"
                  class="form-control price-input" />
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

    <!-- Action Buttons Section - Below Filters as requested -->
    <div class="actions-section card fade-in" style="animation-delay: 0.35s">
      <div class="card-body">
        <div class="action-buttons">
          <div class="action-group">
            <label class="action-label">📊 Quản lý dữ liệu</label>
            <div class="action-buttons-row">
              <button class="btn btn-outline" @click="exportToCSV">
                <i class="btn-icon">📤</i>
                Xuất Excel
              </button>
              <input ref="csvInput" type="file" accept=".csv" class="hidden" @change="importCSV" />
              <button class="btn btn-outline" @click="triggerImport">
                <i class="btn-icon">📥</i>
                Nhập CSV
              </button>
              <button class="btn btn-outline" @click="resetFilters">
                <i class="btn-icon">🔄</i>
                Đặt lại bộ lọc
              </button>
            </div>
          </div>
          
          <div class="action-group">
            <label class="action-label">📱 Tiện ích</label>
            <div class="action-buttons-row">
              <button class="btn btn-outline" @click="scanQRCode">
                <i class="btn-icon">📷</i>
                Quét mã QR
              </button>
              <button class="btn btn-outline" @click="generateQRCodes">
                <i class="btn-icon">🏷️</i>
                Tạo mã QR
              </button>
              <button class="btn btn-outline" @click="printProductLabels">
                <i class="btn-icon">🖨️</i>
                In nhãn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- States: loading / error / empty -->
    <div v-if="loading" class="card fade-in" style="animation-delay: 0.45s">
      <div class="card-body text-center">
        <span class="loading-spinner"></span>
        <span class="ml-2">Đang tải dữ liệu sản phẩm...</span>
      </div>
    </div>

    <div v-else-if="error" class="card fade-in" style="animation-delay: 0.45s">
      <div class="card-body text-center text-error">
        {{ error }}
      </div>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="card fade-in" style="animation-delay: 0.45s">
      <div class="card-body text-center text-gray">Không có sản phẩm phù hợp</div>
    </div>

    <!-- Products Table -->
    <div v-else class="products-table-section card fade-in" style="animation-delay: 0.5s">
      <div class="card-header">
        <h3 class="card-title">
          <i class="table-icon">📋</i>
          Danh Sách Sản Phẩm
        </h3>
        <div class="table-actions">
          <div class="view-options">
            <button class="btn btn-sm"
              :class="{ 'btn-primary': viewMode === 'table', 'btn-outline': viewMode !== 'table' }"
              @click="viewMode = 'table'">
              <i class="btn-icon">📋</i>
              Bảng
            </button>
            <button class="btn btn-sm"
              :class="{ 'btn-primary': viewMode === 'grid', 'btn-outline': viewMode !== 'grid' }"
              @click="viewMode = 'grid'">
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
                    <img :src="product.image || '/placeholder-shoe.jpg'" :alt="product.name"
                      class="product-thumbnail" />
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
                  <div class="brand-logo-cell">
                    <img :src="getBrandLogo(product.brand)" :alt="getBrandName(product.brand)" class="brand-logo"
                      @error="handleBrandLogoError" />
                    <span class="brand-name">{{ getBrandName(product.brand) }}</span>
                  </div>
                </td>
                <td>
                  <span class="category-badge" :class="getCategoryClass(product.category)">
                    {{ getCategoryName(product.category) }}
                  </span>
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
                    <button class="btn btn-sm btn-outline" @click="viewProduct(product)" title="Xem chi tiết">
                      <i class="btn-icon">👁️</i>
                    </button>
                    <button class="btn btn-sm btn-outline" @click="editProduct(product)" title="Chỉnh sửa">
                      <i class="btn-icon">✏️</i>
                    </button>
                    <button class="btn btn-sm btn-outline btn-danger" @click="deleteProduct(product.id)" title="Xóa">
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
            <button class="btn btn-sm btn-outline" :disabled="currentPage === 1" @click="currentPage--">
              ← Trước
            </button>
            <span class="page-numbers">
              <button v-for="page in visiblePages" :key="page" class="btn btn-sm"
                :class="{ 'btn-primary': page === currentPage, 'btn-outline': page !== currentPage }"
                @click="currentPage = page">
                {{ page }}
              </button>
            </span>
            <button class="btn btn-sm btn-outline" :disabled="currentPage === totalPages" @click="currentPage++">
              Tiếp →
            </button>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div class="card-body" v-else>
        <div class="products-grid">
          <div v-for="product in paginatedProducts" :key="product.id" class="product-grid-card">
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
              <div class="product-grid-brand">
                <img :src="getBrandLogo(product.brand)" :alt="getBrandName(product.brand)" class="brand-logo-small"
                  @error="handleBrandLogoError" />
                <span class="brand-name-small">{{ getBrandName(product.brand) }}</span>
              </div>
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
                <input v-model="productForm.name" type="text" class="form-control" placeholder="Nhập tên sản phẩm"
                  required />
              </div>
              <div class="form-group">
                <label class="required">Mã sản phẩm</label>
                <input v-model="productForm.code" type="text" class="form-control"
                  placeholder="Mã tự động hoặc nhập thủ công" required />
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
                  <input v-model.number="productForm.price" type="number" class="form-control" placeholder="0"
                    required />
                  <span class="input-suffix">₫</span>
                </div>
              </div>
              <div class="form-group">
                <label>Giá gốc</label>
                <div class="input-group">
                  <input v-model.number="productForm.originalPrice" type="number" class="form-control"
                    placeholder="0" />
                  <span class="input-suffix">₫</span>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="required">Số lượng tồn kho</label>
                <input v-model.number="productForm.stock" type="number" class="form-control" placeholder="0" required />
              </div>
              <div class="form-group">
                <label>Trạng thái</label>
                <select v-model="productForm.status" class="form-control">
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
                </select>
              </div>
            </div>

            <!-- Enhanced ERD Fields -->
            <div class="form-section-header">
              <h4>🏷️ Thông tin chi tiết sản phẩm</h4>
              <p class="form-section-description">Các thuộc tính chuyên biệt cho giày dép</p>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Nhà sản xuất</label>
                <select v-model="productForm.manufacturer" class="form-control">
                  <option value="">Chọn nhà sản xuất</option>
                  <option value="1">Nike</option>
                  <option value="2">Adidas</option>
                  <option value="3">Puma</option>
                  <option value="4">Converse</option>
                  <option value="5">Vans</option>
                  <option value="6">New Balance</option>
                  <option value="7">Asics</option>
                  <option value="8">Under Armour</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Xuất xứ</label>
                <select v-model="productForm.origin" class="form-control">
                  <option value="">Chọn xuất xứ</option>
                  <option value="1">Việt Nam</option>
                  <option value="2">Trung Quốc</option>
                  <option value="3">Indonesia</option>
                  <option value="4">Thái Lan</option>
                  <option value="5">Hàn Quốc</option>
                  <option value="6">Nhật Bản</option>
                  <option value="7">Mỹ</option>
                  <option value="8">Đức</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Chất liệu chính</label>
                <select v-model="productForm.mainMaterial" class="form-control">
                  <option value="">Chọn chất liệu</option>
                  <option value="1">Da thật</option>
                  <option value="2">Da tổng hợp</option>
                  <option value="3">Vải canvas</option>
                  <option value="4">Vải mesh</option>
                  <option value="5">Vải knit</option>
                  <option value="6">Cao su</option>
                  <option value="7">EVA</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Loại đế giày</label>
                <select v-model="productForm.soleType" class="form-control">
                  <option value="">Chọn loại đế</option>
                  <option value="1">Đế cao su</option>
                  <option value="2">Đế EVA</option>
                  <option value="3">Đế PU</option>
                  <option value="4">Đế Air</option>
                  <option value="5">Đế Boost</option>
                  <option value="6">Đế React</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Khả năng chống nước</label>
                <select v-model="productForm.waterproof" class="form-control">
                  <option value="">Chọn mức độ</option>
                  <option value="1">Không chống nước</option>
                  <option value="2">Chống nước nhẹ</option>
                  <option value="3">Chống nước tốt</option>
                  <option value="4">Hoàn toàn chống nước</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Độ bền</label>
                <select v-model="productForm.durability" class="form-control">
                  <option value="">Chọn độ bền</option>
                  <option value="1">Cơ bản (3-6 tháng)</option>
                  <option value="2">Tốt (6-12 tháng)</option>
                  <option value="3">Rất tốt (1-2 năm)</option>
                  <option value="4">Xuất sắc (2+ năm)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Món thể thao phù hợp</label>
                <select v-model="productForm.sportType" class="form-control">
                  <option value="">Chọn môn thể thao</option>
                  <option value="1">Chạy bộ</option>
                  <option value="2">Bóng đá</option>
                  <option value="3">Bóng rổ</option>
                  <option value="4">Tennis</option>
                  <option value="5">Tập gym</option>
                  <option value="6">Đi bộ</option>
                  <option value="7">Đa năng</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Loại mùa</label>
                <select v-model="productForm.seasonType" class="form-control">
                  <option value="">Chọn mùa phù hợp</option>
                  <option value="1">Tất cả mùa</option>
                  <option value="2">Mùa khô</option>
                  <option value="3">Mùa mưa</option>
                  <option value="4">Mùa hè</option>
                  <option value="5">Mùa đông</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Mô tả sản phẩm</label>
              <textarea v-model="productForm.description" class="form-control" rows="4"
                placeholder="Nhập mô tả chi tiết về sản phẩm"></textarea>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useButtonAnimations } from '@/composables/useButtonAnimations.js'
import { useApi } from '@/composables/useApi'
import { productService } from '@/services/productService'
import { debounce } from '@/utils/debounce'

// Button animations composable
const { staggeredFadeIn, withLoadingAnimation } = useButtonAnimations()

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
  image: '',
  // Enhanced ERD fields
  manufacturer: '',
  origin: '',
  mainMaterial: '',
  soleType: '',
  waterproof: '',
  durability: '',
  sportType: '',
  seasonType: ''
})

// Data
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

// Remote fetch with loading/error/empty states
const { loading, error, data, execute } = useApi()

const fetchProducts = async () => {
  const params = {
    q: searchTerm.value || undefined,
    category: selectedCategory.value || undefined,
    brand: selectedBrand.value || undefined,
    status: selectedStatus.value || undefined,
    priceMin: priceRange.value.min ?? undefined,
    priceMax: priceRange.value.max ?? undefined
  }
  await execute(({ cancelToken }) => productService.getProducts(params, { cancelToken }))
}

const debouncedFetch = debounce(fetchProducts, 400)

watch([searchTerm, selectedCategory, selectedBrand, selectedStatus, () => priceRange.value.min, () => priceRange.value.max], () => {
  debouncedFetch()
})

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

const getBrandLogo = (brand) => {
  const brandLogos = {
    nike: '/brand-logos/nike.svg',
    adidas: '/brand-logos/adidas.svg',
    puma: '/brand-logos/puma.svg',
    converse: '/brand-logos/converse.svg'
  }
  return brandLogos[brand] || '/brand-logos/default.svg'
}

const handleBrandLogoError = (event) => {
  // Fallback to a generic brand icon if logo fails to load
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA0MCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIGZpbGw9IiNmM2Y0ZjYiLz4KICA8dGV4dCB4PSIyMCIgeT0iMTIiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSIjNjc3NDgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CUkFORDwvdGV4dD4KPC9zdmc+'
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

const getCategoryClass = (category) => {
  return `category-${category}`
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

const resetFilters = async (event) => {
  await withLoadingAnimation(event, async () => {
    // Simulate reset process
    await new Promise(resolve => setTimeout(resolve, 800))
    
    searchTerm.value = ''
    selectedCategory.value = ''
    selectedBrand.value = ''
    selectedStatus.value = ''
    priceRange.value = { min: null, max: null }
    
    return 'Filters reset successfully!'
  }, {
    onSuccess: (result) => console.log(result),
    onError: (error) => console.error('Reset failed:', error)
  })
}

// Enhanced header action methods with animations
const openAddModal = async (event) => {
  await withLoadingAnimation(event, async () => {
    // Simulate modal preparation
    await new Promise(resolve => setTimeout(resolve, 600))
    showAddModal.value = true
    return 'Add modal opened!'
  }, {
    onSuccess: (result) => console.log(result),
    onError: (error) => console.error('Open modal failed:', error)
  })
}

// Xuất CSV danh sách sản phẩm (đơn giản) để phục vụ import/export nhanh
const exportToCSV = async () => {
  const rows = [
    ['id','name','code','brand','category','price','originalPrice','stock','status','description'],
    ...sampleProducts.value.map(p => [p.id,p.name,p.code,p.brand,p.category,p.price,p.originalPrice ?? '',p.stock,p.status,p.description?.replaceAll('\n',' ') ?? ''])
  ]
  const csv = rows.map(r => r.map(x => `"${String(x).replaceAll('"','""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'products.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// Nhập CSV để thêm/cập nhật nhanh sản phẩm (tối giản)
const csvInput = ref(null)
const triggerImport = () => csvInput.value?.click()
const importCSV = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const text = await file.text()
  const lines = text.split(/\r?\n/).filter(Boolean)
  const header = lines.shift()?.split(',').map(h => h.replaceAll('"','').trim()) || []
  const getVal = (val) => val?.replace(/^\"|\"$/g,'').replaceAll('""','"')
  const toObj = (arr) => Object.fromEntries(arr.map((v,i)=>[header[i], getVal(v)]))
  const parsed = lines.map(l => toObj(l.match(/\"(?:[^\"]|\"\")*\"|[^,]+/g) || []))
  // Hợp nhất đơn giản theo code
  parsed.forEach(p => {
    if (!p.code) return
    const idx = sampleProducts.value.findIndex(x => x.code === p.code)
    const normalized = {
      id: idx === -1 ? Date.now() + Math.floor(Math.random()*1000) : sampleProducts.value[idx].id,
      name: p.name || 'Sản phẩm',
      code: p.code,
      brand: p.brand || 'nike',
      category: p.category || 'sneakers',
      price: Number(p.price) || 0,
      originalPrice: Number(p.originalPrice) || undefined,
      stock: Number(p.stock) || 0,
      status: p.status || 'active',
      description: p.description || ''
    }
    if (idx === -1) sampleProducts.value.push(normalized)
    else sampleProducts.value[idx] = normalized
  })
  e.target.value = ''
}

// QR Code and Print Functions - As requested by team
const scanQRCode = async () => {
  try {
    // Placeholder for QR scanning functionality
    // In real implementation, this would integrate with camera API
    console.log('Opening QR scanner...')
    alert('Chức năng quét mã QR sẽ được tích hợp với camera. Hiện tại đang trong quá trình phát triển.')
  } catch (error) {
    console.error('QR scan error:', error)
  }
}

const generateQRCodes = async () => {
  try {
    console.log('Generating QR codes for products...')
    // Placeholder for QR code generation
    // In real implementation, this would generate QR codes for selected products
    alert('Đang tạo mã QR cho các sản phẩm đã chọn. Chức năng sẽ được hoàn thiện trong phiên bản tiếp theo.')
  } catch (error) {
    console.error('QR generation error:', error)
  }
}

const printProductLabels = async () => {
  try {
    console.log('Printing product labels...')
    // Placeholder for printing functionality
    // In real implementation, this would format and print product labels
    const selectedProducts = filteredProducts.value.slice(0, 5) // Example: first 5 products
    alert(`Chuẩn bị in nhãn cho ${selectedProducts.length} sản phẩm. Chức năng in sẽ được tích hợp với máy in nhiệt.`)
  } catch (error) {
    console.error('Print error:', error)
  }
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

onMounted(async () => {
  staggeredFadeIn('.header-actions', 100)
  // Initial fetch
  try { await fetchProducts() } catch (e) { /* handled in useApi */ }
})
</script>

<style scoped>
.products-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Products Header */
.products-header {
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

.products-title {
  margin: 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.products-icon {
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.products-title:hover .products-icon {
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  transform: scale(1.1);
}

.btn-white {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-white:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
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

.brand-logo-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
}

.brand-logo {
  width: 40px;
  height: 20px;
  object-fit: contain;
  border-radius: 0.25rem;
  background: var(--gray-50);
  padding: 0.125rem;
  border: 1px solid var(--border-light);
  transition: all 0.2s ease;
}

.brand-logo:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-sm);
}

.brand-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--gray-700);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Keep original brand badge styles for fallback or other uses */
.brand-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  border: 1px solid transparent;
}

.brand-nike {
  background: var(--orange-500);
  color: var(--white);
  border-color: var(--orange-600);
}

.brand-adidas {
  background: var(--gray-900);
  color: var(--white);
  border-color: var(--gray-800);
}

.brand-puma {
  background: var(--yellow-400);
  color: var(--gray-900);
  border-color: var(--yellow-500);
}

.brand-converse {
  background: var(--red-600);
  color: var(--white);
  border-color: var(--red-700);
}

.category-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  letter-spacing: 0.025em;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  min-height: 24px;
}

/* Dynamic category colors */
.category-sneakers {
  background: var(--primary-100);
  color: var(--primary-700);
  border-color: var(--primary-200);
}

.category-boots {
  background: var(--warning-100);
  color: var(--warning-700);
  border-color: var(--warning-200);
}

.category-sandals {
  background: var(--info-100);
  color: var(--info-700);
  border-color: var(--info-200);
}

.category-formal {
  background: var(--success-100);
  color: var(--success-700);
  border-color: var(--success-200);
}

/* Default fallback */
.category-badge:not([class*="category-"]) {
  background: var(--gray-100);
  color: var(--gray-700);
  border-color: var(--gray-200);
}

/* Hover effects */
.category-badge:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-sm);
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
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0 0 0.5rem 0;
}

.brand-logo-small {
  width: 32px;
  height: 16px;
  object-fit: contain;
  border-radius: 0.125rem;
  background: var(--gray-50);
  padding: 0.125rem;
  border: 1px solid var(--border-light);
}

.brand-name-small {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.025em;
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

  /* Medium screen category badges */
  .category-badge {
    font-size: 0.6875rem;
    padding: 0.1875rem 0.4375rem;
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

  /* Responsive category badges */
  .category-badge {
    font-size: 0.625rem;
    padding: 0.125rem 0.375rem;
    min-height: 20px;
  }

  /* Ensure better contrast on small screens */
  .category-sneakers {
    background: var(--primary-200);
    color: var(--primary-800);
  }

  .category-boots {
    background: var(--warning-200);
    color: var(--warning-800);
  }

  .category-sandals {
    background: var(--info-200);
    color: var(--info-800);
  }

  .category-formal {
    background: var(--success-200);
    color: var(--success-800);
  }
}

/* Extra small devices */
@media (max-width: 480px) {
  .category-badge {
    font-size: 0.5rem;
    padding: 0.125rem 0.25rem;
    min-height: 18px;
    border-radius: 0.125rem;
  }

  /* Enhanced contrast for very small screens */
  .category-sneakers {
    background: var(--primary-600);
    color: var(--white);
    border-color: var(--primary-700);
  }

  .category-boots {
    background: var(--warning-600);
    color: var(--white);
    border-color: var(--warning-700);
  }

  .category-sandals {
    background: var(--info-600);
    color: var(--white);
    border-color: var(--info-700);
  }

  .category-formal {
    background: var(--success-600);
    color: var(--white);
    border-color: var(--success-700);
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

/* Enhanced Button Animations */
.header-actions .btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0) scale(1);
  position: relative;
  overflow: hidden;
}

.header-actions .btn::before {
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

.header-actions .btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.header-actions .btn:hover::before {
  width: 300px;
  height: 300px;
}

.header-actions .btn:active {
  transform: translateY(-1px) scale(0.98);
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Success ripple effect for action buttons */
.header-actions .btn.success-ripple {
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

/* Enhanced ERD Form Styling */
.form-section-header {
  margin: 24px 0 16px 0;
  padding: 16px 0;
  border-top: 2px solid var(--primary-100);
  border-bottom: 1px solid var(--border-light);
}

.form-section-header h4 {
  margin: 0 0 4px 0;
  color: var(--primary-600);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-section-description {
  margin: 0;
  color: var(--gray-600);
  font-size: var(--font-size-sm);
  font-style: italic;
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
  min-width: 300px;
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

/* Responsive design for actions */
@media (max-width: 768px) {
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
}
</style>
