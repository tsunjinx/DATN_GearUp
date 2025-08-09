<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">✨</span>
          <span class="badge-text">Chào mừng đến GearUp</span>
        </div>
        <h1 class="hero-title">
          <span class="title-main">Khám phá thế giới giày</span>
          <span class="title-highlight">chất lượng cao 👟</span>
        </h1>
        <p class="hero-description">
          Bộ sưu tập giày thể thao, giày thời trang và phụ kiện chính hãng từ các thương hiệu hàng đầu thế giới.
        </p>
        <div class="hero-actions">
          <Button size="lg" @click="$router.push('/shop/catalog')">
            <span class="btn-icon">🛍️</span>
            Mua sắm ngay
          </Button>
          <Button variant="outline" size="lg" @click="$router.push('/shop/catalog?featured=true')">
            <span class="btn-icon">⭐</span>
            Sản phẩm nổi bật
          </Button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-card">
          <div class="card-icon">👟</div>
          <h3>1000+ Sản phẩm</h3>
          <p>Đa dạng mẫu mã</p>
        </div>
        <div class="hero-card">
          <div class="card-icon">⚡</div>
          <h3>Giao hàng nhanh</h3>
          <p>Trong 24h tại TP.HCM</p>
        </div>
        <div class="hero-card">
          <div class="card-icon">🔒</div>
          <h3>Bảo đảm chất lượng</h3>
          <p>100% hàng chính hãng</p>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-header">
        <h2 class="section-title">Tại sao chọn GearUp?</h2>
        <p class="section-subtitle">Những lợi ích vượt trội khi mua sắm tại GearUp</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon delivery">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16,6 20,6 23,11 23,16 16,16" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div class="feature-content">
            <h3>Giao hàng nhanh chóng</h3>
            <p>Miễn phí giao hàng cho đơn từ 800.000đ. Giao hàng nhanh trong 24h tại TP.HCM và 2-3 ngày toàn quốc.</p>
            <div class="feature-highlight">Miễn phí từ 800K</div>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon return">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1,4 1,10 7,10" />
              <polyline points="23,20 23,14 17,14" />
              <path d="m20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
          </div>
          <div class="feature-content">
            <h3>Đổi trả linh hoạt</h3>
            <p>Chính sách đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất. Hỗ trợ đổi size miễn phí trong 3 ngày.</p>
            <div class="feature-highlight">Đổi trả 7 ngày</div>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon payment">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </div>
          <div class="feature-content">
            <h3>Thanh toán an toàn</h3>
            <p>Hỗ trợ thanh toán COD, chuyển khoản ngân hàng và ví điện tử. Bảo mật thông tin 100%.</p>
            <div class="feature-highlight">Bảo mật 100%</div>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon support">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>
          </div>
          <div class="feature-content">
            <h3>Hỗ trợ 24/7</h3>
            <p>Đội ngũ tư vấn viên chuyên nghiệp, sẵn sàng hỗ trợ bạn 24/7 qua hotline và chat online.</p>
            <div class="feature-highlight">Hỗ trợ 24/7</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products In Stock Section -->
    <section class="products-section">
      <div class="section-header">
        <h2 class="section-title">Sản phẩm có sẵn</h2>
        <p class="section-subtitle">Khám phá bộ sưu tập giày đa dạng đang có sẵn tại cửa hàng</p>
        <div class="section-actions">
          <Button variant="outline" @click="$router.push('/shop/catalog')">
            <span class="btn-icon">👀</span>
            Xem tất cả
          </Button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="products-filter">
        <div class="filter-tabs">
          <button :class="['filter-tab', { active: activeFilter === 'all' }]" @click="activeFilter = 'all'">
            Tất cả
          </button>
          <button :class="['filter-tab', { active: activeFilter === 'nike' }]" @click="activeFilter = 'nike'">
            Nike
          </button>
          <button :class="['filter-tab', { active: activeFilter === 'adidas' }]" @click="activeFilter = 'adidas'">
            Adidas
          </button>
          <button :class="['filter-tab', { active: activeFilter === 'puma' }]" @click="activeFilter = 'puma'">
            Puma
          </button>
          <button :class="['filter-tab', { active: activeFilter === 'converse' }]" @click="activeFilter = 'converse'">
            Converse
          </button>
        </div>

        <div class="sort-controls">
          <select v-model="sortBy" class="sort-select">
            <option value="newest">Mới nhất</option>
            <option value="price-asc">Giá thấp → cao</option>
            <option value="price-desc">Giá cao → thấp</option>
            <option value="popular">Phổ biến</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="productsLoading" class="products-loading">
        <div v-for="n in 8" :key="n" class="product-skeleton" />
      </div>

      <!-- Error State -->
      <div v-else-if="productsError" class="products-error">
        <div class="error-icon">⚠️</div>
        <h3>Không thể tải sản phẩm</h3>
        <p>{{ productsError }}</p>
        <Button @click="fetchProducts"> Thử lại </Button>
      </div>

      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0" class="products-grid">
        <div v-for="product in displayProducts" :key="product.id" class="product-card" @click="goToProduct(product)">
          <div class="product-image">
            <img :src="product.image || '/placeholder-shoe.jpg'" :alt="product.name" loading="lazy" />
            <div class="product-badges">
              <span v-if="product.isNew" class="badge new">Mới</span>
              <span v-if="product.discount" class="badge sale">-{{ product.discount }}%</span>
              <span v-if="product.stock > 0 && product.stock <= 5" class="badge low-stock">Sắp hết</span>
            </div>
            <div class="product-actions">
              <button
                class="action-btn wishlist"
                :class="{ active: isWished(product.id) }"
                :title="isWished(product.id) ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'"
                @click.stop="toggleWishlist(product)"
              >
                {{ isWished(product.id) ? '❤️' : '🤍' }}
              </button>
              <button class="action-btn quick-view" title="Xem nhanh" @click.stop="quickViewProduct(product)">
                👁️
              </button>
            </div>
          </div>

          <div class="product-info">
            <div class="product-brand">
              {{ product.brand || 'GearUp' }}
            </div>
            <h3 class="product-name">
              {{ product.name }}
            </h3>
            <div v-if="product.rating" class="product-rating">
              <div class="stars">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.floor(product.rating) }"
                  >⭐</span
                >
              </div>
              <span class="rating-text">({{ product.rating }})</span>
            </div>
            <div class="product-price">
              <span v-if="product.originalPrice && product.originalPrice !== product.price" class="original-price">
                {{ formatCurrency(product.originalPrice) }}
              </span>
              <span class="current-price">{{ formatCurrency(product.price) }}</span>
            </div>
            <div class="product-stock">
              <span :class="['stock-status', getStockStatus(product.stock)]">
                {{ getStockText(product.stock) }}
              </span>
            </div>
          </div>

          <div class="product-footer">
            <Button size="sm" :disabled="product.stock === 0" class="add-to-cart-btn" @click.stop="addToCart(product)">
              <span class="btn-icon">🛒</span>
              {{ product.stock === 0 ? 'Hết hàng' : 'Thêm giỏ hàng' }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="products-empty">
        <div class="empty-icon">📦</div>
        <h3>Không có sản phẩm nào</h3>
        <p>Hiện tại không có sản phẩm nào phù hợp với bộ lọc của bạn.</p>
        <Button @click="activeFilter = 'all'"> Xem tất cả sản phẩm </Button>
      </div>

      <!-- Show More Button -->
      <div v-if="filteredProducts.length > displayLimit" class="show-more">
        <Button variant="outline" size="lg" @click="displayLimit += 8">
          Xem thêm sản phẩm
          <span class="btn-icon">⬇️</span>
        </Button>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <div class="cta-badge">
          <span class="cta-badge-text">Bắt đầu ngay</span>
        </div>
        <h2 class="cta-title">Sẵn sàng khám phá?</h2>
        <p class="cta-description">Hãy bắt đầu hành trình tìm kiếm đôi giày hoàn hảo của bạn cùng GearUp.</p>
        <div class="cta-actions">
          <Button size="lg" @click="$router.push('/shop/catalog')"> Khám phá sản phẩm </Button>
          <Button variant="outline" size="lg" @click="$router.push('/shop/account')"> Tạo tài khoản </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui'
import { useApi } from '@/composables/useApi'
import { productService } from '@/services/productService'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'

const router = useRouter()
const cart = useCartStore()
const wishlist = useWishlistStore()

// Load stores
cart.load()
wishlist.load()

// Products data
const products = ref([])
const productsLoading = ref(true)
const productsError = ref(null)
const activeFilter = ref('all')
const sortBy = ref('newest')
const displayLimit = ref(8)

// API composable
const { loading, error, execute } = useApi()

// Fetch products
const fetchProducts = async () => {
  productsLoading.value = true
  productsError.value = null

  try {
    const response = await execute(({ cancelToken }) =>
      productService.getProducts({ inStockOnly: true }, { cancelToken })
    )

    if (response?.data) {
      // Add some sample data if API doesn't return enough products
      products.value = response.data.length > 0 ? response.data : getSampleProducts()
    } else {
      products.value = getSampleProducts()
    }
  } catch (err) {
    console.error('Failed to fetch products:', err)
    productsError.value = err.message || 'Không thể tải danh sách sản phẩm'
    products.value = getSampleProducts() // Fallback to sample data
  } finally {
    productsLoading.value = false
  }
}

// Sample products data for demo
const getSampleProducts = () => [
  {
    id: 1,
    name: 'Nike Air Max 270',
    brand: 'nike',
    price: 3200000,
    originalPrice: 3800000,
    image: '/products/nike-air-max-270.jpg',
    stock: 15,
    isNew: true,
    discount: 15,
    rating: 4.8,
    category: 'sneakers'
  },
  {
    id: 2,
    name: 'Adidas Ultraboost 22',
    brand: 'adidas',
    price: 4500000,
    image: '/products/adidas-ultraboost.jpg',
    stock: 8,
    isNew: false,
    rating: 4.7,
    category: 'running'
  },
  {
    id: 3,
    name: 'Puma RS-X',
    brand: 'puma',
    price: 2800000,
    originalPrice: 3200000,
    image: '/products/puma-rsx.jpg',
    stock: 3,
    isNew: false,
    discount: 12,
    rating: 4.5,
    category: 'lifestyle'
  },
  {
    id: 4,
    name: 'Converse Chuck Taylor All Star',
    brand: 'converse',
    price: 1800000,
    image: '/products/converse-chuck-taylor.jpg',
    stock: 25,
    isNew: false,
    rating: 4.6,
    category: 'casual'
  },
  {
    id: 5,
    name: 'Nike Air Force 1',
    brand: 'nike',
    price: 2900000,
    image: '/products/nike-air-force-1.jpg',
    stock: 12,
    isNew: true,
    rating: 4.9,
    category: 'lifestyle'
  },
  {
    id: 6,
    name: 'Adidas Stan Smith',
    brand: 'adidas',
    price: 2400000,
    image: '/products/adidas-stan-smith.jpg',
    stock: 18,
    isNew: false,
    rating: 4.4,
    category: 'casual'
  },
  {
    id: 7,
    name: 'Puma Suede Classic',
    brand: 'puma',
    price: 2200000,
    image: '/products/puma-suede-classic.jpg',
    stock: 6,
    isNew: false,
    rating: 4.3,
    category: 'lifestyle'
  },
  {
    id: 8,
    name: 'Converse One Star',
    brand: 'converse',
    price: 2100000,
    originalPrice: 2500000,
    image: '/products/converse-one-star.jpg',
    stock: 1,
    isNew: false,
    discount: 16,
    rating: 4.2,
    category: 'casual'
  },
  {
    id: 9,
    name: 'Nike React Infinity Run',
    brand: 'nike',
    price: 3800000,
    image: '/products/nike-react-infinity.jpg',
    stock: 9,
    isNew: true,
    rating: 4.7,
    category: 'running'
  },
  {
    id: 10,
    name: 'Adidas NMD R1',
    brand: 'adidas',
    price: 3600000,
    image: '/products/adidas-nmd-r1.jpg',
    stock: 14,
    isNew: false,
    rating: 4.6,
    category: 'sneakers'
  }
]

// Computed properties
const filteredProducts = computed(() => {
  let filtered = products.value.filter(product => product.stock > 0)

  // Apply brand filter
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(product => product.brand === activeFilter.value)
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'popular':
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case 'newest':
    default:
      filtered.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1
        if (!a.isNew && b.isNew) return 1
        return b.id - a.id
      })
      break
  }

  return filtered
})

