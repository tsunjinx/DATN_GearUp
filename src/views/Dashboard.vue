<template>
  <div class="dashboard">
    <!-- Dashboard Header with Action Buttons -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">
          <img class="dashboard-icon" src="@/assets/dashboard.svg" alt="Dashboard" />
          Tổng Quan
        </h1>
        <div class="header-actions">
          <button class="btn btn-primary" @click="refreshData">
            <span class="icon">🔄</span>
            Làm mới
          </button>
          <button class="btn btn-success" @click="exportData">
            <span class="icon">📊</span>
            Xuất báo cáo
          </button>
          <button class="btn btn-info" @click="viewAnalytics">
            <span class="icon">📈</span>
            Phân tích
          </button>
        </div>
      </div>
    </div>

    <!-- Charts Section - Moved to top -->
    <div class="charts-section">
      <div class="chart-card fade-in" style="animation-delay: 0.5s">
        <div class="chart-header">
          <h3>Doanh thu theo tháng</h3>
          <div class="chart-controls">
            <select v-model="selectedYear" class="chart-filter">
              <option v-for="year in availableYears" :key="year" :value="year">Năm {{ year }}</option>
            </select>
          </div>
        </div>
        <div class="chart-content">
          <div class="chart-bars">
            <div
              v-for="(month, index) in monthlyRevenue"
              :key="index"
              class="chart-bar"
              :style="{
                height: `${calculateBarHeight(month.value)}%`,
                animationDelay: `${index * 0.1}s`
              }"
              :class="{ 'current-month': month.current }"
              style="animation: chartBarGrow 0.8s ease-out both"
            >
              <div class="bar-tooltip">
                {{ formatCurrency(month.value) }}
              </div>
            </div>
          </div>
          <div class="chart-labels">
            <div v-for="(month, index) in monthlyRevenue" :key="index" class="chart-label">
              {{ month.label }}
            </div>
          </div>
        </div>
      </div>
      <div class="chart-card fade-in" style="animation-delay: 0.6s">
        <div class="chart-header">
          <h3>Sản phẩm bán chạy</h3>
          <div class="chart-controls">
            <select v-model="timeRange" class="chart-filter">
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm này</option>
            </select>
          </div>
        </div>
        <div class="top-products">
          <div v-for="(product, index) in topProducts" :key="product.id" class="top-product-item">
            <div class="product-rank">
              {{ index + 1 }}
            </div>
            <div class="product-image-container">
              <div class="product-image">👟</div>
            </div>
            <div class="product-info">
              <div class="product-name">
                {{ product.name }}
              </div>
              <div class="product-meta">
                <span class="product-sold">Đã bán: {{ product.sold }}</span>
                <span class="product-revenue">{{ formatCurrency(product.revenue) }}</span>
              </div>
            </div>
            <div class="product-percentage">
              <div class="percentage-bar" :style="{ width: `${calculatePercentage(product.sold)}%` }" />
              <span>{{ calculatePercentage(product.sold) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Grid -->
    <div class="stats-grid">
      <div class="stat-card fade-in" style="animation-delay: 0.1s">
        <div class="stat-icon">👟</div>
        <div class="stat-info">
          <h3>{{ totalProducts }}</h3>
          <p>Tổng sản phẩm</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.2s">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <h3>{{ totalCustomers }}</h3>
          <p>Khách hàng</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.3s">
        <div class="stat-icon">🧾</div>
        <div class="stat-info">
          <h3>{{ totalOrders }}</h3>
          <p>Hóa đơn</p>
        </div>
      </div>

      <div class="stat-card fade-in" style="animation-delay: 0.4s">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <h3>{{ formatCurrency(totalRevenue) }}</h3>
          <p>Doanh thu</p>
        </div>
      </div>
    </div>

    <div class="recent-orders">
      <h3>Đơn hàng gần đây</h3>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.customerName }}</td>
              <td>{{ formatCurrency(order.total) }}</td>
              <td>
                <span class="status-badge" :class="order.status">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td>{{ formatDate(order.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../stores/productStore.js'
import { useCustomerStore } from '../stores/customerStore.js'
import { useOrderStore } from '../stores/orderStore.js'
import { useButtonAnimations } from '@/composables/useButtonAnimations.js'

const productStore = useProductStore()
const customerStore = useCustomerStore()
const orderStore = useOrderStore()

// Button animations composable
const { withLoadingAnimation, staggeredFadeIn } = useButtonAnimations()

// Chart data
const selectedYear = ref(new Date().getFullYear())
const timeRange = ref('month')
const availableYears = [2023, 2024, 2025]

const recentOrders = ref([
  {
    id: 1,
    customerName: 'Nguyễn Văn A',
    total: 2500000,
    status: 'completed',
    createdAt: new Date()
  },
  {
    id: 2,
    customerName: 'Trần Thị B',
    total: 1800000,
    status: 'pending',
    createdAt: new Date()
  },
  {
    id: 3,
    customerName: 'Lê Văn C',
    total: 3200000,
    status: 'shipping',
    createdAt: new Date()
  }
])

const totalProducts = computed(() => productStore.totalProducts || 150)
const totalCustomers = computed(() => customerStore.totalCustomers || 1250)
const totalOrders = computed(() => orderStore.totalOrders || 89)
const totalRevenue = computed(() => orderStore.totalRevenue || 125000000)

const formatCurrency = amount => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = date => {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(date))
}

const getStatusText = status => {
  const statusMap = {
    pending: 'Chờ xử lý',
    completed: 'Hoàn thành',
    shipping: 'Đang giao',
    cancelled: 'Đã hủy'
  }
  return statusMap[status] || status
}

const monthlyRevenue = computed(() => {
  const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
  const currentMonth = new Date().getMonth()

  // Mẫu dữ liệu doanh thu theo tháng
  return months.map((label, index) => {
    // Tạo dữ liệu giả lập với xu hướng tăng và một số biến động
    let value = Math.random() * 50000000 + 15000000

    // Tạo xu hướng tăng
    value += (index / 12) * 20000000

    // Mùa cao điểm (quý 4) có doanh thu cao hơn
    if (index >= 9) {
      value *= 1.5
    }

    return {
      label,
      value,
      current: index === currentMonth
    }
  })
})

const topProducts = computed(() => {
  // Dữ liệu giả lập cho sản phẩm bán chạy
  return [
    { id: 1, name: 'Nike Air Force 1', sold: 145, revenue: 43500000 },
    { id: 2, name: 'Adidas Ultraboost', sold: 98, revenue: 34300000 },
    { id: 3, name: 'Nike Jordan 1', sold: 87, revenue: 39150000 },
    { id: 4, name: 'Converse Chuck Taylor', sold: 76, revenue: 15200000 },
    { id: 5, name: 'Puma RS-X', sold: 65, revenue: 19500000 }
  ]
})

const calculateBarHeight = value => {
  const maxValue = Math.max(...monthlyRevenue.value.map(item => item.value))
  return (value / maxValue) * 100
}

const calculatePercentage = sold => {
  const maxSold = Math.max(...topProducts.value.map(p => p.sold))
  return Math.round((sold / maxSold) * 100)
}

// Dashboard action methods with animations using composable
const refreshData = async event => {
  await withLoadingAnimation(
    event,
    async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Refresh store data
      await Promise.all([productStore.fetchProducts(), customerStore.fetchCustomers(), orderStore.fetchOrders()])

      return 'Data refreshed successfully!'
    },
    {
      onSuccess: result => console.log(result),
      onError: error => console.error('Refresh failed:', error)
    }
  )
}

const exportData = async event => {
  await withLoadingAnimation(
    event,
    async () => {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500))
      return 'Export completed successfully!'
    },
    {
      onSuccess: result => console.log(result),
      onError: error => console.error('Export failed:', error)
    }
  )
}

