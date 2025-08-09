// Enhanced Product Variant Store - Matches ERD sản_phẩm_chi_tiết
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAttributeStore } from './attributeStore.js'
import { useManufacturerStore } from './manufacturerStore.js'

export const useProductVariantStore = defineStore('productVariant', () => {
  // State
  const variants = ref([]) // sản_phẩm_chi_tiết
  const loading = ref(false)
  const error = ref(null)

  // Get access to other stores
  const attributeStore = useAttributeStore()
  const manufacturerStore = useManufacturerStore()

  // Getters
  const getAllVariants = computed(() => variants.value.filter(variant => !variant.deleted))

  // Get variants for a specific product
  const getVariantsByProductId = computed(() => productId => {
    return getAllVariants.value.filter(variant => variant.id_sản_phẩm === productId)
  })

  // Get variant by combination of attributes
  const getVariantByAttributes = computed(() => (productId, colorId, sizeId) => {
    return getAllVariants.value.find(
      variant =>
        variant.id_sản_phẩm === productId &&
        variant.id_mau_sac === colorId &&
        variant.id_kich_thuoc === sizeId
    )
  })

  // Calculate total stock for a product across all variants
  const getTotalStockByProduct = computed(() => productId => {
    return getVariantsByProductId
      .value(productId)
      .reduce((total, variant) => total + (variant.stock || 0), 0)
  })

  // Get low stock variants (configurable threshold)
  const getLowStockVariants = computed(() => (threshold = 10) => {
    return getAllVariants.value.filter(variant => variant.stock <= threshold)
  })

  // Get available size/color combinations for a product
  const getAvailableCombinations = computed(() => productId => {
    const productVariants = getVariantsByProductId.value(productId)
    const combinations = []

    productVariants.forEach(variant => {
      const color = attributeStore.getAllColors.find(c => c.id === variant.id_mau_sac)
      const size = attributeStore.getAllSizes.find(s => s.id === variant.id_kich_thuoc)

      if (color && size) {
        combinations.push({
          variantId: variant.id,
          colorId: color.id,
          colorName: color.ten_mau_sac,
          colorCode: color.ma_mau_sac,
          sizeId: size.id,
          sizeName: size.ten_kich_thuoc,
          sizeCode: size.ma_kich_thuoc,
          stock: variant.stock,
          price: variant.price,
          productDetails: variant
        })
      }
    })

    return combinations
  })

  // Get variant with full attribute details
  const getVariantWithDetails = computed(() => variantId => {
    const variant = getAllVariants.value.find(v => v.id === variantId)
    if (!variant) return null

    return {
      ...variant,
      color: attributeStore.getAllColors.find(c => c.id === variant.id_mau_sac),
      size: attributeStore.getAllSizes.find(s => s.id === variant.id_kich_thuoc),
      material: attributeStore.getAllMaterials.find(m => m.id === variant.id_chat_lieu),
      soleType: attributeStore.getAllSoleTypes.find(st => st.id === variant.id_de_giay),
      insoleType: attributeStore.getAllInsoleTypes.find(it => it.id === variant.id_dem_giay),
      weight: attributeStore.getAllWeights.find(w => w.id === variant.id_trong_luong),
      sportsSeason: attributeStore.getAllSportsSeasons.find(
        ss => ss.id === variant.id_mon_the_thao
      ),
      rainType: attributeStore.getAllRainTypes.find(rt => rt.id === variant.id_loai_mua),
      durability: attributeStore.getAllDurabilities.find(d => d.id === variant.id_do_ben),
      waterproofLevel: attributeStore.getAllWaterproofLevels.find(
        wl => wl.id === variant.id_chong_nuoc
      ),
      manufacturer: manufacturerStore.getManufacturerById(variant.id_nha_san_xuat),
      origin: manufacturerStore.getOriginById(variant.id_xuat_xu)
    }
  })

  // Statistics
  const variantStats = computed(() => ({
    totalVariants: getAllVariants.value.length,
    lowStockVariants: getLowStockVariants.value(10).length,
    outOfStockVariants: getAllVariants.value.filter(v => v.stock === 0).length,
    totalValue: getAllVariants.value.reduce((sum, v) => sum + v.price * v.stock, 0)
  }))

  // Actions
  const fetchVariants = async () => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/product-variants')
      if (!response.ok) throw new Error('Failed to fetch variants')

      const data = await response.json()
      variants.value = data.data || []
    } catch (err) {
      error.value = 'Failed to fetch product variants'
      console.error('Product variants fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchVariantsByProduct = async productId => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/products/${productId}/variants`)
      if (!response.ok) throw new Error('Failed to fetch product variants')

      const data = await response.json()

      // Replace variants for this product
      variants.value = variants.value.filter(v => v.id_sản_phẩm !== productId)
      variants.value.push(...(data.data || []))

      return data.data
    } catch (err) {
      error.value = 'Failed to fetch product variants'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create variants for a product with size/color matrix
  const createVariantsMatrix = async (
    productId,
    selectedColors,
    selectedSizes,
    basePrice,
    attributes
  ) => {
    loading.value = true
    try {
      const variantsToCreate = []

      // Generate all combinations of selected colors and sizes
      for (const color of selectedColors) {
        for (const size of selectedSizes) {
          const variant = {
            id_sản_phẩm: productId,
            id_mau_sac: color.id,
            id_kich_thuoc: size.id,
            id_gia_pham: attributes.discountId || null,
            ma_san_pham: `${productId}-${color.ma_mau_sac}-${size.ma_kich_thuoc}`,
            ten_san_pham: `${attributes.baseName} - ${color.ten_mau_sac} - ${size.ten_kich_thuoc}`,
            price: basePrice,
            stock: attributes.initialStock || 0,
            // Apply additional attributes from ERD
            id_chat_lieu: attributes.materialId || null,
            id_de_giay: attributes.soleTypeId || null,
            id_dem_giay: attributes.insoleTypeId || null,
            id_trong_luong: attributes.weightId || null,
            id_mon_the_thao: attributes.sportsSeasonId || null,
            id_loai_mua: attributes.rainTypeId || null,
            id_do_ben: attributes.durabilityId || null,
            id_chong_nuoc: attributes.waterproofId || null,
            id_nha_san_xuat: attributes.manufacturerId || null,
            id_xuat_xu: attributes.originId || null,
            deleted: false
          }
          variantsToCreate.push(variant)
        }
      }

      // Bulk create variants
      const response = await fetch('/api/admin/product-variants/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variants: variantsToCreate })
      })

      if (!response.ok) throw new Error('Failed to create variants')

      const result = await response.json()
      variants.value.push(...result.data)

      return result.data
    } catch (err) {
      error.value = 'Failed to create variants matrix'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createSingleVariant = async variantData => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/product-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...variantData,
          deleted: false
        })
      })

      if (!response.ok) throw new Error('Failed to create variant')

      const result = await response.json()
      variants.value.push(result.data)

      return result.data
    } catch (err) {
      error.value = 'Failed to create variant'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update variant stock and pricing
  const updateVariant = async (variantId, updates) => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/product-variants/${variantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update variant')

      const result = await response.json()
      const index = variants.value.findIndex(v => v.id === variantId)
      if (index !== -1) {
        variants.value[index] = { ...variants.value[index], ...result.data }
      }

      return result.data
    } catch (err) {
      error.value = 'Failed to update variant'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Bulk update variants (useful for pricing updates)
  const bulkUpdateVariants = async updates => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/product-variants/bulk-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      })

      if (!response.ok) throw new Error('Failed to bulk update variants')

      const result = await response.json()

      // Update local state
      updates.forEach(update => {
        const index = variants.value.findIndex(v => v.id === update.id)
        if (index !== -1) {
          variants.value[index] = { ...variants.value[index], ...update }
        }
      })

      return result.data
    } catch (err) {
      error.value = 'Failed to bulk update variants'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete variant (soft delete)
  const deleteVariant = async variantId => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/product-variants/${variantId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete variant')

      // Update local state - soft delete
      const index = variants.value.findIndex(v => v.id === variantId)
      if (index !== -1) {
        variants.value[index].deleted = true
      }
    } catch (err) {
      error.value = 'Failed to delete variant'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Bulk stock update
  const bulkUpdateStock = async stockUpdates => {
    loading.value = true
    try {
      const response = await fetch('/api/admin/product-variants/bulk-stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: stockUpdates })
      })

      if (!response.ok) throw new Error('Failed to bulk update stock')

      const result = await response.json()

      // Update local state
      stockUpdates.forEach(update => {
        const index = variants.value.findIndex(v => v.id === update.variantId)
        if (index !== -1) {
          variants.value[index].stock = update.stock
        }
      })

      return result.data
    } catch (err) {
      error.value = 'Failed to bulk update stock'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Search functionality
  const searchVariants = computed(() => query => {
    if (!query) return getAllVariants.value

    const searchTerm = query.toLowerCase()
    return getAllVariants.value.filter(
      variant =>
        variant.ten_san_pham.toLowerCase().includes(searchTerm) ||
        variant.ma_san_pham.toLowerCase().includes(searchTerm)
    )
  })

  // Clear error state
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    variants,
    loading,
    error,

    // Getters
    getAllVariants,
    getVariantsByProductId,
    getVariantByAttributes,
    getTotalStockByProduct,
    getLowStockVariants,
    getAvailableCombinations,
    getVariantWithDetails,
    variantStats,
    searchVariants,

    // Actions
    fetchVariants,
    fetchVariantsByProduct,
    createVariantsMatrix,
    createSingleVariant,
    updateVariant,
    bulkUpdateVariants,
    deleteVariant,
    bulkUpdateStock,
    clearError
  }
})
