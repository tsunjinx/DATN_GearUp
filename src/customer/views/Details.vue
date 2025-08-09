<!-- Trang Chi tiết sản phẩm (khách hàng):
     - Hiển thị gallery ảnh, thông tin giá/ tồn
     - Chọn thuộc tính cơ bản (size/ màu) và số lượng
     - Thêm vào giỏ hàng -->
<template>
  <div v-if="product" class="details">
    <nav class="breadcrumbs">
      <router-link to="/shop"> Trang chủ </router-link>
      <span>/</span>
      <router-link to="/shop/catalog"> Danh mục </router-link>
      <span>/</span>
      <span aria-current="page">{{ product.name }}</span>
    </nav>
    <div class="page-actions">
      <Button variant="outline" size="sm" @click="toggleWish">
        {{ wish.has(product.id) ? 'Bỏ thích' : 'Yêu thích' }}
      </Button>
      <Button size="sm" variant="outline" @click="share"> Chia sẻ </Button>
      <span v-if="copied" class="copied">Đã sao chép liên kết</span>
    </div>
    <Card class="details-card">
      <div class="layout">
        <div class="gallery" role="group" aria-label="Bộ sưu tập ảnh">
          <img :src="activeImage" class="image" alt="" />
          <div
            class="thumbs"
            role="listbox"
            aria-label="Ảnh thu nhỏ"
            tabindex="0"
            @keydown.left.prevent="prevImg"
            @keydown.right.prevent="nextImg"
          >
            <button
              v-for="(img, idx) in gallery"
              :key="idx"
              :class="['thumb', { active: activeIndex === idx }]"
              :aria-selected="activeIndex === idx"
              @click="activeIndex = idx"
            >
              <img :src="img" alt="" />
            </button>
          </div>
        </div>
        <div class="panel">
          <h1 class="name">
            {{ product.name }}
          </h1>
          <div class="brand">
            {{ product.brand }}
          </div>
          <div class="price">
            {{ formatCurrency(product.price) }}
          </div>
          <div class="stock" :class="{ low: product.stock <= 5 }">Tồn: {{ product.stock }}</div>
          <fieldset class="options">
            <legend class="sr-only">Tùy chọn</legend>
            <StatusBadge
              v-if="product.stock === 0"
              status="cancelled"
              variant="outline"
              size="small"
              custom-text="Hết hàng"
            />
            <StatusBadge v-else-if="product.stock <= 5" status="low-stock" variant="outline" size="small" />
            <div class="field">
              <label>Kích cỡ</label>
              <div class="chips">
                <button
                  v-for="s in sizes"
                  :key="s"
                  :class="['chip', { selected: size === s }]"
                  :aria-pressed="size === s"
                  @click="size = s"
                >
                  {{ s }}
                </button>
              </div>
            </div>
            <div class="field">
              <label>Màu sắc</label>
              <div class="chips">
                <button
                  v-for="c in colors"
                  :key="c"
                  :class="['chip', { selected: color === c }]"
                  :aria-pressed="color === c"
                  @click="color = c"
                >
                  {{ c }}
                </button>
              </div>
            </div>
            <div class="field qty">
              <label>Số lượng</label>
              <input
                v-model.number="quantity"
                type="number"
                min="1"
                :max="Math.max(1, product.stock)"
                :aria-invalid="quantity < 1 || quantity > product.stock"
              />
            </div>
          </fieldset>
          <div class="actions">
            <button class="wish" :aria-pressed="wish.has(product.id)" @click="toggleWish">
              {{ wish.has(product.id) ? '❤️' : '🤍' }}
            </button>
            <Button :disabled="product.stock === 0" aria-disabled="product.stock === 0" @click="addToCart">
              Thêm vào giỏ
            </Button>
            <Button variant="outline" @click="openSizeGuide"> Bảng size </Button>
          </div>
        </div>
      </div>
    </Card>
    <Card class="mt-2" role="region" aria-label="Thông tin chi tiết">
      <template #header>
        <div class="tabs">
          <button :class="{ active: tab === 'desc' }" @click="tab = 'desc'">Mô tả</button>
          <button :class="{ active: tab === 'specs' }" @click="tab = 'specs'">Thông số</button>
          <button :class="{ active: tab === 'ship' }" @click="tab = 'ship'">Vận chuyển</button>
        </div>
      </template>
      <div v-if="tab === 'desc'">
        {{ product.description }}
      </div>
      <div v-else-if="tab === 'specs'">Chất liệu: Tổng hợp. Bảo hành: 6 tháng. Xuất xứ: VN.</div>
      <div v-else>Giao nhanh 2-4 ngày, miễn phí từ 800.000đ.</div>
    </Card>

    <!-- Related products -->
    <Card class="mt-2" role="region" aria-label="Sản phẩm liên quan">
      <template #header>
        <strong>Sản phẩm liên quan</strong>
      </template>
      <div class="related-grid">
        <ProductCard
          v-for="rp in related"
          :key="rp.id"
          :product="rp"
          :is-wished="wish.has(rp.id)"
          @toggle-wish="wish.toggle(rp)"
          @quick-view="goRelated(rp)"
          @add="addRelated(rp)"
        />
      </div>
    </Card>
    <!-- Thanh thêm nhanh (mobile) -->
    <div class="sticky-bar">
      <div class="sticky-price">
        {{ formatCurrency(product.price) }}
      </div>
      <Button :disabled="product.stock === 0" @click="addToCart"> Thêm vào giỏ </Button>
    </div>
  </div>
  <StateBlock v-else type="loading" message="Đang tải sản phẩm..." />
  <!-- Size Guide Modal -->
  <teleport to="body">
    <div v-if="showSizeGuide" class="modal-overlay" @click.self="showSizeGuide = false">
      <div class="modal size-modal">
        <div class="modal-header">
          <strong>Bảng size tham khảo</strong><button class="modal-close" @click="showSizeGuide = false">×</button>
        </div>
        <div class="modal-body">
          <p>Gợi ý: Nếu chân bè hoặc mang ôm, chọn tăng 0.5 size.</p>
          <ul>
            <li>Size 38 ~ 24cm</li>
            <li>Size 39 ~ 24.5cm</li>
            <li>Size 40 ~ 25cm</li>
            <li>Size 41 ~ 25.5cm</li>
            <li>Size 42 ~ 26cm</li>
          </ul>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { productService } from '@/services/productService'
