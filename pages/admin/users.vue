<template>
  <div class="w-auto px-8 py-12">
    <div class="flex flex-col items-center justify-center">
      <div class="flex w-full items-center justify-between">
        <div class="m-2 self-start p-2 text-3xl">帳號列表</div>
        <div class="mr-8">
          <t-button @click="createUserVisible = true">新增</t-button>
        </div>
      </div>
      <div class="min-h-[512px] w-auto rounded-md border-2 border-gray-300 bg-white p-4">
        <t-table v-if="users.length > 0" row-key="id" :data="users" :columns="col"></t-table>
      </div>
    </div>

    <t-dialog v-model:visible="createUserVisible" header="新增使用者" :footer="false">
      <t-form
        ref="createUserForm"
        :rules="createUserFormRules"
        :data="createUserFormData"
        @submit="createUser"
      >
        <t-form-item label="信箱" name="email">
          <t-input v-model="createUserFormData.email" placeholder="請輸入信箱" />
        </t-form-item>
        <t-form-item label="密碼" name="password">
          <t-input v-model="createUserFormData.password" type="password" placeholder="請輸入密碼" />
        </t-form-item>
        <t-form-item label="名稱" name="username">
          <t-input v-model="createUserFormData.username" placeholder="請輸入名稱" />
        </t-form-item>
        <t-form-item label="身份組" name="role">
          <t-radio-group variant="primary-filled" default-value="user">
            <t-radio-button value="user">user</t-radio-button>
            <t-radio-button value="admin">admin</t-radio-button>
          </t-radio-group>
        </t-form-item>
        <div class="flex justify-end">
          <t-button type="submit">新增使用者</t-button>
        </div>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import { type SubmitContext } from 'tdesign-vue-next/lib/form/type'
import { useAuthStore } from '@/stores/auth'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const col = ref([
  { title: 'ID', colKey: 'id' },
  { title: '名稱', colKey: 'username' },
  { title: '電子郵件', colKey: 'email' },
  { title: '身份', colKey: 'role' },
  { title: '建立時間', colKey: 'created_at' },
  { title: '更新時間', colKey: 'updated_at' },
])

interface user {
  id: number
  username: string
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

const { data } = await useFetch<userResData>(config.public.apiBase + '/users', {
  method: 'GET',
  headers: {
    Authorization: 'Bearer ' + authStore.token,
  },
})

const users = computed(() => data.value?.data ?? [])

const createUserVisible = ref(false)
const createUserLoading = ref(false)
const createUserForm = ref(null)
const createUserFormData = ref({
  email: '',
  password: '',
  username: '',
  role: '',
})
const createUserFormRules = {
  email: [{ required: true, message: '信箱必填' }],
  password: [{ required: true, message: '密碼必填' }],
  username: [{ required: true, message: '名稱必填' }],
}

interface createUserResData {
  error: string
  data: string
}

const createUser = async ({ validateResult, firstError }: SubmitContext) => {
  if (validateResult !== true) {
    alert(firstError)
    return
  }

  createUserLoading.value = true
  const { data } = await useFetch<createUserResData>(config.public.apiBase + '/user', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + authStore.token,
    },
    body: JSON.stringify(createUserFormData.value),
  })
  if (data.value) {
    if (data.value.error) {
      alert(data.value.error)
      createUserLoading.value = false
      return
    }
    createUserVisible.value = false
    await MessagePlugin.success('新增成功')
    location.reload()
  }
}
</script>