const viewAnalytics = async event => {
  await withLoadingAnimation(
    event,
    async () => {
      // Simulate analytics loading
      await new Promise(resolve => setTimeout(resolve, 1200))
      console.log('Opening analytics view...')
      return 'Analytics loaded successfully!'
    },
    {
      onSuccess: result => console.log(result),
      onError: error => console.error('Analytics failed:', error)
    }
  )
}

onMounted(() => {
  productStore.fetchProducts()
  customerStore.fetchCustomers()
  orderStore.fetchOrders()

  // Add staggered animations to header buttons with smoother timing
  staggeredFadeIn('.header-actions', 100)
})
</script>

<style scoped>
.dashboard {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0;
}

.dashboard-header {
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
  gap: var(--spacing-xl);
}

.dashboard-title {
  margin: 0;
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dashboard-icon {
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.dashboard-title:hover .dashboard-icon {
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  transform: scale(1.1);
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

/* Simplified Button Animations */
.header-actions .btn {
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: var(--font-weight-semibold);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0) scale(1);
}

.header-actions .btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px) scale(1.02);
}

.header-actions .btn:active {
  transform: translateY(0) scale(0.98);
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Apply same hover effect as "xuất báo cáo" to "phân tích" button */
.header-actions .btn.btn-info:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px) scale(1.02);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(16px, 3vw, 32px);
  margin-bottom: var(--spacing-3xl);
  padding: 0 8px;
}

