<template>
  <ClientOnly>
    <div class="h-fit min-h-full w-full bg-blue-50 p-8">
      <div class="flex flex-col items-center justify-center space-y-4">
        <div class="ml-8 flex space-x-8 self-start">
          <t-select v-model="yearValue" label="系級：" :options="yearOptions" />
          <t-button @click="getStuData">取得資料</t-button>
        </div>
        <div class="w-full rounded-xl border-2 bg-white p-4">
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

        <div
          v-if="seriesDataSemester.length + seriesDataYears.length > 0"
          class="h-[800px] w-full rounded-xl border-2 bg-white p-4"
        >
          <VChart :option="optionSemester" :autoresize="true" class="h-1/2" />
          <VChart :option="optionYears" :autoresize="true" class="h-1/2" />
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
  selectedRowKeys.value = []

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
  xAxisDataSemester.value = Array.from(
    new Set(rankData.value.flatMap((item) => Object.keys(item.semester))),
  ).sort()
  xAxisDataYears.value = Array.from(
    new Set(rankData.value.flatMap((item) => Object.keys(item.years))),
  ).sort()
  seriesDataSemester.value = []
  seriesDataYears.value = []
  for (let i = 0; i < selectedRowKeys.value.length; i++) {
    const idx = stuData.value.findIndex((item) => item.id === selectedRowKeys.value[i])
    const tmpDataSemester: number[] = []
    for (let j = 0; j < xAxisDataSemester.value.length; j++) {
      tmpDataSemester.push(rankData.value[idx].semester[xAxisDataSemester.value[j]])
    }
    seriesDataSemester.value.push({
      name: legendData.value[i],
      type: 'line',
      data: tmpDataSemester,
    })

    const tmpDataYears: number[] = []
    for (let j = 0; j < xAxisDataYears.value.length; j++) {
      tmpDataYears.push(rankData.value[idx].years[xAxisDataYears.value[j]])
    }
    seriesDataYears.value.push({
      name: legendData.value[i],
      type: 'line',
      data: tmpDataYears,
    })
  }

  optionSemester.value.legend.data = legendData.value
  optionSemester.value.xAxis.data = xAxisDataSemester.value
  optionSemester.value.series = seriesDataSemester.value

  optionYears.value.legend.data = legendData.value
  optionYears.value.xAxis.data = xAxisDataYears.value
  optionYears.value.series = seriesDataYears.value
}

interface SeriesData {
  name: string
  type: string
  data: number[]
}
const seriesDataSemester = ref<SeriesData[]>([])
const legendData = ref<string[]>([])
const xAxisDataSemester = ref<string[]>([])
const optionSemester = ref({
  title: {
    text: '當學期成績排名',
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
    data: xAxisDataSemester.value,
  },
  yAxis: {
    type: 'value',
    inverse: true,
    min: 1,
  },
  series: seriesDataSemester.value,
})

const seriesDataYears = ref<SeriesData[]>([])
const xAxisDataYears = ref<string[]>([])
const optionYears = ref({
  title: {
    text: '歷年成績排名',
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
    data: xAxisDataYears.value,
  },
  yAxis: {
    type: 'value',
    inverse: true,
    min: 1,
  },
  series: seriesDataYears.value,
})
</script>
