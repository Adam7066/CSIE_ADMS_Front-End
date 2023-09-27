<template>
  <div class="w-auto rounded-3xl px-8 py-12">
    <div class="flex flex-col items-center justify-center">
      <div class="m-2 p-2 text-3xl">招生委員會獨門秘笈 (^_^)</div>
      <div class="w-1/2 rounded-md border-2 border-gray-300 bg-blue-50 p-4">
        <div class="p-2 text-center text-4xl font-bold text-gray-700">登入</div>
        <div class="text-center text-gray-500">請輸入您的帳號密碼</div>
        <t-form ref="form" class="!mt-4 !p-4" :data="loginForm" :colon="true" :label-width="0">
          <t-form-item class="my-4" name="account">
            <t-input v-model="loginForm.email" clearable placeholder="電子郵件">
              <template #prefix-icon>
                <desktop-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item name="password">
            <t-input v-model="loginForm.password" type="password" clearable placeholder="密碼">
              <template #prefix-icon>
                <lock-on-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item>
            <t-button theme="primary" type="submit" block @click="login">登入</t-button>
          </t-form-item>
        </t-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-vue-next'
import { useAuthStore } from '@/stores/auth'

const config = useRuntimeConfig()
const router = useRouter()

const loginForm = ref({
  email: '',
  password: '',
})

interface AuthData {
  token: string
  username: string
}

interface LoginResData {
  code: number
  msg: string
  data: AuthData
}

const authStore = useAuthStore()

const login = async () => {
  const { data } = await useFetch<LoginResData>(config.public.apiBase + '/login', {
    method: 'POST',
    body: JSON.stringify(loginForm.value),
  })
  if (data.value) {
    if (data.value.msg !== 'success') {
      alert(data.value.msg) // TODO: change to warning toast
      return
    }
    const resData = data.value.data
    authStore.setToken(resData.token)
    authStore.setUsername(resData.username)
    if (authStore.isLoggedIn) loginAfter()
  }
}

const loginAfter = () => {
  router.push('/dashboard')
}
</script>
