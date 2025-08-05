<template>
  <div class="admin-layout">
    <!-- Mobile Overlay -->
    <div 
      class="mobile-overlay" 
      :class="{ active: mobileMenuOpen }"
      @click="closeMobileMenu"
    ></div>
    
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 
      'sidebar-collapsed': sidebarCollapsed && !isMobile, 
      'sidebar-open': mobileMenuOpen && isMobile 
    }">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-wrapper" :class="{ 'logo-hidden': sidebarCollapsed && !isMobile }">
            <GearUpLogo variant="small" />
          </div>
        </div>
        <button 
          class="sidebar-toggle"
          @click="toggleSidebar"
          v-if="!isMobile"
        >
          <i class="icon">☰</i>
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <ul class="nav-menu">
          <li>
            <router-link to="/" class="nav-link" exact @click="closeMobileMenu">
              <i class="nav-icon">📊</i>
              <span v-if="!sidebarCollapsed || isMobile" class="nav-text">Thống kê & Báo cáo</span>
            </router-link>
          </li>
          <li>
            <router-link to="/products" class="nav-link" exact @click="closeMobileMenu">
              <i class="nav-icon">👟</i>
              <span v-if="!sidebarCollapsed || isMobile" class="nav-text">Quản lý Sản phẩm</span>
            </router-link>
          </li>
          <li>
            <router-link to="/orders" class="nav-link" exact>
              <i class="nav-icon">🧾</i>
              <span v-if="!sidebarCollapsed" class="nav-text">Quản lý Hóa đơn</span>
            </router-link>
          </li>
          <li>
            <router-link to="/customers" class="nav-link" exact>
                <i class="nav-icon">👥</i>
              <span v-if="!sidebarCollapsed" class="nav-text">Quản lý Khách hàng</span>
            </router-link>
          </li>
          <li>
            <router-link to="/employees" class="nav-link" exact>
              <i class="nav-icon">👨‍💼</i>
              <span v-if="!sidebarCollapsed" class="nav-text">Quản lý Nhân viên</span>
            </router-link>
          </li>
          <li>
            <router-link to="/discounts" class="nav-link" exact>
              <i class="nav-icon">🏷️</i>
              <span v-if="!sidebarCollapsed" class="nav-text">Đợt giảm giá</span>
            </router-link>
          </li>
          <li>
            <router-link to="/coupons" class="nav-link" exact>
              <i class="nav-icon">🎫</i>
              <span v-if="!sidebarCollapsed" class="nav-text">Phiếu giảm giá</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
    
    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <button 
            class="mobile-menu-toggle"
            @click="toggleMobileMenu"
            v-if="isMobile"
          >
            <i class="icon">☰</i>
          </button>
          <div class="breadcrumb">
            <router-link to="/" class="breadcrumb-link">Trang chủ</router-link>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">{{ pageTitle }}</span>
          </div>
        </div>
        
        <div class="header-right">
          <div class="header-actions">
            <button class="btn btn-outline notifications-btn">
              <i class="icon">🔔</i>
              <span class="notification-badge">3</span>
            </button>
            
            <div class="user-menu">
              <div class="user-info">
                <div class="user-avatar">
                  <span>{{ displayName.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="user-details">
                  <span class="user-name">{{ displayName }}</span>
                  <span class="user-role">Quản trị viên</span>
                </div>
              </div>
              <button class="logout-btn btn btn-secondary" @click="logout">
                <i class="icon">🚪</i>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <div class="page-content">
        <div class="page-header">
          <h1 class="page-title">
            <span class="page-icon">{{ pageIcon }}</span>
            {{ pageTitle }}
          </h1>
          <p class="page-subtitle">{{ pageSubtitle }}</p>
        </div>
        
        <div class="content-area">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import GearUpLogo from '@/components/ui/GearUpLogo.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarCollapsed = ref(false)
const mobileMenuOpen = ref(false)
const isMobile = ref(false)

const displayName = computed(() => authStore.displayName)

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const pageTitle = computed(() => {
  // First try to get title from route meta, remove "GearUp - " prefix for display
  if (route.meta?.title) {
    return route.meta.title.replace('GearUp - ', '')
  }
  
  // Fallback to static mapping for backwards compatibility
  const titles = {
    '/': 'Thống kê & Báo cáo',
    '/products': 'Quản lý Sản phẩm',
    '/orders': 'Quản lý Hóa đơn',
    '/customers': 'Quản lý Khách hàng',
    '/employees': 'Quản lý Nhân viên',
    '/discounts': 'Quản lý Đợt giảm giá',
    '/coupons': 'Quản lý Mã giảm giá'
  }
  return titles[route.path] || 'GearUp Admin'
})

const pageSubtitle = computed(() => {
  const subtitles = {
    '/': 'Tổng quan về doanh thu và hiệu suất kinh doanh',
    '/products': 'Quản lý danh mục sản phẩm và kho hàng',
    '/orders': 'Theo dõi và xử lý đơn hàng khách hàng',
    '/customers': 'Thông tin và lịch sử khách hàng',
    '/employees': 'Quản lý nhân sự và phân quyền hệ thống',
    '/discounts': 'Thiết lập chương trình khuyến mãi và đợt giảm giá',
    '/coupons': 'Tạo và quản lý mã giảm giá cho khách hàng'
  }
  return subtitles[route.path] || 'Hệ thống quản lý cửa hàng giày GearUp'
})

const pageIcon = computed(() => {
  // First try to get icon from route meta
  if (route.meta?.icon) {
    return route.meta.icon
  }
  
  // Fallback to static mapping
  const icons = {
    '/': '📊',
    '/products': '👟',
    '/orders': '🧾',
    '/customers': '👥',
    '/employees': '👨‍💼',
    '/discounts': '🏷️',
    '/coupons': '🎫'
  }
  return icons[route.path] || '🏪'
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--gray-50);
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  min-width: 280px;
  max-width: 320px;
  background: white;
  border-right: 1px solid var(--border);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.sidebar-collapsed {
  width: 80px;
  min-width: 80px;
  text-align: center;
}

.sidebar-collapsed .nav-link {
  padding: 0.875rem 0;
  margin: 0.25rem 0;
  justify-content: center;
  width: 100%;
  min-width: 48px;
  display: flex;
  align-items: center;
}

.sidebar-collapsed .nav-link.router-link-exact-active {
  border-left: none;
  border-radius: 8px;
  margin: 0.25rem 0;
  background: var(--primary-50);
  color: var(--primary-600);
  width: 100%;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  overflow: hidden;
  flex: 1;
  max-width: calc(100% - 60px);
}

.logo-wrapper {
  transition: all 0.3s ease;
  opacity: 1;
  transform: scale(1);
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-wrapper.logo-hidden {
  opacity: 0;
  transform: scale(0.8);
  width: 0;
  overflow: hidden;
}

.sidebar-collapsed .sidebar-header {
  padding: 1.5rem 0.75rem;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-collapsed .logo-container {
  justify-content: center;
  max-width: 100%;
  width: 100%;
}

.sidebar-collapsed .sidebar-toggle {
  position: static;
  margin: 0 auto;
}

/* Logo scaling adjustments */
.logo-wrapper :deep(.gearup-logo) {
  transform: scale(1.2);
  max-width: 100%;
  height: auto;
}

.sidebar-collapsed .logo-wrapper :deep(.gearup-logo) {
  transform: scale(1.0);
}

.sidebar-toggle {
  background: none;
  border: none;
  padding: 0.625rem;
  cursor: pointer;
  border-radius: 0.5rem;
  color: var(--gray-600);
  transition: all 0.2s ease;
  position: relative;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.sidebar-toggle:hover {
  background: var(--gray-100);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  margin-bottom: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.875rem 1.5rem;
  color: var(--gray-600);
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 0;
  position: relative;
  min-height: 48px;
  margin: 0 0.5rem;
  border-radius: 8px;
}

.nav-link:hover {
  background: var(--primary-50);
  color: var(--primary-700);
}

.nav-link.router-link-exact-active {
  background: var(--primary-100);
  color: var(--primary-700);
  border-left: 4px solid var(--primary-500);
  margin-left: 0.5rem;
  border-radius: 0 8px 8px 0;
}

.nav-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.sidebar-collapsed .nav-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.sidebar-collapsed .nav-icon {
  margin-right: 0;
  width: 24px;
  text-align: center;
  font-size: 1.25rem;
}

.sidebar-collapsed .sidebar-nav {
  padding: 0.5rem 0;
}

.sidebar-collapsed .nav-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.25rem;
  width: 100%;
}

.sidebar-collapsed .nav-menu li {
  width: calc(100% - 0.5rem);
  display: flex;
  justify-content: center;
  margin: 0 0.25rem;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Top Header */
.top-header {
  background: white;
  border-bottom: 1px solid var(--border);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
}

.header-left {
  flex: 1;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: var(--gray-500);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--primary-600);
}

.breadcrumb-separator {
  color: var(--gray-400);
}

.breadcrumb-current {
  color: var(--gray-800);
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notifications-btn {
  position: relative;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.notification-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: var(--error);
  color: white;
  font-size: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--gray-800);
  font-size: 0.875rem;
}

.user-role {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.logout-btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Page Content */
.page-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-icon {
  font-size: 2.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
  border-radius: 12px;
  border: 2px solid var(--primary-200);
}

.page-subtitle {
  color: var(--gray-600);
  font-size: 1rem;
}

.content-area {
  min-height: calc(100vh - 300px);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .page-content {
    padding: 1.5rem;
  }
  
  .top-header {
    padding: 1rem 1.5rem;
  }
}

/* Desktop to tablet transition - keep logo visible but compress sidebar */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px; /* Keep reasonable width instead of collapsing too much */
  }
  
  .page-title {
    font-size: 1.75rem;
    gap: 0.5rem;
  }
  
  .page-icon {
    font-size: 1.875rem;
    min-width: 2rem;
    height: 2rem;
  }
  
  .breadcrumb {
    font-size: 0.8125rem;
  }
}

/* Tablet transition point - start collapsing sidebar but keep mobile menu hidden */
@media (max-width: 900px) {
  .sidebar {
    width: 72px;
  }
  
  .sidebar .nav-text {
    display: none;
  }
  
  .logo-wrapper {
    opacity: 0;
    transform: scale(0.8);
    width: 0;
    overflow: hidden;
  }
  
  .sidebar-header {
    padding: 1rem 0.75rem;
    justify-content: center;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .sidebar-toggle {
    position: static;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .admin-layout {
    position: relative;
  }
  
  .sidebar {
    position: fixed;
    left: -100%;
    top: 0;
    height: 100vh;
    z-index: 1000;
    width: 280px;
    transition: left 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar.sidebar-open {
    left: 0;
  }
  
  /* Reset sidebar collapsed state on mobile */
  .sidebar-collapsed {
    width: 280px;
    left: -100%;
  }
  
  .sidebar-collapsed.sidebar-open {
    left: 0;
  }
  
  /* Show all navigation elements on mobile */
  .sidebar .nav-text {
    display: block !important;
  }
  
  /* Restore logo visibility on mobile */
  .logo-wrapper {
    opacity: 1 !important;
    transform: scale(1) !important;
    width: auto !important;
    overflow: visible !important;
  }
  
  /* Reset sidebar header layout for mobile */
  .sidebar-header {
    padding: 1.5rem !important;
    justify-content: space-between !important;
    flex-direction: row !important;
    gap: 0.75rem !important;
  }
  
  .main-content {
    margin-left: 0;
    width: 100%;
  }
  
  .top-header {
    padding: 1rem;
    position: relative;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .mobile-menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    background: var(--gray-100);
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    font-size: 1.25rem;
    color: var(--gray-600);
  }
  
  .page-content {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
    gap: 0.5rem;
  }
  
  .page-icon {
    font-size: 1.625rem;
    min-width: 1.75rem;
    height: 1.75rem;
  }
  
  .page-subtitle {
    font-size: 0.875rem;
  }
  
  .user-details {
    display: none;
  }
  
  .header-actions {
    gap: 0.5rem;
  }
  
  .breadcrumb {
    flex: 1;
    margin-left: 0.5rem;
  }
  
  .notifications-btn {
    padding: 0.5rem;
  }
  
  .logout-btn {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
  
  .logout-btn .icon {
    margin-right: 0;
  }
  
  .logout-btn span:not(.icon) {
    display: none;
  }
}

@media (max-width: 640px) {
  .page-header {
    margin-bottom: 1rem;
  }
  
  .page-title {
    font-size: 1.25rem;
    gap: 0.375rem;
  }
  
  .page-icon {
    font-size: 1.375rem;
    min-width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
  }
  
  .breadcrumb-current {
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .header-actions {
    gap: 0.25rem;
  }
  
  .user-avatar {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }
}

/* Extra small mobile devices - fix icon expansion and improve spacing */
@media (max-width: 480px) {
  .page-content {
    padding: 0.75rem;
  }
  
  .top-header {
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.125rem;
    gap: 0.25rem;
    flex-wrap: wrap;
  }
  
  .page-icon {
    font-size: 1.25rem;
    min-width: 1.25rem;
    height: 1.25rem;
    padding: 0.25rem;
    flex-shrink: 0;
    border-radius: 8px;
  }
  
  .breadcrumb {
    font-size: 0.75rem;
    margin-left: 0.25rem;
  }
  
  .breadcrumb-current {
    max-width: 120px;
  }
  
  .header-actions {
    gap: 0.125rem;
  }
  
  .notifications-btn {
    padding: 0.375rem;
  }
  
  .user-avatar {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.625rem;
  }
  
  .logout-btn {
    padding: 0.375rem;
  }
  
  .mobile-menu-toggle {
    padding: 0.375rem;
    font-size: 1.125rem;
  }
  
  /* Prevent icon stretching in the sidebar */
  .nav-icon {
    font-size: 1.125rem !important;
    width: 20px !important;
    text-align: center;
    flex-shrink: 0;
  }
  
  /* Ensure sidebar navigation doesn't have excessive padding */
  .nav-link {
    padding: 0.75rem 1rem;
    min-height: 44px;
  }
  
  .sidebar-header {
    padding: 1rem !important;
    min-height: 70px;
  }
}

/* Mobile Overlay */
@media (max-width: 768px) {
  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }
  
  .mobile-overlay.active {
    opacity: 1;
    visibility: visible;
  }
}
</style>