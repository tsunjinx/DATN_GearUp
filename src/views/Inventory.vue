<!-- Trang Tồn kho (Admin): danh sách sắp hết, tìm kiếm (debounce), điều chỉnh tồn qua modal, trạng thái loading/error. -->
<template>
  <div class="inventory-page">
    <!-- Inventory Header with Action Buttons -->
    <div class="inventory-header fade-in">
      <div class="header-content">
        <h1 class="inventory-title">
          <span class="inventory-icon">📦</span>
          Quản lý Tồn kho
        </h1>
        <div class="header-actions">
          <button class="btn btn-primary" @click="refresh">
            <i class="btn-icon">🔄</i>
            Làm mới
          </button>
        </div>
      </div>
    </div>

    <Card class="fade-in" style="animation-delay: 0.3s">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="font-semibold">Sản phẩm sắp hết hàng</div>
          <FormControl v-model="query" as="input" placeholder="Tìm theo tên hoặc mã" />
        </div>
      </template>
      <div v-if="loading" class="text-center"><span class="loading-spinner" /> Đang tải...</div>
      <div v-else-if="error" class="text-error text-center">
        {{ error }}
      </div>
      <div v-else>
        <Table>
          <template #head>
            <th>Mã</th>
            <th>Tên</th>
            <th>Tồn</th>
            <th>Ngưỡng cảnh báo</th>
            <th>Hành động</th>
          </template>
          <tr v-for="item in filtered" :key="item.id">
            <td>#{{ item.code }}</td>
            <td>{{ item.name }}</td>
            <td>
              <Badge :variant="item.stock === 0 ? 'error' : 'warning'">
                {{ item.stock }}
              </Badge>
            </td>
            <td>{{ item.threshold }}</td>
            <td>
              <Button size="sm" variant="primary" @click="adjust(item)"> Điều chỉnh </Button>
            </td>
          </tr>
        </Table>
      </div>

      <!-- Adjustment modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>Điều chỉnh tồn kho: {{ selected?.name }}</h3>
            <button class="close" @click="closeModal">×</button>
          </div>
          <div class="modal-body">
            <FormControl v-model="delta" label="Số lượng điều chỉnh (+/-)" type="number" />
            <div class="mt-2">
              <Button :disabled="saving" @click="applyAdjust"> Lưu </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '@/composables/useApi'
import { productService } from '@/services/productService'
import { debounce } from '@/utils/debounce'
import { Button, Card, Table, Badge, FormControl } from '@/components/ui'

const query = ref('')
const items = ref([])
const showModal = ref(false)
const selected = ref(null)
const delta = ref(0)
const saving = ref(false)

const { loading, error, execute } = useApi()

const fetchLowStock = async () => {
  await execute(({ cancelToken }) =>
    productService.getProducts({ lowStock: true, q: query.value || undefined }, { cancelToken })
  )
}

const debouncedFetch = debounce(fetchLowStock, 400)
watch(query, () => debouncedFetch())

const filtered = computed(() => items.value)

const refresh = () => fetchLowStock()

const adjust = item => {
  selected.value = item
  delta.value = 0
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const applyAdjust = async () => {
  if (!selected.value || !Number.isFinite(+delta.value)) return
  try {
    saving.value = true
    // Placeholder: optimistic update
    selected.value.stock = Math.max(0, Number(selected.value.stock) + Number(delta.value))
    showModal.value = false
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await fetchLowStock()
})
</script>

<style scoped>
.inventory-page {
  display: grid;
  gap: 1rem;
}

/* Inventory Header */
.inventory-header {
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
  gap: var(--spacing-lg);
}

.inventory-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--white);
}

.inventory-icon {
  font-size: var(--font-size-4xl);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.header-actions .btn {
  background: rgba(255, 255, 255, 0.2);
  color: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-actions .btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
}
.modal {
  background: #fff;
  border-radius: 8px;
  width: 420px;
  max-width: calc(100vw - 24px);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.modal-body {
  padding: 16px;
}
.close {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.mt-2 {
  margin-top: 0.5rem;
}

/* Fade-in Animation */
.fade-in {
  animation: fadeInUp 0.6s ease-out both;
}

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

/* Enhanced Button Animations */
.header-actions .btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0) scale(1);
  position: relative;
  overflow: hidden;
}

.header-actions .btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.header-actions .btn:active {
  transform: translateY(0) scale(0.98);
}
</style>
