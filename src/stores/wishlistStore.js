// Store Wishlist: lưu danh sách yêu thích của khách hàng (persist localStorage)
import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] // [{ id, name, price, image }]
  }),
  getters: {
    count: (s) => s.items.length,
    has: (s) => (id) => s.items.some(i => i.id === id)
  },
  actions: {
    load() {
      try {
        const raw = localStorage.getItem('wishlist')
        this.items = raw ? JSON.parse(raw) : []
      } catch { this.items = [] }
    },
    save() { localStorage.setItem('wishlist', JSON.stringify(this.items)) },
    toggle(product) {
      const idx = this.items.findIndex(i => i.id === product.id)
      if (idx >= 0) {
        this.items.splice(idx, 1)
      } else {
        this.items.push({ id: product.id, name: product.name, price: product.price, image: product.image })
      }
      this.save()
    }
  }
})


