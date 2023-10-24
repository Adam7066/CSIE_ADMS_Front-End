<template>
  <div class="min-h-screen w-auto px-8 py-12">
    <div class="flex flex-col items-center justify-center">
      <div class="m-2 self-start p-2 text-3xl">帳號列表</div>
      <div class="min-h-[512px] w-auto rounded-md border-2 border-gray-300 bg-white p-4">
        <t-table v-if="users.length > 0" row-key="id" :data="users" :columns="col"></t-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const col = ref([
  { title: '名稱', colKey: 'username' },
  { title: '電子郵件', colKey: 'email' },
  { title: '身份', colKey: 'role' },
  { title: '建立時間', colKey: 'created_at' },
])

interface user {
  id: number
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

interface userResData {
  code: number
  msg: string
  data: user[]
}

const { data } = await useFetch<userResData>(config.public.apiBase + '/get_users', {
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + authStore.token,
  },
})

const users = computed(() => data.value?.data ?? [])
</script>
