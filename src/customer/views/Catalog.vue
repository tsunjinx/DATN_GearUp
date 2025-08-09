<!-- Catalog Page - Customer Side with Admin-style Design -->
<template>
  <div class="catalog-page">
    <!-- Page Header with Breadcrumb -->
    <div class="page-header">
      <div class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Trang chủ</router-link>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item current">Danh mục sản phẩm</span>
      </div>
      <h1 class="page-title">Danh mục sản phẩm</h1>
    </div>

    <!-- Controls Bar -->
    <div class="controls-bar">
      <div class="left-controls">
        <div class="search-box">
          <i class="search-icon">🔍</i>
          <FormControl 
            as="input" 
            placeholder="Tìm kiếm sản phẩm..." 
            v-model="q" 
            class="search-input"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          @click="mobileFiltersOpen = !mobileFiltersOpen"
          class="filter-btn"
        >
          <i class="filter-icon">🎛️</i>
          {{ mobileFiltersOpen ? 'Đóng bộ lọc' : 'Bộ lọc' }}
        </Button>
      </div>
      
      <div class="right-controls">
        <div class="view-toggle">
          <button 
            :class="['view-btn', { active: viewMode==='grid' }]" 
            @click="viewMode='grid'"
            title="Xem dạng lưới"
          >
            <i>⊞</i>
          </button>
          <button 
            :class="['view-btn', { active: viewMode==='list' }]" 
            @click="viewMode='list'"
            title="Xem dạng danh sách"
          >
            <i>☰</i>
          </button>
        </div>
        
        <Button 
          v-if="hasActiveFilters" 
          variant="outline" 
          size="sm" 
          @click="clearAll"
          class="clear-btn"
        >
          <i>🗑️</i>
          Xóa bộ lọc
        </Button>
      </div>
    </div>

    <!-- Brand Filter Strip -->
    <div class="brand-filter">
      <div class="brand-label">Thương hiệu:</div>
      <div class="brand-options">
        <button 
          class="brand-chip" 
          :class="{active: brand==='nike'}" 
          @click="brand = brand==='nike' ? '' : 'nike'"
        >
          <img src="/brand-logos/nike.svg" alt="Nike" />
          Nike
        </button>
        <button 
          class="brand-chip" 
          :class="{active: brand==='adidas'}" 
          @click="brand = brand==='adidas' ? '' : 'adidas'"
        >
          <img src="/brand-logos/adidas.svg" alt="Adidas" />
          Adidas
        </button>
        <button 
          class="brand-chip" 
          :class="{active: brand==='puma'}" 
          @click="brand = brand==='puma' ? '' : 'puma'"
        >
          <img src="/brand-logos/puma.svg" alt="Puma" />
          Puma
        </button>
        <button 
          class="brand-chip" 
          :class="{active: brand==='converse'}" 
          @click="brand = brand==='converse' ? '' : 'converse'"
        >
          <img src="/brand-logos/converse.svg" alt="Converse" />
          Converse
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="catalog-content">
      <!-- Filter Sidebar -->
      <aside class="filter-sidebar" :class="{ open: mobileFiltersOpen }">
        <div class="filter-panel">
          <div class="filter-header">
            <h3 class="filter-title">Bộ lọc</h3>
            <button class="close-btn" @click="mobileFiltersOpen=false" aria-label="Đóng">
              ×
            </button>
          </div>
          <CategoryFilter
            v-model="filterModel"
            :brands="brands"
            :categories="categories"
            :closable="false"
            @apply="applyFilters"
            @reset="resetFilters"
          />
        </div>
      </aside>

      <!-- Products Area -->
      <main class="products-area">
        <!-- Loading State -->
        <div v-if="loading" class="loading-grid">
          <div v-for="n in 8" :key="n" class="loading-card"></div>
        </div>
        
        <!-- Error State -->
        <StateBlock 
          v-else-if="error" 
          type="error" 
          :message="error" 
          class="state-block"
        />
        
        <!-- Empty State -->
        <StateBlock 
          v-else-if="items.length === 0" 
          type="empty" 
          message="Không tìm thấy sản phẩm nào" 
          class="state-block"
        />
        
        <!-- Products Grid/List -->
        <div v-else :class="['products-container', viewMode]">
          <ProductCard
            v-for="p in pagedItems"
            :key="p.id"
            :product="p"
            :is-wished="wish.has(p.id)"
            @toggle-wish="wish.toggle(p)"
            @quick-view="quickView(p)"
            @add="addToCart(p)"
            :class="['product-card', viewMode]"
          />
        </div>

        <!-- Pagination -->
        <div v-if="!loading && items.length > pageSize" class="pagination">
          <button 
            class="page-btn" 
            :disabled="page===1" 
            @click="prevPage"
            title="Trang trước"
          >
            ← Trước
          </button>
          <div class="page-info">
            <span class="page-numbers">Trang {{ page }} / {{ totalPages }}</span>
            <span class="item-count">({{ items.length }} sản phẩm)</span>
          </div>
          <button 
            class="page-btn" 
            :disabled="page===totalPages" 
            @click="nextPage"
            title="Trang sau"
          >
            Sau →
          </button>
        </div>
      </main>
    </div>


    <!-- Quick View Modal: chuẩn hoá giống Admin (header/body/footer) -->
    <teleport to="body">
      <div v-if="showQuick && current" class="modal-overlay" @click.self="closeQuick">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">{{ current.name }}</h3>
            <button class="modal-close" aria-label="Đóng" @click="closeQuick">×</button>
          </div>
          <div class="modal-body modal-grid">
            <img :src="current.image || '/placeholder-shoe.jpg'" class="modal-image" alt="" />
            <div class="modal-info">
              <div class="price">{{ formatCurrency(current.price) }}</div>
              <p class="desc">{{ current.description }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <Button variant="outline" @click="goDetails(current)">Chi tiết</Button>
            <Button @click="addToCart(current)">Thêm vào giỏ</Button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { FormControl, Card, Button, StateBlock, ProductCard, PageHeader } from '@/components/ui'
import CategoryFilter from '@/customer/components/CategoryFilter.vue'
import { useCatalogStore } from '@/stores/catalogStore'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useApi } from '@/composables/useApi'
import { productService } from '@/services/productService'
import { debounce } from '@/utils/debounce'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'

