<!-- Layout quản trị (AdminLayout): chứa sidebar, header, breadcrumb, vùng nội dung và hệ thống thông báo.
     - Điều hướng: sidebar LUÔN MỞ khi truy cập admin site, có thể thu gọn/mở rộng theo tương tác người dùng.
     - Responsive: tự động đóng trên mobile, luôn mở trên desktop/tablet cho admin.
     - Thông báo: hiển thị số chưa đọc, dropdown, modal tất cả; sử dụng useNotifications để polling & lưu trữ.
     - Tối ưu hiệu năng: lazy-load logo, theo dõi kích thước cửa sổ, giảm log ở production. -->
<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside :class="sidebarClass">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-wrapper" :class="{ 'logo-hidden': !showLogo }" @click="navigateToDashboard">
            <GearUpLogo variant="small" />
          </div>
        </div>
        <button v-if="!isMobile" class="sidebar-toggle" @click="toggleSidebar">
          <div class="hamburger-icon" :class="{ active: !sidebarCollapsed }">
            <span class="line" />
            <span class="line" />
            <span class="line" />
          </div>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul class="nav-menu">
          <li>
            <router-link to="/admin/dashboard" class="nav-link" exact @click="closeMobileMenu">
              <img class="nav-icon" src="@/assets/dashboard.svg" alt="Dashboard" />
              <span v-if="showNavText" class="nav-text">Thống kê & Báo cáo</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/products" class="nav-link" exact @click="closeMobileMenu">
              <img class="nav-icon" src="@/assets/products.svg" alt="Products" />
              <span v-if="showNavText" class="nav-text">Quản lý Sản phẩm</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/product-variants" class="nav-link" exact @click="closeMobileMenu">
              <span class="nav-icon">🏷️</span>
              <span v-if="showNavText" class="nav-text">Biến thể Sản phẩm</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/attributes" class="nav-link" exact @click="closeMobileMenu">
              <span class="nav-icon">🔧</span>
              <span v-if="showNavText" class="nav-text">Thuộc tính Giày</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/warranties" class="nav-link" exact @click="closeMobileMenu">
              <span class="nav-icon">🛡️</span>
              <span v-if="showNavText" class="nav-text">Quản lý Bảo hành</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/orders" class="nav-link" exact @click="closeMobileMenu">
              <img class="nav-icon" src="@/assets/orders.png" alt="Orders" />
              <span v-if="showNavText" class="nav-text">Quản lý Hóa đơn</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/customers" class="nav-link" exact @click="closeMobileMenu">
              <img class="nav-icon" src="@/assets/customers.png" alt="Customers" />
              <span v-if="showNavText" class="nav-text">Quản lý Khách hàng</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/employees" class="nav-link" exact @click="closeMobileMenu">
              <img class="nav-icon" src="@/assets/employees.png" alt="Employees" />
              <span v-if="showNavText" class="nav-text">Quản lý Nhân viên</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/discounts" class="nav-link" exact @click="closeMobileMenu">
              <img class="nav-icon" src="@/assets/discounts.png" alt="Discounts" />
              <span v-if="showNavText" class="nav-text">Đợt giảm giá</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/coupons" class="nav-link" exact @click="closeMobileMenu">
              <img class="nav-icon" src="@/assets/coupons.png" alt="Coupons" />
              <span v-if="showNavText" class="nav-text">Phiếu giảm giá</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/inventory" class="nav-link" exact @click="closeMobileMenu">
              <span class="nav-icon">📦</span>
              <span v-if="showNavText" class="nav-text">Quản lý Tồn kho</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/analytics" class="nav-link" exact @click="closeMobileMenu">
              <span class="nav-icon">📈</span>
              <span v-if="showNavText" class="nav-text">Phân tích & Báo cáo</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Mobile/Tablet Overlay - only covers main content area -->
      <div
        class="mobile-overlay"
        :class="{ active: mobileMenuOpen || (isTablet && !sidebarCollapsed) }"
        @click="closeMenu"
      />

      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <button v-if="isMobile" class="mobile-menu-toggle" @click="toggleMobileMenu">
            <div class="hamburger-icon" :class="{ active: mobileMenuOpen }">
              <span class="line" />
              <span class="line" />
              <span class="line" />
            </div>
          </button>
          <div class="breadcrumb">
            <router-link to="/admin/dashboard" class="breadcrumb-link"> Trang chủ </router-link>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">{{ pageTitle }}</span>
          </div>
        </div>

        <div class="header-right">
          <div class="header-actions">
            <button class="notification-button" @click="toggleNotifications">
              <div class="bell-icon-container">
                <!-- Clean Bell Icon -->
                <svg
                  class="bell-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <!-- Notification count badge with dynamic animation -->
                <div
                  v-if="unreadNotifications > 0"
                  :key="unreadNotifications"
                  class="notification-count"
                  :class="{ updating: isCountUpdating }"
                >
                  {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
                </div>
              </div>
            </button>

            <!-- Notifications Dropdown -->
            <div v-if="showNotifications" class="notifications-dropdown" @click.stop>
              <div class="notifications-header">
                <h3>Thông báo</h3>
                <button v-if="unreadNotifications > 0" class="mark-all-read" @click="markAllAsRead">
                  Đánh dấu đã đọc
                </button>
              </div>

              <div class="notifications-list">
                <div v-if="notifications.length === 0" class="no-notifications">
                  <i class="empty-icon">📭</i>
                  <p>Không có thông báo mới</p>
                </div>

                <div v-else>
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="notification-item"
                    :class="{ unread: !notification.isRead }"
                    @click="markAsRead(notification.id)"
                  >
                    <div class="notification-icon">
                      {{ notification.icon }}
                    </div>
                    <div class="notification-content">
                      <div class="notification-title">
                        {{ notification.title }}
                      </div>
                      <div class="notification-message">
                        {{ notification.message }}
                      </div>
                      <div class="notification-time">
                        {{ formatTimeAgo(notification.timestamp) }}
                      </div>
                    </div>
                    <div v-if="!notification.isRead" class="unread-indicator" />
                  </div>
                </div>
              </div>

              <div class="notifications-footer">
                <button class="view-all-btn" @click="viewAllNotifications">Xem tất cả thông báo</button>
              </div>
            </div>

            <!-- Full Notifications Modal -->
            <teleport to="body">
              <div
                v-if="showAllNotificationsModal"
                class="modal-overlay"
                :class="{ 'modal-closing': isModalClosing }"
                @click="closeAllNotificationsModal"
              >
                <div class="notifications-modal" :class="{ 'modal-closing': isModalClosing }" @click.stop>
                  <div class="modal-header">
                    <div class="modal-title-section">
                      <h2 class="modal-title">
                        <i class="modal-icon">🔔</i>
                        Tất cả thông báo
                      </h2>
                      <span class="notifications-count">{{ notifications.length }} thông báo</span>
                    </div>
                    <div class="modal-actions">
                      <button v-if="unreadNotifications > 0" class="mark-all-read-modal" @click="markAllAsRead">
                        <i class="action-icon">✓</i>
                        Đánh dấu tất cả đã đọc
                      </button>
                      <button type="button" class="close-modal-btn" title="Đóng" @click="closeAllNotificationsModal">
                        <img class="close-icon" src="@/assets/close.png" alt="Close" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div class="modal-filters">
                    <div class="filter-tabs">
                      <button
                        v-for="filter in notificationFilters"
                        :key="filter.key"
                        class="filter-tab"
                        :class="{ active: selectedFilter === filter.key }"
                        @click="selectFilter(filter.key)"
                      >
                        <i class="tab-icon">{{ filter.icon }}</i>
                        {{ filter.label }}
                        <span
                          v-show="filterCounts[filter.key] > 0"
                          class="tab-badge"
                          :class="{
                            'badge-unread': getUnreadCountForFilter(filter.key) > 0,
                            'badge-read': getUnreadCountForFilter(filter.key) === 0 && filterCounts[filter.key] > 0
                          }"
                        >
                          {{ filterCounts[filter.key] }}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div class="modal-content">
                    <div v-if="filteredNotificationsModal.length === 0" class="empty-notifications">
                      <div class="empty-icon">📭</div>
                      <h3>Không có thông báo</h3>
                      <p>{{ getEmptyMessage() }}</p>
                    </div>

                    <div v-else class="notifications-grid">
                      <div
                        v-for="(notification, index) in filteredNotificationsModal"
                        :key="notification.id"
                        class="notification-card"
                        :class="{ unread: !notification.isRead }"
                        :style="{ 'animation-delay': `${index * 0.05}s` }"
                        @click="markAsRead(notification.id)"
                      >
                        <div class="card-header">
                          <div class="notification-type" :class="`type-${notification.type}`">
                            <i class="type-icon">{{ notification.icon }}</i>
                            <span class="type-label">{{ getTypeLabel(notification.type) }}</span>
                          </div>
                          <div class="notification-meta">
                            <span class="notification-time-full">{{ formatFullDate(notification.timestamp) }}</span>
                            <div v-if="!notification.isRead" class="unread-dot" />
                          </div>
                        </div>

                        <div class="card-body">
                          <h4 class="notification-title-full">
                            {{ notification.title }}
                          </h4>
                          <p class="notification-message-full">
                            {{ notification.message }}
                          </p>
                        </div>

                        <div class="card-footer">
                          <span class="time-ago">{{ formatTimeAgo(notification.timestamp) }}</span>
                          <button
                            v-if="!notification.isRead"
                            class="mark-read-btn"
                            @click.stop="markAsRead(notification.id)"
                          >
                            <i class="check-icon">✓</i>
                            Đánh dấu đã đọc
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </teleport>

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
import { ref, computed, onMounted, onUnmounted, watch, nextTick, defineAsyncComponent, shallowRef, markRaw } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Lazy load components for better performance
const GearUpLogo = defineAsyncComponent({
  loader: () => import('@/components/ui/GearUpLogo.vue'),
  delay: 200,
  timeout: 3000,
  loadingComponent: { template: '<div class="logo-skeleton"></div>' }
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const sidebarCollapsed = ref(false) // Always start expanded for admin site
const userToggledSidebar = ref(false) // Track if user manually toggled sidebar
const mobileMenuOpen = ref(false)
const isMobile = ref(false)
const isTablet = ref(false)
const windowWidth = ref(0)

// Load user's sidebar preference from localStorage - but always start expanded
const loadSidebarPreference = () => {
  try {
    // Always start with sidebar expanded on admin site access
    sidebarCollapsed.value = false

    // Load user toggle preference for maintaining state during session
    const savedUserToggled = localStorage.getItem('gearup-sidebar-user-toggled')
    if (savedUserToggled !== null) {
      userToggledSidebar.value = JSON.parse(savedUserToggled)

      // Only apply saved collapsed state if user has manually toggled before
      // and we're on desktop (not mobile/tablet)
      if (userToggledSidebar.value && window.innerWidth > 1024) {
        const savedCollapsed = localStorage.getItem('gearup-sidebar-collapsed')
        if (savedCollapsed !== null) {
          sidebarCollapsed.value = JSON.parse(savedCollapsed)
        }
      }
    }

    console.log('📋 Sidebar initialized:', {
      collapsed: sidebarCollapsed.value,
      userToggled: userToggledSidebar.value,
      screenWidth: window.innerWidth
    })
  } catch (error) {
    console.warn('Failed to load sidebar preferences:', error)
    sidebarCollapsed.value = false // Fallback to expanded
  }
}

// Save user's sidebar preference to localStorage
const saveSidebarPreference = () => {
  try {
    localStorage.setItem('gearup-sidebar-collapsed', JSON.stringify(sidebarCollapsed.value))
    localStorage.setItem('gearup-sidebar-user-toggled', JSON.stringify(userToggledSidebar.value))
  } catch (error) {
    console.warn('Failed to save sidebar preferences:', error)
  }
}

// Reset sidebar to default state (always open for admin site)
const resetSidebarToDefault = () => {
  try {
    localStorage.removeItem('gearup-sidebar-collapsed')
    localStorage.removeItem('gearup-sidebar-user-toggled')
    sidebarCollapsed.value = false // Admin default - always expanded
    userToggledSidebar.value = false
    console.log('✅ Sidebar reset to admin default (always open)')
  } catch (error) {
    console.warn('Failed to reset sidebar preferences:', error)
  }
}

// Make reset function available globally for testing
if (import.meta.env.DEV) {
  window.resetSidebar = resetSidebarToDefault
}

// Force sidebar open for admin site access
const forceAdminSidebarOpen = () => {
  if (!isMobile.value && sidebarCollapsed.value) {
    console.log('🔓 Forcing sidebar open for admin site access')
    sidebarCollapsed.value = false
    // Don't save this as user preference since it's automatic
  }
}

// Notifications
const {
  notifications,
  unreadCount,
  startPolling,
  markAsRead: markAsReadComposable,
  markAllAsRead: markAllAsReadComposable
} = useNotifications()
const showNotifications = ref(false)
const showAllNotificationsModal = ref(false)
const isModalClosing = ref(false)
const selectedFilter = ref('all')
const isCountUpdating = ref(false)
const previousUnreadCount = ref(0)

// Filters
const notificationFilters = markRaw([
  { key: 'all', label: 'Tất cả', icon: '📋' },
  { key: 'unread', label: 'Chưa đọc', icon: '🔴' },
  { key: 'order', label: 'Đơn hàng', icon: '🛒' },
  { key: 'inventory', label: 'Kho hàng', icon: '⚠️' },
  { key: 'review', label: 'Đánh giá', icon: '⭐' },
  { key: 'customer', label: 'Khách hàng', icon: '👤' },
  { key: 'report', label: 'Báo cáo', icon: '📊' }
])

const displayName = computed(() => authStore.displayName)

const sidebarClass = computed(() => {
  const classes = ['sidebar']

  if (isMobile.value) {
    classes.push('sidebar-mobile')
    if (mobileMenuOpen.value) {
      classes.push('sidebar-open')
    }
  } else if (isTablet.value) {
    // On tablet, use mobile-like behavior when expanded
    if (sidebarCollapsed.value) {
      classes.push('sidebar-collapsed')
    } else {
      classes.push('sidebar-tablet-expanded')
    }
  } else if (sidebarCollapsed.value) {
    classes.push('sidebar-collapsed')
  }

  return classes.join(' ')
})

// Computed property for navigation text visibility
const showNavText = computed(() => {
  // Always show text on mobile when sidebar is open
  if (isMobile.value) {
    return true
  }

  // On tablet, show text only if sidebar is expanded (not collapsed)
  if (isTablet.value) {
    return !sidebarCollapsed.value
  }

  // On desktop, show text only if sidebar is not collapsed
  return !sidebarCollapsed.value
})

// Computed property for logo visibility
const showLogo = computed(() => {
  // Always show logo on mobile
  if (isMobile.value) {
    return true
  }

  // On tablet, show logo only if sidebar is expanded (not collapsed)
  if (isTablet.value) {
    return !sidebarCollapsed.value
  }

  // On desktop, show logo only if sidebar is not collapsed
  return !sidebarCollapsed.value
})

const unreadNotifications = computed(() => unreadCount.value)

// Optimized with early return and reduced iterations
const filteredNotificationsModal = computed(() => {
  const notifs = notifications.value

  // Early return for 'all' filter to avoid unnecessary filtering
  if (selectedFilter.value === 'all') {
    return [...notifs].sort((a, b) => b.timestamp - a.timestamp)
  }

  let filtered
  if (selectedFilter.value === 'unread') {
    filtered = notifs.filter(n => !n.isRead)
  } else {
    // For type filters
    filtered = notifs.filter(n => n.type === selectedFilter.value)
  }

  return filtered.sort((a, b) => b.timestamp - a.timestamp)
})

// Store previous width to detect significant changes
const previousWidth = ref(window.innerWidth)
const isInitialLoad = ref(true) // Track if this is the first load

// Debounced resize handler for better performance
let resizeTimeout = null
const debouncedCheckResponsive = () => {
  if (resizeTimeout) clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(checkResponsive, 150) // 150ms debounce
}

// Optimized responsive breakpoints with performance considerations
const checkResponsive = () => {
  const currentWidth = window.innerWidth
  const widthDifference = Math.abs(currentWidth - previousWidth.value)

  // Update reactive values
  windowWidth.value = currentWidth
  isMobile.value = currentWidth <= 768
  isTablet.value = currentWidth > 768 && currentWidth <= 1024

  // Performance: Only log in development
  if (import.meta.env.DEV) {
    console.log('📐 Window resized:', {
      newWidth: currentWidth,
      isMobile: isMobile.value,
      isTablet: isTablet.value
    })
  }

  // On initial load, set reasonable defaults - always start with sidebar open on desktop
  if (isInitialLoad.value) {
    if (currentWidth <= 768) {
      // Mobile: sidebar should be closed (mobile overlay pattern)
      sidebarCollapsed.value = true // Mobile uses overlay, keep collapsed
      mobileMenuOpen.value = false
    } else if (currentWidth <= 1024) {
      // Tablet: start expanded but can be collapsed
      sidebarCollapsed.value = false // Start expanded on tablet
    } else {
      // Desktop: always start expanded for admin site
      sidebarCollapsed.value = false // Always start expanded on desktop
    }

    console.log('🚀 Initial admin sidebar state:', {
      width: currentWidth,
      collapsed: sidebarCollapsed.value,
      isMobile: isMobile.value,
      isTablet: isTablet.value
    })

    isInitialLoad.value = false
    previousWidth.value = currentWidth
    return
  }

  // Only reset sidebar state for significant width changes (not DevTools toggle)
  // This prevents DevTools from interfering with user interactions
  if (widthDifference > 100) {
    // Auto-collapse sidebar for tablet screens only if user hasn't manually toggled
    if (currentWidth <= 1024 && currentWidth > 768) {
      // Only auto-collapse if user hasn't manually expanded it
      if (!userToggledSidebar.value) {
        sidebarCollapsed.value = true
      }
    } else if (currentWidth > 1024) {
      // On desktop, default to collapsed unless user has toggled
      if (!userToggledSidebar.value) {
        sidebarCollapsed.value = true
      }
      // Don't reset user toggle state anymore - let user preference persist
    }

    // Update previous width only for significant changes
    previousWidth.value = currentWidth
  }

  // Always ensure mobile menu is closed when switching to desktop
  if (currentWidth > 768) {
    mobileMenuOpen.value = false
  }

  // Debug logging (only when not initial load)
  console.log('Responsive check:', {
    width: currentWidth,
    previousWidth: previousWidth.value,
    widthDifference: Math.abs(currentWidth - previousWidth.value),
    significantChange: Math.abs(currentWidth - previousWidth.value) > 100,
    isMobile: isMobile.value,
    isTablet: isTablet.value,
    sidebarCollapsed: sidebarCollapsed.value,
    userToggledSidebar: userToggledSidebar.value,
    mobileMenuOpen: mobileMenuOpen.value,
    isInitialLoad: isInitialLoad.value
  })
}

onMounted(() => {
  // Load user preferences first (but always start expanded for admin site)
  loadSidebarPreference()

  // Force sidebar open for admin site access
  forceAdminSidebarOpen()

  // Then check responsive layout
  checkResponsive()

  // Use debounced resize handler for better performance
  window.addEventListener('resize', debouncedCheckResponsive, { passive: true })
  document.addEventListener('click', handleClickOutside, { passive: true })

  // Notifications polling
  startPolling()
  previousUnreadCount.value = unreadNotifications.value

  console.log('🎯 AdminLayout mounted - sidebar always starts open for admin site')

  // Development utilities
  if (import.meta.env.DEV) {
    // Expose functions for debugging
    window.toggleSidebar = toggleSidebar
    window.checkResponsive = checkResponsive
    window.resetSidebar = () => {
      localStorage.removeItem('sidebar-collapsed')
      forceAdminSidebarOpen()
      console.log('🔄 Sidebar reset to always open for admin site')
    }
  }
})

onUnmounted(() => {
  // Clean up timers
  if (resizeTimeout) clearTimeout(resizeTimeout)

  // Remove event listeners
  window.removeEventListener('resize', debouncedCheckResponsive)
  document.removeEventListener('click', handleClickOutside)
})

// Optimized watchers with better performance
watch(
  unreadNotifications,
  (newCount, oldCount) => {
    if (newCount !== oldCount && oldCount !== undefined) {
      // Trigger update animation
      isCountUpdating.value = true

      // Reset animation class after animation completes
      setTimeout(() => {
        isCountUpdating.value = false
      }, 600)
    }

    previousUnreadCount.value = newCount
  },
  { immediate: false }
)

// Simplified notification watcher - only in development
if (import.meta.env.DEV) {
  watch(
    notifications,
    () => {
      console.log('Notifications changed, filter counts will update automatically')
    },
    { deep: true }
  )

  watch(selectedFilter, newFilter => {
    console.log('Filter changed to:', newFilter)
  })
}

// Watch for route changes to ensure sidebar is always open for admin routes
watch(
  route,
  newRoute => {
    // If navigating to any admin route, ensure sidebar is open (except mobile)
    if (newRoute.path.startsWith('/admin') && !isMobile.value) {
      if (sidebarCollapsed.value) {
        console.log('🔄 Auto-opening sidebar for admin route:', newRoute.path)
        sidebarCollapsed.value = false
      }
    }
  },
  { immediate: true }
)

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

  // Track that user manually toggled the sidebar
  if (isTablet.value) {
    userToggledSidebar.value = true
  }

  // Save user preferences
  saveSidebarPreference()

  console.log('Sidebar toggled:', {
    collapsed: sidebarCollapsed.value,
    userToggled: userToggledSidebar.value,
    isTablet: isTablet.value
  })
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const closeMenu = () => {
  if (isMobile.value) {
    mobileMenuOpen.value = false
  } else if (isTablet.value && !sidebarCollapsed.value) {
    sidebarCollapsed.value = true
    userToggledSidebar.value = true // Keep user preference when closing via overlay
    saveSidebarPreference() // Save the preference
  }
}

const logout = () => {
  authStore.logout()
  router.push('/admin/login')
}

const navigateToDashboard = () => {
  router.push('/admin/dashboard')
}

// Notification functions
const toggleNotifications = () => {
  console.log('Toggle notifications clicked, current state:', showNotifications.value)
  showNotifications.value = !showNotifications.value
  console.log('New state:', showNotifications.value)
}

const markAsRead = async notificationId => {
  markAsReadComposable(notificationId)
}

const markAllAsRead = async () => {
  markAllAsReadComposable()
}

const viewAllNotifications = () => {
  showNotifications.value = false
  showAllNotificationsModal.value = true
}

const closeAllNotificationsModal = () => {
  isModalClosing.value = true

  // Wait for the closing animation to complete before hiding the modal
  setTimeout(() => {
    showAllNotificationsModal.value = false
    isModalClosing.value = false
    selectedFilter.value = 'all'
  }, 400) // 400ms matches the animation duration
}

const selectFilter = filterKey => {
  selectedFilter.value = filterKey

  // Performance: Only add debug logging in development
  if (import.meta.env.DEV) {
    console.log('� Selecting filter:', filterKey)
    console.log('💾 Filter count:', filterCounts.value[filterKey])
  }
}

// Create reactive computed properties for filter counts
const filterCounts = computed(() => {
  const counts = {
    all: notifications.value.length,
    unread: notifications.value.filter(n => !n.isRead).length,
    order: notifications.value.filter(n => n.type === 'order').length,
    inventory: notifications.value.filter(n => n.type === 'inventory').length,
    review: notifications.value.filter(n => n.type === 'review').length,
    customer: notifications.value.filter(n => n.type === 'customer').length,
    report: notifications.value.filter(n => n.type === 'report').length
  }

  console.log('Filter counts updated:', counts)
  return counts
})

const getFilterCount = filterKey => {
  return filterCounts.value[filterKey] || 0
}

const getUnreadCountForFilter = filterKey => {
  switch (filterKey) {
    case 'all':
      return notifications.value.filter(n => !n.isRead).length
    case 'unread':
      return notifications.value.filter(n => !n.isRead).length
    default:
      // For specific types, count unread notifications of that type
      return notifications.value.filter(n => n.type === filterKey && !n.isRead).length
  }
}

const getEmptyMessage = () => {
  switch (selectedFilter.value) {
    case 'unread':
      return 'Tất cả thông báo đã được đọc'
    case 'order':
      return 'Không có thông báo đơn hàng nào'
    case 'inventory':
      return 'Không có thông báo kho hàng nào'
    case 'review':
      return 'Không có thông báo đánh giá nào'
    case 'customer':
      return 'Không có thông báo khách hàng nào'
    case 'report':
      return 'Không có thông báo báo cáo nào'
    default:
      return 'Không có thông báo nào'
  }
}

const getTypeLabel = type => {
  const typeLabels = {
    order: 'Đơn hàng',
    inventory: 'Kho hàng',
    review: 'Đánh giá',
    customer: 'Khách hàng',
    report: 'Báo cáo'
  }
  return typeLabels[type] || type
}

const formatFullDate = timestamp => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp))
}

