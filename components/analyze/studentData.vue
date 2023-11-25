<template>
  <div class="h-full w-full">
    <ClientOnly>
      <div class="bg-blue-50 px-8 py-12">
        <div class="flex flex-col items-center justify-center">
          <div class="m-2 self-start bg-white">
            <t-select v-model="SiJiSelected" :options="SiJi" placeholder="系級"></t-select>
          </div>
          <div class="flex flex-row content-start justify-between">
            <div
              class="m-2 min-h-[768px] w-full rounded-md border-2 border-gray-300 bg-green-50 p-4"
            >
              <VChart :init-options="initOptions" :option="option" class="h-full w-full" />
            </div>
            <div
              class="m-2 min-h-[768px] w-full rounded-md border-2 border-gray-300 bg-pink-50 p-4"
            >
              <t-table
                :columns="colSmall"
                :data="stuData"
                row-key="id"
                :selected-row-keys="selectedRowKeys"
                :active-row-type="activeRow ? 'single' : undefined"
                @select-change="rehandleSelectChange"
              >
              </t-table>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'

interface studentData {
  id: number
  admission_year: string
  student_code: string
  name: string
  admission_method: string
  graduated_school: string
}

const SiJiSelected = ref()
const selectedRowKeys = ref([])
const activeRow = ref(false)
const stuSelected = ref<studentData[]>([])
const colSmall = ref([
  { title: '', colKey: 'row-select', type: 'multiple', width: 50 },
  { title: '入學年度', colKey: 'admission_year' },
  { title: '學號', colKey: 'student_code' },
  { title: '姓名', colKey: 'name' },
  { title: '入學方式', colKey: 'admission_method' },
  { title: '畢業學校', colKey: 'graduated_school' },
])
const SiJi = ref([
  { content: '107級', value: 107 },
  { content: '108級', value: 108 },
  { content: '109級', value: 109 },
  { content: '110級', value: 110 },
])
const stuData = ref<studentData[]>([
  {
    id: 1,
    admission_year: '113',
    student_code: '40947043S',
    name: '徐政皓',
    admission_method: '分發入學',
    graduated_school: '國立新竹高中',
  },
  {
    id: 2,
    admission_year: '113',
    student_code: '40947026S',
    name: '余原齊',
    admission_method: '特殊申請',
    graduated_school: '某所私立高中',
  },
  {
    id: 3,
    admission_year: '113',
    student_code: '40947030S',
    name: '陳柏翰',
    admission_method: '個人申請',
    graduated_school: '國立建國高中',
  },
])

const rehandleSelectChange = (selectRows: []) => {
  selectedRowKeys.value = selectRows

  stuSelected.value = []
  selectedRowKeys.value.forEach((item: number) => {
    stuSelected.value.push(stuData.value[item])
  })
}

// chart
const initOptions = ref({
  locale: 'EN',
})

// const option = ref({
//   xAxis: {
//     type: 'category',
//     data: ['110-1', '110-2', '111-1', '111-2', '112-1', '112-2', '113-1', '113-2'],
//     axisLine: {
//       onZero: false,
//     },
//   },
//   yAxis: {
//     name: '排名',
//     nameLocation: 'start',
//     type: 'value',
//     inverse: true,
//   },
//   series: [
//     {
//       data: [40, 30, 33, 45, 29, 26, 28],
//       type: 'line',
//     },
//   ],
//   toolbox: {
//     show: true,
//     left: 'right',
//     top: 'top',
//     feature: {
//       saveAsImage: {},
//     },
//   },
// })

const option = ref()

// const fetchStuRank = async () => {
//   const { data } = await useFetch<stuRankResData>(config.public.apiBase + '/stuRank', {
//     method: 'POST',
//     body: JSON.stringify(stuSelected.value),
//   })
//   stuRank.value = data.data
// }

const updateChartOption = () => {
  if (stuSelected.value.length === 0) {
    // error message
    return
  }

  const semester = []
  for (let i = 0; i < 4; i++) {
    semester.push(`${SiJiSelected.value + i}-1`)
    semester.push(`${SiJiSelected.value + i}-2`)
  }

  const insOption = {
    title: {
      text: '學生入學後學期排名追蹤',
    },
    xAxis: {
      name: '學期',
      nameLocation: 'end',
      type: 'category',
      data: semester,
      axisLine: {
        onZero: false,
      },
    },
    yAxis: {
      name: '排名',
      nameLocation: 'start',
      type: 'value',
      inverse: true,
    },
    series: [
      {
        data: [40, 30, 33, 45, 29, 26, 28],
        type: 'line',
      },
    ],
    toolbox: {
      show: true,
      left: 'right',
      top: 'top',
      feature: {
        saveAsImage: {},
      },
    },
  }
  option.value = insOption
}

watch(stuSelected, () => {
  updateChartOption()
})

onUpdated(() => {
  updateChartOption()
})
</script>
