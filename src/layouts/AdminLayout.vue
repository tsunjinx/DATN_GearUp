<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo-section">
        <GearUpLogo variant="small" show-text text="Admin" />
      </div>
      <nav>
        <ul class="nav-menu">
          <li>
            <router-link to="/" class="nav-link">
              <span class="icon">📊</span>
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/products" class="nav-link">
              <span class="icon">👟</span>
              Sản phẩm
            </router-link>
          </li>
          <li>
            <router-link to="/customers" class="nav-link">
              <span class="icon">👥</span>
              Khách hàng
            </router-link>
          </li>
          <li>
            <router-link to="/employees" class="nav-link">
              <span class="icon">👨‍💼</span>
              Nhân viên
            </router-link>
          </li>
          <li>
            <router-link to="/orders" class="nav-link">
              <span class="icon">🧾</span>
              Hóa đơn
            </router-link>
          </li>
          <li>
            <router-link to="/discounts" class="nav-link">
              <span class="icon">🏷️</span>
              Đợt giảm giá
            </router-link>
          </li>
          <li>
            <router-link to="/coupons" class="nav-link">
              <span class="icon">🎫</span>
              Phiếu giảm giá
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="main-content">
      <header class="header">
        <h1>{{ pageTitle }}</h1>
        <div class="user-info">
          <span>Xin chào, {{ displayName }}</span>
          <button class="logout-btn" @click="logout">Đăng xuất</button>
        </div>
      </header>

      <div class="content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import GearUpLogo from '../components/ui/GearUpLogo.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const displayName = computed(() => authStore.displayName)

const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/products': 'Quản lý Sản phẩm',
    '/customers': 'Quản lý Khách hàng',
    '/employees': 'Quản lý Nhân viên',
    '/orders': 'Quản lý Hóa đơn',
    '/discounts': 'Quản lý Đợt giảm giá',
    '/coupons': 'Quản lý Phiếu giảm giá'
  }
  return titles[route.path] || 'GearUp Admin'
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px 0;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
  padding: 0 20px;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  margin-bottom: 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #34495e;
  color: #3498db;
}

.nav-link .icon {
  margin-right: 10px;
  font-size: 18px;
}

.main-content {
  flex: 1;
  background: #f8f9fa;
}

.header {
  background: white;
  padding: 20px 30px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  color: #2c3e50;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}

.content {
  padding: 30px;
}
</style>