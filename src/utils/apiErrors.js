/**
 * API Error Handling Utilities
 * Standardized error handling for API responses
 */

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status = null, code = null, details = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

/**
 * Error status codes and messages
 */
export const ERROR_CODES = {
  // Client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  
  // Custom business errors
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  INVALID_COUPON: 'INVALID_COUPON',
  ORDER_CANCELLED: 'ORDER_CANCELLED',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL'
}

/**
 * User-friendly error messages in Vietnamese
 */
export const ERROR_MESSAGES = {
  [ERROR_CODES.BAD_REQUEST]: 'Yêu cầu không hợp lệ',
  [ERROR_CODES.UNAUTHORIZED]: 'Vui lòng đăng nhập để tiếp tục',
  [ERROR_CODES.FORBIDDEN]: 'Bạn không có quyền thực hiện thao tác này',
  [ERROR_CODES.NOT_FOUND]: 'Không tìm thấy dữ liệu',
  [ERROR_CODES.CONFLICT]: 'Dữ liệu bị xung đột',
  [ERROR_CODES.VALIDATION_ERROR]: 'Dữ liệu không hợp lệ',
  [ERROR_CODES.TOO_MANY_REQUESTS]: 'Quá nhiều yêu cầu. Vui lòng thử lại sau',
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Lỗi hệ thống. Vui lòng thử lại sau',
  [ERROR_CODES.BAD_GATEWAY]: 'Lỗi kết nối. Vui lòng thử lại',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Dịch vụ tạm thời không khả dụng',
  [ERROR_CODES.GATEWAY_TIMEOUT]: 'Yêu cầu quá thời gian chờ',
  
  // Business errors
  [ERROR_CODES.INSUFFICIENT_STOCK]: 'Sản phẩm không đủ số lượng trong kho',
  [ERROR_CODES.INVALID_COUPON]: 'Mã giảm giá không hợp lệ hoặc đã hết hạn',
  [ERROR_CODES.ORDER_CANCELLED]: 'Đơn hàng đã bị hủy',
  [ERROR_CODES.DUPLICATE_EMAIL]: 'Email đã được sử dụng',
  
  // Network errors
  'Network Error': 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet',
  'Request timeout': 'Yêu cầu quá thời gian chờ. Vui lòng thử lại',
  
  // Default
  'default': 'Đã xảy ra lỗi. Vui lòng thử lại sau'
}

/**
 * Parse API error response
 */
export const parseApiError = (error) => {
  // Network error
  if (!error.response) {
    return new ApiError(
      ERROR_MESSAGES['Network Error'],
      null,
      'NETWORK_ERROR',
      { originalError: error.message }
    )
  }
  
  const { status, data } = error.response
  
  // Extract error details from response
  const message = data?.error?.message || 
                  data?.message || 
                  ERROR_MESSAGES[status] || 
                  ERROR_MESSAGES.default
  
  const code = data?.error?.code || data?.code || status
  const details = data?.error?.details || data?.details || null
  
  return new ApiError(message, status, code, details)
}

/**
 * Handle validation errors
 */
export const handleValidationErrors = (errors) => {
  const formattedErrors = {}
  
  if (Array.isArray(errors)) {
    errors.forEach(error => {
      if (error.field) {
        formattedErrors[error.field] = error.message
      }
    })
  } else if (typeof errors === 'object') {
    Object.keys(errors).forEach(field => {
      formattedErrors[field] = Array.isArray(errors[field]) 
        ? errors[field][0] 
        : errors[field]
    })
  }
  
  return formattedErrors
}

/**
 * Check if error is of specific type
 */
export const isErrorType = (error, type) => {
  if (error instanceof ApiError) {
    return error.code === type || error.status === type
  }
  return false
}

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error) => {
  if (error instanceof ApiError) {
    return error.message
  }
  
  if (error.response?.status) {
    return ERROR_MESSAGES[error.response.status] || ERROR_MESSAGES.default
  }
  
  if (error.message in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.message]
  }
  
  return ERROR_MESSAGES.default
}

/**
 * Log error for debugging (only in development)
 */
export const logError = (error, context = '') => {
  if (import.meta.env.DEV) {
    console.group(`🔴 API Error${context ? ` - ${context}` : ''}`)
    console.error('Error:', error)
    if (error instanceof ApiError) {
      console.table({
        Status: error.status,
        Code: error.code,
        Message: error.message,
        Details: JSON.stringify(error.details),
        Timestamp: error.timestamp
      })
    }
    console.groupEnd()
  }
}
