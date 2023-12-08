<template>
  <ClientOnly>
    <div class="h-fit min-h-full w-full bg-blue-50 p-8">
      <div class="flex flex-col items-center justify-center space-y-4">
        <div class="ml-8 flex space-x-8 self-start">
          <t-select v-model="yearValue" label="系級：" :options="yearOptions" />
          <t-button @click="getStuData">取得資料</t-button>
        </div>
        <div class="w-full rounded-xl border-2 bg-pink-50 p-4">
          <t-table
            row-key="id"
            :columns="columns"
            :data="stuData"
            :bordered="true"
            :max-height="400"
            :selected-row-keys="selectedRowKeys"
            :loading="getStuDataPending"
            @select-change="rehandleSelectChange"
          />
        </div>

        <div class="ml-8 self-start">
          <t-button theme="success" variant="outline">取得所選學生「成績排名」資料</t-button>
        </div>
        <div class="h-96 w-full rounded-xl border-2 bg-green-50 p-4"></div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const config = useRuntimeConfig()
const authStore = useAuthStore()

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
    yearOptions.value = data.value.data.map((item) => {
      return { label: (item + 4).toString() + ' 級', value: item }
    })
  }
}
getStudentYears()

interface YearOptions {
  label: string
  value: number
}

const yearValue = ref('')
const yearOptions = ref<YearOptions[]>([])

const columns = ref([
  {
    colKey: 'row-select',
    type: 'single',
    checkProps: { allowUncheck: true },
  },
  { title: '入學年度', colKey: 'admission_year' },
  { title: '學號', colKey: 'student_code' },
  { title: '姓名', colKey: 'name' },
  { title: '入學方式', colKey: 'admission_method' },
  { title: '入學組別', colKey: 'admission_group' },
  { title: '身分類別', colKey: 'identity_category' },
  { title: '畢業學校', colKey: 'graduated_school' },
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
  const { data } = await useFetch<StuRes>(config.public.apiBase + '/students', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + authStore.token,
    },
    params: {
      year: yearValue.value,
    },
  })
  getStuDataPending.value = false
  if (data.value) {
    if (data.value.error) {
      alert(data.value.error)
      return
    }
    stuData.value = data.value.data
  }
}

const selectedRowKeys = ref<number[]>([])
const rehandleSelectChange = (
  value: number[],
  { selectedRowData }: { selectedRowData: StuData[] },
) => {
  selectedRowKeys.value = value
  console.log(selectedRowData)
}
</script>
