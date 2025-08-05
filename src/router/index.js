import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuthStore } from '@/stores/authStore'

// Views
import Dashboard from '@/views/Dashboard.simple.vue' // Using simple version for now
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
    meta: { requiresGuest: true }
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
        component: Dashboard
      },
      {
        path: 'products',
        name: 'Products',
        component: Products
      },
      {
        path: 'customers',
        name: 'Customers',
        component: Customers
      },
      {
        path: 'employees',
        name: 'Employees',
        component: Employees
      },
      {
        path: 'orders',
        name: 'Orders',
        component: Orders
      },
      {
        path: 'discounts',
        name: 'Discounts',
        component: Discounts
      },
      {
        path: 'coupons',
        name: 'Coupons',
        component: Coupons
      }
    ]
  },
  // Catch-all route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
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

export default router
