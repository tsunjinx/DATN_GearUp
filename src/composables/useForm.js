import { ref, computed } from 'vue'

/**
 * Composable để quản lý form data và validation
 * Theo rules: Single responsibility, tối đa 5 functions
 */
export function useForm(initialData = {}) {
  // Reactive state
  const formData = ref({ ...initialData })
  const errors = ref({})
  const isSubmitting = ref(false)

  // Computed properties
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  const hasChanges = computed(() => {
    return JSON.stringify(formData.value) !== JSON.stringify(initialData)
  })

  // Methods (max 5 functions)
  const setField = (field, value) => {
    formData.value[field] = value
    // Clear error khi user bắt đầu sửa
    if (errors.value[field]) {
      delete errors.value[field]
    }
  }

  const setError = (field, message) => {
    errors.value[field] = message
  }

  const clearErrors = () => {
    errors.value = {}
  }

  const reset = () => {
    formData.value = { ...initialData }
    clearErrors()
    isSubmitting.value = false
  }

  const validate = (rules = {}) => {
    clearErrors()

    Object.keys(rules).forEach(field => {
      const rule = rules[field]
      const value = formData.value[field]

      if (rule.required && !value) {
        setError(field, `${field} là bắt buộc`)
      }

      if (rule.minLength && value && value.length < rule.minLength) {
        setError(field, `${field} phải có ít nhất ${rule.minLength} ký tự`)
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        setError(field, rule.message || `${field} không đúng định dạng`)
      }
    })

    return isValid.value
  }

  return {
    // State
    formData,
    errors,
    isSubmitting,

    // Computed
    isValid,
    hasChanges,

    // Methods
    setField,
    setError,
    clearErrors,
    reset,
    validate
  }
}