const formatTimeAgo = timestamp => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}

// Close notifications when clicking outside
const handleClickOutside = event => {
  if (
    showNotifications.value &&
    !event.target.closest('.notification-button') &&
    !event.target.closest('.notifications-dropdown')
  ) {
    showNotifications.value = false
  }
  if (showAllNotificationsModal.value && !event.target.closest('.notifications-modal')) {
    closeAllNotificationsModal()
  }
}
</script>

<style scoped>
/* Performance optimizations */
.admin-layout {
  display: flex;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: var(--gray-50);
  /* Performance: Enable hardware acceleration */
  transform: translate3d(0, 0, 0);
  will-change: auto;
}

/* Performance: Add contain property for better rendering */
.sidebar {
  width: 280px;
  min-width: 280px;
  max-width: 320px;
  height: 100vh;
  background: var(--surface);
  border-right: 1px solid var(--border);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  contain: layout style paint;
  transform: translate3d(0, 0, 0);
}

/* Logo loading skeleton */
.logo-skeleton {
  width: 120px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading-shimmer 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading-shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
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
  cursor: pointer;
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
}

.logo-wrapper:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
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
  transform: scale(1);
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

.nav-link:hover .nav-icon {
  filter: brightness(0) saturate(100%) invert(18%) sepia(85%) saturate(2736%) hue-rotate(177deg) brightness(91%)
    contrast(96%);
}

