<!-- Trang Giỏ hàng: hiển thị các sản phẩm đã thêm, chỉnh số lượng, loại bỏ và chuyển tới checkout (COD). -->
<template>
  <div class="cart">
    <div class="page-actions">
      <router-link class="btn-link" to="/shop/catalog">← Tiếp tục mua</router-link>
      <Button variant="outline" size="sm" @click="cart.clear()" :disabled="cart.items.length===0">Xoá giỏ</Button>
    </div>
    <StateBlock v-if="cart.items.length === 0" type="empty" message="Chưa có sản phẩm" />
    <div v-else class="list">
      <div v-for="item in cart.items" :key="item.id" class="row">
        <img :src="item.image || '/placeholder-shoe.jpg'" class="thumb" :alt="item.name" />
        <div class="info">
          <div class="name">{{ item.name }}</div>
          <div class="unit">{{ formatCurrency(item.price) }} /sp</div>
        </div>
        <input class="qty" type="number" min="1" :value="item.quantity" @input="e => cart.updateQuantity(item.id, e.target.value)" :aria-label="`Số lượng cho ${item.name}`" />
        <div class="price">{{ formatCurrency(item.price * item.quantity) }}</div>
        <button class="remove" :aria-label="`Xóa ${item.name}`" @click="cart.remove(item.id)">×</button>
      </div>
      <div class="coupon-row">
        <input class="coupon" placeholder="Mã giảm giá" v-model="coupon" aria-label="Nhập mã giảm giá" />
        <button class="apply" @click="applyCoupon">Áp dụng</button>
        <span class="coupon-msg" v-if="couponMsg">{{ couponMsg }}</span>
      </div>
      <div class="summary">
        <div>Tạm tính: <span>{{ formatCurrency(subtotal) }}</span></div>
        <div>Giảm giá: <span>-{{ formatCurrency(discountAmount) }}</span></div>
        <div>Phí vận chuyển: <span>{{ formatCurrency(shipping) }}</span></div>
        <div class="total">Tổng: <strong>{{ formatCurrency(total) }}</strong></div>
      </div>
      <router-link class="checkout" to="/shop/checkout">Thanh toán COD</router-link>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { StateBlock } from '@/components/ui'
import { Button } from '@/components/ui'
import { ref, computed } from 'vue'
import { couponService } from '@/services/orderService'
const cart = useCartStore()
cart.load()
const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)
const subtotal = computed(() => cart.total)
const coupon = ref('')
const discountRate = ref(0)
const couponMsg = ref('')
const applyCoupon = async () => {
  couponMsg.value = ''
  const res = await couponService.validateCoupon(coupon.value.trim())
  if (res?.data?.valid) { discountRate.value = res.data.discount; couponMsg.value = 'Áp dụng thành công' } else { discountRate.value = 0; couponMsg.value = 'Mã không hợp lệ' }
}
const discountAmount = computed(() => Math.round(subtotal.value * discountRate.value))
const shipping = computed(() => (subtotal.value - discountAmount.value > 800000 || subtotal.value === 0) ? 0 : 30000)
const total = computed(() => subtotal.value - discountAmount.value + shipping.value)
</script>

<style scoped>
.page-actions { display:flex; justify-content:space-between; align-items:center; gap: 8px; margin-bottom: var(--spacing-sm) }
.btn-link { text-decoration:none; color: var(--gray-700) }
.row { display:grid; grid-template-columns: 64px 1fr 100px 140px 40px; gap: var(--spacing-sm); align-items:center; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--border) }
.thumb { width:64px; height:64px; object-fit:cover; background: var(--gray-100); border-radius: 8px }
.info { display:flex; flex-direction:column }
.qty { width: 80px }
.price { text-align:right; font-weight:700 }
.remove { background: transparent; border:none; font-size: 20px; cursor:pointer }
.summary { display:grid; justify-content:end; gap: var(--spacing-xs); padding: var(--spacing-md) 0 }
.summary > div { display:flex; gap: 8px }
.total { text-align:right; }
.checkout { display:inline-block; background: var(--primary-600); color:#fff; padding:10px 16px; border-radius: 10px; text-decoration:none }
.coupon-row { display:flex; align-items:center; gap: 8px; justify-content:flex-end; margin-top: var(--spacing-sm) }
.coupon { padding: var(--form-input-padding); border: var(--form-input-border); border-radius: var(--form-input-radius) }
.apply { border:1px solid var(--border); background:#fff; border-radius: var(--radius-lg); padding: 6px 12px; cursor:pointer }
.coupon-msg { color: var(--gray-600) }
</style>