.stat-card {
  background: var(--surface);
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
  display: flex;
  align-items: center;
  transition: all var(--transition-slow);
  min-width: 0;
  overflow: hidden;
  margin: 4px;
}

.stat-icon {
  font-size: var(--font-size-5xl);
  margin-right: var(--spacing-xl);
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-info h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-4xl);
  color: var(--gray-900);
  font-weight: var(--font-weight-bold);
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.1;
  hyphens: auto;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Enhanced responsive handling for revenue stat card */
.stat-card:nth-child(4) .stat-info h3 {
  font-size: clamp(0.5rem, 4vw, 1.8rem);
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
  line-height: 1;
  word-break: break-all;
  word-spacing: -0.1em;
  letter-spacing: -0.02em;
  max-height: 2.5em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-info p {
  margin: 0;
  color: var(--gray-700);
  font-weight: var(--font-weight-semibold);
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-3xl);
}

.chart-card {
  background: var(--surface);
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.chart-header h3 {
  margin: 0;
  color: var(--gray-900);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
}

.chart-filter {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: var(--surface);
  font-size: var(--font-size-sm);
  color: var(--gray-800);
  font-weight: var(--font-weight-semibold);
}

.chart-content {
  height: 280px;
  position: relative;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 220px;
}

@keyframes chartBarGrow {
  0% {
    height: 0 !important;
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

.chart-bar {
  width: 24px;
  background: var(--primary-500);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  position: relative;
  transition: all var(--transition-normal);
  transform-origin: bottom;
}

.chart-bar:hover {
  background: var(--primary-600);
  transform: scaleY(1.05);
}

.chart-bar.current-month {
  background: var(--primary-600);
  box-shadow: 0 0 10px var(--primary-600-alpha-50);
}

.chart-bar:hover .bar-tooltip {
  opacity: 1;
}

.bar-tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: var(--text-inverse);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  opacity: 0;
  transition: opacity var(--transition-fast);
  white-space: nowrap;
  z-index: var(--z-tooltip);
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.chart-label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  text-align: center;
  width: 24px;
  font-weight: var(--font-weight-medium);
}

.top-products {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.top-product-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-rank {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.top-product-item:nth-child(1) .product-rank {
  background: #ffd700;
  color: var(--text-inverse);
}

.top-product-item:nth-child(2) .product-rank {
  background: #c0c0c0;
  color: var(--text-inverse);
}

.top-product-item:nth-child(3) .product-rank {
  background: #cd7f32;
  color: var(--text-inverse);
}

.product-image-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  font-size: 24px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-sm);
  color: var(--gray-900);
}

.product-meta {
  display: flex;
  gap: 10px;
  font-size: var(--font-size-xs);
  color: var(--gray-700);
  margin-top: 3px;
  font-weight: var(--font-weight-semibold);
}

.product-percentage {
  width: 80px;
  position: relative;
}

.percentage-bar {
  height: 6px;
  background: var(--primary-500);
  border-radius: var(--radius-sm);
  margin-bottom: 4px;
}

.product-percentage span {
  font-size: var(--font-size-xs);
  color: var(--gray-700);
  font-weight: var(--font-weight-semibold);
}

.recent-orders {
  background: var(--surface);
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow);
}

.recent-orders h3 {
  margin-top: 0;
  color: var(--gray-900);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xl);
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.table th,
.table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--border);
  color: var(--gray-800);
  font-weight: var(--font-weight-semibold);
}