.nav-link.router-link-exact-active {
  background: var(--primary-100);
  color: var(--primary-700);
  border-left: 4px solid var(--primary-500);
  margin-left: 0.5rem;
  border-radius: 0 8px 8px 0;
}

.nav-icon {
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
  object-fit: contain;
  transition: all 0.3s ease;
}

.nav-link:hover .nav-icon {
  filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6));
  transform: scale(1.1);
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
  height: 100vh;
  overflow: hidden;
  position: relative;
  /* For overlay positioning */
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
  position: relative;
}

/* Modern Notification Button */
.notification-button {
  position: relative;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.notification-button:hover {
  background: rgba(255, 255, 255, 1);
  border-color: var(--primary-300);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.notification-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.bell-icon-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.bell-icon {
  width: 20px;
  height: 20px;
  color: var(--gray-600);
  transition: all 0.2s ease;
}

.notification-button:hover .bell-icon {
  color: var(--primary-600);
  transform: scale(1.05);
}

.notification-count {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  z-index: 1;
  animation:
    badgeEntrance 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55),
    badgePulse 2s infinite 1s;
  transform-origin: center;
}

/* Enhanced badge entrance animation */
@keyframes badgeEntrance {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
    box-shadow: 0 0 0 rgba(239, 68, 68, 0);
  }
  50% {
    opacity: 1;
    transform: scale(1.3) rotate(-90deg);
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.6);
  }
  70% {
    transform: scale(0.9) rotate(-30deg);
  }
  85% {
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }
}

