<template>
  <t-header>
    <t-head-menu theme="light" class="drop-shadow">
      <t-menu-item value="home" class="text-lg font-semibold" to="/">首頁</t-menu-item>

      <div v-if="authStore.isLoggedIn" class="flex">
        <t-menu-item value="analyze" class="text-lg font-semibold" to="/analyze">
          數據分析
        </t-menu-item>

        <div v-if="authStore.isAdmin" class="flex">
          <t-menu-item value="adminUsers" class="text-lg font-semibold" to="/admin/users">
            成員管理
          </t-menu-item>
          <t-menu-item value="adminData" class="text-lg font-semibold" to="/admin/data">
            資料管理
          </t-menu-item>
        </div>
      </div>

      <template #operations>
        <div v-if="authStore.isLoggedIn" class="flex">
          <t-menu-item value="logout" class="text-lg font-semibold" @click="logout">
            登出
          </t-menu-item>
        </div>
      </template>
    </t-head-menu>
  </t-header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const config = useRuntimeConfig()
const authStore = useAuthStore()
const router = useRouter()

interface LogoutResData {
  code: number
  msg: string
  data: string
}

const logout = async () => {
  const { data } = await useFetch<LogoutResData>(config.public.apiBase + '/logout', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + authStore.getToken,
    },
  })
  if (data.value) {
    if (data.value.msg !== 'success') {
      alert(data.value.msg) // TODO: change to warning toast
      return
    }
    logoutAfter()
  }
}

const logoutAfter = () => {
  authStore.logout()
  router.replace('/')
}
</script>
