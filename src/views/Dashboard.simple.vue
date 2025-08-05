<template>
  <div class="dashboard-simple">
    <div class="welcome-section">
      <h1>Chào mừng đến với GearUp Admin</h1>
      <p>Hệ thống quản lý cửa hàng giày thể thao</p>
      <p>Dashboard đơn giản - Đang hoạt động!</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👟</div>
        <div class="stat-info">
          <h3>150</h3>
          <p>Tổng sản phẩm</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <h3>1,250</h3>
          <p>Khách hàng</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🧾</div>
        <div class="stat-info">
          <h3>89</h3>
          <p>Hóa đơn</p>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <h3>125,000,000 ₫</h3>
          <p>Doanh thu</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
console.log('Dashboard loaded successfully!')
</script>

<style scoped>
.dashboard-simple {
  max-width: 1200px;
}

.welcome-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
}

.welcome-section h1 {
  font-size: 28px;
  margin: 15px 0 10px 0;
  font-weight: 600;
}

.welcome-section p {
  font-size: 16px;
  opacity: 0.9;
  margin: 10px 0;
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
</style>
