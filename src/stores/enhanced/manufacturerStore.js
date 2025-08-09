// Manufacturer & Origin Management Store - Matches ERD nhà_sản_xuất & xuất_xu
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useManufacturerStore = defineStore('manufacturer', () => {
  // State
  const manufacturers = ref([]) // nhà_sản_xuất
  const origins = ref([]) // xuất_xu
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getAllManufacturers = computed(() => manufacturers.value.filter(item => !item.deleted))

  const getAllOrigins = computed(() => origins.value.filter(item => !item.deleted))

  const getManufacturerById = computed(
    () => id => manufacturers.value.find(m => m.id === id && !m.deleted)
  )

  const getOriginById = computed(() => id => origins.value.find(o => o.id === id && !o.deleted))

  // Statistics
  const totalManufacturers = computed(() => getAllManufacturers.value.length)
  const totalOrigins = computed(() => getAllOrigins.value.length)

  // Actions
  const fetchManufacturers = async () => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/manufacturers')
      if (!response.ok) throw new Error('Failed to fetch manufacturers')

      const data = await response.json()
      manufacturers.value = data.data || []
    } catch (err) {
      error.value = 'Failed to fetch manufacturers'
      console.error('Manufacturers fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchOrigins = async () => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/origins')
      if (!response.ok) throw new Error('Failed to fetch origins')

      const data = await response.json()
      origins.value = data.data || []
    } catch (err) {
      error.value = 'Failed to fetch origins'
      console.error('Origins fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAll = async () => {
    await Promise.all([fetchManufacturers(), fetchOrigins()])
  }

  const createManufacturer = async manufacturerData => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/manufacturers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ma_nha_san_xuat: manufacturerData.ma_nha_san_xuat,
          ten_nha_san_xuat: manufacturerData.ten_nha_san_xuat,
          deleted: false
        })
      })

      if (!response.ok) throw new Error('Failed to create manufacturer')

      const newManufacturer = await response.json()
      manufacturers.value.push(newManufacturer.data)

      return newManufacturer.data
    } catch (err) {
      error.value = 'Failed to create manufacturer'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createOrigin = async originData => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/origins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ten_xuat_xu: originData.ten_xuat_xu,
          deleted: false
        })
      })

      if (!response.ok) throw new Error('Failed to create origin')

      const newOrigin = await response.json()
      origins.value.push(newOrigin.data)

      return newOrigin.data
    } catch (err) {
      error.value = 'Failed to create origin'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateManufacturer = async (id, manufacturerData) => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/manufacturers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(manufacturerData)
      })

      if (!response.ok) throw new Error('Failed to update manufacturer')

      const updatedManufacturer = await response.json()
      const index = manufacturers.value.findIndex(m => m.id === id)
      if (index !== -1) {
        manufacturers.value[index] = updatedManufacturer.data
      }

      return updatedManufacturer.data
    } catch (err) {
      error.value = 'Failed to update manufacturer'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateOrigin = async (id, originData) => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/origins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(originData)
      })

      if (!response.ok) throw new Error('Failed to update origin')

      const updatedOrigin = await response.json()
      const index = origins.value.findIndex(o => o.id === id)
      if (index !== -1) {
        origins.value[index] = updatedOrigin.data
      }

      return updatedOrigin.data
    } catch (err) {
      error.value = 'Failed to update origin'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteManufacturer = async id => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/manufacturers/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete manufacturer')

      // Soft delete
      const index = manufacturers.value.findIndex(m => m.id === id)
      if (index !== -1) {
        manufacturers.value[index].deleted = true
      }
    } catch (err) {
      error.value = 'Failed to delete manufacturer'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteOrigin = async id => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/origins/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete origin')

      // Soft delete
      const index = origins.value.findIndex(o => o.id === id)
      if (index !== -1) {
        origins.value[index].deleted = true
      }
    } catch (err) {
      error.value = 'Failed to delete origin'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search functionality
  const searchManufacturers = computed(() => query => {
    if (!query) return getAllManufacturers.value

    const searchTerm = query.toLowerCase()
    return getAllManufacturers.value.filter(
      manufacturer =>
        manufacturer.ten_nha_san_xuat.toLowerCase().includes(searchTerm) ||
        manufacturer.ma_nha_san_xuat.toLowerCase().includes(searchTerm)
    )
  })

  const searchOrigins = computed(() => query => {
    if (!query) return getAllOrigins.value

    const searchTerm = query.toLowerCase()
    return getAllOrigins.value.filter(origin =>
      origin.ten_xuat_xu.toLowerCase().includes(searchTerm)
    )
  })

  return {
    // State
    manufacturers,
    origins,
    loading,
    error,

    // Getters
    getAllManufacturers,
    getAllOrigins,
    getManufacturerById,
    getOriginById,
    totalManufacturers,
    totalOrigins,
    searchManufacturers,
    searchOrigins,

    // Actions
    fetchManufacturers,
    fetchOrigins,
    fetchAll,
    createManufacturer,
    createOrigin,
    updateManufacturer,
    updateOrigin,
    deleteManufacturer,
    deleteOrigin
  }
})