const displayProducts = computed(() => {
  return filteredProducts.value.slice(0, displayLimit.value)
})

// Utility functions
const formatCurrency = amount => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const getStockStatus = stock => {
  if (stock === 0) return 'out-of-stock'
  if (stock <= 5) return 'low-stock'
  if (stock <= 10) return 'medium-stock'
  return 'in-stock'
}

const getStockText = stock => {
  if (stock === 0) return 'Hết hàng'
  if (stock <= 5) return `Chỉ còn ${stock} sản phẩm`
  if (stock <= 10) return 'Số lượng có hạn'
  return 'Còn hàng'
}

// Product interactions
const goToProduct = product => {
  router.push(`/shop/details/${product.id}`)
}

const addToCart = product => {
  if (product.stock > 0) {
    cart.add(product, 1)
    // Show toast notification (would need a toast system)
    console.log(`Added ${product.name} to cart`)
  }
}

const isWished = productId => {
  return wishlist.has(productId)
}

const toggleWishlist = product => {
  wishlist.toggle(product)
}

const quickViewProduct = product => {
  // This would open a quick view modal
  // For now, just navigate to product details
  goToProduct(product)
}

// Watch for filter/sort changes
watch([activeFilter, sortBy], () => {
  displayLimit.value = 8 // Reset display limit when filters change
})

