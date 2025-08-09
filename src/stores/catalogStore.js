// Pinia store cho Catalog: lưu và đồng bộ trạng thái bộ lọc + chế độ xem
import { defineStore } from 'pinia'

const STORAGE_KEY = 'gearup-catalog'

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    q: '',
    brand: '',
    category: '',
    sort: '',
    minPrice: '',
    maxPrice: '',
    inStockOnly: false,
    viewMode: 'grid',
    page: 1
  }),
  getters: {
    queryObject: s => ({
      q: s.q || undefined,
      brand: s.brand || undefined,
      category: s.category || undefined,
      sort: s.sort || undefined,
      minPrice: s.minPrice || undefined,
      maxPrice: s.maxPrice || undefined,
      inStockOnly: s.inStockOnly || undefined,
      page: s.page > 1 ? s.page : undefined
    })
  },
  actions: {
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) Object.assign(this, JSON.parse(raw))
      } catch {}
    },
    persist() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            q: this.q,
            brand: this.brand,
            category: this.category,
            sort: this.sort,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            inStockOnly: this.inStockOnly,
            viewMode: this.viewMode,
            page: this.page
          })
        )
      } catch {}
    },
    resetFilters() {
      this.brand = ''
      this.category = ''
      this.sort = ''
      this.minPrice = ''
      this.maxPrice = ''
      this.inStockOnly = false
      this.page = 1
      this.persist()
    },
    setFromQuery(query = {}) {
      this.q = query.q || ''
      this.brand = query.brand || ''
      this.category = query.category || ''
      this.sort = query.sort || ''
      this.minPrice = query.minPrice || ''
      this.maxPrice = query.maxPrice || ''
      this.inStockOnly = query.inStockOnly === 'true' || query.inStockOnly === true
      const p = Number(query.page)
      this.page = Number.isFinite(p) && p > 0 ? p : 1
      this.persist()
    }
  }
})
