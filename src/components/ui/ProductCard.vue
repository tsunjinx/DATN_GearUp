<!-- Thẻ sản phẩm chuẩn hoá theo ngôn ngữ thiết kế Admin: dùng Card + tokens -->
<template>
  <Card :hover="true" class="pcard">
    <img :src="product.image || '/placeholder-shoe.jpg'" alt="" class="thumb" loading="lazy" />
    <div class="info">
      <div class="name">{{ product.name }}</div>
      <div class="price">
        <StatusBadge v-if="product.stock===0" status="cancelled" variant="outline" size="small" custom-text="Hết hàng" />
        <StatusBadge v-else-if="product.stock<=5" status="low-stock" variant="outline" size="small" />
        {{ formatCurrency(product.price) }}
      </div>
    </div>
    <div class="rating" :aria-label="`Đánh giá ${rating} trên 5`">{{ ratingStars }}</div>
    <div class="actions">
      <button class="icon-btn" :aria-pressed="isWished" @click="$emit('toggle-wish')" :title="isWished ? 'Bỏ thích' : 'Yêu thích'">{{ isWished ? '❤️' : '🤍' }}</button>
      <Button size="sm" variant="outline" @click="$emit('quick-view')">Xem nhanh</Button>
      <Button size="sm" @click="$emit('add')">Thêm</Button>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'

const props = defineProps({
  product: { type: Object, required: true },
  isWished: { type: Boolean, default: false }
})

defineEmits(['toggle-wish', 'quick-view', 'add'])

const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)

// Tạo rating ổn định (mock) dựa trên id để hiển thị sao
const rating = computed(() => {
  const id = String(props.product?.id || '')
  const sum = Array.from(id).reduce((n, ch) => n + ch.charCodeAt(0), 0)
  return 3 + (sum % 3)
})
const ratingStars = computed(() => '★'.repeat(rating.value) + '☆'.repeat(5 - rating.value))
</script>

<style scoped>
.pcard { display:flex; flex-direction:column; gap:8px }
.thumb { width:100%; aspect-ratio: 1/1; object-fit:cover; background: var(--gray-100); border-radius: var(--radius-lg) }
.info { display:flex; align-items:center; justify-content:space-between }
.name { font-weight:700 }
.price { color: var(--primary-700); font-weight:700 }
.rating { color: #f59e0b; font-size: 12px; margin-top: -6px }
.actions { display:flex; justify-content:flex-end; gap: 8px }
.icon-btn { border:1px solid var(--border); background:#fff; border-radius: var(--radius-full); width:32px; height:32px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer }
</style>


