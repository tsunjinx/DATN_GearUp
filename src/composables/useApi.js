// Composable API tổng quát: quản lý loading/error/data, hủy request khi unmount và chạy song song.
import { ref, onUnmounted } from 'vue'
import { createCancelToken, isCancel } from '@/services/api'
import { getUserFriendlyMessage } from '@/utils/apiErrors'

/**
 * Enhanced API Composable with Request Cancellation
 * Manages API requests with loading states, error handling, and automatic cleanup
 */
export function useApi() {
  // State
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  // Store cancel tokens for cleanup
  const cancelTokens = []

  /**
   * Execute API request with automatic state management
   */
  const execute = async (apiCall, options = {}) => {
    const { showLoading = true, showError = true } = options

    // Reset state
    if (showLoading) loading.value = true
    error.value = null

    // Create cancel token
    const source = createCancelToken()
    cancelTokens.push(source)

    try {
      // Execute API call with cancel token
      const result = await apiCall({
        ...options,
        cancelToken: source.token
      })

      data.value = result?.data || result
      return result
    } catch (err) {
      // Ignore cancelled requests
      if (isCancel(err)) {
        console.log('Request cancelled')
        return null
      }

      const errorMessage = getUserFriendlyMessage(err)

      if (showError) {
        error.value = errorMessage
      }

      throw err
    } finally {
      if (showLoading) loading.value = false

      // Remove used cancel token
      const index = cancelTokens.indexOf(source)
      if (index > -1) {
        cancelTokens.splice(index, 1)
      }
    }
  }

  /**
   * Execute multiple API requests in parallel
   */
  const executeAll = async (apiCalls, options = {}) => {
    const { showLoading = true, showError = true } = options

    if (showLoading) loading.value = true
    error.value = null

    try {
      const results = await Promise.all(
        apiCalls.map(apiCall => {
          const source = createCancelToken()
          cancelTokens.push(source)
          return apiCall({ cancelToken: source.token })
        })
      )

      data.value = results
      return results
    } catch (err) {
      if (isCancel(err)) {
        console.log('Requests cancelled')
        return null
      }

      const errorMessage = getUserFriendlyMessage(err)

      if (showError) {
        error.value = errorMessage
      }

      throw err
    } finally {
      if (showLoading) loading.value = false
    }
  }

  /**
   * Cancel all pending requests
   */
  const cancelRequests = () => {
    cancelTokens.forEach(source => {
      source.cancel('Request cancelled by user')
    })
    cancelTokens.length = 0
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Reset all state
   */
  const reset = () => {
    loading.value = false
    error.value = null
    data.value = null
    cancelRequests()
  }

  // Cancel all requests on component unmount
  onUnmounted(() => {
    cancelRequests()
  })

  return {
    // State
    loading,
    error,
    data,

    // Methods
    execute,
    executeAll,
    cancelRequests,
    clearError,
    reset
  }
}