/* Continuous pulse animation */
@keyframes badgePulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5);
  }
}

/* Special animation for count updates */
.notification-count.updating {
  animation: badgeUpdate 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes badgeUpdate {
  0% {
    transform: scale(1);
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }
  25% {
    transform: scale(1.4) rotate(15deg);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    box-shadow: 0 6px 24px rgba(245, 158, 11, 0.6);
  }
  50% {
    transform: scale(0.8) rotate(-10deg);
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.5);
  }
  75% {
    transform: scale(1.2) rotate(5deg);
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }
  100% {
    transform: scale(1) rotate(0deg);
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  }
}

/* Hover effect for notification button affects badge */
.notification-button:hover .notification-count {
  animation-play-state: paused;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.5);
}

.notification-button:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Notifications Dropdown */
.notifications-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 380px;
  max-width: 90vw;
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownFadeIn 0.3s ease-out;
}

@keyframes dropdownFadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.notifications-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gray-50);
}

.notifications-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-900);
}

.mark-all-read {
  background: none;
  border: none;
  color: var(--primary-600);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.mark-all-read:hover {
  background: var(--primary-50);
  color: var(--primary-700);
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-notifications {
  padding: 2rem;
  text-align: center;
  color: var(--gray-500);
}

.no-notifications .empty-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.no-notifications p {
  margin: 0;
  font-size: 0.875rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background: var(--gray-50);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.unread {
  background: var(--primary-25);
  border-left: 3px solid var(--primary-500);
}

.notification-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border-radius: 50%;
}

.notification-item.unread .notification-icon {
  background: var(--primary-100);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  color: var(--gray-900);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  line-height: 1.3;
}

.notification-message {
  color: var(--gray-600);
  font-size: 0.8125rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-time {
  color: var(--gray-500);
  font-size: 0.75rem;
  font-weight: 500;
}

.unread-indicator {
  width: 8px;
  height: 8px;
  background: var(--primary-500);
  border-radius: 50%;
  flex-shrink: 0;
  margin-left: 0.5rem;
  margin-top: 0.25rem;
}

.notifications-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid var(--border);
  background: var(--gray-50);
}

.view-all-btn {
  width: 100%;
  background: none;
  border: 1px solid var(--primary-500);
  color: var(--primary-600);
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: var(--primary-500);
  color: white;
}

/* Full Notifications Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(4px);
  animation: modalOverlayFadeIn 0.3s ease-out;
}

/* Reset any global button styles in modal */
.notifications-modal button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  text-transform: none;
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
  overflow: visible;
  cursor: pointer;
}

/* Override the reset for specific styled buttons */
.notifications-modal .mark-all-read-modal {
  background: var(--primary-500) !important;
  color: white !important;
  border: 2px solid var(--primary-500) !important;
  padding: 0.5rem 1rem !important;
}

.notifications-modal .close-modal-btn {
  background: white !important;
  border: 2px solid var(--gray-300) !important;
  padding: 0 !important;
}

.notifications-modal button:focus {
  outline: 0;
}

@keyframes modalOverlayFadeIn {
  0% {
    opacity: 0;
    backdrop-filter: blur(0px);
  }

  100% {
    opacity: 1;
    backdrop-filter: blur(4px);
  }
}

.notifications-modal {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Closing Animations */
.modal-overlay.modal-closing {
  animation: modalOverlayFadeOut 0.4s ease-in forwards !important;
}

@keyframes modalOverlayFadeOut {
  0% {
    opacity: 1;
    backdrop-filter: blur(4px);
  }

  100% {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
}

.notifications-modal.modal-closing {
  animation: modalSlideOut 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards !important;
}

@keyframes modalSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }

  50% {
    opacity: 0.6;
    transform: translateY(-30px) scale(0.98) rotate(-2deg);
  }

  100% {
    opacity: 0;
    transform: translateY(-80px) scale(0.8) rotate(-10deg);
  }
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
}

.modal-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.modal-icon {
  font-size: 1.75rem;
  color: var(--primary-600);
}

.notifications-count {
  font-size: 0.875rem;
  color: var(--gray-600);
  font-weight: 500;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mark-all-read-modal {
  background: var(--primary-500) !important;
  color: white !important;
  border: 2px solid var(--primary-500) !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.5rem !important;
  font-size: 0.875rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  transition: all 0.2s ease !important;
}

.mark-all-read-modal:hover {
  background: var(--primary-600) !important;
  color: white !important;
  border-color: var(--primary-600) !important;
  transform: translateY(-1px) !important;
}

.action-icon {
  font-size: 1rem;
}

.close-modal-btn {
  background: white !important;
  border: 2px solid var(--gray-300) !important;
  width: 2.5rem !important;
  height: 2.5rem !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  color: var(--gray-700) !important;
  padding: 0 !important;
  margin: 0 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  font-family: inherit !important;
  font-size: inherit !important;
  line-height: 1 !important;
  position: relative !important;
  overflow: hidden !important;
  animation: closeButtonEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

/* Entrance animation for close button */
@keyframes closeButtonEntrance {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.2) rotate(-90deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* Ripple effect animation */
.close-modal-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  pointer-events: none;
}

.close-modal-btn:hover {
  background: var(--red-50) !important;
  color: var(--red-600) !important;
  border-color: var(--red-300) !important;
  transform: scale(1.15) rotate(90deg) !important;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.2) !important;
  animation: closeButtonPulse 1.5s infinite ease-in-out !important;
}

/* Pulse animation on hover */
@keyframes closeButtonPulse {
  0%,
  100% {
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.2),
      0 0 0 0 rgba(156, 163, 175, 0.4);
  }

  50% {
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.2),
      0 0 0 8px rgba(156, 163, 175, 0);
  }
}

