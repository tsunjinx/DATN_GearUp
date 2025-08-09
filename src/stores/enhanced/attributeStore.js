// Enhanced Attribute Store - Manages All Footwear Attributes from ERD
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAttributeStore = defineStore('attribute', () => {
  // State for all footwear attributes from ERD
  const colors = ref([]) // màu_sắc
  const sizes = ref([]) // kich_thuoc
  const materials = ref([]) // chât_liệu
  const soleTypes = ref([]) // dạ_giày
  const insoleTypes = ref([]) // dém_giày
  const weights = ref([]) // trung_luong
  const sportsSeasons = ref([]) // mùa_thể_thao
  const rainTypes = ref([]) // loại_mũa
  const durabilities = ref([]) // đỗ_bền
  const waterproofLevels = ref([]) // chống_nước
  
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const getAllColors = computed(() => colors.value.filter(item => !item.deleted))
  const getAllSizes = computed(() => sizes.value.filter(item => !item.deleted))
  const getAllMaterials = computed(() => materials.value.filter(item => !item.deleted))
  const getAllSoleTypes = computed(() => soleTypes.value.filter(item => !item.deleted))
  const getAllInsoleTypes = computed(() => insoleTypes.value.filter(item => !item.deleted))
  const getAllWeights = computed(() => weights.value.filter(item => !item.deleted))
  const getAllSportsSeasons = computed(() => sportsSeasons.value.filter(item => !item.deleted))
  const getAllRainTypes = computed(() => rainTypes.value.filter(item => !item.deleted))
  const getAllDurabilities = computed(() => durabilities.value.filter(item => !item.deleted))
  const getAllWaterproofLevels = computed(() => waterproofLevels.value.filter(item => !item.deleted))

  // Helper to get attribute by ID
  const getAttributeById = (attributeType, id) => {
    const mapping = {
      colors, sizes, materials, soleTypes, insoleTypes, 
      weights, sportsSeasons, rainTypes, durabilities, waterproofLevels
    }
    return mapping[attributeType]?.value.find(item => item.id === id)
  }

  // Actions
  const fetchAllAttributes = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Fetch all attributes in parallel
      const [
        colorsData, sizesData, materialsData, soleTypesData, insoleTypesData,
        weightsData, sportsSeasonsData, rainTypesData, durabilitiesData, waterproofData
      ] = await Promise.all([
        fetch('/api/admin/attributes/colors').then(r => r.json()),
        fetch('/api/admin/attributes/sizes').then(r => r.json()),
        fetch('/api/admin/attributes/materials').then(r => r.json()),
        fetch('/api/admin/attributes/sole-types').then(r => r.json()),
        fetch('/api/admin/attributes/insole-types').then(r => r.json()),
        fetch('/api/admin/attributes/weights').then(r => r.json()),
        fetch('/api/admin/attributes/sports-seasons').then(r => r.json()),
        fetch('/api/admin/attributes/rain-types').then(r => r.json()),
        fetch('/api/admin/attributes/durabilities').then(r => r.json()),
        fetch('/api/admin/attributes/waterproof-levels').then(r => r.json())
      ])

      colors.value = colorsData.data || []
      sizes.value = sizesData.data || []
      materials.value = materialsData.data || []
      soleTypes.value = soleTypesData.data || []
      insoleTypes.value = insoleTypesData.data || []
      weights.value = weightsData.data || []
      sportsSeasons.value = sportsSeasonsData.data || []
      rainTypes.value = rainTypesData.data || []
      durabilities.value = durabilitiesData.data || []
      waterproofLevels.value = waterproofData.data || []
      
    } catch (err) {
      error.value = 'Failed to fetch attributes'
      console.error('Attribute fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  const createAttribute = async (attributeType, data) => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/attributes/${attributeType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('Failed to create attribute')
      
      const newAttribute = await response.json()
      
      // Add to appropriate array
      const mapping = {
        colors, sizes, materials, soleTypes, insoleTypes,
        weights, sportsSeasons, rainTypes, durabilities, waterproofLevels
      }
      mapping[attributeType]?.value.push(newAttribute.data)
      
      return newAttribute.data
    } catch (err) {
      error.value = `Failed to create ${attributeType}`
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAttribute = async (attributeType, id, data) => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/attributes/${attributeType}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) throw new Error('Failed to update attribute')
      
      const updatedAttribute = await response.json()
      
      // Update in appropriate array
      const mapping = {
        colors, sizes, materials, soleTypes, insoleTypes,
        weights, sportsSeasons, rainTypes, durabilities, waterproofLevels
      }
      const targetArray = mapping[attributeType]?.value
      if (targetArray) {
        const index = targetArray.findIndex(item => item.id === id)
        if (index !== -1) {
          targetArray[index] = updatedAttribute.data
        }
      }
      
      return updatedAttribute.data
    } catch (err) {
      error.value = `Failed to update ${attributeType}`
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteAttribute = async (attributeType, id) => {
    loading.value = true
    try {
      const response = await fetch(`/api/admin/attributes/${attributeType}/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete attribute')
      
      // Soft delete - mark as deleted
      const mapping = {
        colors, sizes, materials, soleTypes, insoleTypes,
        weights, sportsSeasons, rainTypes, durabilities, waterproofLevels
      }
      const targetArray = mapping[attributeType]?.value
      if (targetArray) {
        const index = targetArray.findIndex(item => item.id === id)
        if (index !== -1) {
          targetArray[index].deleted = true
        }
      }
      
    } catch (err) {
      error.value = `Failed to delete ${attributeType}`
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    colors, sizes, materials, soleTypes, insoleTypes,
    weights, sportsSeasons, rainTypes, durabilities, waterproofLevels,
    loading, error,
    
    // Getters
    getAllColors, getAllSizes, getAllMaterials, getAllSoleTypes, getAllInsoleTypes,
    getAllWeights, getAllSportsSeasons, getAllRainTypes, getAllDurabilities, getAllWaterproofLevels,
    
    // Actions
    fetchAllAttributes, createAttribute, updateAttribute, deleteAttribute,
    getAttributeById
  }
})

