<template>
  <div class="dashboard">
    <!-- Charts Section - Moved to top -->
    <div class="charts-section">
      <div class="chart-card">
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
            <div v-for="(month, index) in monthlyRevenue" :key="index" class="chart-bar"
              :style="{ height: `${calculateBarHeight(month.value)}%` }" :class="{ 'current-month': month.current }">
              <div class="bar-tooltip">{{ formatCurrency(month.value) }}</div>
            </div>
          </div>
          <div class="chart-labels">
            <div v-for="(month, index) in monthlyRevenue" :key="index" class="chart-label">
              {{ month.label }}
            </div>
          </div>
        </div>
      </div>

      <div class="chart-card">
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
            <div class="product-rank">{{ index + 1 }}</div>
            <div class="product-image-container">
              <div class="product-image">👟</div>
            </div>
            <div class="product-info">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-meta">
                <span class="product-sold">Đã bán: {{ product.sold }}</span>
                <span class="product-revenue">{{ formatCurrency(product.revenue) }}</span>
              </div>
            </div>
            <div class="product-percentage">
              <div class="percentage-bar" :style="{ width: `${calculatePercentage(product.sold)}%` }"></div>
              <span>{{ calculatePercentage(product.sold) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👟</div>
        <div class="stat-info">
          <h3>{{ totalProducts }}</h3>
          <p>Tổng sản phẩm</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <h3>{{ totalCustomers }}</h3>
          <p>Khách hàng</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🧾</div>
        <div class="stat-info">
          <h3>{{ totalOrders }}</h3>
          <p>Hóa đơn</p>
        </div>
      </div>

      <div class="stat-card">
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

const productStore = useProductStore()
const customerStore = useCustomerStore()
const orderStore = useOrderStore()

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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN').format(new Date(date))
}

const getStatusText = (status) => {
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

const calculateBarHeight = (value) => {
  const maxValue = Math.max(...monthlyRevenue.value.map(item => item.value))
  return (value / maxValue) * 100
}

const calculatePercentage = (sold) => {
  const maxSold = Math.max(...topProducts.value.map(p => p.sold))
  return Math.round((sold / maxSold) * 100)
}

onMounted(() => {
  productStore.fetchProducts()
  customerStore.fetchCustomers()
  orderStore.fetchOrders()
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 40px;
  margin-right: 20px;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #2c3e50;
}

.stat-info p {
  margin: 0;
  color: #7f8c8d;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-header h3 {
  margin: 0;
  color: #2c3e50;
}

.chart-filter {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  font-size: 14px;
  color: #495057;
}

.chart-content {
  height: 250px;
  position: relative;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
}

.chart-bar {
  width: 24px;
  background: #667eea;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.3s ease;
}

.chart-bar.current-month {
  background: #764ba2;
}

.chart-bar:hover .bar-tooltip {
  opacity: 1;
}

.bar-tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: #2c3e50;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.chart-labels {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.chart-label {
  font-size: 12px;
  color: #6c757d;
  text-align: center;
  width: 24px;
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
  background: #f8f9fa;
  font-weight: bold;
  font-size: 14px;
}

.top-product-item:nth-child(1) .product-rank {
  background: #FFD700;
  color: #fff;
}

.top-product-item:nth-child(2) .product-rank {
  background: #C0C0C0;
  color: #fff;
}

.top-product-item:nth-child(3) .product-rank {
  background: #CD7F32;
  color: #fff;
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
  font-weight: 600;
  font-size: 14px;
}

.product-meta {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #6c757d;
  margin-top: 3px;
}

.product-percentage {
  width: 80px;
  position: relative;
}

.percentage-bar {
  height: 6px;
  background: #667eea;
  border-radius: 3px;
  margin-bottom: 4px;
}

.product-percentage span {
  font-size: 12px;
  color: #6c757d;
}

.recent-orders {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recent-orders h3 {
  margin-top: 0;
  color: #2c3e50;
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
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.completed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.shipping {
  background: #d4edda;
  color: #155724;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

/* Responsive Design */
/* Large Screen Optimizations */
@media (min-width: 1600px) {
  .dashboard {
    max-width: 1800px;
    margin: 0 auto;
  }
  
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-bottom: 2.5rem;
  }
  
  .stat-card {
    padding: 2rem;
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
    gap: 2.5rem;
    margin-bottom: 3rem;
  }
  
  .stat-card {
    padding: 2.5rem;
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
    gap: 1.5rem;
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
  
  .charts-section {
    gap: 16px;
  }
  
  .stats-grid {
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
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

@media (max-width: 1024px) {
  .dashboard {
    padding: 0;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-icon {
    font-size: 32px;
    margin-right: 16px;
  }
  
  .stat-info h3 {
    font-size: 24px;
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
  .charts-section {
    margin-bottom: 24px;
  }
  
  .chart-header {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .chart-filter {
    min-width: 120px;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  .stat-card {
    padding: 16px;
    flex-direction: row;
    text-align: left;
  }
  
  .stat-icon {
    margin: 0 16px 0 0;
    font-size: 36px;
  }
  
  .charts-section {
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .chart-card {
    padding: 16px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 16px;
  }
  
  .chart-header h3 {
    font-size: 16px;
  }
  
  .chart-filter {
    font-size: 12px;
    padding: 4px 8px;
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
    width: 18px;
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
  .stat-card {
    padding: 12px;
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    margin: 0 0 8px 0;
    font-size: 32px;
  }
  
  .stat-info h3 {
    font-size: 20px;
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
    gap: 8px;
  }
  
  .stat-card {
    padding: 12px;
  }
  
  .stat-info h3 {
    font-size: 18px;
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
</style>
