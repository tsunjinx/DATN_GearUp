import { ref, watch } from 'vue'

/**
 * Composable for managing document title
 * @param {string} defaultTitle - Default title when no specific title is provided
 */
export function useDocumentTitle(defaultTitle = 'GearUp - Quản lý cửa hàng giày') {
  const title = ref(defaultTitle)

  // Update document title when title ref changes
  watch(
    title,
    (newTitle) => {
      document.title = newTitle
    },
    { immediate: true }
  )

  /**
   * Set a new title
   * @param {string} newTitle - The new title to set
   */
  const setTitle = (newTitle) => {
    title.value = newTitle
  }

  /**
   * Reset to default title
   */
  const resetTitle = () => {
    title.value = defaultTitle
  }

  /**
   * Set title with prefix (e.g., "GearUp - Page Name")
   * @param {string} pageName - The page name to append to GearUp prefix
   */
  const setPageTitle = (pageName) => {
    title.value = `GearUp - ${pageName}`
  }

  return {
    title,
    setTitle,
    resetTitle,
    setPageTitle
  }
}

/**
 * Predefined page titles for consistent naming
 */
export const PAGE_TITLES = {
  DASHBOARD: 'GearUp - Thống kê & báo cáo',
  PRODUCTS: 'GearUp - Quản lý Sản phẩm',
  CUSTOMERS: 'GearUp - Quản lý Khách hàng',
  EMPLOYEES: 'GearUp - Quản lý Nhân viên',
  ORDERS: 'GearUp - Quản lý Hóa đơn',
  DISCOUNTS: 'GearUp - Quản lý Đợt giảm giá',
  COUPONS: 'GearUp - Quản lý Mã giảm giá',
  LOGIN: 'GearUp - Đăng nhập',
  NOT_FOUND: 'GearUp - Trang không tồn tại'
}