.table th {
  background: var(--gray-50);
  font-weight: var(--font-weight-bold);
  color: var(--gray-900);
  font-size: var(--font-size-sm);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.status-badge.pending {
  background: var(--warning-100);
  color: var(--warning-800);
}

.status-badge.completed {
  background: var(--info-100);
  color: var(--info-800);
}

.status-badge.shipping {
  background: var(--success-100);
  color: var(--success-800);
}

.status-badge.cancelled {
  background: var(--error-100);
  color: var(--error-800);
}

/* Responsive Design */
/* Ultra-wide screen optimizations */
@media (min-width: 2560px) {
  .stat-card:nth-child(4) .stat-info h3 {
    font-size: clamp(1.5rem, 2.5vw, 2.5rem);
    line-height: 1.1;
    max-height: 2.8em;
  }
}

/* Large Screen Optimizations */
@media (min-width: 1600px) {
  .dashboard {
    max-width: 1800px;
    margin: 0 auto;
  }

  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(24px, 4vw, 48px);
    margin-bottom: 2.5rem;
    padding: 0 12px;
  }

  .stat-card {
    padding: 2rem;
    margin: 6px;
  }

  .stat-icon {
    font-size: 3rem;
    margin-right: 1.5rem;
  }

  .stat-info h3 {
    font-size: 2.25rem;
  }

  .charts-section {
    grid-template-columns: 1.2fr 0.8fr;
    gap: 2.5rem;
  }

  .chart-card {
    padding: 2rem;
  }

  .recent-orders {
    padding: 2rem;
  }

  .table th,
  .table td {
    padding: 1rem;
    font-size: 0.9375rem;
  }
}

@media (min-width: 1920px) {
  .dashboard {
    max-width: 2000px;
  }

  .stats-grid {
    gap: clamp(32px, 5vw, 64px);
    margin-bottom: 3rem;
    padding: 0 16px;
  }

  .stat-card {
    padding: 2.5rem;
    margin: 8px;
  }

  .stat-icon {
    font-size: 3.5rem;
  }

  .stat-info h3 {
    font-size: 2.5rem;
  }

  .charts-section {
    gap: 3rem;
  }

  .chart-card {
    padding: 2.5rem;
  }

  .recent-orders {
    padding: 2.5rem;
  }
}

@media (min-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: clamp(20px, 3.5vw, 40px);
    padding: 0 10px;
  }

  .stat-card {
    margin: 5px;
  }

  .charts-section {
    grid-template-columns: 1.3fr 0.7fr;
    gap: 2rem;
  }
}

@media (max-width: 1400px) {
  .dashboard {
    max-width: 100%;
  }

  .stats-grid {
    gap: clamp(16px, 2.5vw, 24px);
    padding: 0 8px;
  }

  .stat-card {
    margin: 4px;
  }

  .charts-section {
    gap: 16px;
  }
}

