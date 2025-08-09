<template>
  <Card class="filter-card" role="region" aria-label="Bộ lọc sản phẩm">
    <template #header>
      <div class="filter-header">
        <strong>Bộ lọc</strong>
        <button class="close-filter" v-if="closable" @click="$emit('close')" aria-label="Đóng bộ lọc">×</button>
      </div>
    </template>
    <div class="side-section">
      <h4>Thương hiệu</h4>
      <div class="chip-group">
        <button v-for="b in brands" :key="b.value" :class="['chip', { selected: model.brand===b.value }]" @click="toggle('brand', b.value)" :aria-pressed="model.brand===b.value">{{ b.label }}</button>
      </div>
    </div>
    <div class="side-section">
      <h4>Danh mục</h4>
      <div class="chip-group">
        <button v-for="c in categories" :key="c.value" :class="['chip', { selected: model.category===c.value }]" @click="toggle('category', c.value)" :aria-pressed="model.category===c.value">{{ c.label }}</button>
      </div>
    </div>
    <div class="side-section two-cols">
      <div>
        <h4>Giá tối thiểu</h4>
        <input class="select" type="number" min="0" v-model.number="model.minPrice" placeholder="0" />
      </div>
      <div>
        <h4>Giá tối đa</h4>
        <input class="select" type="number" min="0" v-model.number="model.maxPrice" placeholder="5,000,000" />
      </div>
    </div>
    <label class="checkbox"><input type="checkbox" v-model="model.inStockOnly" /> Còn hàng</label>
    <div class="side-section">
      <h4>Sắp xếp</h4>
      <select v-model="model.sort" class="select">
        <option value="">Mặc định</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
      </select>
    </div>
    <div class="filter-actions">
      <button class="btn" @click="$emit('reset')">Đặt lại</button>
      <button class="btn primary" @click="$emit('apply')">Áp dụng</button>
    </div>
  </Card>
</template>

<script setup>
import { reactive, watch } from 'vue'
import Card from '@/components/ui/Card.vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  brands: { type: Array, required: true },
  categories: { type: Array, required: true },
  closable: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'apply', 'reset', 'close'])
const model = reactive({ ...props.modelValue })
watch(() => props.modelValue, (v) => Object.assign(model, v || {}), { deep: true })
watch(model, (v) => emit('update:modelValue', { ...v }), { deep: true })

const toggle = (key, value) => {
  model[key] = model[key] === value ? '' : value
}
</script>

<style scoped>
.filter-card { position: relative }
.filter-header { display:flex; align-items:center; justify-content:space-between }
.close-filter { border:1px solid var(--border); background:#fff; border-radius: var(--radius-full); width:28px; height:28px; cursor:pointer }
.side-section { border:1px solid var(--border); border-radius: var(--radius-lg); padding: var(--spacing-sm); background:#fff; margin-top: 8px }
.side-section h4 { margin-bottom: var(--spacing-xs) }
.chip-group { display:flex; gap: 8px; flex-wrap:wrap }
.chip { padding: 6px 10px; border:1px solid var(--border); border-radius: var(--radius-full); background:#fff; cursor:pointer }
.chip.selected { background: var(--primary-50); border-color: var(--primary-300); color: var(--primary-800) }
.two-cols { display:grid; grid-template-columns: 1fr 1fr; gap: 8px }
.checkbox { display:flex; align-items:center; gap: 8px; margin-top: 8px }
.filter-actions { display:flex; gap: 8px; justify-content:flex-end; margin-top: 8px }
.btn { padding: 8px 12px; border:1px solid var(--border); border-radius: var(--radius-lg); background:#fff; cursor:pointer }
.btn.primary { background: var(--primary-600); color:#fff; border-color: var(--primary-600) }
.select { padding: var(--form-input-padding); border: var(--form-input-border); border-radius: var(--form-input-radius) }
</style>


