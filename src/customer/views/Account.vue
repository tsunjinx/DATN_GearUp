<template>
  <div class="account">
    <div class="tabs">
      <button :class="{ active: tab==='login' }" @click="tab='login'">Đăng nhập</button>
      <button :class="{ active: tab==='register' }" @click="tab='register'">Đăng ký</button>
    </div>
    <form v-if="tab==='login'" class="form" @submit.prevent="submitLogin">
      <FormControl label="Tên đăng nhập" v-model="loginForm.username" required />
      <FormControl label="Mật khẩu" type="password" v-model="loginForm.password" required />
      <Button type="submit" :disabled="auth.loading">Đăng nhập</Button>
      <div v-if="auth.error" class="text-error">{{ auth.error }}</div>
    </form>
    <form v-else class="form" @submit.prevent="submitRegister">
      <FormControl label="Email" v-model="registerForm.email" required />
      <FormControl label="Tên đăng nhập" v-model="registerForm.username" required />
      <FormControl label="Mật khẩu" type="password" v-model="registerForm.password" required />
      <Button type="submit">Tạo tài khoản</Button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button, FormControl } from '@/components/ui'
import useAuth from '@/composables/useAuth'

const tab = ref('login')
const auth = useAuth()
const loginForm = ref({ username: '', password: '' })
const registerForm = ref({ email: '', username: '', password: '' })

const submitLogin = async () => {
  const ok = await auth.login(loginForm.value)
  if (ok) window.location.href = '/shop'
}
const submitRegister = async () => {
  await new Promise(r => setTimeout(r, 600))
  tab.value = 'login'
}
</script>

<style scoped>
.tabs { display:flex; gap: 8px; margin-bottom: 12px }
.tabs button { padding: 8px 12px; border:1px solid var(--border); border-radius: 8px; background:#fff; cursor:pointer }
.tabs button.active { background: var(--primary-50); border-color: var(--primary-300); color: var(--primary-700) }
.form { display:grid; gap: 12px; max-width: 400px }
</style>


