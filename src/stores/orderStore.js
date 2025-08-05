import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getOrderById: (state) => (id) => {
      return state.orders.find(order => order.id === id)
    },
    totalOrders: (state) => state.orders.length,
    totalRevenue: (state) => {
      return state.orders.reduce((sum, order) => sum + order.total, 0)
    }
  },
  
  actions: {
    async fetchOrders() {
      this.loading = true
      try {
        // API call sẽ được thêm sau
        this.loading = false
      } catch (error) {
        this.error = error.message
        this.loading = false
      }
    },
    
    async createOrder(order) {
      try {
        // API call
      } catch (error) {
        this.error = error.message
      }
    },
    
    async updateOrderStatus(id, status) {
      try {
        // API call
        const index = this.orders.findIndex(o => o.id === id)
        if (index !== -1) {
          this.orders[index].status = status
        }
      } catch (error) {
        this.error = error.message
      }
    }
  }
})
