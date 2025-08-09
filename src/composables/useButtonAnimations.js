/**
 * 🎭 useButtonAnimations Composable - Simple Version
 * Provides simple, clean button animation methods across all views
 */

import { nextTick } from 'vue'

export function useButtonAnimations() {
  /**
   * Triggers simple success animation on a button
   * @param {HTMLElement|Event} buttonOrEvent - Button element or click event
   */
  const triggerSuccess = buttonOrEvent => {
    const button = getButtonElement(buttonOrEvent)
    if (button) {
      button.classList.add('success-state')
      setTimeout(() => {
        button.classList.remove('success-state')
      }, 500)
    }
  }

  /**
   * Triggers simple error animation on a button
   * @param {HTMLElement|Event} buttonOrEvent - Button element or click event
   */
  const triggerError = buttonOrEvent => {
    const button = getButtonElement(buttonOrEvent)
    if (button) {
      button.classList.add('error-state')
      setTimeout(() => {
        button.classList.remove('error-state')
      }, 300)
    }
  }

  /**
   * Adds simple loading state to a button
   * @param {HTMLElement|Event} buttonOrEvent - Button element or click event
   */
  const setLoading = buttonOrEvent => {
    const button = getButtonElement(buttonOrEvent)
    if (button) {
      button.classList.add('loading')
      button.disabled = true
      // Store original text
      if (!button.dataset.originalText) {
        button.dataset.originalText = button.textContent
      }
    }
  }

  /**
   * Removes simple loading state from a button
   * @param {HTMLElement|Event} buttonOrEvent - Button element or click event
   */
  const removeLoading = buttonOrEvent => {
    const button = getButtonElement(buttonOrEvent)
    if (button) {
      button.classList.remove('loading')
      button.disabled = false
      // Restore original text if stored
      if (button.dataset.originalText) {
        button.textContent = button.dataset.originalText
      }
    }
  }

  /**
   * Simple async operation with loading, then success/error
   * @param {HTMLElement|Event} buttonOrEvent - Button element or click event
   * @param {Function} asyncOperation - Async function to execute
   * @param {Object} options - Configuration options
   */
  const withLoadingAnimation = async (buttonOrEvent, asyncOperation, options = {}) => {
    const { showSuccess = true, showError = true, onSuccess = null, onError = null } = options

    const button = getButtonElement(buttonOrEvent)
    if (!button) return

    setLoading(button)

    try {
      const result = await asyncOperation()

      removeLoading(button)

      if (showSuccess) {
        triggerSuccess(button)
      }

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (error) {
      removeLoading(button)

      if (showError) {
        triggerError(button)
      }

      if (onError) {
        onError(error)
      }

      throw error
    }
  }

  /**
   * Adds simple fade-in animations to buttons
   * @param {string} containerSelector - CSS selector for container
   * @param {number} delay - Delay between animations (ms)
   */
  const staggeredFadeIn = async (containerSelector, delay = 100) => {
    await nextTick()

    const container = document.querySelector(containerSelector)
    if (!container) return

    const buttons = container.querySelectorAll('.btn')
    buttons.forEach((button, index) => {
      button.classList.add('fade-in')
      button.style.animationDelay = `${index * delay}ms`
    })
  }

  /**
   * Removes all animation classes from a button
   * @param {HTMLElement|Event} buttonOrEvent - Button element or click event
   */
  const clearAnimations = buttonOrEvent => {
    const button = getButtonElement(buttonOrEvent)
    if (button) {
      button.classList.remove('loading', 'success-state', 'error-state', 'fade-in')
      button.disabled = false
      button.style.animationDelay = ''
      // Clear stored text
      if (button.dataset.originalText) {
        delete button.dataset.originalText
      }
    }
  }

  /**
   * Helper function to extract button element from event or element
   * @param {HTMLElement|Event} buttonOrEvent
   * @returns {HTMLElement|null}
   */
  const getButtonElement = buttonOrEvent => {
    if (!buttonOrEvent) return null

    // If it's an event, get the target button
    if (buttonOrEvent.target) {
      return buttonOrEvent.target.closest('.btn')
    }

    // If it's already an element
    if (buttonOrEvent.nodeType === Node.ELEMENT_NODE) {
      return buttonOrEvent.classList.contains('btn')
        ? buttonOrEvent
        : buttonOrEvent.querySelector('.btn')
    }

    return null
  }

  /**
   * Creates a simple debounced button click handler
   * @param {Function} handler - Original click handler
   * @param {number} delay - Debounce delay in ms
   * @returns {Function} Debounced handler
   */
  const createAnimatedHandler = (handler, delay = 300) => {
    let timeoutId = null

    return async event => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      const button = getButtonElement(event)
      if (!button || button.disabled) return

      timeoutId = setTimeout(async () => {
        try {
          await handler(event)
        } catch (error) {
          console.error('Button handler error:', error)
        }
      }, delay)
    }
  }

  return {
    // Basic animations
    triggerSuccess,
    triggerError,
    setLoading,
    removeLoading,
    clearAnimations,

    // Advanced operations
    withLoadingAnimation,
    staggeredFadeIn,
    createAnimatedHandler,

    // Utilities
    getButtonElement
  }
}

/**
 * Example usage in components:
 *
 * ```javascript
 * import { useButtonAnimations } from '@/composables/useButtonAnimations'
 *
 * const { triggerSuccess, withLoadingAnimation, staggeredFadeIn } = useButtonAnimations()
 *
 * // Simple success animation
 * const handleSuccess = (event) => {
 *   triggerSuccess(event)
 * }
 *
 * // Async operation with loading
 * const handleAsyncAction = async (event) => {
 *   await withLoadingAnimation(event, async () => {
 *     // Your async operation here
 *     return await apiCall()
 *   })
 * }
 *
 * // On component mount
 * onMounted(() => {
 *   staggeredFadeIn('.header-actions', 150)
 * })
 * ```
 */
