<template>
  <div class="api-example">
    <h2>Enhanced API Usage Example</h2>

    <!-- Search with Debounce -->
    <section class="search-section">
      <h3>🔍 Debounced Search</h3>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm sản phẩm (tự động sau 500ms)..."
        class="form-control"
      />

      <div v-if="isSearching" class="loading"><span class="loading-spinner" /> Đang tìm kiếm...</div>

      <div v-if="searchError" class="error">
        {{ searchError }}
      </div>

      <div v-if="searchResults.length > 0" class="results">
        <div v-for="product in searchResults" :key="product.id" class="result-item">
          {{ product.name }} - {{ formatPrice(product.price) }}
        </div>
      </div>
    </section>

    <!-- API with Cancellation -->
    <section class="api-section">
      <h3>📡 API with Request Cancellation</h3>

      <div class="button-group">
        <button :disabled="loading" class="btn btn-primary" @click="loadProducts">
          {{ loading ? 'Đang tải...' : 'Tải sản phẩm' }}
        </button>

        <button :disabled="!loading" class="btn btn-secondary" @click="cancelRequests">Hủy yêu cầu</button>

        <button class="btn btn-outline" @click="reset">Reset</button>
      </div>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <div v-if="data" class="data-display">
        <pre>{{ JSON.stringify(data, null, 2) }}</pre>
      </div>
    </section>

    <!-- Parallel Requests -->
    <section class="parallel-section">
      <h3>⚡ Parallel API Requests</h3>

      <button :disabled="parallelLoading" class="btn btn-primary" @click="loadMultipleData">
        {{ parallelLoading ? 'Đang tải...' : 'Tải nhiều dữ liệu cùng lúc' }}
      </button>

      <div v-if="parallelData" class="data-grid">
        <div v-for="(dataset, index) in parallelData" :key="index" class="data-card">
          <h4>Dataset {{ index + 1 }}</h4>
          <pre>{{ JSON.stringify(dataset, null, 2) }}</pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useDebouncedSearch } from '@/utils/debounce'
import { productService } from '@/services/productService'
import { customerService } from '@/services/userService'
import { orderService } from '@/services/orderService'

// ============================================
// 1. DEBOUNCED SEARCH EXAMPLE
// ============================================
const searchProducts = async query => {
  // Simulate API call
  const response = await productService.getProducts({
    search: query,
    limit: 5
  })
  return response.data?.items || []
}

const { searchQuery, searchResults, isSearching, searchError, clearSearch } = useDebouncedSearch(searchProducts, 500)

// ============================================
// 2. API WITH CANCELLATION EXAMPLE
// ============================================
const { loading, error, data, execute, cancelRequests, reset } = useApi()

const loadProducts = async () => {
  await execute(
    options =>
      productService.getProducts({
        ...options,
        limit: 10
      }),
    { showLoading: true, showError: true }
  )
}

// ============================================
// 3. PARALLEL REQUESTS EXAMPLE
// ============================================
const parallelApi = useApi()
const parallelLoading = parallelApi.loading
const parallelData = parallelApi.data

const loadMultipleData = async () => {
  await parallelApi.executeAll([
    options => productService.getProducts({ ...options, limit: 5 }),
    options => customerService.getCustomers({ ...options, limit: 5 }),
    options => orderService.getOrders({ ...options, limit: 5 })
  ])
}

// ============================================
// HELPER FUNCTIONS
// ============================================
const formatPrice = price => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}
</script>

<style scoped>
.api-example {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h2 {
  color: var(--primary-600);
  margin-bottom: 2rem;
}

h3 {
  color: var(--gray-800);
  margin-bottom: 1rem;
}

h4 {
  color: var(--gray-700);
  margin-bottom: 0.5rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.loading {
  color: var(--primary-600);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error {
  color: var(--error);
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  margin: 1rem 0;
}

.results,
.data-display {
  margin-top: 1rem;
}

.result-item {
  padding: 0.5rem;
  border-bottom: 1px solid var(--border-light);
}

.result-item:last-child {
  border-bottom: none;
}

.data-display pre,
.data-card pre {
  background: var(--gray-50);
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  font-size: 0.75rem;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.data-card {
  background: var(--gray-50);
  padding: 1rem;
  border-radius: 0.375rem;
}

/* Responsive */
@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }

  .data-grid {
    grid-template-columns: 1fr;
  }
}
</style>
