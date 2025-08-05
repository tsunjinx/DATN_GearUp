import { ref } from 'vue'

/**
 * Composable để quản lý API calls
 * Theo rules: Single responsibility, standardized error handling
 */
export function useApi() {
  // State
  const loading = ref(false)
  const error = ref(null)
  
  // Method để handle API calls với standardized error handling
  const execute = async (apiCall, options = {}) => {
    const { showLoading = true, showError = true } = options
    
    try {
      if (showLoading) loading.value = true
      error.value = null
      
      const result = await apiCall()
      return result
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra'
      
      if (showError) {
        error.value = errorMessage
        console.error('API Error:', err)
      }
      
      throw err
      
    } finally {
      if (showLoading) loading.value = false
    }
  }

  // Method để clear error
  const clearError = () => {
    error.value = null
  }

  return {
    loading,
    error,
    execute,
    clearError
  }
}
