// Pinia store giỏ hàng (cart): lưu trữ sản phẩm, số lượng, tổng tiền và đồng bộ với localStorage.
import { defineStore } from 'pinia'

const STORAGE_KEY = 'gearup-cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  getters: {
    count: s => s.items.reduce((n, i) => n + i.quantity, 0),
    total: s => s.items.reduce((n, i) => n + i.price * i.quantity, 0)
  },
  actions: {
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) this.items = JSON.parse(raw)
      } catch {}
    },
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      } catch {}
    },
    add(product, quantity = 1) {
      const idx = this.items.findIndex(i => i.id === product.id)
      if (idx === -1) {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity
        })
      } else {
        this.items[idx].quantity += quantity
      }
      this.persist()
    },
    updateQuantity(id, quantity) {
      const idx = this.items.findIndex(i => i.id === id)
      if (idx !== -1) {
        this.items[idx].quantity = Math.max(1, Number(quantity) || 1)
        this.persist()
      }
    },
    remove(id) {
      this.items = this.items.filter(i => i.id !== id)
      this.persist()
    },
    clear() {
      this.items = []
      this.persist()
    }
  }
})