import { useApi } from '@/composables/useApi'
import { Card, Button, StateBlock, ProductCard, PageHeader } from '@/components/ui'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'

const route = useRoute()
const product = ref(null)
const { execute } = useApi()
const cart = useCartStore()
cart.load()
const wish = useWishlistStore()
wish.load()

const formatCurrency = amount => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

// Thuộc tính lựa chọn cơ bản (mock khi API chưa sẵn sàng)
const sizes = ref(['38', '39', '40', '41', '42'])
const colors = ref(['Đen', 'Trắng', 'Xanh'])
const size = ref('40')
const color = ref('Đen')
const quantity = ref(1)
const tab = ref('desc')
const copied = ref(false)
const showSizeGuide = ref(false)

// Gallery: xây dựng từ ảnh chính + ảnh phụ (nếu có)
const gallery = ref([])
const activeIndex = ref(0)
const activeImage = computed(() => gallery.value[activeIndex.value] || '/placeholder-shoe.jpg')

onMounted(async () => {
  const id = route.params.id
  const res = await execute(() => productService.getProduct(id))
  product.value = res?.data || null
  const images = [product.value?.image, ...(product.value?.images || [])].filter(Boolean)
  gallery.value = images.length ? images : ['/placeholder-shoe.jpg']
})

const addToCart = () => {
  // Gộp thuộc tính vào tên hiển thị để dễ phân biệt trong giỏ (tạm thời)
  const display = `${product.value.name} • Size ${size.value} • ${color.value}`
  cart.add(
    {
      id: `${product.value.id}-${size.value}-${color.value}`,
      name: display,
      price: product.value.price,
      image: activeImage.value
    },
    quantity.value
  )
}

const toggleWish = () => wish.toggle(product.value)
const share = async () => {
  try {
    const url = window.location.href
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url)
    } else {
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {}
}
const openSizeGuide = () => {
  showSizeGuide.value = true
}

// Gallery keyboard nav
const prevImg = () => {
  activeIndex.value = (activeIndex.value - 1 + gallery.value.length) % gallery.value.length
}
const nextImg = () => {
  activeIndex.value = (activeIndex.value + 1) % gallery.value.length
}

// Related products (simple: same brand or category if available)
const related = ref([])
const goRelated = p => router.push({ path: `/shop/details/${p.id}` })
const addRelated = p => cart.add(p, 1)

import { useRouter } from 'vue-router'
const router = useRouter()

onMounted(async () => {
  if (!product.value) return
  const res = await execute(() => productService.getProducts({ brand: product.value.brand }))
  const list = res?.data || []
  related.value = list.filter(it => it.id !== product.value.id).slice(0, 6)
})
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}
.gallery {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.image {
  width: 100%;
  border-radius: var(--radius-lg);
  background: var(--gray-100);
  object-fit: cover;
}
.thumbs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.thumb {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 2px;
  background: #fff;
  cursor: pointer;
}
.thumb.active {
  border-color: var(--primary-400);
}
.thumb img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}
.panel {
  display: grid;
  gap: var(--spacing-sm);
}
.name {
  font-size: 1.5rem;
  font-weight: 800;
}
.brand {
  color: var(--gray-500);
}
.price {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--primary-700);
}
.stock.low {
  color: var(--warning);
}
.options {
  display: grid;
  gap: var(--spacing-sm);
}
.field {
  display: grid;
  gap: var(--spacing-xs);
}
.chips {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}
.chip {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: #fff;
  cursor: pointer;
}
.chip.selected {
  background: var(--primary-50);
  border-color: var(--primary-300);
  color: var(--primary-800);
}
.field.qty input {
  width: 96px;
  padding: var(--form-input-padding);
  border: var(--form-input-border);
  border-radius: var(--form-input-radius);
}
.mt-2 {
  margin-top: 0.5rem;
}
.details-card {
  padding: var(--spacing-md);
}
.tabs {
  display: flex;
  gap: 8px;
}
.tabs button {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: #fff;
  cursor: pointer;
}
.tabs button.active {
  background: var(--primary-50);
  border-color: var(--primary-300);
  color: var(--primary-800);
}
.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.wish {
  border: 1px solid var(--border);
  background: #fff;
  border-radius: var(--radius-full);
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.page-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-bottom: var(--spacing-sm);
}
.copied {
  color: var(--gray-600);
  font-size: 12px;
}
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray-600);
  margin-bottom: var(--spacing-sm);
}
.breadcrumbs a {
  text-decoration: none;
  color: var(--gray-700);
}
.breadcrumbs a:hover {
  color: var(--primary-700);
}
/* Size modal reuse modal styles from Catalog */
.size-modal {
  width: min(520px, 92vw);
}
/* Sticky add-to-cart bar for mobile */
.sticky-bar {
  position: sticky;
  bottom: 0;
  display: none;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px solid var(--border);
  background: #fff;
  margin-top: var(--spacing-md);
}
.sticky-price {
  font-weight: 800;
  color: var(--primary-700);
}
@media (max-width: 768px) {
  .sticky-bar {
    display: flex;
  }
}
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
</style>
