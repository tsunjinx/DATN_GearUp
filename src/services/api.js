import axios from 'axios'
import { transformRequest, transformResponse } from '@/utils/apiTransformers'
import { parseApiError, logError } from '@/utils/apiErrors'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // CSRF protection
  }
})

// Request retry configuration
let retryCount = 0
const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000 // 1 second

// Retry logic for failed requests
const retryRequest = async (error) => {
  const config = error.config
  
  // Only retry on network errors or 5xx errors
  if (!config || retryCount >= MAX_RETRY_ATTEMPTS) {
    return Promise.reject(error)
  }
  
  if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
    retryCount++
    
    // Exponential backoff
    const delay = RETRY_DELAY * Math.pow(2, retryCount - 1)
    
    console.warn(`Retrying request... Attempt ${retryCount}/${MAX_RETRY_ATTEMPTS}`)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(api.request(config))
      }, delay)
    })
  }
  
  return Promise.reject(error)
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Reset retry count for new requests
    retryCount = 0
    
    // Add auth token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Transform request data from camelCase to snake_case
    if (config.data && config.headers['Content-Type'] === 'application/json') {
      config.data = transformRequest(config.data)
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    
    return config
  },
  (error) => {
    logError(error, 'Request Interceptor')
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log request duration in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime
      console.log(`✅ ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`)
    }
    
    // Transform response data from snake_case to camelCase
    if (response.data) {
      response.data = transformResponse(response.data)
    }
    
    return response
  },
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
      
      const apiError = parseApiError(error)
      logError(apiError, 'Unauthorized')
      return Promise.reject(apiError)
    }
    
    // Try retry logic for network/server errors
    if (!error.response || error.response.status >= 500) {
      try {
        return await retryRequest(error)
      } catch (retryError) {
        const apiError = parseApiError(retryError)
        logError(apiError, 'After Retry')
        return Promise.reject(apiError)
      }
    }
    
    // Parse and log other errors
    const apiError = parseApiError(error)
    logError(apiError, error.config?.url)
    return Promise.reject(apiError)
  }
)

// Request cancellation helper
export const createCancelToken = () => {
  return axios.CancelToken.source()
}

// Check if error is from cancelled request
export const isCancel = axios.isCancel

// Export configured instance
export default api