/* Ripple effect on hover */
.close-modal-btn:hover::before {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
}

.close-modal-btn:active {
  transform: scale(0.9) rotate(180deg) !important;
  transition: all 0.1s ease !important;
  animation: closeButtonShake 0.3s ease-in-out !important;
}

/* Shake animation on click */
@keyframes closeButtonShake {
  0%,
  100% {
    transform: scale(0.9) rotate(180deg) translateX(0);
  }

  25% {
    transform: scale(0.9) rotate(180deg) translateX(-2px);
  }

  75% {
    transform: scale(0.9) rotate(180deg) translateX(2px);
  }
}

.close-modal-btn:focus {
  outline: 2px solid var(--primary-500) !important;
  outline-offset: 2px !important;
  animation: closeButtonFocusPulse 1s infinite ease-in-out !important;
}

/* Focus pulse animation */
@keyframes closeButtonFocusPulse {
  0%,
  100% {
    outline-color: var(--primary-500);
    outline-width: 2px;
  }

  50% {
    outline-color: var(--primary-400);
    outline-width: 3px;
  }
}

.close-icon {
  width: 16px !important;
  height: 16px !important;
  object-fit: contain !important;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
  transform-origin: center !important;
  filter: brightness(0.4) !important; /* Make the black icon darker gray */
}

