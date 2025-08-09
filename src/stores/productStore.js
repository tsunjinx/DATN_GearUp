import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    error: null
  }),

  getters: {
    getProductById: state => id => {
      return state.products.find(product => product.id === id)
    },
    totalProducts: state => state.products.length
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        // API call sẽ được thêm sau
        // const response = await api.get('/products')
        // this.products = response.data
        this.loading = false
      } catch (error) {
        this.error = error.message
        this.loading = false
      }
    },

    async addProduct(product) {
      try {
        // API call
        // const response = await api.post('/products', product)
        // this.products.push(response.data)
      } catch (error) {
        this.error = error.message
      }
    },

    async updateProduct(id, product) {
      try {
        // API call
        // const response = await api.put(`/products/${id}`, product)
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...product }
        }
      } catch (error) {
        this.error = error.message
      }
    },

    async deleteProduct(id) {
      try {
        // API call
        // await api.delete(`/products/${id}`)
        this.products = this.products.filter(p => p.id !== id)
      } catch (error) {
        this.error = error.message
      }
    }
  }
})
