import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './authStore'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('logs in with demo credentials', async () => {
    const store = useAuthStore()
    const ok = await store.login({ username: 'admin', password: 'admin' })
    expect(ok).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(localStorage.getItem('token')).toBeTruthy()
  })

  it('logout clears token', () => {
    const store = useAuthStore()
    store.token = 'x'
    store.logout()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('token')).toBeNull()
  })
})