/* Icon rotation animation on hover */
.close-modal-btn:hover .close-icon {
  transform: rotate(90deg) scale(1.1) !important;
  filter: brightness(0) saturate(100%) invert(27%) sepia(91%) saturate(2870%) hue-rotate(346deg) brightness(91%)
    contrast(94%) !important; /* Red color filter */
}

/* Icon animation on active */
.close-modal-btn:active .close-icon {
  transform: rotate(180deg) scale(0.8) !important;
  filter: brightness(0) saturate(100%) invert(9%) sepia(100%) saturate(7093%) hue-rotate(352deg) brightness(86%)
    contrast(118%) !important; /* Darker red color filter */
}

/* Special closing animation for the close button when modal is closing */
.modal-closing .close-modal-btn {
  animation: closeButtonExit 0.4s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards !important;
}

@keyframes closeButtonExit {
  0% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }

  25% {
    opacity: 0.8;
    transform: scale(1.3) rotate(90deg);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.1) rotate(180deg);
  }

  75% {
    opacity: 0.2;
    transform: scale(0.8) rotate(270deg);
  }

  100% {
    opacity: 0;
    transform: scale(0) rotate(360deg);
  }
}

.modal-closing .close-modal-btn .close-icon {
  animation: closeIconSpinOut 0.4s ease-in forwards !important;
}

