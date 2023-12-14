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

        <div class="h-[400px] w-full rounded-xl border-2 bg-green-50 p-4">
          <VChart :option="option" :autoresize="true" />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import VChart, { INIT_OPTIONS_KEY, UPDATE_OPTIONS_KEY } from 'vue-echarts'
import { useAuthStore } from '@/stores/auth'
import { remixUrl } from '@/composables/useFetch'

const config = useRuntimeConfig()
const authStore = useAuthStore()
provide(INIT_OPTIONS_KEY, { locale: 'EN' })
provide(UPDATE_OPTIONS_KEY, { notMerge: true })

onMounted(() => {
  getStudentYears()
})

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

interface YearOptions {
  label: string
  value: number
}

const yearValue = ref('')
const yearOptions = ref<YearOptions[]>([])

const columns = ref([
  {
    colKey: 'row-select',
    type: 'multiple',
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

interface RankData {
  semester: Record<string, number>
  years: Record<string, number>
}

interface RankRes {
  error: string
  data: RankData[]
}

const getStuDataPending = ref(false)
const stuData = ref<StuData[]>([])
const rankData = ref<RankData[]>([])

const getStuData = async () => {
  getStuDataPending.value = true
  const { data: getStuData } = await useFetch<StuRes>(config.public.apiBase + '/students', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + authStore.token,
    },
    params: {
      year: yearValue.value,
    },
  })
  if (getStuData.value) {
    if (getStuData.value.error) {
      alert(getStuData.value.error)
      return
    }
    stuData.value = getStuData.value.data
  }

  const { data: getRankData } = await useFetch<RankRes>(
    remixUrl(
      config.public.apiBase + '/ranks',
      'stu_ids',
      stuData.value.map((item) => item.id),
    ),
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authStore.token,
      },
    },
  )
  if (getRankData.value) {
    if (getRankData.value.error) {
      alert(getRankData.value.error)
      return
    }
    rankData.value = getRankData.value.data
  }
  getStuDataPending.value = false
}

const selectedRowKeys = ref<number[]>([])
const rehandleSelectChange = (
  value: number[],
  { selectedRowData }: { selectedRowData: StuData[] },
) => {
  selectedRowKeys.value = value
  legendData.value = selectedRowData.map((item) => item.student_code)
  xAxisData.value = Array.from(
    new Set(rankData.value.flatMap((item) => Object.keys(item.semester))),
  ).sort()
  seriesData.value = []
  for (let i = 0; i < selectedRowKeys.value.length; i++) {
    const idx = stuData.value.findIndex((item) => item.id === selectedRowKeys.value[i])
    const tmpData: number[] = []
    for (let j = 0; j < xAxisData.value.length; j++) {
      tmpData.push(rankData.value[idx].semester[xAxisData.value[j]])
    }
    seriesData.value.push({
      name: legendData.value[i],
      type: 'line',
      data: tmpData,
    })
  }

  option.value.legend.data = legendData.value
  option.value.xAxis.data = xAxisData.value
  option.value.series = seriesData.value
}

interface SeriesData {
  name: string
  type: string
  data: number[]
}
const seriesData = ref<SeriesData[]>([])
const legendData = ref<string[]>([])
const xAxisData = ref<string[]>([])

const option = ref({
  title: {
    text: '各學期成績排名',
  },
  tooltip: {
    trigger: 'axis',
    order: 'valueAsc',
  },
  legend: {
    data: legendData.value,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    data: xAxisData.value,
  },
  yAxis: {
    type: 'value',
    inverse: true,
    min: 1,
  },
  series: seriesData.value,
})
</script>
