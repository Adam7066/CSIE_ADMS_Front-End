<template>
  <div class="w-auto rounded-3xl px-8 py-12">
    <div class="flex flex-col items-center justify-center">
      <div class="m-2 p-2 text-3xl">招生委員會獨門秘笈 (^_^)</div>
      <div class="w-1/2 rounded-md border-2 border-gray-300 bg-blue-50 p-4">
        <div class="p-2 text-center text-4xl font-bold text-gray-700">登入</div>
        <div class="text-center text-gray-500">請輸入您的帳號密碼</div>
        <t-form ref="form" class="!mt-4 !p-4" :data="account" :colon="true" :label-width="0">
          <t-form-item class="my-4" name="account">
            <t-input v-model="account.email" clearable placeholder="電子郵件">
              <template #prefix-icon>
                <desktop-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item name="password">
            <t-input v-model="account.password" type="password" clearable placeholder="密碼">
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
import { ref } from 'vue'

const account = ref({
  email: 'hsujinho@gmail.com',
  password: '1234567890',
})

const local = 'http://localhost:8000'
const url = local + '/login'
const router = useRouter()

const login = async () => {
  const { data, status } = await useFetch(url, {
    method: 'POST',
    body: JSON.stringify(account.value),
  })

  console.log(data)

  if (status.value === 'success') {
    router.push('/dashboard')
  }
}
</script>