@keyframes closeIconSpinOut {
  0% {
    opacity: 1;
    transform: rotate(0deg) scale(1);
    filter: brightness(0.4);
  }

  50% {
    opacity: 0.7;
    transform: rotate(180deg) scale(1.2);
    filter: brightness(0) saturate(100%) invert(27%) sepia(91%) saturate(2870%) hue-rotate(346deg) brightness(91%)
      contrast(94%);
  }

  100% {
    opacity: 0;
    transform: rotate(360deg) scale(0);
    filter: brightness(0) saturate(100%) invert(9%) sepia(100%) saturate(7093%) hue-rotate(352deg) brightness(86%)
      contrast(118%);
  }
}

.modal-filters {
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border);
  background: var(--gray-25);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.notifications-modal .filter-tab {
  background: white;
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem !important;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  color: var(--gray-700);
  position: relative;
  min-height: 40px;
  box-sizing: border-box !important;
  white-space: nowrap;
  /* Performance: Use transform3d for GPU acceleration */
  transform: translate3d(0, 0, 0);
  will-change: transform, background-color;
}

.notifications-modal .filter-tab:hover {
  background: var(--gray-50) !important;
  border-color: var(--primary-300);
  transform: translate3d(0, -1px, 0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Active state - higher specificity and distinct styling */
.notifications-modal .filter-tab.active {
  background: var(--primary-500) !important;
  border-color: var(--primary-500) !important;
  color: white !important;
  transform: translate3d(0, -1px, 0) !important;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3) !important;
}

/* Active tab hover state - slightly different from regular active */
.notifications-modal .filter-tab.active:hover {
  background: var(--primary-600) !important;
  border-color: var(--primary-600) !important;
  transform: translate3d(0, -2px, 0) !important;
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4) !important;
}

.tab-icon {
  font-size: 1rem;
}

.tab-badge {
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 0.75rem;
  min-width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* Badge colors based on read status */
.tab-badge.badge-unread {
  background: var(--error);
  color: white;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
}

.tab-badge.badge-read {
  background: var(--gray-400);
  color: white;
  box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.2);
}

/* Active tab badges - higher specificity */
.notifications-modal .filter-tab.active .tab-badge.badge-unread {
  background: rgba(239, 68, 68, 0.9) !important;
  color: white !important;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3) !important;
}

.notifications-modal .filter-tab.active .tab-badge.badge-read {
  background: rgba(156, 163, 175, 0.8) !important;
  color: white !important;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3) !important;
}

/* Hover effects for badges - regular tabs */
.notifications-modal .filter-tab:not(.active):hover .tab-badge.badge-unread {
  background: var(--error) !important;
  transform: scale(1.05);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
}

.notifications-modal .filter-tab:not(.active):hover .tab-badge.badge-read {
  background: var(--gray-500) !important;
  transform: scale(1.05);
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.3);
}

/* Hover effects for badges - active tabs */
.notifications-modal .filter-tab.active:hover .tab-badge.badge-unread {
  background: rgba(239, 68, 68, 1) !important;
  transform: scale(1.05);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4) !important;
}

.notifications-modal .filter-tab.active:hover .tab-badge.badge-read {
  background: rgba(156, 163, 175, 0.9) !important;
  transform: scale(1.05);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4) !important;
}

/* Closing animations for filter tabs */
.modal-closing .filter-tab {
  animation: filterTabFadeOut 0.2s ease-in forwards !important;
}

.modal-closing .filter-tab:nth-child(1) {
  animation-delay: 0ms !important;
}

.modal-closing .filter-tab:nth-child(2) {
  animation-delay: 30ms !important;
}

.modal-closing .filter-tab:nth-child(3) {
  animation-delay: 60ms !important;
}

.modal-closing .filter-tab:nth-child(4) {
  animation-delay: 90ms !important;
}

.modal-closing .filter-tab:nth-child(5) {
  animation-delay: 120ms !important;
}

.modal-closing .filter-tab:nth-child(n + 6) {
  animation-delay: 150ms !important;
}

@keyframes filterTabFadeOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  50% {
    opacity: 0.5;
    transform: translateY(-5px) scale(0.95);
  }

  100% {
    opacity: 0;
    transform: translateY(-15px) scale(0.8);
  }
}

.modal-content {
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.empty-notifications {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--gray-500);
}

.empty-notifications .empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.empty-notifications h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--gray-700);
}

.empty-notifications p {
  margin: 0;
  font-size: 1rem;
}

.notifications-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

.notification-card {
  background: white;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: cardSlideIn 0.5s ease-out both;
}

@keyframes cardSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Closing animation for notification cards */
.modal-closing .notification-card {
  animation: cardSlideOut 0.3s ease-in forwards !important;
}

/* Staggered closing animation delays */
.modal-closing .notification-card:nth-child(1) {
  animation-delay: 0ms !important;
}

.modal-closing .notification-card:nth-child(2) {
  animation-delay: 50ms !important;
}

.modal-closing .notification-card:nth-child(3) {
  animation-delay: 100ms !important;
}

.modal-closing .notification-card:nth-child(4) {
  animation-delay: 150ms !important;
}

.modal-closing .notification-card:nth-child(5) {
  animation-delay: 200ms !important;
}

.modal-closing .notification-card:nth-child(n + 6) {
  animation-delay: 250ms !important;
}

@keyframes cardSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateY(0deg);
  }

  50% {
    opacity: 0.5;
    transform: translateY(-10px) scale(0.95) rotateY(15deg);
  }

  100% {
    opacity: 0;
    transform: translateY(-30px) scale(0.8) rotateY(45deg);
  }
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-200);
}