const router = useRouter()
const route = useRoute()
const cart = useCartStore()
cart.load()
const wish = useWishlistStore(); wish.load()
const catalog = useCatalogStore(); catalog.load()
const q = ref(catalog.q)
const brand = ref(catalog.brand)
const category = ref(catalog.category)
const sort = ref(catalog.sort)
const minPrice = ref(catalog.minPrice)
const maxPrice = ref(catalog.maxPrice)
const inStockOnly = ref(catalog.inStockOnly)
const mobileFiltersOpen = ref(false)
const brands = [
  { value: 'nike', label: 'Nike' },
  { value: 'adidas', label: 'Adidas' },
  { value: 'puma', label: 'Puma' },
  { value: 'converse', label: 'Converse' }
]
const categories = [
  { value: 'sneakers', label: 'Giày thể thao' },
  { value: 'boots', label: 'Boot' },
  { value: 'sandals', label: 'Sandal' },
  { value: 'formal', label: 'Giày tây' }
]
const items = ref([])
const { loading, error, execute } = useApi()
const page = ref(1)
const pageSize = 12
const viewMode = ref(catalog.viewMode)
const totalPages = computed(() => Math.max(1, Math.ceil(items.value.length / pageSize)))
const pagedItems = computed(() => {
  const start = (page.value - 1) * pageSize
  return items.value.slice(start, start + pageSize)
})

const fetchCatalog = async () => {
  const params = {
    q: q.value || undefined,
    brand: brand.value || undefined,
    category: category.value || undefined,
    sort: sort.value || undefined,
    minPrice: minPrice.value || undefined,
    maxPrice: maxPrice.value || undefined,
    inStockOnly: inStockOnly.value || undefined
  }
  const res = await execute(({ cancelToken }) => productService.getProducts(params, { cancelToken }))
  items.value = res?.data || []
  page.value = 1
}
const debouncedFetch = debounce(fetchCatalog, 400)
watch([q, brand, category, sort, minPrice, maxPrice, inStockOnly], () => debouncedFetch())

