/**
 * API Data Transformation Utilities
 * Handles conversion between frontend (camelCase) and backend (snake_case) formats
 */

/**
 * Convert snake_case to camelCase
 */
export const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert camelCase to snake_case
 */
export const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Deep transform object keys from snake_case to camelCase
 */
export const transformToCamelCase = (data) => {
  if (data === null || data === undefined) return data
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(transformToCamelCase)
  }
  
  // Handle objects
  if (typeof data === 'object' && data.constructor === Object) {
    const transformed = {}
    
    Object.keys(data).forEach(key => {
      const camelKey = toCamelCase(key)
      transformed[camelKey] = transformToCamelCase(data[key])
    })
    
    return transformed
  }
  
  // Return primitives as-is
  return data
}

/**
 * Deep transform object keys from camelCase to snake_case
 */
export const transformToSnakeCase = (data) => {
  if (data === null || data === undefined) return data
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(transformToSnakeCase)
  }
  
  // Handle objects
  if (typeof data === 'object' && data.constructor === Object) {
    const transformed = {}
    
    Object.keys(data).forEach(key => {
      const snakeKey = toSnakeCase(key)
      transformed[snakeKey] = transformToSnakeCase(data[key])
    })
    
    return transformed
  }
  
  // Return primitives as-is
  return data
}

/**
 * Transform API response
 * Converts snake_case keys to camelCase for frontend usage
 */
export const transformResponse = (response) => {
  // Handle paginated responses
  if (response?.data?.items) {
    return {
      ...transformToCamelCase(response),
      data: {
        ...transformToCamelCase(response.data),
        items: response.data.items.map(transformToCamelCase)
      }
    }
  }
  
  // Handle standard responses
  return transformToCamelCase(response)
}

/**
 * Transform API request
 * Converts camelCase keys to snake_case for backend
 */
export const transformRequest = (data) => {
  return transformToSnakeCase(data)
}

/**
 * Extract error message from API error response
 */
export const extractErrorMessage = (error) => {
  // Check for various error message locations
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  
  if (error.message) {
    return error.message
  }
  
  return 'Đã xảy ra lỗi không xác định'
}
