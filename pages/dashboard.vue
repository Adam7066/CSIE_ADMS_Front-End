<template>
  <div class="h-full w-full bg-blue-50">
    <ClientOnly>
      <div class="px-8 py-12">
        <div class="flex flex-col items-center justify-center gap-4">
          <div class="m-4 text-3xl font-bold">歡迎使用 資工系 招生系務系統</div>
          <div class="m-2 flex w-4/5 flex-col gap-4 rounded-md border-2 border-gray-300 bg-white">
            <div class="px-4 pt-4 text-2xl font-bold">最新個人申請資料</div>
            <div v-if="applyStuData.length === 0">
              <div class="px-4 pb-4 text-xl text-red-700">目前沒有最新資料</div>
            </div>
            <div v-else>
              <div class="px-4 pb-4 text-xl">{{ newestApplyYear }} 學年度</div>
            </div>
          </div>
          <div class="m-2 flex w-4/5 flex-col gap-4 rounded-md border-2 border-gray-300 bg-white">
            <div class="px-4 pt-4 text-2xl font-bold">最新繁星申請資料</div>
            <div v-if="applyStuData.length === 0">
              <div class="px-4 pb-4 text-xl text-red-700">目前沒有最新資料</div>
            </div>
            <div v-else>
              <div class="px-4 pb-4 text-xl">{{ newestApplyYear }} 學年度</div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const config = useRuntimeConfig()
const authStore = useAuthStore()

interface YearData {
  error: string
  data: number[]
}
interface studentData {
  admission_year: number
  student_code: string
  name: string
  graduated_school: string
  admission_group: string
  identity_category: string
  chinese: number
  english: number
  math: number
  nature: number
  society: number
  listening: string
  sum_score: number
}
interface StuData {
  error: string
  data: studentData[]
}

const starYears = ref([]) as Ref<number[]>
const applyYears = ref([]) as Ref<number[]>
const starStuData = ref([]) as Ref<studentData[]>
const applyStuData = ref([]) as Ref<studentData[]>
const newestStarYear = ref(0)
const newestApplyYear = ref(0)

const fetchStarYears = async () => {
  const { data } = await useFetch<YearData>(config.public.apiBase + '/adms_info/years/star_plan', {
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
    data.value.data.forEach((item) => {
      starYears.value.push(item)
    })
  }
}
const fetchApplyYears = async () => {
  const { data } = await useFetch<YearData>(config.public.apiBase + '/adms_info/years/apply', {
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
    data.value.data.forEach((item) => {
      applyYears.value.push(item)
    })
  }
}
const fetchApplyStuData = async (year: number) => {
  const { data } = await useFetch<StuData>(config.public.apiBase + '/adms_info/students/apply', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + authStore.token,
    },
    body: {
      years: year,
    },
  })
  if (data.value) {
    if (data.value.error) {
      return
    }
    data.value.data.forEach((item) => {
      applyStuData.value.push(item)
    })
  }
}
const fetchStarStuData = async (year: number) => {
  const { data } = await useFetch<StuData>(
    config.public.apiBase + '/adms_info/students/star_plan',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + authStore.token,
      },
      body: {
        years: year,
      },
    },
  )
  if (data.value) {
    if (data.value.error) {
      return
    }
    data.value.data.forEach((item) => {
      starStuData.value.push(item)
    })
  }
}
const fetchNewestData = async () => {
  await fetchStarYears()
  await fetchApplyYears()
  // fetch newest data, go though all years from index 0 to end of array, and break when data is not empty
  for (let i = 0; i < starYears.value.length; i++) {
    await fetchStarStuData(starYears.value[i])
    if (starStuData.value.length !== 0) {
      newestStarYear.value = starYears.value[i]
      break
    }
  }
  for (let i = 0; i < applyYears.value.length; i++) {
    await fetchApplyStuData(applyYears.value[i])
    if (applyStuData.value.length !== 0) {
      newestApplyYear.value = applyYears.value[i]
      break
    }
  }
}

onMounted(async () => {
  await fetchNewestData()
})
</script>
