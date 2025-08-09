<!-- Trang Thanh toán (COD): nhập thông tin giao hàng và xác nhận đặt hàng thanh toán khi nhận. -->
<template>
  <div class="checkout-page">
    <nav class="breadcrumbs">
      <router-link to="/shop"> Trang chủ </router-link>
      <span>/</span>
      <router-link to="/shop/cart"> Giỏ hàng </router-link>
      <span>/</span>
      <span aria-current="page">Thanh toán</span>
    </nav>
    <h1>Thanh toán (COD)</h1>
    <StateBlock
      v-if="cart.count === 0"
      type="empty"
      message="Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán."
    />
    <div v-else class="grid">
      <form class="form" @submit.prevent="placeOrder">
        <FormControl v-model="name" label="Họ và tên" :error="errors.name" required />
        <FormControl v-model="phone" label="Số điện thoại" :error="errors.phone" required />
        <FormControl v-model="address" as="textarea" label="Địa chỉ" :error="errors.address" required />
        <div class="stepper">
          <span :class="{ active: step >= 1 }">Địa chỉ</span>
          <span :class="{ active: step >= 2 }">Xác nhận</span>
          <span :class="{ active: step >= 3 }">Hoàn tất</span>
        </div>
        <Button type="submit" :disabled="cart.count === 0 || placing"> Đặt hàng COD </Button>
      </form>
      <div class="order-summary">
        <h3>Tóm tắt đơn</h3>
        <div class="row">
          <span>Số lượng</span><span>{{ cart.count }}</span>
        </div>
        <div class="row">
          <span>Tạm tính</span><span>{{ formatCurrency(cart.total) }}</span>
        </div>
        <div class="row total">
          <span>Tổng</span><span>{{ formatCurrency(cart.total) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button, FormControl, StateBlock } from '@/components/ui'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
cart.load()
const router = useRouter()
const name = ref('')
const phone = ref('')
const address = ref('')
const placing = ref(false)
const step = ref(1)
const errors = ref({ name: '', phone: '', address: '' })

const formatCurrency = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v)

const validate = () => {
  errors.value = { name: '', phone: '', address: '' }
  if (!name.value.trim()) errors.value.name = 'Vui lòng nhập họ tên'
  if (!/^\d{9,11}$/.test(phone.value)) errors.value.phone = 'Số điện thoại không hợp lệ'
  if (address.value.trim().length < 10) errors.value.address = 'Địa chỉ quá ngắn'
  return !errors.value.name && !errors.value.phone && !errors.value.address
}

const placeOrder = async () => {
  placing.value = true
  try {
    if (!validate()) return
    await new Promise(r => setTimeout(r, 800))
    cart.clear()
    router.push('/shop')
    alert('Đặt hàng COD thành công!')
    step.value = 3
  } finally {
    placing.value = false
  }
}
</script>

<style scoped>
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
.grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--spacing-lg);
}
.form {
  display: grid;
  gap: var(--spacing-md);
  max-width: 520px;
}
.summary {
  margin: 8px 0;
}
.order-summary {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  background: #fff;
  align-self: start;
}
.order-summary h3 {
  margin-top: 0;
  margin-bottom: var(--spacing-sm);
}
.order-summary .row {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
}
.order-summary .total {
  font-weight: 800;
}
.stepper {
  display: flex;
  gap: 8px;
  margin: var(--spacing-sm) 0;
}
.stepper span {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
}
.stepper span.active {
  background: var(--primary-50);
  border-color: var(--primary-300);
  color: var(--primary-800);
}
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
