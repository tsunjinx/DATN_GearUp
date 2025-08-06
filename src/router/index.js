import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuthStore } from '@/stores/authStore'

// Views
import Dashboard from '@/views/Dashboard.vue'
import Products from '@/views/Products.vue'
import Customers from '@/views/Customers.vue'
import Employees from '@/views/Employees.vue'
import Orders from '@/views/Orders.vue'
import Discounts from '@/views/Discounts.vue'
import Coupons from '@/views/Coupons.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  // Public routes (no layout)
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      requiresGuest: true,
      title: 'GearUp - Đăng nhập'
    }
  },
  // Admin routes (with AdminLayout)
  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'GearUp - Thống kê & báo cáo',
          icon: '📊'
        }
      },
      {
        path: 'products',
        name: 'Products',
        component: Products,
        meta: {
          title: 'GearUp - Quản lý Sản phẩm',
          icon: '📦'
        }
      },
      {
        path: 'customers',
        name: 'Customers',
        component: Customers,
        meta: {
          title: 'GearUp - Quản lý Khách hàng',
          icon: '👥'
        }
      },
      {
        path: 'employees',
        name: 'Employees',
        component: Employees,
        meta: {
          title: 'GearUp - Quản lý Nhân viên',
          icon: '👨‍💼'
        }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: Orders,
        meta: {
          title: 'GearUp - Quản lý Hóa đơn',
          icon: '🧾'
        }
      },
      {
        path: 'discounts',
        name: 'Discounts',
        component: Discounts,
        meta: {
          title: 'GearUp - Đợt giảm giá',
          icon: '🏷️'
        }
      },
      {
        path: 'coupons',
        name: 'Coupons',
        component: Coupons,
        meta: {
          title: 'GearUp - Phiếu giảm giá',
          icon: '🎫'
        }
      }
    ]
  },
  // Catch-all route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'GearUp - Trang không tồn tại'
    }
  }
]

const router = createRouter({   
  history: createWebHistory(),
  routes
})

// Navigation guards with proper authentication
router.beforeEach(async (to, from, next) => {
  console.log('Route navigation to:', to.path)
  
  // Enable authentication
  const DISABLE_AUTH = false // Authentication is now enabled
  
  if (DISABLE_AUTH) {
    console.log('Authentication disabled for development')
    next()
    return
  }
  
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  // Check authentication status
  if (requiresAuth && !authStore.isAuthenticated) {
    // Try to restore session
    const isValid = await authStore.checkAuth()
    if (!isValid) {
      console.log('Authentication required, redirecting to login')
      next('/login')
      return
    }
  }
  
  // Prevent authenticated users from accessing guest-only pages
  if (requiresGuest && authStore.isAuthenticated) {
    console.log('Already authenticated, redirecting to dashboard')
    next('/')
    return
  }
  
  next()
})

// Update document title after navigation
router.afterEach((to) => {
  // Get the title from route meta or use default
  const title = to.meta?.title || 'GearUp - Quản lý cửa hàng giày'
  document.title = title
  
  // Update favicon based on route (optional enhancement)
  const favicon = document.querySelector('link[rel="icon"]')
  if (favicon && to.meta?.icon) {
    // Create a canvas to generate emoji favicon
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    ctx.font = '24px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(to.meta.icon, 16, 16)
    favicon.href = canvas.toDataURL()
  }
})

export default router
