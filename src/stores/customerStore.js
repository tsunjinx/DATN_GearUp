import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getCustomerById: (state) => (id) => {
      return state.customers.find(customer => customer.id === id)
    },
    totalCustomers: (state) => state.customers.length
  },
  
  actions: {
    async fetchCustomers() {
      this.loading = true
      try {
        // API call sẽ được thêm sau
        this.loading = false
      } catch (error) {
        this.error = error.message
        this.loading = false
      }
    },
    
    async addCustomer(customer) {
      try {
        // API call
      } catch (error) {
        this.error = error.message
      }
    },
    
    async updateCustomer(id, customer) {
      try {
        // API call
        const index = this.customers.findIndex(c => c.id === id)
        if (index !== -1) {
          this.customers[index] = { ...this.customers[index], ...customer }
        }
      } catch (error) {
        this.error = error.message
      }
    },
    
    async deleteCustomer(id) {
      try {
        // API call
        this.customers = this.customers.filter(c => c.id !== id)
      } catch (error) {
        this.error = error.message
      }
    }
  }
})