const view = (p) => router.push({ path: `/shop/details/${p.id}` })
const goDetails = view
const addToCart = (p) => cart.add(p, 1)
const prevPage = () => { if (page.value > 1) { page.value--; pushQuery() } }
const nextPage = () => { if (page.value < totalPages.value) { page.value++; pushQuery() } }
const resetFilters = () => {
  brand.value = ''
  category.value = ''
  sort.value = ''
  minPrice.value = ''
  maxPrice.value = ''
  inStockOnly.value = false
}
const applyFilters = () => { mobileFiltersOpen.value = false; fetchCatalog() }
const hasActiveFilters = computed(() => !!(brand.value || category.value || sort.value || minPrice.value || maxPrice.value || inStockOnly.value || q.value))
const clearAll = () => {
  q.value = ''
  resetFilters()
  fetchCatalog()
}

// Quick view modal
const showQuick = ref(false)
const current = ref(null)
const quickView = (p) => { current.value = p; showQuick.value = true }
const closeQuick = () => { showQuick.value = false; current.value = null }

const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

// route sync
const filterModel = computed({
  get: () => ({ brand: brand.value, category: category.value, minPrice: minPrice.value, maxPrice: maxPrice.value, inStockOnly: inStockOnly.value, sort: sort.value }),
  set: (v) => {
    brand.value = v.brand
    category.value = v.category
    minPrice.value = v.minPrice
    maxPrice.value = v.maxPrice
    inStockOnly.value = v.inStockOnly
    sort.value = v.sort
  }
})

const hydrateFromRoute = () => {
  const qy = route.query || {}
  q.value = qy.q || ''
  brand.value = qy.brand || ''
  category.value = qy.category || ''
  sort.value = qy.sort || ''
  minPrice.value = qy.minPrice || ''
  maxPrice.value = qy.maxPrice || ''
  inStockOnly.value = qy.inStockOnly === 'true' || qy.inStockOnly === true
  const p = Number(qy.page); page.value = Number.isFinite(p) && p > 0 ? p : 1
  viewMode.value = qy.view === 'list' ? 'list' : 'grid'
}
const pushQuery = () => {
  const qy = {
    q: q.value || undefined,
    brand: brand.value || undefined,
    category: category.value || undefined,
    sort: sort.value || undefined,
    minPrice: minPrice.value || undefined,
    maxPrice: maxPrice.value || undefined,
    inStockOnly: inStockOnly.value ? 'true' : undefined,
    page: page.value > 1 ? page.value : undefined,
    view: viewMode.value === 'list' ? 'list' : undefined
  }
  router.replace({ query: qy })
  // persist
  Object.assign(catalog, { q: q.value, brand: brand.value, category: category.value, sort: sort.value, minPrice: minPrice.value, maxPrice: maxPrice.value, inStockOnly: inStockOnly.value, viewMode: viewMode.value, page: page.value });
  catalog.persist()
}

watch([q, brand, category, sort, minPrice, maxPrice, inStockOnly, viewMode], () => pushQuery())

onMounted(() => { hydrateFromRoute(); fetchCatalog() })
</script>

<style scoped>
/* Page Layout */
.catalog-page {
  padding: var(--spacing-lg);
  min-height: 100vh;
  background: var(--gray-50);
}