// Initialize data
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
/* ========================================
   Customer Home Page - Modern Design
   Matching admin layout aesthetic
======================================== */

.home-page {
  max-width: 100%;
  margin: 0 auto;
}

/* Hero Section (HeroProduct component from design system) */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  padding: 56px 0; /* section_vspace.hero from design */
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  margin-bottom: 56px;
  border: 1px solid var(--border);
  box-shadow: var(--elevation-card);
}

.hero-content {
  padding: 2rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-surface-alt);
  color: var(--neutral-700);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-pill);
  font-size: 10px; /* overline from design system */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border);
}

.badge-icon {
  font-size: 1rem;
}

.hero-title {
  font-size: 34px; /* h1 from design system */
  line-height: 40px;
  font-weight: 700;
  letter-spacing: -0.25px;
  margin-bottom: 1.5rem;
  color: var(--neutral-900);
  font-family: var(--font-family-heading);
}

.title-main {
  display: block;
  margin-bottom: 0.5rem;
}

.title-highlight {
  display: block;
  color: var(--color-primary);
}

.hero-description {
  font-size: 16px; /* body_lg from design system */
  line-height: 24px;
  color: var(--neutral-600);
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-icon {
  margin-right: 0.5rem;
  font-size: 1.125rem;
}

.hero-visual {
  display: grid;
  gap: 1rem;
  padding: 2rem;
}

.hero-card {
  background: var(--color-surface);
  padding: 16px; /* ProductCard padding from design */
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  box-shadow: var(--elevation-card);
  text-align: center;
  transition: all var(--duration-base) var(--easing);
}

.hero-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--elevation-card-hover);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  display: block;
}

