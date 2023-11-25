<template>
  <div class="px-8 py-12">
    <div class="text-2xl font-semibold">資料上傳區</div>
    <div class="flex space-x-20 px-12 py-4">
      <div class="flex flex-col space-y-6">
        <t-select v-model="categoryValue" :options="categoryOptions" label="資料類別" />
        <t-select
          v-if="categoryValue == '1'"
          v-model="admsMethodValue"
          :options="admsMethodOptions"
          label="入學方式"
        />
        <t-form>
          <t-form-item label="年份">
            <t-input-number v-model="yearValue" :min="106" :max="107" />
          </t-form-item>
        </t-form>
      </div>
      <div>
        <div>選擇檔案：請使用 .xlsx 檔</div>
        <t-upload
          ref="uploadRef"
          v-model="files"
          draggable
          :auto-upload="false"
          :request-method="requestMethod"
          :on-fail="handleUploadFail"
          placeholder="請上傳 .xlsx 檔"
        />
      </div>
    </div>

    <t-divider />

    <div class="text-2xl font-semibold">現有資料</div>
  </div>
</template>

<script setup lang="ts">
import { type UploadFile, type UploadFailContext, MessagePlugin } from 'tdesign-vue-next'
import { useAuthStore } from '@/stores/auth'

const config = useRuntimeConfig()
const authStore = useAuthStore()

const categoryValue = ref('')
const categoryOptions = [{ label: '入學資料', value: '1' }]

const admsMethodValue = ref('')
const admsMethodOptions = [
  { label: '繁星推薦', value: '1' },
  { label: '申請入學_一般組', value: '2' },
  { label: '申請入學_APCS組', value: '3' },
]

const yearValue = ref(107)
const files = ref([])
const apiURL = ref('')

interface uploadFileRes {
  error: string
  data: string
}

const uploadRef = ref()

const requestMethod = async (file: UploadFile) => {
  apiURL.value = ''
  if (categoryValue.value === '1') {
    if (admsMethodValue.value === '1') apiURL.value = '/upload_star_plan'
    else if (admsMethodValue.value === '2') apiURL.value = '/upload_apply_general'
    else if (admsMethodValue.value === '3') apiURL.value = '/upload_apply_apcs'

    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return new Promise((resolve) => {
        resolve({ status: 'fail', error: '檔案格式錯誤' })
      })
    }
    if (apiURL.value === '') {
      return new Promise((resolve) => {
        resolve({ status: 'fail', error: '請選擇資料類型、入學方式' })
      })
    }

    const formData = new FormData()
    formData.append('year', yearValue.value.toString())
    if (file.raw) {
      const fileBlob = new Blob([file.raw], { type: file.type })
      formData.append('file', fileBlob)
    }
    const { data } = await useFetch<uploadFileRes>(config.public.apiBase + apiURL.value, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + authStore.token,
      },
      body: formData,
    })

    if (data.value) {
      if (data.value.error) {
        return new Promise((resolve) => {
          resolve({ status: 'fail', error: '上傳失敗' })
        })
      }
      return new Promise((resolve) => {
        resolve({ status: 'success', response: { url: '.' } })
      })
    }
  }
}

const handleUploadFail = (e: UploadFailContext) => {
  MessagePlugin.error(e.response.error)
}
</script>
