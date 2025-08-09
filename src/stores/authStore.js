import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: state => !!state.token,
    isAdmin: state => state.user?.role === 'admin',
    username: state => state.user?.username || 'Admin',
    displayName: state => state.user?.name || state.user?.username || 'Quản Trị Viên'
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        // Giả lập API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Kiểm tra thông tin đăng nhập (demo)
        if (credentials.username === 'admin' && credentials.password === 'admin') {
          // Lưu token vào localStorage
          const authToken = 'demo-token-' + Math.random().toString(36).substring(2)
          const refreshToken = 'demo-refresh-' + Math.random().toString(36).substring(2)
          localStorage.setItem('token', authToken)
          localStorage.setItem('refreshToken', refreshToken)
          this.token = authToken
          this.refreshToken = refreshToken

          this.user = {
            id: 1,
            username: credentials.username,
            name: 'Admin',
            role: 'admin'
          }

          if (credentials.remember) {
            localStorage.setItem('remember', 'true')
          }

          return true
        } else {
          throw new Error('Sai tên đăng nhập hoặc mật khẩu')
        }
      } catch (err) {
        this.error = err.message || 'Có lỗi xảy ra khi đăng nhập'
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('remember')
      this.token = null
      this.refreshToken = null
      this.user = null
    },

    async checkAuth() {
      if (!this.token) return false

      try {
        // Giả lập kiểm tra token với API
        await new Promise(resolve => setTimeout(resolve, 300))

        // Trong thực tế, sẽ gọi API để kiểm tra token
        this.user = {
          id: 1,
          username: 'admin',
          name: 'Admin',
          role: 'admin'
        }

        return true
      } catch (err) {
        this.token = null
        localStorage.removeItem('token')
        return false
      }
    }
  }
})
