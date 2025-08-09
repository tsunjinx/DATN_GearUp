<!-- Danh sách Yêu thích: hiển thị sản phẩm đã lưu và thao tác thêm vào giỏ / bỏ thích -->
<template>
  <div class="wishlist">
    <div class="page-actions">
      <router-link class="btn-link" to="/shop/catalog">← Tiếp tục mua</router-link>
      <Button variant="outline" size="sm" @click="clearAll" :disabled="wish.count===0">Xoá tất cả</Button>
    </div>
    <StateBlock v-if="wish.items.length===0" type="empty" message="Chưa có sản phẩm yêu thích" />
    <div v-else class="grid">
      <Card v-for="p in wish.items" :key="p.id" class="item" :hover="true">
        <img :src="p.image || '/placeholder-shoe.jpg'" class="thumb" :alt="p.name" />
        <div class="info">
          <div class="name">{{ p.name }}</div>
          <div class="price">{{ formatCurrency(p.price) }}</div>
        </div>
        <div class="actions">
          <button class="icon-btn" @click="wish.toggle(p)" :aria-label="`Bỏ thích ${p.name}`" :aria-pressed="true">🗑️</button>
          <Button size="sm" @click="addToCart(p)">Thêm vào giỏ</Button>
        </div>
      </Card>
    </div>
  </div>
  
</template>

<script setup>
import { useWishlistStore } from '@/stores/wishlistStore'
import { useCartStore } from '@/stores/cartStore'
import { Card, Button, StateBlock } from '@/components/ui'

const wish = useWishlistStore(); wish.load()
const cart = useCartStore(); cart.load()

const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
const addToCart = (p) => cart.add(p, 1)
const clearAll = () => { wish.items = []; wish.save() }
</script>

<style scoped>
.grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 12px }
.page-actions { display:flex; justify-content:space-between; align-items:center; gap: 8px; margin-bottom: var(--spacing-sm) }
.btn-link { text-decoration:none; color: var(--gray-700) }
.item { display:flex; flex-direction:column; gap:8px }
.thumb { width:100%; aspect-ratio: 1/1; object-fit:cover; background: var(--gray-100); border-radius: var(--radius-lg) }
.info { display:flex; align-items:center; justify-content:space-between }
.name { font-weight:700 }
.price { color: var(--primary-700); font-weight:700 }
.actions { display:flex; justify-content:flex-end; gap: 8px }
.icon-btn { border:1px solid var(--border); background:#fff; border-radius: var(--radius-full); width:32px; height:32px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer }
</style>


