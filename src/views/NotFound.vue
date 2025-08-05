<template>
  <div class="not-found">
    <div class="not-found-content">
      <GearUpLogo variant="large" />
      <h1>404</h1>
      <h2>Trang không tồn tại</h2>
      <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <router-link to="/" class="back-home">Trở về trang chủ</router-link>
    </div>
  </div>
</template>

<script setup>
import GearUpLogo from '../components/ui/GearUpLogo.vue'
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
}

.not-found-content {
  max-width: 500px;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 72px;
  font-weight: 700;
  color: #667eea;
  margin: 10px 0;
}

h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #2c3e50;
}

p {
  color: #6c757d;
  margin-bottom: 30px;
  line-height: 1.5;
}

.back-home {
  display: inline-block;
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-home:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}
</style>
