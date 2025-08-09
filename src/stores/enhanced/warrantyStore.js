// Warranty Management Store - Matches ERD phiếu_bảo_hành & kích_thử_bảo_hành
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWarrantyStore = defineStore('warranty', () => {
  // State
  const warranties = ref([]) // phiếu_bảo_hành
  const warrantyRepairs = ref([]) // kích_thử_bảo_hành
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getAllWarranties = computed(() => warranties.value.filter(item => !item.deleted))

  const getActiveWarranties = computed(() =>
    getAllWarranties.value.filter(warranty => warranty.trang_thai === 'active')
  )

  const getExpiredWarranties = computed(() =>
    getAllWarranties.value.filter(warranty => {
      const expireDate = new Date(warranty.ngày_hết_han)
      return expireDate < new Date()
    })
  )

  const getExpiringWarranties = computed(() => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    return getAllWarranties.value.filter(warranty => {
      const expireDate = new Date(warranty.ngày_hết_han)
      const now = new Date()
      return expireDate >= now && expireDate <= thirtyDaysFromNow
    })
  })

  const getAllWarrantyRepairs = computed(() => warrantyRepairs.value.filter(item => !item.deleted))

  const getWarrantyById = computed(
    () => id => warranties.value.find(w => w.id === id && !w.deleted)
  )

  const getRepairsByWarrantyId = computed(
    () => warrantyId =>
      getAllWarrantyRepairs.value.filter(repair => repair.id_phieu_bao_hanh === warrantyId)
  )

  // Statistics
  const warrantyStats = computed(() => ({
    total: getAllWarranties.value.length,
    active: getActiveWarranties.value.length,
    expired: getExpiredWarranties.value.length,
    expiringSoon: getExpiringWarranties.value.length,
    totalRepairs: getAllWarrantyRepairs.value.length,
    pendingRepairs: getAllWarrantyRepairs.value.filter(r => r.trang_thai === 'pending').length,
    completedRepairs: getAllWarrantyRepairs.value.filter(r => r.trang_thai === 'completed').length
  }))

  // Actions
  const fetchWarranties = async () => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/warranties')
      if (!response.ok) throw new Error('Failed to fetch warranties')

      const data = await response.json()
      warranties.value = data.data || []
    } catch (err) {
      error.value = 'Failed to fetch warranties'
      console.error('Warranties fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchWarrantyRepairs = async () => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/warranty-repairs')
      if (!response.ok) throw new Error('Failed to fetch warranty repairs')

      const data = await response.json()
      warrantyRepairs.value = data.data || []
    } catch (err) {
      error.value = 'Failed to fetch warranty repairs'
      console.error('Warranty repairs fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAll = async () => {
    await Promise.all([fetchWarranties(), fetchWarrantyRepairs()])
  }

  const createWarranty = async warrantyData => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/warranties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_chi_tiet_san_pham: warrantyData.id_chi_tiet_san_pham,
          ma_bao_hanh: warrantyData.ma_bao_hanh,
          ngày_bat_đau: warrantyData.ngày_bat_đau,
          ngày_hết_han: warrantyData.ngày_hết_han,
          trang_thai: warrantyData.trang_thai || 'active',
          deleted: false
        })
      })

      if (!response.ok) throw new Error('Failed to create warranty')

      const newWarranty = await response.json()
      warranties.value.push(newWarranty.data)

      return newWarranty.data
    } catch (err) {
      error.value = 'Failed to create warranty'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWarranty = async (id, warrantyData) => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/warranties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(warrantyData)
      })

      if (!response.ok) throw new Error('Failed to update warranty')

      const updatedWarranty = await response.json()
      const index = warranties.value.findIndex(w => w.id === id)
      if (index !== -1) {
        warranties.value[index] = updatedWarranty.data
      }

      return updatedWarranty.data
    } catch (err) {
      error.value = 'Failed to update warranty'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteWarranty = async id => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/warranties/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete warranty')

      // Soft delete
      const index = warranties.value.findIndex(w => w.id === id)
      if (index !== -1) {
        warranties.value[index].deleted = true
      }
    } catch (err) {
      error.value = 'Failed to delete warranty'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createWarrantyRepair = async repairData => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/warranty-repairs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_phieu_bao_hanh: repairData.id_phieu_bao_hanh,
          ngày_bảo_hành: repairData.ngày_bảo_hành,
          chi_zin: repairData.chi_zin,
          phương_thục_sửa_chữa: repairData.phương_thục_sửa_chữa,
          chi_phi: repairData.chi_phi,
          trang_thai: repairData.trang_thai || 'pending',
          deleted: false
        })
      })

      if (!response.ok) throw new Error('Failed to create warranty repair')

      const newRepair = await response.json()
      warrantyRepairs.value.push(newRepair.data)

      return newRepair.data
    } catch (err) {
      error.value = 'Failed to create warranty repair'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateWarrantyRepair = async (id, repairData) => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/warranty-repairs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(repairData)
      })

      if (!response.ok) throw new Error('Failed to update warranty repair')

      const updatedRepair = await response.json()
      const index = warrantyRepairs.value.findIndex(r => r.id === id)
      if (index !== -1) {
        warrantyRepairs.value[index] = updatedRepair.data
      }

      return updatedRepair.data
    } catch (err) {
      error.value = 'Failed to update warranty repair'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteWarrantyRepair = async id => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/warranty-repairs/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete warranty repair')

      // Soft delete
      const index = warrantyRepairs.value.findIndex(r => r.id === id)
      if (index !== -1) {
        warrantyRepairs.value[index].deleted = true
      }
    } catch (err) {
      error.value = 'Failed to delete warranty repair'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search functionality
  const searchWarranties = computed(() => query => {
    if (!query) return getAllWarranties.value

    const searchTerm = query.toLowerCase()
    return getAllWarranties.value.filter(warranty =>
      warranty.ma_bao_hanh.toLowerCase().includes(searchTerm)
    )
  })

  // Filter by status
  const filterWarrantiesByStatus = computed(() => status => {
    return getAllWarranties.value.filter(warranty => warranty.trang_thai === status)
  })

  const filterRepairsByStatus = computed(() => status => {
    return getAllWarrantyRepairs.value.filter(repair => repair.trang_thai === status)
  })

  return {
    // State
    warranties,
    warrantyRepairs,
    loading,
    error,

    // Getters
    getAllWarranties,
    getActiveWarranties,
    getExpiredWarranties,
    getExpiringWarranties,
    getAllWarrantyRepairs,
    getWarrantyById,
    getRepairsByWarrantyId,
    warrantyStats,
    searchWarranties,
    filterWarrantiesByStatus,
    filterRepairsByStatus,

    // Actions
    fetchWarranties,
    fetchWarrantyRepairs,
    fetchAll,
    createWarranty,
    updateWarranty,
    deleteWarranty,
    createWarrantyRepair,
    updateWarrantyRepair,
    deleteWarrantyRepair
  }
})
