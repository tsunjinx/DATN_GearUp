/**
 * Excel Export Utility for GearUp Admin Dashboard
 * Handles CSV export functionality with Vietnamese support
 */

/**
 * Convert array of objects to CSV format with proper escaping
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file (without extension)
 * @param {Object} options - Export options
 */
export const exportToCSV = (data, filename, options = {}) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('Không có dữ liệu để xuất')
    }

    // Get headers from first object
    const headers = Object.keys(data[0])
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || ''
          // Escape commas, quotes and newlines in CSV
          const cleanValue = value.toString()
            .replace(/"/g, '""')
            .replace(/\n/g, ' ')
            .replace(/\r/g, ' ')
          return `"${cleanValue}"`
        }).join(',')
      )
    ].join('\n')

    // Create and download file
    const blob = new Blob(['\uFEFF' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    })
    
    downloadFile(blob, `${filename}.csv`)
    
    return {
      success: true,
      recordCount: data.length,
      message: `Đã xuất ${data.length} bản ghi thành công!`
    }
    
  } catch (error) {
    console.error('Lỗi khi xuất Excel:', error)
    return {
      success: false,
      error: error.message,
      message: 'Có lỗi xảy ra khi xuất file Excel'
    }
  }
}

/**
 * Download file from blob
 * @param {Blob} blob - File blob
 * @param {string} filename - File name
 */
const downloadFile = (blob, filename) => {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up URL object
  URL.revokeObjectURL(url)
}

/**
 * Generate timestamp for filename
 * @returns {string} Formatted timestamp
 */
export const generateTimestamp = () => {
  const now = new Date()
  return now.toISOString().slice(0, 19).replace(/[:-]/g, '')
}

/**
 * Format currency value for export
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
export const formatCurrencyForExport = (amount) => {
  if (!amount) return '0'
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ'
}

/**
 * Format date for export
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDateForExport = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

/**
 * Export discounts data to Excel
 * @param {Array} discounts - Filtered discounts array
 * @param {Object} helpers - Helper functions (formatCurrency, formatDate, etc.)
 */
export const exportDiscountsToExcel = (discounts, helpers) => {
  const dataToExport = discounts.map((discount, index) => ({
    'STT': index + 1,
    'Mã giảm giá': discount.ma_dot_giam_gia || `DGG${discount.id}`,
    'Tên chương trình': discount.ten_dot_giam_gia || discount.name,
    'Mô tả': discount.description,
    'Loại giảm giá': discount.type === 'percentage' ? 'Giảm phần trăm' : 'Giảm tiền cố định',
    'Giá trị': discount.value,
    'Đơn vị': discount.type === 'percentage' ? '%' : 'VNĐ',
    'Giảm tối đa': discount.so_len_giam_toi_da ? formatCurrencyForExport(discount.so_len_giam_toi_da) : 'Không giới hạn',
    'Ngày bắt đầu': formatDateForExport(discount.ngay_bat_dau || discount.startDate),
    'Ngày kết thúc': formatDateForExport(discount.ngay_ket_thuc || discount.endDate),
    'Trạng thái': helpers.getDiscountStatusText(discount),
    'Giá trị đơn hàng tối thiểu': discount.minOrderValue ? formatCurrencyForExport(discount.minOrderValue) : 'Không yêu cầu',
    'Áp dụng cho': helpers.getApplicableProductsText(discount),
    'Đang hoạt động': discount.isActive ? 'Có' : 'Không'
  }))

  const timestamp = generateTimestamp()
  const filename = `danh_sach_giam_gia_${timestamp}`
  
  return exportToCSV(dataToExport, filename)
}

/**
 * Export coupons data to Excel
 * @param {Array} coupons - Filtered coupons array
 * @param {Object} helpers - Helper functions (formatCurrency, formatDate, etc.)
 */
export const exportCouponsToExcel = (coupons, helpers) => {
  const dataToExport = coupons.map((coupon, index) => ({
    'STT': index + 1,
    'Mã phiếu giảm giá': coupon.code,
    'Tên phiếu': coupon.ten_phieu_giam_gia || coupon.name,
    'Chi tiết': coupon.chi_phieu_giam_gia || coupon.description,
    'Loại giảm giá': coupon.type === 'percentage' ? 'Giảm phần trăm' : 'Giảm tiền cố định',
    'Giá trị': coupon.value,
    'Đơn vị': coupon.type === 'percentage' ? '%' : 'VNĐ',
    'Số lượng ban đầu': coupon.so_luong || coupon.totalQuantity,
    'Đã sử dụng': coupon.usedCount || 0,
    'Còn lại': (coupon.so_luong || coupon.totalQuantity) - (coupon.usedCount || 0),
    'Ngày bắt đầu': formatDateForExport(coupon.ngay_bat_dau || coupon.startDate),
    'Ngày kết thúc': formatDateForExport(coupon.ngay_ket_thuc || coupon.endDate),
    'Trạng thái': helpers.getCouponStatusText(coupon),
    'Giá trị đơn hàng tối thiểu': coupon.minOrderValue ? formatCurrencyForExport(coupon.minOrderValue) : 'Không yêu cầu',
    'Giảm tối đa': coupon.maxDiscountAmount ? formatCurrencyForExport(coupon.maxDiscountAmount) : 'Không giới hạn',
    'Đang hoạt động': coupon.isActive ? 'Có' : 'Không'
  }))

  const timestamp = generateTimestamp()
  const filename = `danh_sach_phieu_giam_gia_${timestamp}`
  
  return exportToCSV(dataToExport, filename)
}
