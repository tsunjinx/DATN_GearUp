<template>
  <div class="not-found">
    <div class="not-found-content">
      <GearUpLogo variant="large" />
      <h1>404</h1>
      <h2>Trang không tồn tại</h2>
      <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <router-link to="/" class="back-home"> Trở về trang chủ </router-link>
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

/* Responsive Design */
@media (max-width: 768px) {
  .not-found {
    padding: 15px;
  }

  .not-found-content {
    max-width: 100%;
    padding: 30px 20px;
  }

  h1 {
    font-size: 56px;
  }

  h2 {
    font-size: 20px;
  }

  p {
    font-size: 14px;
    margin-bottom: 25px;
  }

  .back-home {
    padding: 12px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .not-found {
    padding: 10px;
  }

  .not-found-content {
    padding: 25px 15px;
  }

  h1 {
    font-size: 48px;
  }

  h2 {
    font-size: 18px;
    margin-bottom: 12px;
  }

  p {
    font-size: 13px;
    margin-bottom: 20px;
  }

  .back-home {
    padding: 10px 18px;
    font-size: 13px;
    width: 100%;
    box-sizing: border-box;
  }
}

@media (max-width: 360px) {
  .not-found-content {
    padding: 20px 12px;
  }

  h1 {
    font-size: 42px;
  }

  h2 {
    font-size: 16px;
  }

  p {
    font-size: 12px;
  }
}

/* Touch devices optimizations */
@media (hover: none) and (pointer: coarse) {
  .back-home {
    min-height: 44px;
  }

  .back-home:hover {
    transform: none;
  }

  .back-home:active {
    transform: scale(0.98);
  }
}
</style>
