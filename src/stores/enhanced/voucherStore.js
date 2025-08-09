// Voucher Management Store - Matches ERD phiếu_giảm_giá & phiếu_giảm_giá_cá_nhân
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useVoucherStore = defineStore('voucher', () => {
  // State
  const vouchers = ref([]) // phiếu_giảm_giá (public vouchers)
  const personalVouchers = ref([]) // phiếu_giảm_giá_cá_nhân (customer-specific vouchers)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getAllVouchers = computed(() => vouchers.value.filter(item => !item.deleted))

  const getActiveVouchers = computed(() => {
    const now = new Date()
    return getAllVouchers.value.filter(
      voucher =>
        voucher.trang_thai === 'active' &&
        new Date(voucher.ngày_bat_đau) <= now &&
        new Date(voucher.ngày_ket_thuc) >= now
    )
  })

  const getExpiredVouchers = computed(() => {
    const now = new Date()
    return getAllVouchers.value.filter(voucher => new Date(voucher.ngày_ket_thuc) < now)
  })

  const getUpcomingVouchers = computed(() => {
    const now = new Date()
    return getAllVouchers.value.filter(voucher => new Date(voucher.ngày_bat_đau) > now)
  })

  const getAllPersonalVouchers = computed(() =>
    personalVouchers.value.filter(item => !item.deleted)
  )

  const getPersonalVouchersByCustomer = computed(
    () => customerId => getAllPersonalVouchers.value.filter(pv => pv.id_khach_hang === customerId)
  )

  const getVoucherById = computed(() => id => vouchers.value.find(v => v.id === id && !v.deleted))

  // Statistics
  const voucherStats = computed(() => ({
    totalVouchers: getAllVouchers.value.length,
    activeVouchers: getActiveVouchers.value.length,
    expiredVouchers: getExpiredVouchers.value.length,
    upcomingVouchers: getUpcomingVouchers.value.length,
    totalPersonalVouchers: getAllPersonalVouchers.value.length,
    usedPersonalVouchers: getAllPersonalVouchers.value.filter(pv => pv.trang_thai === 'used')
      .length,
    availablePersonalVouchers: getAllPersonalVouchers.value.filter(
      pv => pv.trang_thai === 'available'
    ).length
  }))

  // Actions
  const fetchVouchers = async () => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/vouchers')
      if (!response.ok) throw new Error('Failed to fetch vouchers')

      const data = await response.json()
      vouchers.value = data.data || []
    } catch (err) {
      error.value = 'Failed to fetch vouchers'
      console.error('Vouchers fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchPersonalVouchers = async () => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/personal-vouchers')
      if (!response.ok) throw new Error('Failed to fetch personal vouchers')

      const data = await response.json()
      personalVouchers.value = data.data || []
    } catch (err) {
      error.value = 'Failed to fetch personal vouchers'
      console.error('Personal vouchers fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchAll = async () => {
    await Promise.all([fetchVouchers(), fetchPersonalVouchers()])
  }

  const createVoucher = async voucherData => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ten_phieu_giam_gia: voucherData.ten_phieu_giam_gia,
          chi_phieu_giam_gia: voucherData.chi_phieu_giam_gia,
          so_luong: voucherData.so_luong,
          ngày_bat_đau: voucherData.ngày_bat_đau,
          ngày_ket_thuc: voucherData.ngày_ket_thuc,
          trang_thai: voucherData.trang_thai || 'active',
          deleted: false
        })
      })

      if (!response.ok) throw new Error('Failed to create voucher')

      const newVoucher = await response.json()
      vouchers.value.push(newVoucher.data)

      return newVoucher.data
    } catch (err) {
      error.value = 'Failed to create voucher'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateVoucher = async (id, voucherData) => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/vouchers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(voucherData)
      })

      if (!response.ok) throw new Error('Failed to update voucher')

      const updatedVoucher = await response.json()
      const index = vouchers.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vouchers.value[index] = updatedVoucher.data
      }

      return updatedVoucher.data
    } catch (err) {
      error.value = 'Failed to update voucher'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteVoucher = async id => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/vouchers/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete voucher')

      // Soft delete
      const index = vouchers.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vouchers.value[index].deleted = true
      }
    } catch (err) {
      error.value = 'Failed to delete voucher'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createPersonalVoucher = async personalVoucherData => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/personal-vouchers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_khach_hang: personalVoucherData.id_khach_hang,
          id_phieu_giam_gia: personalVoucherData.id_phieu_giam_gia,
          ten_phieu_giam_gia_ca_nhan: personalVoucherData.ten_phieu_giam_gia_ca_nhan,
          ngày_sinh: personalVoucherData.ngày_sinh,
          ngày_het_han: personalVoucherData.ngày_het_han,
          trang_thai: personalVoucherData.trang_thai || 'available',
          deleted: false
        })
      })

      if (!response.ok) throw new Error('Failed to create personal voucher')

      const newPersonalVoucher = await response.json()
      personalVouchers.value.push(newPersonalVoucher.data)

      return newPersonalVoucher.data
    } catch (err) {
      error.value = 'Failed to create personal voucher'
      throw err
    } finally {
      loading.value = false
    }
  }

  const assignVoucherToCustomers = async (voucherId, customerIds) => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/vouchers/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voucher_id: voucherId,
          customer_ids: customerIds
        })
      })

      if (!response.ok) throw new Error('Failed to assign voucher to customers')

      const result = await response.json()
      // Refresh personal vouchers to get the new assignments
      await fetchPersonalVouchers()

      return result.data
    } catch (err) {
      error.value = 'Failed to assign voucher to customers'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updatePersonalVoucher = async (id, personalVoucherData) => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/personal-vouchers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(personalVoucherData)
      })

      if (!response.ok) throw new Error('Failed to update personal voucher')

      const updatedPersonalVoucher = await response.json()
      const index = personalVouchers.value.findIndex(pv => pv.id === id)
      if (index !== -1) {
        personalVouchers.value[index] = updatedPersonalVoucher.data
      }

      return updatedPersonalVoucher.data
    } catch (err) {
      error.value = 'Failed to update personal voucher'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Bulk operations
  const bulkCreatePersonalVouchers = async (voucherId, customerIds) => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/personal-vouchers/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          voucher_id: voucherId,
          customer_ids: customerIds
        })
      })

      if (!response.ok) throw new Error('Failed to bulk create personal vouchers')

      const result = await response.json()
      personalVouchers.value.push(...result.data)

      return result.data
    } catch (err) {
      error.value = 'Failed to bulk create personal vouchers'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search functionality
  const searchVouchers = computed(() => query => {
    if (!query) return getAllVouchers.value

    const searchTerm = query.toLowerCase()
    return getAllVouchers.value.filter(voucher =>
      voucher.ten_phieu_giam_gia.toLowerCase().includes(searchTerm)
    )
  })

  // Filter by status
  const filterVouchersByStatus = computed(() => status => {
    return getAllVouchers.value.filter(voucher => voucher.trang_thai === status)
  })

  const filterPersonalVouchersByStatus = computed(() => status => {
    return getAllPersonalVouchers.value.filter(pv => pv.trang_thai === status)
  })

  return {
    // State
    vouchers,
    personalVouchers,
    loading,
    error,

    // Getters
    getAllVouchers,
    getActiveVouchers,
    getExpiredVouchers,
    getUpcomingVouchers,
    getAllPersonalVouchers,
    getPersonalVouchersByCustomer,
    getVoucherById,
    voucherStats,
    searchVouchers,
    filterVouchersByStatus,
    filterPersonalVouchersByStatus,

    // Actions
    fetchVouchers,
    fetchPersonalVouchers,
    fetchAll,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    createPersonalVoucher,
    assignVoucherToCustomers,
    updatePersonalVoucher,
    bulkCreatePersonalVouchers
  }
})