@media (max-width: 1200px) {
  .charts-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .chart-content {
    height: 200px;
  }

  .chart-bars {
    height: 150px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(16px, 2vw, 24px);
    padding: 0 8px;
  }

  .stat-card {
    margin: 4px;
  }
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: clamp(16px, 2vw, 20px);
    padding: 0 8px;
  }

  .stat-card {
    min-width: 0;
    padding: 20px;
    margin: 4px;
  }

  .stat-info h3 {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 1024px) {
  .dashboard {
    padding: 0;
  }

  .dashboard-header {
    margin-bottom: 20px;
    padding: 16px 20px;
    border-radius: 8px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .dashboard-title {
    font-size: 24px;
  }

  .header-actions {
    justify-content: center;
    gap: 8px;
  }

  .header-actions .btn {
    padding: 8px 16px;
    font-size: 13px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: clamp(12px, 2vw, 16px);
    padding: 0 8px;
  }

  .stat-card {
    padding: 16px;
    margin: 4px;
    min-width: 0;
  }

  .stat-icon {
    font-size: 32px;
    margin-right: 16px;
  }

  .stat-info h3 {
    font-size: 18px;
    line-height: 1.3;
  }

  /* Enhanced revenue card handling for tablets */
  .stat-card:nth-child(4) .stat-info h3 {
    font-size: clamp(0.6rem, 3.5vw, 1.2rem);
    line-height: 0.95;
    max-height: 2.2em;
  }

  .chart-card {
    padding: 20px;
  }

  .top-product-item {
    gap: 10px;
  }

  .product-percentage {
    width: 60px;
  }

  .table th,
  .table td {
    padding: 10px 8px;
    font-size: 13px;
  }
}

@media (max-width: 900px) {
  .dashboard {
    padding: 0 var(--spacing-md);
  }

  .dashboard-header {
    padding: var(--spacing-lg) var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
    text-align: center;
  }

  .dashboard-header h1 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-sm);
  }

  .dashboard-header .subtitle {
    font-size: var(--font-size-sm);
  }

  .header-actions {
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-lg);
  }

  .header-actions .btn {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-sm);
  }

  .charts-section {
    margin-bottom: var(--spacing-xl);
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }

  .chart-header {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .chart-filter {
    min-width: 120px;
  }

  .chart-content {
    height: 240px;
  }

  .chart-bars {
    height: 180px;
    justify-content: space-evenly;
  }

  .chart-bar {
    width: 20px;
    margin: 0 2px;
  }

  .bar-tooltip {
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs);
  }
}

