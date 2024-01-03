<template>
  <div class="h-full w-full">
    <ClientOnly>
      <div class="bg-blue-50 px-8 py-12">
        <div class="flex flex-col items-center justify-center">
          <div
            v-if="isMagInputExpand"
            class="my-2 grid grid-cols-5 gap-x-2 gap-y-1 self-end rounded border-2 border-gray-300 px-4 py-2"
          >
            <div class="text-center">國文</div>
            <div class="text-center">英文</div>
            <div class="text-center">數學</div>
            <div class="text-center">自然</div>
            <div class="text-center">社會</div>
            <t-input-number v-model="magnification.chi" theme="column"></t-input-number>
            <t-input-number v-model="magnification.eng" theme="column"></t-input-number>
            <t-input-number v-model="magnification.math" theme="column"></t-input-number>
            <t-input-number v-model="magnification.nat" theme="column"></t-input-number>
            <t-input-number v-model="magnification.soc" theme="column"></t-input-number>
          </div>
          <div class="m-2 min-h-[400px] w-full rounded-md border-2 border-gray-300 bg-gray-100">
            <div class="flex w-full flex-row justify-between">
              <div class="m-2 bg-white">
                <t-select v-model="SiJiSelected" :options="SiJi" label="系級：" :multiple="true" />
              </div>
              <div class="m-2 bg-white">
                <t-button variant="text" @click="fetchStuData">查詢</t-button>
              </div>
              <div class="m-2 bg-white">
                <t-button variant="text" @click="isMagInputExpand = !isMagInputExpand">
                  篩選倍率調整
                  <template #icon>
                    <chevron-down-icon />
                  </template>
                </t-button>
              </div>
            </div>
            <t-table
              :columns="colSmall"
              :data="stuData"
              :sort="sort"
              row-key="student_code"
              :selected-row-keys="selectedRowKeys"
              :active-row-type="activeRow ? 'single' : undefined"
              :max-height="400"
              @sort-change="sortChange"
              @select-change="rehandleSelectChange"
            >
            </t-table>
          </div>
          <div class="min-h-[600px] w-full rounded-md border-2 border-gray-300 bg-white">
            <t-tabs v-model="currentTab" theme="card">
              <t-tab-panel :value="1" label="成績表格" :destroy-on-hide="false" :lazy="true">
                <div v-if="stuData.length !== 0" class="grid w-full grid-cols-3 gap-4 bg-white p-4">
                  <div class="grid grid-cols-4">
                    <div class="col-span-4">整體數據 ( {{ stuData.length }} 項資料 )</div>
                    <div class="col-span-1 col-start-2">平均</div>
                    <div class="col-span-1">眾數</div>
                    <div class="col-span-1">中位數</div>
                    <div class="col-span-1">國文</div>
                    <div class="col-span-1">{{ countStatics('chi', 'mean', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('chi', 'mode', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('chi', 'median', 'all') }}</div>
                    <div class="col-span-1">英文</div>
                    <div class="col-span-1">{{ countStatics('eng', 'mean', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('eng', 'mode', 'all') }}</div>
                    <div class="col-spn-1">{{ countStatics('eng', 'median', 'all') }}</div>
                    <div class="col-span-1">數學</div>
                    <div class="col-span-1">{{ countStatics('math', 'mean', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('math', 'mode', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('math', 'median', 'all') }}</div>
                    <div class="col-span-1">自然</div>
                    <div class="col-span-1">{{ countStatics('nat', 'mean', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('nat', 'mode', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('nat', 'median', 'all') }}</div>
                    <div class="col-span-1">社會</div>
                    <div class="col-span-1">{{ countStatics('soc', 'mean', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('soc', 'mode', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('soc', 'median', 'all') }}</div>
                    <div class="col-span-1">總級分</div>
                    <div class="col-span-1">{{ countStatics('sum', 'mean', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('sum', 'mode', 'all') }}</div>
                    <div class="col-span-1">{{ countStatics('sum', 'median', 'all') }}</div>
                  </div>
                </div>
                <div v-else>
                  <div class="flex flex-col items-start justify-center">
                    <div class="m-2 text-xl">請選擇入學年度</div>
                  </div>
                </div>
              </t-tab-panel>
              <t-tab-panel :value="2" label="成績雷達圖" :destroy-on-hide="true" :lazy="true">
                <div v-if="stuData.length === 0">
                  <div class="flex flex-col items-start justify-center">
                    <div class="m-2 text-xl">請選擇入學年度</div>
                  </div>
                </div>
                <div class="h-[552px] p-4">
                  <VChart :option="option" :autoresize="true" />
                </div>
              </t-tab-panel>
              <t-tab-panel
                :value="3"
                label="選中學生成績雷達圖"
                :destroy-on-hide="true"
                :lazy="true"
              >
                <div v-if="stuData.length === 0">
                  <div class="flex flex-col items-start justify-center">
                    <div class="m-2 text-xl">請選擇入學年度</div>
                  </div>
                </div>
                <div v-else-if="stuSelected.length === 0">
                  <div class="flex flex-col items-start justify-center">
                    <div class="m-2 text-xl">請選擇學生資料</div>
                  </div>
                </div>
                <div class="h-[552px] p-4">
                  <VChart :option="option" :autoresize="true" />
                </div>
              </t-tab-panel>
            </t-tabs>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon } from 'tdesign-icons-vue-next'
import VChart from 'vue-echarts'
import { useAuthStore } from '@/stores/auth'

const currentTab = ref(1)

const sort = ref({
  sortBy: '',
  descending: true,
})

const sortChange = (value: { sortBy: string; descending: boolean }) => {
  sort.value = value

  const sortKey = sort.value.sortBy
  if (
    sortKey === 'chinese' ||
    sortKey === 'math' ||
    sortKey === 'english' ||
    sortKey === 'nature' ||
    sortKey === 'society' ||
    sortKey === 'sum_score'
  ) {
    stuData.value.sort((a, b) => {
      if (sort.value.descending) {
        return a[sortKey] - b[sortKey]
      } else {
        return b[sortKey] - a[sortKey]
      }
    })
  }
}

const magnification = ref({
  chi: 1.0,
  eng: 1.0,
  math: 1.0,
  nat: 1.0,
  soc: 1.0,
})

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

const isMagInputExpand = ref(false)
const SiJiSelected = ref()
const selectedRowKeys = ref([])
const activeRow = ref(false)
const stuSelected = ref<studentData[]>([])
const colSmall = ref([
  { title: '', colKey: 'row-select', type: 'multiple', width: 50 },
  { title: '入學年度', colKey: 'admission_year' },
  { title: '學號', colKey: 'student_code' },
  { title: '姓名', colKey: 'name' },
  { title: '畢業學校', colKey: 'graduated_school', sortType: 'all', sorter: false },
  { title: '入學組別', colKey: 'admission_group', sortType: 'all', sorter: false },
  { title: '身份', colKey: 'identity_category', sortType: 'all', sorter: false },
  { title: '國文', colKey: 'chinese', sortType: 'all', sorter: true },
  { title: '英文', colKey: 'english', sortType: 'all', sorter: true },
  { title: '數學', colKey: 'math', sortType: 'all', sorter: true },
  { title: '自然', colKey: 'nature', sortType: 'all', sorter: true },
  { title: '社會', colKey: 'society', sortType: 'all', sorter: true },
  { title: '英聽', colKey: 'listening', sortType: 'all', sorter: false },
  { title: '總級分', colKey: 'sum_score', sortType: 'all', sorter: true },
])

const SiJi = ref<{ label: string; value: number }[]>([])

const stuRawData = ref<studentData[]>([])

const stuData = computed(() => {
  const res = ref<studentData[]>([])
  stuRawData.value.forEach((item) => {
    res.value.push({
      ...item,
      chinese: item.chinese * magnification.value.chi,
      english: item.english * magnification.value.eng,
      math: item.math * magnification.value.math,
      nature: item.nature * magnification.value.nat,
      society: item.society * magnification.value.soc,
      sum_score:
        item.chinese * magnification.value.chi +
        item.english * magnification.value.eng +
        item.math * magnification.value.math +
        item.nature * magnification.value.nat +
        item.society * magnification.value.soc,
    })
  })
  return res.value
})

const rehandleSelectChange = (selectRows: []) => {
  selectedRowKeys.value = selectRows

  stuSelected.value = []
  selectedRowKeys.value.forEach((item) => {
    stuData.value.forEach((item2) => {
      if (item === item2.student_code) {
        stuSelected.value.push(item2)
      }
    })
  })
}

interface ApplyYears {
  error: string
  data: number[]
}

const config = useRuntimeConfig()
const authStore = useAuthStore()
const fetchStarYears = async () => {
  const { data } = await useFetch<ApplyYears>(
    config.public.apiBase + '/adms_info/years/star_plan',
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authStore.token,
      },
    },
  )
  if (data.value) {
    if (data.value.error) {
      alert(data.value.error)
      return
    }
    data.value.data.forEach((item) => {
      SiJi.value.push({ label: (item + 4).toString() + '級', value: item })
    })
  }
}

interface StuData {
  error: string
  data: studentData[]
}

const fetchStuData = async () => {
  const { data } = await useFetch<StuData>(
    config.public.apiBase + '/adms_info/students/star_plan',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + authStore.token,
      },
      body: {
        years: SiJiSelected.value,
      },
    },
  )
  if (data.value) {
    if (data.value.error) {
      alert(data.value.error)
      return
    }
    stuRawData.value = data.value.data
  }
}

const mean = (arr: number[]) => {
  let sum = 0
  arr.forEach((item) => {
    sum += item
  })
  return Math.round((sum / arr.length) * 100) / 100
}

const mode = (arr: number[]) => {
  const frequencyMap: Record<number, number> = {}
  let maxFrequency = 0
  let modeValue: number | null = null

  arr.forEach((num) => {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1

    if (frequencyMap[num] > maxFrequency) {
      maxFrequency = frequencyMap[num]
      modeValue = num
    }
  })

  return modeValue
}

const median = (arr: number[]) => {
  arr.sort((a, b) => a - b)
  const mid = Math.floor(arr.length / 2)
  return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2
}

const countStatics = (subject: string, counting: string, g: string) => {
  if (g === 'all') {
    const arr: number[] = []
    stuData.value.forEach((item) => {
      if (subject === 'chi') {
        arr.push(item.chinese)
      } else if (subject === 'eng') {
        arr.push(item.english)
      } else if (subject === 'math') {
        arr.push(item.math)
      } else if (subject === 'nat') {
        arr.push(item.nature)
      } else if (subject === 'soc') {
        arr.push(item.society)
      } else if (subject === 'sum') {
        arr.push(item.sum_score)
      }
    })
    if (counting === 'mean') {
      return mean(arr) as number
    } else if (counting === 'mode') {
      return mode(arr) as number | null
    } else if (counting === 'median') {
      return median(arr) as number
    }
  }
}

onMounted(() => {
  fetchStarYears()
})

const option = ref({})

const updateChartOption = () => {
  if (currentTab.value === 2) {
    if (stuData.value.length === 0) {
      return
    }

    const newOption = {
      title: {
        text: '成績雷達圖',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        data: computed(() => {
          const legendData = [] as string[]
          SiJi.value.forEach((item) => {
            legendData.push(item.label.toString())
          })
          return legendData
        }),
      },
      radar: {
        indicator: [
          { name: '國文', max: 15 * magnification.value.chi },
          { name: '英文', max: 15 * magnification.value.eng },
          { name: '數學', max: 15 * magnification.value.math },
          { name: '自然', max: 15 * magnification.value.nat },
          { name: '社會', max: 15 * magnification.value.soc },
        ],
      },
      series: [
        {
          type: 'radar',
          data: computed(() => {
            const seriesData = [] as { value: number[]; name: string }[]
            SiJi.value.forEach((item) => {
              const ins = {} as { value: number[]; name: string }
              ins.name = item.label.toString()
              ins.value = [
                countStatics('chi', 'mean', 'all') as number,
                countStatics('eng', 'mean', 'all') as number,
                countStatics('math', 'mean', 'all') as number,
                countStatics('nat', 'mean', 'all') as number,
                countStatics('soc', 'mean', 'all') as number,
              ]
              seriesData.push(ins)
            })
            return seriesData
          }),
        },
      ],
    }

    option.value = newOption
  } else if (currentTab.value === 3) {
    if (stuSelected.value.length === 0) {
      return
    }

    const newOption = {
      title: {
        text: '選中學生學測成績雷達圖',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        data: computed(() => {
          const legendData = [] as string[]
          stuSelected.value.forEach((item) => {
            legendData.push(item.name)
          })
          return legendData
        }),
      },
      radar: {
        indicator: [
          { name: '國文', max: 15 * magnification.value.chi },
          { name: '英文', max: 15 * magnification.value.eng },
          { name: '數學', max: 15 * magnification.value.math },
          { name: '自然', max: 15 * magnification.value.nat },
          { name: '社會', max: 15 * magnification.value.soc },
        ],
      },
      series: [
        {
          type: 'radar',
          data: computed(() => {
            const seriesData = [] as { value: number[]; name: string }[]
            stuSelected.value.forEach((item) => {
              const ins = {} as { value: number[]; name: string }
              ins.name = item.name
              ins.value = [item.chinese, item.english, item.math, item.nature, item.society]
              seriesData.push(ins)
            })
            return seriesData
          }),
        },
      ],
    }

    option.value = newOption
  }
}

watch(stuData, () => {
  updateChartOption()
})

watch(stuSelected, () => {
  updateChartOption()
})

watch(currentTab, () => {
  updateChartOption()
})

onUpdated(() => {
  updateChartOption()
})
</script>
