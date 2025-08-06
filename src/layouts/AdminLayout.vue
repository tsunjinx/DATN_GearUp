<template>
  <div class="admin-layout">
    <!-- Mobile Overlay -->
    <div class="mobile-overlay" :class="{ active: mobileMenuOpen }" @click="closeMobileMenu"></div>

    <!-- Sidebar -->
    <aside :class="sidebarClass">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-wrapper" :class="{ 'logo-hidden': (sidebarCollapsed || isTablet) && !isMobile }">
            <GearUpLogo variant="small" />
          </div>
        </div>
        <button class="sidebar-toggle" @click="toggleSidebar" v-if="!isMobile">
          <div class="hamburger-icon" :class="{ 'active': sidebarCollapsed }">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
          </div>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-menu">
          <li>
            <router-link to="/" class="nav-link" exact @click="closeMobileMenu">
              <i class="nav-icon">📊</i>
              <span v-if="!(sidebarCollapsed || isTablet) || isMobile" class="nav-text">Thống kê & Báo cáo</span>
            </router-link>
          </li>
          <li>
            <router-link to="/products" class="nav-link" exact @click="closeMobileMenu">
              <i class="nav-icon">👟</i>
              <span v-if="!(sidebarCollapsed || isTablet) || isMobile" class="nav-text">Quản lý Sản phẩm</span>
            </router-link>
          </li>
          <li>
            <router-link to="/orders" class="nav-link" exact @click="closeMobileMenu">
              <i class="nav-icon">🧾</i>
              <span v-if="!(sidebarCollapsed || isTablet) || isMobile" class="nav-text">Quản lý Hóa đơn</span>
            </router-link>
          </li>
          <li>
            <router-link to="/customers" class="nav-link" exact @click="closeMobileMenu">
              <i class="nav-icon">👥</i>
              <span v-if="!(sidebarCollapsed || isTablet) || isMobile" class="nav-text">Quản lý Khách hàng</span>
            </router-link>
          </li>
          <li>
            <router-link to="/employees" class="nav-link" exact @click="closeMobileMenu">
              <i class="nav-icon">👨‍💼</i>
              <span v-if="!(sidebarCollapsed || isTablet) || isMobile" class="nav-text">Quản lý Nhân viên</span>
            </router-link>
          </li>
          <li>
            <router-link to="/discounts" class="nav-link" exact @click="closeMobileMenu">
              <i class="nav-icon">🏷️</i>
              <span v-if="!(sidebarCollapsed || isTablet) || isMobile" class="nav-text">Đợt giảm giá</span>
            </router-link>
          </li>
          <li>
            <router-link to="/coupons" class="nav-link" exact @click="closeMobileMenu">
              <i class="nav-icon">🎫</i>
              <span v-if="!(sidebarCollapsed || isTablet) || isMobile" class="nav-text">Phiếu giảm giá</span>
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
          <button class="mobile-menu-toggle" @click="toggleMobileMenu" v-if="isMobile">
            <div class="hamburger-icon" :class="{ 'active': mobileMenuOpen }">
              <span class="line"></span>
              <span class="line"></span>
              <span class="line"></span>
            </div>
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
const isTablet = ref(false)
const windowWidth = ref(0)

const displayName = computed(() => authStore.displayName)

// Dynamic responsive breakpoints
const checkResponsive = () => {
  windowWidth.value = window.innerWidth
  isMobile.value = window.innerWidth <= 768
  isTablet.value = window.innerWidth > 768 && window.innerWidth <= 1024

  // Auto-collapse sidebar for medium screens
  if (window.innerWidth <= 1024 && window.innerWidth > 768) {
    sidebarCollapsed.value = true
  } else if (window.innerWidth > 1024) {
    sidebarCollapsed.value = false
  }
}

// Computed class for dynamic sidebar sizing
const sidebarClass = computed(() => {
  const classes = ['sidebar']

  if (isMobile.value) {
    classes.push('sidebar-mobile')
    if (mobileMenuOpen.value) classes.push('sidebar-open')
  } else if (isTablet.value || sidebarCollapsed.value) {
    classes.push('sidebar-collapsed')
  }

  return classes.join(' ')
})

