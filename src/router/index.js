// Cấu hình Router: bảo vệ tuyến (requiresAuth/guest), lazy-load layout/view, cập nhật favicon emoji theo meta.icon.
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Lazy load layout with high priority
const AdminLayout = () => import('@/layouts/AdminLayout.vue')

// Lazy load views for better performance
const Dashboard = () => import('@/views/Dashboard.vue')
const Products = () => import('@/views/Products.vue')
const ProductVariants = () => import('@/views/ProductVariants.vue')
const AttributeManagement = () => import('@/views/AttributeManagement.vue')
const WarrantyManagement = () => import('@/views/WarrantyManagement.vue')
const Customers = () => import('@/views/Customers.vue')
const Employees = () => import('@/views/Employees.vue')
const Orders = () => import('@/views/Orders.vue')
const Discounts = () => import('@/views/Discounts.vue')
const Coupons = () => import('@/views/Coupons.vue')
const Inventory = () => import('@/views/Inventory.vue')
const Analytics = () => import('@/views/Analytics.vue')
const Login = () => import('@/views/Login.vue')
const NotFound = () => import('@/views/NotFound.vue')
// Customer app
const CustomerLayout = () => import('@/customer/layouts/CustomerLayout.vue')
const ShopHome = () => import('@/customer/views/Home.vue')
const ShopCatalog = () => import('@/customer/views/Catalog.vue')
const ShopDetails = () => import('@/customer/views/Details.vue')
const ShopCart = () => import('@/customer/views/Cart.vue')
const ShopCheckout = () => import('@/customer/views/Checkout.vue')
const ShopAccount = () => import('@/customer/views/Account.vue')
const ShopWishlist = () => import('@/customer/views/Wishlist.vue')

const routes = [
  // Default: chuyển người dùng vào ứng dụng khách hàng
  { path: '/', redirect: '/shop' },
  // Public routes (no layout)
  // Admin login dưới /admin/login
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: Login,
    meta: { 
      requiresGuest: true,
      title: 'GearUp - Đăng nhập quản trị'
    }
  },
  // Customer routes (/shop)
  {
    path: '/shop',
    component: CustomerLayout,
    children: [
      { path: '', name: 'ShopHome', component: ShopHome, meta: { title: 'GearUp - Cửa hàng', icon: '🛍️' } },
      { path: 'catalog', name: 'ShopCatalog', component: ShopCatalog, meta: { title: 'GearUp - Danh mục', icon: '🗂️' } },
      { path: 'details/:id', name: 'ShopDetails', component: ShopDetails, meta: { title: 'GearUp - Chi tiết sản phẩm', icon: '👟' } },
      { path: 'cart', name: 'ShopCart', component: ShopCart, meta: { title: 'GearUp - Giỏ hàng', icon: '🛒' } },
      { path: 'checkout', name: 'ShopCheckout', component: ShopCheckout, meta: { title: 'GearUp - Thanh toán', icon: '💳' } },
      { path: 'account', name: 'ShopAccount', component: ShopAccount, meta: { title: 'GearUp - Tài khoản', icon: '👤' } },
      { path: 'wishlist', name: 'ShopWishlist', component: ShopWishlist, meta: { title: 'GearUp - Yêu thích', icon: '❤️' } }
    ]
  },
  // Admin routes (with AdminLayout) dưới tiền tố /admin
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
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
        path: 'product-variants',
        name: 'ProductVariants',
        component: ProductVariants,
        meta: {
          title: 'GearUp - Quản lý Biến thể Sản phẩm',
          icon: '🏷️'
        }
      },
      {
        path: 'attributes',
        name: 'AttributeManagement',
        component: AttributeManagement,
        meta: {
          title: 'GearUp - Quản lý Thuộc tính',
          icon: '🏷️'
        }
      },
      {
        path: 'warranties',
        name: 'WarrantyManagement',
        component: WarrantyManagement,
        meta: {
          title: 'GearUp - Quản lý Bảo hành',
          icon: '🛡️'
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
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: Inventory,
        meta: {
          title: 'GearUp - Quản lý Tồn kho',
          icon: '📦'
        }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: Analytics,
        meta: {
          title: 'GearUp - Phân tích & Báo cáo',
          icon: '📈'
        }
      }
    ]
  },
  // Redirect /admin -> /admin/dashboard
  { path: '/admin', redirect: '/admin/dashboard' },
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
      console.log('Authentication required, redirecting to admin login')
      next('/admin/login')
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
  // Keep optional emoji favicon update
  const favicon = document.querySelector('link[rel="icon"]')
  if (favicon && to.meta?.icon) {
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
