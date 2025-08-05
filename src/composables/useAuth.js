import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const useAuth = () => {
  const router = useRouter()
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Kiểm tra thông tin đăng nhập (demo)
      if (credentials.username === 'admin' && credentials.password === 'admin') {
        // Lưu token vào localStorage
        const authToken = 'demo-token-' + Math.random().toString(36).substring(2)
        localStorage.setItem('token', authToken)
        token.value = authToken
        
        user.value = {
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
      error.value = err.message || 'Có lỗi xảy ra khi đăng nhập'
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('remember')
    token.value = null
    user.value = null
    router.push('/login')
  }
  
  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      // Giả lập kiểm tra token với API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Trong thực tế, sẽ gọi API để kiểm tra token
      user.value = {
        id: 1,
        username: 'admin',
        name: 'Admin',
        role: 'admin'
      }
      
      return true
    } catch (err) {
      token.value = null
      localStorage.removeItem('token')
      return false
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
}

export default useAuth
