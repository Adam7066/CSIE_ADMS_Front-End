<template>
  <div class="w-full rounded-3xl bg-rose-100 px-8 py-12">
    <div class="flex flex-col items-center justify-center">
      <div class="text-4xl font-bold text-gray-700">登入</div>
      <div class="text-gray-500">請輸入您的帳號密碼</div>
    </div>
    <div class="mt-8 flex flex-col items-center justify-center">
      <div class="flex flex-col items-center justify-center">
        <div class="flex flex-row items-center justify-center">
          <div class="text-gray-500">帳號</div>
          <t-input v-model="account.email" class="ml-4 w-64" placeholder=" " />
        </div>
        <div class="mt-4 flex flex-row items-center justify-center">
          <div class="text-gray-500">密碼</div>
          <t-input v-model="account.password" class="ml-4 w-64" placeholder=" " />
        </div>
      </div>
      <div class="mt-8 flex flex-row items-center justify-center">
        <t-button variant="primary" shape="square">登入</t-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const account = ref({
  email: '',
  password: '',
})
</script>
