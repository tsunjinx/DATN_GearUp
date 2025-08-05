<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Side - Branding -->
      <div class="login-branding">
        <div class="branding-content">
            <GearUpLogo variant="large" />
            <p class="brand-subtitle" style="font-weight: bold;">Hệ thống quản lý cửa hàng giày thể thao</p>
          <div class="features-list">
          </div>
        </div>
      </div>
      
      <!-- Right Side - Login Form -->
      <div class="login-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2>Đăng nhập hệ thống</h2>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="username">Tên đăng nhập</label>
              <div class="input-wrapper">
                <i class="input-icon">👤</i>
                <input 
                  id="username" 
                  type="text" 
                  v-model="form.username" 
                  class="form-control"
                  placeholder="Nhập tên đăng nhập" 
                  required 
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Mật khẩu</label>
              <div class="input-wrapper">
                <i class="input-icon">🔒</i>
                <input 
                  id="password" 
                  type="password" 
                  v-model="form.password" 
                  class="form-control"
                  placeholder="Nhập mật khẩu" 
                  required 
                />
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-container">
                <input type="checkbox" v-model="form.remember" />
                <span class="checkmark"></span>
                <span class="checkbox-text">Ghi nhớ đăng nhập</span>
              </label>
              
              <a href="#" class="forgot-password">Quên mật khẩu?</a>
            </div>

            <div v-if="error" class="error-message">
              <i class="error-icon">⚠️</i>
              {{ error }}
            </div>

            <button type="submit" class="btn btn-primary btn-login" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              <i v-else class="login-icon">🚀</i>
              {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </button>
          </form>

          <div class="demo-credentials">
            <div class="demo-header">
              <i class="demo-icon">🔑</i>
              <span>Thông tin đăng nhập demo</span>
            </div>
            <div class="demo-info">
              <p><strong>Tên đăng nhập:</strong> admin</p>
              <p><strong>Mật khẩu:</strong> admin</p>
            </div>
          </div>

          <div class="login-footer">
            <p>&copy; 2025 GearUp. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import GearUpLogo from '../components/ui/GearUpLogo.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = computed(() => authStore.loading)
const error = computed(() => authStore.error)

const form = ref({
  username: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  const success = await authStore.login({
    username: form.value.username,
    password: form.value.password,
    remember: form.value.remember
  })

  if (success) {
    router.push('/')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 600px;
}

/* Left Side - Branding */
.login-branding {
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  color: white;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-branding::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  transform: rotate(45deg);
}

.branding-content {
  text-align: center;
  z-index: 1;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem 0;
}

.brand-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  opacity: 0.9;
}

.feature-icon {
  font-size: 1.25rem;
}

/* Right Side - Form */
.login-form-section {
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--gray-600);
  font-size: 0.95rem;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--gray-700);
  font-weight: 500;
  font-size: 0.875rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  color: var(--gray-400);
  z-index: 1;
}

.form-control {
  padding-left: 3rem;
  height: 3rem;
  border: 1.5px solid var(--border);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: var(--primary-400);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input[type="checkbox"] {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  accent-color: var(--primary-500);
}

.checkbox-text {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.forgot-password {
  color: var(--primary-600);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password:hover {
  color: var(--primary-700);
}

.btn-login {
  width: 100%;
  height: 3rem;
  font-size: 1rem;
  font-weight: 600;
  gap: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(74, 222, 128, 0.3);
}

.login-icon {
  font-size: 1.125rem;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.error-icon {
  font-size: 1rem;
}

.demo-credentials {
  background: var(--gray-50);
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.demo-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.875rem;
}

.demo-icon {
  font-size: 1rem;
}

.demo-info {
  font-size: 0.8125rem;
  color: var(--gray-600);
}

.demo-info p {
  margin: 0.25rem 0;
}

.demo-info strong {
  color: var(--gray-700);
}

.login-footer {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.login-footer p {
  color: var(--gray-500);
  font-size: 0.8125rem;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
  
  .login-branding {
    display: none;
  }
  
  .login-form-section {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
    align-items: flex-start;
    padding-top: 2rem;
  }
  
  .login-container {
    min-height: auto;
    max-width: 100%;
    width: 100%;
  }
  
  .login-form-section {
    padding: 1.5rem;
  }
  
  .form-header h2 {
    font-size: 1.5rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-control {
    height: 2.75rem;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .demo-credentials {
    padding: 0.75rem;
  }
  
  .demo-info {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 0.5rem;
  }
  
  .login-form-section {
    padding: 1rem;
  }
  
  .form-header h2 {
    font-size: 1.25rem;
  }
  
  .form-header p {
    font-size: 0.875rem;
  }
  
  .btn-login {
    height: 2.75rem;
    font-size: 0.9rem;
  }
  
  .demo-credentials {
    padding: 0.5rem;
  }
  
  .demo-header {
    font-size: 0.75rem;
  }
  
  .demo-info {
    font-size: 0.7rem;
  }
  
  .login-footer p {
    font-size: 0.75rem;
  }
}

/* Landscape phone orientation */
@media (max-width: 768px) and (orientation: landscape) {
  .login-page {
    padding-top: 1rem;
  }
  
  .login-container {
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .form-header {
    margin-bottom: 1rem;
  }
  
  .demo-credentials {
    margin-bottom: 1rem;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .login-branding::before {
    background-size: 100% 100%;
  }
}

/* Touch device improvements */
@media (hover: none) and (pointer: coarse) {
  .btn-login:hover:not(:disabled) {
    transform: none;
    box-shadow: 0 4px 14px rgba(74, 222, 128, 0.3);
  }
  
  .btn-login:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  .forgot-password:hover {
    color: var(--primary-600);
  }
  
  .forgot-password:active {
    color: var(--primary-800);
  }
}
</style>