.hero-card h3 {
  font-size: 18px; /* h4 from design system */
  line-height: 24px;
  font-weight: 600;
  color: var(--neutral-900);
  margin: 0 0 0.5rem 0;
}

.hero-card p {
  font-size: 14px; /* body from design system */
  line-height: 22px;
  color: var(--neutral-600);
  margin: 0;
}

/* Features Section */
.features-section {
  margin: 4rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--gray-900);
  margin: 0 0 1rem 0;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--gray-600);
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border-light);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-200);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.feature-icon.delivery {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.feature-icon.return {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.feature-icon.payment {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.feature-icon.support {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 0.75rem 0;
}

.feature-content p {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--gray-600);
  margin: 0 0 1rem 0;
}

.feature-highlight {
  display: inline-flex;
  align-items: center;
  background: var(--primary-50);
  color: var(--primary-700);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--primary-200);
}

/* Products Section */
.products-section {
  margin: 4rem 0;
}

.products-section .section-header {
  position: relative;
}

.section-actions {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  gap: 1rem;
}

.products-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid var(--border-light);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.filter-tab {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  background: white;
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem;
}

.filter-tab:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.filter-tab.active {
  background: var(--primary-600);
  border-color: var(--primary-600);
  color: white;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  min-width: 180px;
}

.sort-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid var(--border-light);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-200);
}

