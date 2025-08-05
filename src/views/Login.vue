<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
          <GearUpLogo variant="large"/>
        </div>

        <h2>Đăng nhập hệ thống</h2>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Tên đăng nhập</label>
            <input id="username" type="text" v-model="form.username" class="form-control"
              placeholder="Nhập tên đăng nhập" required />
          </div>

          <div class="form-group">
            <label for="password">Mật khẩu</label>
            <input id="password" type="password" v-model="form.password" class="form-control"
              placeholder="Nhập mật khẩu" required />
          </div>

          <div class="form-group">
            <label class="checkbox-container">
              <input type="checkbox" v-model="form.remember" />
              <span class="checkmark"></span>
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>
        </form>

        <div class="login-footer">
          <p>&copy; 2024 GearUp.</p>
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.logo-section {
  margin-bottom: 30px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-weight: 600;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  margin-right: 8px;
}

.btn-block {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover:not(:disabled) {
  background: #5a6fd8;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.login-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e1e5e9;
}

.login-footer p {
  color: #888;
  font-size: 14px;
  margin: 0;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
}
</style>