@media (max-width: 820px) {
  .dashboard {
    padding: 0 var(--spacing-sm);
  }

  .dashboard-header {
    padding: var(--spacing-md) var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
  }

  .charts-section {
    grid-template-columns: 1fr;
  }

  .chart-content {
    height: 220px;
  }

  .chart-bars {
    height: 160px;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: clamp(12px, 1.5vw, 16px);
    padding: 0 6px;
  }

  .stat-card {
    padding: var(--spacing-md);
    margin: 3px;
    min-width: 0;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: clamp(12px, 1.5vw, 16px);
    margin-bottom: var(--spacing-xl);
    padding: 0 6px;
  }

  .stat-card {
    padding: var(--spacing-md);
    flex-direction: row;
    text-align: left;
    margin: 3px;
    min-width: 0;
  }

  .stat-icon {
    margin: 0 var(--spacing-lg) 0 0;
    font-size: var(--font-size-4xl);
  }

  .stat-info h3 {
    font-size: 16px;
    line-height: 1.3;
  }

  /* Enhanced revenue card specific handling for mobile */
  .stat-card:nth-child(4) .stat-info h3 {
    font-size: clamp(0.5rem, 3vw, 1rem);
    line-height: 0.9;
    word-break: break-all;
    max-height: 2em;
    letter-spacing: -0.03em;
  }

  .charts-section {
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }

  .chart-card {
    padding: var(--spacing-lg);
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
  }

  .chart-header h3 {
    font-size: var(--font-size-lg);
  }

  .chart-filter {
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    width: 100%;
    max-width: 150px;
  }

  .chart-content {
    height: 180px;
  }

  .chart-bars {
    height: 130px;
  }

  .chart-bar {
    width: 16px;
    margin: 0 1px;
  }

  .bar-tooltip {
    font-size: 10px;
    padding: 2px 4px;
  }

  .top-products {
    gap: 12px;
  }

  .top-product-item {
    gap: 8px;
  }

  .product-rank {
    width: 20px;
    height: 20px;
    font-size: 12px;
  }

  .product-image-container {
    width: 32px;
    height: 32px;
  }

  .product-image {
    font-size: 20px;
  }

  .product-name {
    font-size: 13px;
  }

  .product-meta {
    font-size: 11px;
    gap: 8px;
  }

  .product-percentage {
    width: 50px;
  }

  .percentage-bar {
    height: 4px;
  }

  .product-percentage span {
    font-size: 10px;
  }

  .recent-orders {
    padding: 16px;
  }

  .recent-orders h3 {
    font-size: 16px;
  }

  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table {
    min-width: 600px;
  }

  .table th,
  .table td {
    padding: 8px;
    font-size: 12px;
  }

  .table th {
    font-size: 11px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .status-badge {
    padding: 2px 8px;
    font-size: 10px;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: clamp(8px, 1vw, 12px);
    padding: 0 4px;
  }

  .stat-card {
    padding: 12px;
    flex-direction: column;
    text-align: center;
    margin: 2px;
    min-width: 0;
  }

  .stat-icon {
    margin: 0 0 8px 0;
    font-size: 32px;
  }

  .stat-info h3 {
    font-size: 14px;
    line-height: 1.3;
  }

  /* Enhanced revenue card specific handling for small mobile */
  .stat-card:nth-child(4) .stat-info h3 {
    font-size: clamp(0.45rem, 2.5vw, 0.9rem);
    line-height: 0.85;
    word-break: break-all;
    max-height: 1.8em;
    letter-spacing: -0.04em;
    word-spacing: -0.15em;
  }

  .stat-info p {
    font-size: 12px;
  }

  .chart-header h3 {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    gap: clamp(6px, 1vw, 8px);
    padding: 0 4px;
  }

  .stat-card {
    padding: 10px;
    margin: 2px;
    min-width: 0;
  }

  .stat-info h3 {
    font-size: 12px;
    line-height: 1.3;
  }

  /* Enhanced revenue card specific handling for very small mobile */
  .stat-card:nth-child(4) .stat-info h3 {
    font-size: clamp(0.4rem, 2.2vw, 0.8rem);
    line-height: 0.8;
    word-break: break-all;
    max-height: 1.6em;
    letter-spacing: -0.05em;
    word-spacing: -0.2em;
  }

  .stat-info p {
    font-size: 11px;
  }

  .charts-section {
    gap: 12px;
  }

  .chart-card {
    padding: 12px;
  }

  .chart-content {
    height: 150px;
  }

  .chart-bars {
    height: 100px;
  }

  .chart-bar {
    width: 12px;
  }

  .chart-label {
    font-size: 10px;
  }

  .recent-orders {
    padding: 12px;
  }

  .table {
    min-width: 500px;
  }

  .table th,
  .table td {
    padding: 6px;
    font-size: 11px;
  }
}

/* Ultra small screen optimizations */
@media (max-width: 320px) {
  .stats-grid {
    gap: clamp(4px, 0.5vw, 6px);
    padding: 0 2px;
  }

  .stat-card:nth-child(4) .stat-info h3 {
    font-size: clamp(0.35rem, 2vw, 0.65rem);
    line-height: 0.75;
    word-break: break-all;
    max-height: 1.4em;
    letter-spacing: -0.06em;
    word-spacing: -0.25em;
  }

  .stat-card {
    padding: 8px;
    min-width: 0;
    margin: 1px;
  }

  .stat-icon {
    font-size: 24px;
    margin-right: 8px;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .chart-bar:hover .bar-tooltip {
    opacity: 0;
  }

  .chart-bar:active .bar-tooltip {
    opacity: 1;
  }

  .stat-card {
    transition: transform 0.2s ease;
  }

  .stat-card:active {
    transform: scale(0.98);
  }
}

/* Button Animations */
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

.fade-in {
  animation: fadeInUp 0.6s ease-out both;
}

.btn.loading {
  pointer-events: none;
  opacity: 0.7;
  position: relative;
}

.btn.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Consistent button transitions */
.header-actions .btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0) scale(1);
}

.header-actions .btn:hover {
  transform: translateY(-2px) scale(1.02);
}
</style>