.product-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--gray-100);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.new {
  background: var(--success-100);
  color: var(--success-700);
  border: 1px solid var(--success-200);
}

.badge.sale {
  background: var(--danger-100);
  color: var(--danger-700);
  border: 1px solid var(--danger-200);
}

.badge.low-stock {
  background: var(--warning-100);
  color: var(--warning-700);
  border: 1px solid var(--warning-200);
}

.product-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-actions {
  opacity: 1;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 1px solid var(--border-light);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
  background: var(--gray-50);
  transform: scale(1.1);
}

.action-btn.wishlist.active {
  background: var(--danger-50);
  border-color: var(--danger-200);
  color: var(--danger-600);
}

.product-info {
  padding: 1.5rem;
}

.product-brand {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--gray-500);
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.product-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  font-size: 0.875rem;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.star.filled {
  opacity: 1;
}

.rating-text {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.original-price {
  font-size: 0.875rem;
  color: var(--gray-500);
  text-decoration: line-through;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-600);
}

.product-stock {
  margin-bottom: 1rem;
}

.stock-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.stock-status.in-stock {
  background: var(--success-100);
  color: var(--success-700);
}

.stock-status.medium-stock {
  background: var(--warning-100);
  color: var(--warning-700);
}

.stock-status.low-stock {
  background: var(--danger-100);
  color: var(--danger-700);
}

.stock-status.out-of-stock {
  background: var(--gray-100);
  color: var(--gray-600);
}

.product-footer {
  padding: 0 1.5rem 1.5rem;
}

.add-to-cart-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-to-cart-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading State */
.products-loading {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-skeleton {
  background: white;
  border-radius: 1rem;
  border: 1px solid var(--border-light);
  overflow: hidden;
  height: 450px;
}

.product-skeleton::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--gray-100) 0%, var(--gray-200) 50%, var(--gray-100) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Error State */
.products-error {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid var(--border-light);
  margin-bottom: 3rem;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.products-error h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 0.5rem 0;
}

.products-error p {
  color: var(--gray-600);
  margin: 0 0 2rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Empty State */
.products-empty {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid var(--border-light);
  margin-bottom: 3rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.products-empty h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 0.5rem 0;
}

.products-empty p {
  color: var(--gray-600);
  margin: 0 0 2rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

/* Show More */
.show-more {
  text-align: center;
  margin-bottom: 3rem;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 1rem;
  text-align: center;
  margin: 4rem 0;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
}

.cta-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 2rem;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .products-loading {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .section-actions {
    position: static;
    justify-content: center;
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 1rem;
    margin-bottom: 3rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-actions {
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .products-section .section-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .products-filter {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
  }

  .filter-tabs {
    justify-content: center;
    flex-wrap: wrap;
  }

  .filter-tab {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }

  .sort-select {
    min-width: 150px;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .products-loading {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .product-skeleton {
    height: 400px;
  }

  .cta-section {
    padding: 3rem 1.5rem;
  }

  .cta-title {
    font-size: 1.875rem;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .products-filter {
    padding: 0.75rem;
  }

  .filter-tabs {
    gap: 0.25rem;
  }

  .filter-tab {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .products-loading {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .product-card {
    margin-bottom: 1rem;
  }

  .product-info {
    padding: 1rem;
  }

  .product-name {
    font-size: 1rem;
  }

  .current-price {
    font-size: 1.125rem;
  }

  .product-footer {
    padding: 0 1rem 1rem;
  }

  .product-skeleton {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }

  .products-filter {
    padding: 0.5rem;
  }

  .filter-tabs {
    grid-template-columns: repeat(3, 1fr);
    display: grid;
    width: 100%;
    gap: 0.25rem;
  }

  .filter-tab {
    padding: 0.5rem 0.25rem;
    text-align: center;
    font-size: 0.7rem;
  }

  .sort-controls {
    width: 100%;
  }

  .sort-select {
    width: 100%;
    min-width: auto;
    font-size: 0.8125rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .products-loading {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .product-actions {
    opacity: 1; /* Always visible on mobile */
    position: static;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 1rem;
    margin-top: -3rem;
    margin-bottom: 1rem;
    z-index: 2;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    font-size: 1rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(4px);
  }

  .cta-title {
    font-size: 1.625rem;
  }
}
</style>
