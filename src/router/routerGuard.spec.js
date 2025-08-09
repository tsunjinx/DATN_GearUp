import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock auth store for routing tests
vi.mock('@/stores/authStore', () => {
  let isAuthenticated = false
  return {
    useAuthStore: () => ({
      get isAuthenticated() { return isAuthenticated },
      set isAuthenticated(v) { isAuthenticated = v },
      async checkAuth() { return isAuthenticated }
    })
  }
})

import router from './index.js'
import { useAuthStore } from '@/stores/authStore'

describe('router guards', () => {
  beforeEach(async () => {
    // Reset to login state
    localStorage.removeItem('token')
  })

  it('redirects unauthenticated user to /login for protected routes', async () => {
    await router.push('/')
    await router.isReady()
  expect(router.currentRoute.value.path).toBe('/admin/login')
  })

  it.todo('redirects authenticated user away from /login to /')
})