onMounted(() => {
  checkResponsive()
  window.addEventListener('resize', checkResponsive)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkResponsive)
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
  background: var(--surface);
  border-right: 1px solid var(--border);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

/* Dynamic responsive sidebar states */
.sidebar-collapsed {
  width: 70px;
  min-width: 70px;
}

.sidebar-mobile {
  position: fixed;
  left: -100%;
  top: 0;
  height: 100vh;
  z-index: 1000;
  width: 280px;
  transition: left 0.3s ease;
  box-shadow: var(--shadow-xl);
}

.sidebar-mobile.sidebar-open {
  left: 0;
}

.sidebar-collapsed .nav-link {
  padding: 0.875rem 0;
  margin: 0.25rem;
  justify-content: center;
  width: calc(100% - 0.5rem);
  border-radius: var(--radius-sm);
}

.sidebar-collapsed .nav-icon {
  margin: 0;
  font-size: 1.25rem;
}

.sidebar-collapsed .nav-text {
  display: none;
}

.sidebar-collapsed .logo-wrapper,
.sidebar-collapsed .logo-hidden {
  display: none;
}

.sidebar-collapsed .sidebar-header {
  padding: 1rem 0.5rem;
  justify-content: center;
}

.sidebar-collapsed .sidebar-toggle {
  margin: 0.5rem auto 0;
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
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 0.75rem;
  color: var(--gray-600);
  transition: all 0.2s ease;
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle:hover {
  background: var(--gray-100);
  transform: scale(1.05);
}

.sidebar-toggle:active {
  transform: scale(0.95);
}

/* Animated Hamburger Icon - "Oreos" Concept */
.hamburger-icon {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.hamburger-icon .line {
  height: 3px;
  background: var(--gray-600);
  border-radius: 6px;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
  position: relative;
}

.hamburger-icon .line:nth-child(1) {
  width: 100%;
}

.hamburger-icon .line:nth-child(2) {
  width: 100%;
}

.hamburger-icon .line:nth-child(3) {
  width: 100%;
}

/* Enhanced Sidebar Toggle Animation - "Stepped Lines" Concept */
.sidebar-toggle .hamburger-icon.active .line:nth-child(1) {
  transform: translateX(8px);
  width: 60%;
  background: var(--primary-600);
}

.sidebar-toggle .hamburger-icon.active .line:nth-child(2) {
  transform: translateX(4px);
  width: 80%;
  background: var(--primary-600);
}

.sidebar-toggle .hamburger-icon.active .line:nth-child(3) {
  transform: translateX(0px);
  width: 100%;
  background: var(--primary-600);
}

/* Enhanced Mobile Menu Toggle Animation - "Stepped Lines" Concept */
.mobile-menu-toggle .hamburger-icon.active .line:nth-child(1) {
  transform: translateX(8px);
  width: 60%;
  background: var(--primary-600);
}

.mobile-menu-toggle .hamburger-icon.active .line:nth-child(2) {
  transform: translateX(4px);
  width: 80%;
  background: var(--primary-600);
}

.mobile-menu-toggle .hamburger-icon.active .line:nth-child(3) {
  transform: translateX(0px);
  width: 100%;
  background: var(--primary-600);
}

/* Enhanced Hover Effects with Elegant Micro-interactions */
.sidebar-toggle:hover .hamburger-icon .line {
  background: var(--gray-700);
}

.sidebar-toggle:hover .hamburger-icon .line:nth-child(1) {
  transform: translateY(-1px);
  width: 95%;
}

.sidebar-toggle:hover .hamburger-icon .line:nth-child(2) {
  transform: scaleX(1.05);
}

.sidebar-toggle:hover .hamburger-icon .line:nth-child(3) {
  transform: translateY(1px);
  width: 95%;
}

.mobile-menu-toggle:hover .hamburger-icon .line {
  background: var(--gray-700);
}

.mobile-menu-toggle:hover .hamburger-icon .line:nth-child(1) {
  transform: translateY(-1px);
  width: 95%;
}

.mobile-menu-toggle:hover .hamburger-icon .line:nth-child(2) {
  transform: scaleX(1.05);
}

.mobile-menu-toggle:hover .hamburger-icon .line:nth-child(3) {
  transform: translateY(1px);
  width: 95%;
}

/* Active State Colors - Override hover transforms */
.sidebar-toggle .hamburger-icon.active .line {
  background: var(--primary-600) !important;
}

.mobile-menu-toggle .hamburger-icon.active .line {
  background: var(--primary-600) !important;
}

/* Specific active state transforms (higher specificity) - "Stepped Lines" Pattern */
.sidebar-toggle .hamburger-icon.active .line:nth-child(1) {
  transform: translateX(8px) !important;
  width: 60% !important;
  height: 3px !important;
  border-radius: 6px !important;
}

.sidebar-toggle .hamburger-icon.active .line:nth-child(2) {
  transform: translateX(4px) !important;
  width: 80% !important;
  height: 3px !important;
  border-radius: 6px !important;
}

.sidebar-toggle .hamburger-icon.active .line:nth-child(3) {
  transform: translateX(0px) !important;
  width: 100% !important;
  height: 3px !important;
  border-radius: 6px !important;
}

.mobile-menu-toggle .hamburger-icon.active .line:nth-child(1) {
  transform: translateX(8px) !important;
  width: 60% !important;
  height: 3px !important;
  border-radius: 6px !important;
}

.mobile-menu-toggle .hamburger-icon.active .line:nth-child(2) {
  transform: translateX(4px) !important;
  width: 80% !important;
  height: 3px !important;
  border-radius: 6px !important;
}

.mobile-menu-toggle .hamburger-icon.active .line:nth-child(3) {
  transform: translateX(0px) !important;
  width: 100% !important;
  height: 3px !important;
  border-radius: 6px !important;
}

/* Enhanced button states */
.sidebar-toggle:hover {
  background: var(--gray-100);
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-menu-toggle:hover {
  background: var(--gray-200);
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Focus States for Accessibility */
.sidebar-toggle:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

.mobile-menu-toggle:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
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
/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: margin-left 0.3s ease;
}

/* Dynamic main content margins based on sidebar state */
.admin-layout:has(.sidebar-collapsed:not(.sidebar-mobile)) .main-content {
  margin-left: 0;
}

.admin-layout:has(.sidebar-mobile) .main-content {
  margin-left: 0;
}

/* Fallback for browsers that don't support :has() */
@supports not selector(:has(*)) {
  .main-content {
    margin-left: 0;
  }
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

/* Mobile overlay styles */
@media (max-width: 768px) {
  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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

/* Tablet transition point - start collapsing sidebar but keep mobile menu hidden */
@media (max-width: 900px) {
  .sidebar {
    width: 70px;
    min-width: 70px;
  }

  .sidebar .nav-text {
    display: none;
  }

  .logo-wrapper {
    display: none;
  }

  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 40px;
    padding: 0.5rem 0;
  }

  .sidebar-header {
    padding: 0.5rem;
    justify-content: center;
    flex-direction: column;
    gap: 0.25rem;
  }

  .sidebar-toggle {
    position: static;
    margin: 0 auto;
    padding: 0.5rem;
    font-size: 16px;
  }

  /* Ensure proper spacing and alignment */
  .nav-link {
    justify-content: center;
    padding: 0.75rem 0.5rem;
    margin: 0.125rem 0.25rem;
    border-radius: 6px;
  }

  .nav-icon {
    margin: 0;
    font-size: 18px;
  }

  .main-content {
    margin-left: 70px;
  }
}

@media (max-width: 820px) {
  .sidebar {
    width: 64px;
    min-width: 64px;
  }

  .logo-wrapper {
    display: none;
  }

  .sidebar-header {
    padding: 0.5rem 0.25rem;
  }

  .nav-link {
    padding: 0.5rem 0.25rem;
    justify-content: center;
    margin: 0.125rem;
  }

  .nav-icon {
    font-size: 16px;
  }

  .main-content {
    margin-left: 64px;
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
    box-shadow: var(--shadow-xl);
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
    padding: 0.75rem;
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 0.75rem;
    cursor: pointer;
    color: var(--gray-600);
    transition: all 0.2s ease;
    width: 48px;
    height: 48px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .mobile-menu-toggle:hover {
    background: var(--gray-200);
    transform: scale(1.05);
  }

  .mobile-menu-toggle:active {
    transform: scale(0.95);
  }

  .page-content {
    padding: 1rem;
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
    padding: 0.5rem;
    width: 40px;
    height: 40px;
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