.notification-card.unread {
  border-left: 4px solid var(--primary-500);
  background: linear-gradient(135deg, var(--primary-25) 0%, white 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.notification-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-order {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.type-inventory {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.type-review {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.type-customer {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.type-report {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
}

.type-icon {
  font-size: 0.875rem;
}

.type-label {
  font-size: 0.6875rem;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notification-time-full {
  font-size: 0.75rem;
  color: var(--gray-500);
  font-weight: 500;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: var(--primary-500);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.card-body {
  margin-bottom: 1rem;
}

.notification-title-full {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  line-height: 1.4;
}

.notification-message-full {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--gray-600);
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.time-ago {
  font-size: 0.8125rem;
  color: var(--gray-500);
  font-weight: 500;
}

.mark-read-btn {
  background: var(--primary-100);
  color: var(--primary-700);
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
}

.mark-read-btn:hover {
  background: var(--primary-200);
  transform: translateY(-1px);
}

.check-icon {
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }

  .notifications-modal {
    max-width: 100%;
    max-height: 95vh;
  }

  .modal-header {
    padding: 1rem 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-actions {
    width: 100%;
    justify-content: space-between;
  }

  .modal-filters {
    padding: 1rem 1.5rem;
  }

  .filter-tabs {
    overflow-x: auto;
    padding-bottom: 0.5rem;
    scrollbar-width: thin;
    scrollbar-color: var(--gray-300) transparent;
  }

  .filter-tabs::-webkit-scrollbar {
    height: 4px;
  }

  .filter-tabs::-webkit-scrollbar-track {
    background: transparent;
  }

  .filter-tabs::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: 2px;
  }

  .filter-tab {
    white-space: nowrap;
    flex-shrink: 0;
  }

  .modal-content {
    padding: 1rem 1.5rem;
    max-height: 50vh;
  }

  .notification-card {
    padding: 1rem;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .notification-meta {
    width: 100%;
    justify-content: space-between;
  }

  .notification-title-full {
    font-size: 1rem;
  }

  .notification-message-full {
    font-size: 0.875rem;
  }
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
  height: calc(100vh - 80px); /* Subtract header height */
  max-height: calc(100vh - 80px);
}

.content-area {
  /* Removed min-height to prevent infinite scrolling */
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .page-content {
    padding: 1.5rem;
  }

  .content-area {
    padding: 0;
  }

  .top-header {
    padding: 1rem 1.5rem;
  }
}

/* Mobile/Tablet overlay styles */
@media (max-width: 1024px) {
  .mobile-overlay {
    position: absolute;
    /* Relative to main-content */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 500;
    /* Lower than sidebar z-index */
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .mobile-overlay.active {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
}

/* Tablet transition point - start collapsing sidebar but keep mobile menu hidden */
@media (max-width: 900px) and (min-width: 769px) {
  .sidebar.sidebar-collapsed {
    width: 70px;
    min-width: 70px;
  }

  .sidebar.sidebar-collapsed .nav-text {
    display: none;
  }

  .sidebar.sidebar-collapsed .logo-wrapper {
    display: none;
  }

  .sidebar.sidebar-collapsed .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 40px;
    padding: 0.5rem 0;
  }

  .sidebar.sidebar-collapsed .sidebar-header {
    padding: 0.5rem;
    justify-content: center;
    flex-direction: column;
    gap: 0.25rem;
  }

  .sidebar.sidebar-collapsed .sidebar-toggle {
    position: static;
    margin: 0 auto;
    padding: 0.5rem;
    font-size: 16px;
  }

  /* Ensure proper spacing and alignment for collapsed state */
  .sidebar.sidebar-collapsed .nav-link {
    justify-content: center;
    padding: 0.75rem 0.5rem;
    margin: 0.125rem 0.25rem;
    border-radius: 6px;
  }

  .sidebar.sidebar-collapsed .nav-icon {
    margin: 0;
    font-size: 18px;
  }

  /* Tablet expanded sidebar - overlay behavior like mobile */
  .sidebar.sidebar-tablet-expanded {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    /* Higher than overlay z-index */
    width: 280px;
    min-width: 280px;
    transition: transform 0.3s ease;
    box-shadow: var(--shadow-xl);
    background: var(--surface);
  }

  /* Main content adjustments */
  .admin-layout:has(.sidebar.sidebar-collapsed) .main-content {
    margin-left: 70px;
  }

  .admin-layout:has(.sidebar.sidebar-tablet-expanded) .main-content {
    margin-left: 70px;
    /* Keep content in place, sidebar overlays */
  }

  /* Fallback for browsers that don't support :has() */
  @supports not selector(:has(*)) {
    .main-content {
      margin-left: 70px;
    }
  }
}

@media (max-width: 820px) and (min-width: 769px) {
  .sidebar.sidebar-collapsed {
    width: 64px;
    min-width: 64px;
  }

  .sidebar.sidebar-collapsed .logo-wrapper {
    display: none;
  }

  .sidebar.sidebar-collapsed .sidebar-header {
    padding: 0.5rem 0.25rem;
  }

  .sidebar.sidebar-collapsed .nav-link {
    padding: 0.5rem 0.25rem;
    justify-content: center;
    margin: 0.125rem;
  }

  .sidebar.sidebar-collapsed .nav-icon {
    font-size: 16px;
  }

  /* Tablet expanded sidebar - overlay behavior like mobile */
  .sidebar.sidebar-tablet-expanded {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    /* Higher than overlay z-index */
    width: 280px;
    min-width: 280px;
    transition: transform 0.3s ease;
    box-shadow: var(--shadow-xl);
    background: var(--surface);
  }

  /* Main content adjustments */
  .admin-layout:has(.sidebar.sidebar-collapsed) .main-content {
    margin-left: 64px;
  }

  .admin-layout:has(.sidebar.sidebar-tablet-expanded) .main-content {
    margin-left: 64px;
    /* Keep content in place, sidebar overlays */
  }

  /* Fallback for browsers that don't support :has() */
  @supports not selector(:has(*)) {
    .main-content {
      margin-left: 64px;
    }
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

  /* Mobile notifications dropdown */
  .notifications-dropdown {
    width: calc(100vw - 2rem);
    right: -1rem;
    max-width: none;
  }

  .notification-item {
    padding: 0.75rem 1rem;
  }

  .notification-icon {
    width: 28px;
    height: 28px;
    font-size: 1rem;
    margin-right: 0.5rem;
  }

  .notification-title {
    font-size: 0.8125rem;
  }

  .notification-message {
    font-size: 0.75rem;
  }

  .notifications-header {
    padding: 0.75rem 1rem;
  }

  .notifications-footer {
    padding: 0.5rem 1rem;
  }
}

/* Mobile Overlay */
@media (max-width: 768px) {
  .mobile-overlay {
    position: absolute;
    /* Relative to main-content */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 500;
    /* Lower than sidebar z-index for consistency */
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