/* Page Header */
.page-header {
  margin-bottom: var(--spacing-lg);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.breadcrumb-item {
  text-decoration: none;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.breadcrumb-item:hover {
  color: var(--primary-600);
}

.breadcrumb-item.current {
  color: var(--text-primary);
  font-weight: 500;
}

.breadcrumb-separator {
  color: var(--text-muted);
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

/* Controls Bar */
.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.left-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--text-muted);
  z-index: 1;
}

.search-input {
  padding-left: 40px !important;
  width: 300px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.filter-icon {
  font-size: 0.875rem;
}

.right-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.view-toggle {
  display: flex;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: white;
}

.view-btn {
  padding: 8px 12px;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  background: var(--gray-50);
}

.view-btn.active {
  background: var(--primary-600);
  color: white;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--danger-600);
  border-color: var(--danger-200);
}

.clear-btn:hover {
  background: var(--danger-50);
  border-color: var(--danger-300);
}

/* Brand Filter */
.brand-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.brand-label {
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.brand-options {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.brand-chip {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.brand-chip:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.brand-chip.active {
  background: var(--primary-50);
  border-color: var(--primary-300);
  color: var(--primary-700);
}

.brand-chip img {
  width: 20px;
  height: 16px;
  object-fit: contain;
}

/* Main Content */
.catalog-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-lg);
}

/* Filter Sidebar */
.filter-sidebar {
  position: sticky;
  top: var(--spacing-lg);
  height: fit-content;
}

.filter-panel {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border);
  background: var(--gray-50);
}

.filter-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  display: none;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: white;
  cursor: pointer;
  font-size: 1.25rem;
  align-items: center;
  justify-content: center;
}

/* Products Area */
.products-area {
  display: grid;
  gap: var(--spacing-lg);
}

.state-block {
  margin: var(--spacing-xl) 0;
}

/* Loading Grid */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.loading-card {
  height: 320px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    90deg,
    var(--gray-100) 0%,
    var(--gray-200) 50%,
    var(--gray-100) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Products Container */
.products-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.products-container.list {
  display: grid;
  gap: var(--spacing-md);
}

.product-card.grid {
  /* Grid-specific card styles */
}

.product-card.list {
  /* List-specific card styles */
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.page-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.page-btn:hover:not(:disabled) {
  background: var(--primary-50);
  border-color: var(--primary-200);
  color: var(--primary-700);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.page-numbers {
  font-weight: 600;
  color: var(--text-primary);
}

.item-count {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Quick View Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal {
  background: white;
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  width: min(880px, 92vw);
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--gray-50);
}

.modal-title {
  margin: 0;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.modal-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  background: var(--gray-100);
  object-fit: cover;
}

.modal-info {
  display: grid;
  gap: var(--spacing-md);
}

.modal-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border);
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  background: var(--gray-50);
}

.modal-close {
  border: 1px solid var(--border);
  background: white;
  border-radius: var(--radius-full);
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--gray-100);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .catalog-content {
    grid-template-columns: 260px 1fr;
    gap: var(--spacing-md);
  }
  
  .search-input {
    width: 250px;
  }
}

@media (max-width: 900px) {
  .catalog-page {
    padding: var(--spacing-md);
  }
  
  .catalog-content {
    display: block;
  }
  
  .filter-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(85vw, 320px);
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .filter-sidebar.open {
    transform: translateX(0);
  }
  
  .filter-sidebar::before {
    content: '';
    position: fixed;
    top: 0;
    right: -100vw;
    bottom: 0;
    width: 100vw;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }
  
  .close-btn {
    display: flex !important;
  }
  
  .controls-bar {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .left-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .search-input {
    width: 200px;
  }
  
  .brand-filter {
    padding: var(--spacing-sm);
  }
  
  .brand-options {
    gap: var(--spacing-xs);
  }
  
  .brand-chip {
    padding: var(--spacing-xs);
    font-size: 0.75rem;
  }
  
  .brand-chip img {
    width: 16px;
    height: 12px;
  }
  
  .products-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .loading-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .modal-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .catalog-page {
    padding: var(--spacing-sm);
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .controls-bar {
    padding: var(--spacing-sm);
  }
  
  .left-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }
  
  .search-input {
    width: 100%;
  }
  
  .right-controls {
    justify-content: space-between;
    width: 100%;
  }
  
  .brand-filter {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }
  
  .brand-options {
    justify-content: center;
  }
  
  .products-container.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-sm);
  }
  
  .loading-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--spacing-sm);
  }
  
  .pagination {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .modal {
    width: 95vw;
    margin: var(--spacing-sm);
  }
  
  .modal-body {
    padding: var(--spacing-md);
  }
  
  .modal-footer {
    padding: var(--spacing-sm) var(--spacing-md);
    flex-direction: column;
  }
}
</style>


