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
        <t-select
          v-else-if="categoryValue == '2'"
          v-model="rankMethodValue"
          :options="rankMethodOptions"
          label="檔案類別"
        />
        <t-form>
          <t-form-item label="年份">
            <t-input-number v-model="yearValue" :min="106" :max="112" />
          </t-form-item>
          <t-form-item v-if="categoryValue == '2'" label="學期">
            <t-input-number v-model="semesterValue" :min="1" :max="2" />
          </t-form-item>
        </t-form>
      </div>
      <div>
        <div>選擇檔案：請使用 .xlsx 檔</div>
        <t-upload
          ref="uploadRef"
          v-model="files"
          :draggable="true"
          :auto-upload="false"
          :request-method="requestMethod"
          :on-fail="handleUploadFail"
          placeholder="請上傳 .xlsx 檔"
        />
      </div>
      <div>
        <div class="text-lg font-medium">範例格式檔案下載區</div>
        <t-space direction="vertical" class="ml-4 mt-2">
          <t-link
            v-for="(item, index) in sampleFormat"
            :key="index"
            :href="'/files/sample_format/' + item.filename"
            theme="primary"
            :underline="true"
            download
          >
            {{ item.label }}
          </t-link>
        </t-space>
      </div>
    </div>

    <t-divider />

    <div class="text-2xl font-semibold">現有資料</div>
    <div class="flex flex-col space-y-4 p-4">
      <div class="flex w-96 space-x-8">
        <t-select v-model="nowDataYearValue" label="系級：" :options="nowDataYearOptions" />
        <t-button @click="getStuData">取得資料</t-button>
      </div>
      <div class="w-full rounded-xl border-2 bg-white p-4">
        <t-table
          row-key="id"
          :columns="columns"
          :data="stuData"
          :bordered="true"
          :max-height="600"
          :loading="getStuDataPending"
        >
          <template #operation="{ row }">
            <t-button variant="text" theme="primary" @click="editStuData(row.id)">編輯</t-button>
          </template>
        </t-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type UploadFile, type UploadFailContext, MessagePlugin } from 'tdesign-vue-next'
import { useAuthStore } from '@/stores/auth'

onMounted(() => {
  getStudentYears()
})

const config = useRuntimeConfig()
const authStore = useAuthStore()

const categoryValue = ref('')
const categoryOptions = [
  { label: '入學資料', value: '1' },
  { label: '成績排名', value: '2' },
]

const admsMethodValue = ref('')
const admsMethodOptions = [
  { label: '繁星推薦', value: '1' },
  { label: '申請入學_一般組', value: '2' },
  { label: '申請入學_APCS組', value: '3' },
]

const rankMethodValue = ref('')
const rankMethodOptions = [
  { label: '當學期', value: '1' },
  { label: '歷年', value: '2' },
]

const yearValue = ref(107)
const semesterValue = ref(1)
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
    if (apiURL.value === '') {
      return new Promise((resolve) => {
        resolve({ status: 'fail', error: '請選擇資料類型、入學方式' })
      })
    }
  } else if (categoryValue.value === '2') {
    if (rankMethodValue.value === '1') apiURL.value = '/rank/upload_semester'
    else if (rankMethodValue.value === '2') apiURL.value = '/rank/upload_years'
    if (apiURL.value === '') {
      return new Promise((resolve) => {
        resolve({ status: 'fail', error: '請選擇資料類型、檔案類別' })
      })
    }
  }

  if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    return new Promise((resolve) => {
      resolve({ status: 'fail', error: '檔案格式錯誤' })
    })
  }

  const formData = new FormData()
  formData.append('year', yearValue.value.toString())
  if (categoryValue.value === '2') {
    formData.append('semester', semesterValue.value.toString())
  }
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

const handleUploadFail = (e: UploadFailContext) => {
  MessagePlugin.error(e.response.error)
}

const sampleFormat = [
  { label: '申請入學_一般組', filename: 'apply_general.xlsx' },
  { label: '申請入學_APCS組', filename: 'apply_apcs.xlsx' },
  { label: '繁星推薦', filename: 'star_plan.xlsx' },
  { label: '成績排名', filename: 'rank.xlsx' },
]

interface StudentYears {
  error: string
  data: number[]
}

const getStudentYears = async () => {
  const { data } = await useFetch<StudentYears>(config.public.apiBase + '/student/years', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + authStore.token,
    },
  })
  if (data.value) {
    if (data.value.error) {
      alert(data.value.error)
      return
    }
    nowDataYearOptions.value = data.value.data.map((item) => {
      return { label: (item + 4).toString() + ' 級', value: item }
    })
  }
}

const nowDataYearValue = ref('')
const nowDataYearOptions = ref<
  {
    label: string
    value: number
  }[]
>([])

const columns = ref([
  { title: '入學年度', colKey: 'admission_year' },
  { title: '學號', colKey: 'student_code' },
  { title: '姓名', colKey: 'name' },
  { title: '入學方式', colKey: 'admission_method' },
  { title: '入學組別', colKey: 'admission_group' },
  { title: '身分類別', colKey: 'identity_category' },
  { title: '畢業學校', colKey: 'graduated_school' },
  { title: '操作', colKey: 'operation' },
])

interface StuData {
  id: number
  name: string
  student_code: string
  admission_year: number
  admission_method: string
  admission_group: string
  identity_category: string
  graduated_school: string
}

interface StuRes {
  error: string
  data: StuData[]
}

const getStuDataPending = ref(false)
const stuData = ref<StuData[]>([])
const getStuData = async () => {
  getStuDataPending.value = true
  const { data: getStuData } = await useFetch<StuRes>(config.public.apiBase + '/students', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + authStore.token,
    },
    params: {
      year: nowDataYearValue.value,
    },
  })
  if (getStuData.value) {
    if (getStuData.value.error) {
      alert(getStuData.value.error)
      return
    }
    stuData.value = getStuData.value.data
  }
  getStuDataPending.value = false
}

const editStuData = (id: number) => {
  console.log(id)
}
</script>
