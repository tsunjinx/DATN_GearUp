/**
 * Debounce Utility
 * Optimizes performance by limiting function execution frequency
 */

/**
 * Create a debounced version of a function
 * @param {Function} func - Function to debounce
 * @param {Number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay = 300) {
  let timeoutId = null
  
  const debounced = function(...args) {
    // Clear previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Set new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args)
      timeoutId = null
    }, delay)
  }
  
  // Add cancel method
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }
  
  // Add flush method to execute immediately
  debounced.flush = function(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    func.apply(this, args)
  }
  
  return debounced
}

/**
 * Create a throttled version of a function
 * @param {Function} func - Function to throttle
 * @param {Number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 100) {
  let inThrottle = false
  let lastArgs = null
  let lastThis = null
  
  const throttled = function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      
      setTimeout(() => {
        inThrottle = false
        
        // Execute pending call if exists
        if (lastArgs) {
          func.apply(lastThis, lastArgs)
          lastArgs = null
          lastThis = null
        }
      }, limit)
    } else {
      // Store last call arguments
      lastArgs = args
      lastThis = this
    }
  }
  
  return throttled
}

/**
 * Composable for debounced search
 */
import { ref, watch } from 'vue'

export function useDebouncedSearch(searchFunction, delay = 500) {
  const searchQuery = ref('')
  const isSearching = ref(false)
  const searchResults = ref([])
  const searchError = ref(null)
  
  // Create debounced search
  const debouncedSearch = debounce(async (query) => {
    if (!query || query.trim().length < 2) {
      searchResults.value = []
      return
    }
    
    isSearching.value = true
    searchError.value = null
    
    try {
      const results = await searchFunction(query)
      searchResults.value = results
    } catch (error) {
      searchError.value = error.message || 'Lỗi tìm kiếm'
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, delay)
  
  // Watch search query changes
  watch(searchQuery, (newQuery) => {
    if (!newQuery) {
      searchResults.value = []
      debouncedSearch.cancel()
      return
    }
    
    debouncedSearch(newQuery)
  })
  
  // Clear search
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    searchError.value = null
    debouncedSearch.cancel()
  }
  
  return {
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    clearSearch
  }
}
