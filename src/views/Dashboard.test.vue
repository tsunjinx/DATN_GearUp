<template>
  <div class="dashboard">
    <!-- Simple Test Element -->
    <div style="background: #22c55e; color: white; padding: 20px; margin: 20px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold;">
      ✅ DASHBOARD IS WORKING! Time: {{ timeRange }}
    </div>
    
    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ todayStats.revenue }}</div>
          <div class="stat-label">Hôm nay</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ weekStats.revenue }}</div>
          <div class="stat-label">Tuần này</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ monthStats.revenue }}</div>
          <div class="stat-label">Tháng này</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-value">{{ yearStats.revenue }}</div>
          <div class="stat-label">Năm này</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

console.log('🎯 Dashboard component is loading...')

const timeRange = ref('month')

const todayStats = ref({
  revenue: '0 ₫',
  products: 0,
  orders: 0
})

const weekStats = ref({
  revenue: '0 ₫',
  products: 0,
  orders: 0
})

const monthStats = ref({
  revenue: '643.480.000 ₫',
  products: 22,
  orders: 22
})

const yearStats = ref({
  revenue: '2.822.498.000 ₫',
  products: 89,
  orders: 69
})

console.log('✅ Dashboard component setup complete!')
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--gray-200);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-content {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-600);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: var(--gray-600);
  font-weight: 500;
}
</style>
