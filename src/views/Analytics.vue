<!-- Trang Phân tích (Admin): hiển thị KPI nhanh và placeholder biểu đồ, hỗ trợ xuất CSV số liệu cơ bản. -->
<template>
  <div class="analytics-page">
    <!-- Analytics Header with Action Buttons -->
    <div class="analytics-header fade-in">
      <div class="header-content">
        <h1 class="analytics-title">
          <span class="analytics-icon">📈</span>
          Phân tích & Báo cáo
        </h1>
        <div class="header-actions">
          <button class="btn btn-primary" @click="exportCsv">
            <i class="btn-icon">📊</i>
            Xuất CSV
          </button>
        </div>
      </div>
    </div>

    <div class="grid fade-in" style="animation-delay: 0.3s">
      <Card class="stat-card" style="animation-delay: 0.4s">
        <template #header> Doanh thu hôm nay </template>
        <div class="stat">
          {{ formatCurrency(kpis.revenueToday) }}
        </div>
      </Card>
      <Card class="stat-card" style="animation-delay: 0.5s">
        <template #header> Đơn hàng hôm nay </template>
        <div class="stat">
          {{ kpis.ordersToday }}
        </div>
      </Card>
      <Card class="stat-card" style="animation-delay: 0.6s">
        <template #header> Hàng sắp hết </template>
        <div class="stat">
          {{ kpis.lowStock }}
        </div>
      </Card>
    </div>

    <Card class="fade-in" style="animation-delay: 0.7s">
      <template #header> Doanh thu 7 ngày qua </template>
      <div class="chart" role="img" aria-label="Biểu đồ cột doanh thu 7 ngày qua">
        <div
          v-for="(v, i) in last7Days"
          :key="i"
          class="bar"
          :style="{
            height: `${scale(v)}%`,
            '--bar-index': i,
            animationDelay: `${i * 0.1 + 0.8}s`
          }"
        >
          <span class="bar-label">{{ shortDay(i) }}</span>
          <span class="bar-value">{{ formatCurrency(v) }}</span>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button, Card } from '@/components/ui'

const kpis = ref({ revenueToday: 0, ordersToday: 0, lowStock: 0 })

const formatCurrency = val => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

const exportCsv = () => {
  const rows = [
    ['Metric', 'Value'],
    ['Revenue Today', kpis.value.revenueToday],
    ['Orders Today', kpis.value.ordersToday],
    ['Low Stock', kpis.value.lowStock]
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'analytics.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// Dữ liệu biểu đồ (mock): doanh thu 7 ngày (từ trái sang phải là các ngày gần nhất)
const last7Days = ref([12000000, 8000000, 15000000, 6000000, 9000000, 11000000, 14000000])
const max = () => Math.max(1, ...last7Days.value)
const scale = v => Math.round((v / max()) * 100)
const shortDay = i => ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]
</script>

<style scoped>
.analytics-page {
  display: grid;
  gap: 1rem;
}

/* Analytics Header */
.analytics-header {
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

.analytics-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--white);
}

.analytics-icon {
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
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.stat {
  font-size: 1.5rem;
  font-weight: 700;
}
.chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 240px;
  padding: 8px;
  background: var(--gray-50);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.bar {
  position: relative;
  flex: 1;
  min-width: 24px;
  background: linear-gradient(180deg, var(--primary-400), var(--primary-600));
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.bar-label {
  position: absolute;
  bottom: -22px;
  font-size: 12px;
  color: var(--gray-600);
}
.bar-value {
  position: absolute;
  top: -22px;
  background: #fff;
  color: var(--gray-700);
  font-size: 10px;
  padding: 2px 4px;
  border: 1px solid var(--border);
  border-radius: 4px;
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

/* Enhanced Card Animations for Stats */
.stat-card {
  animation: fadeInUp 0.6s ease-out both;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Chart Bar Growth Animation */
.bar {
  animation: chartBarGrow 0.8s ease-out both;
  animation-delay: calc(var(--bar-index, 0) * 0.1s + 0.8s);
}

@keyframes chartBarGrow {
  0% {
    height: 0% !important;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
