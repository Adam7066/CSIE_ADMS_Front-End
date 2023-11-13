<template>
  <div class="h-full w-full">
    <ClientOnly>
      <div class="bg-blue-50 px-8 py-12">
        <div class="flex flex-col items-center justify-center">
          <div class="flex w-full flex-row content-start justify-between">
            <div
              class="m-2 min-h-[768px] w-auto rounded-md border-2 border-gray-300 bg-pink-50 p-4"
            >
              <div class="flex h-full flex-col items-center justify-start bg-purple-200 px-2">
                <t-select
                  v-model="SiJiSelected"
                  placeholder="系級"
                  multiple
                  clearable
                  :min-collapsed-num="1"
                  class="!w-[160px]"
                >
                  <t-option label="全選" :check-all="true" />
                  <t-option
                    v-for="item in SiJi"
                    :key="item.value"
                    :value="item.value"
                    :label="item.content"
                  ></t-option>
                </t-select>
                <div class="my-2 w-full rounded border-2 border-gray-300 bg-blue-50">
                  <div class="my-2 text-center">圖表類型</div>
                  <div v-for="item in plot" :key="item.feat" class="m-2">
                    <t-button
                      :variant="item.variant"
                      class="w-full"
                      @click="changePlotShowing(item)"
                    >
                      {{ item.feat }}
                    </t-button>
                  </div>
                </div>
                <div class="my-2 w-full rounded border-2 border-gray-300 bg-red-100">
                  <div class="my-2 text-center">計算方式</div>
                  <div v-for="item in counting" :key="item.feat" class="m-2">
                    <t-button variant="outline" class="w-full" @click="changeCountingWay(item)">
                      {{ item.feat }}
                    </t-button>
                  </div>
                  {{ SiJiSelected }}
                  {{ currentState.SiJiNum }}
                  {{ currentState.plot }}
                  {{ currentState.counting }}
                </div>
              </div>
            </div>
            <div
              class="m-2 min-h-[768px] w-1/2 rounded-md border-2 border-gray-300 bg-green-50 p-4"
            >
              <VChart :init-options="initOptions" :option="option" class="h-full w-full" />
            </div>
            <div
              class="m-2 min-h-[768px] w-1/3 rounded-md border-2 border-gray-300 bg-yellow-50 p-4"
            >
              <div class="text-center">圖表數據顯示</div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'

interface state {
  SiJiNum: number
  plot: string
  counting: string
}

const SiJi = ref([
  { content: '107級', value: 107 },
  { content: '108級', value: 108 },
  { content: '109級', value: 109 },
  { content: '110級', value: 110 },
])

const plot = ref([
  { feat: '折線圖', value: 'line', variant: 'outline' },
  { feat: '長條圖', value: 'bar', variant: 'outline' },
  { feat: '箱型圖', value: 'boxplot', variant: 'outline' },
])

const counting = ref([
  { feat: '平均', value: 'mean' },
  { feat: '中位數', value: 'median' },
  { feat: '眾數', value: 'mode' },
])

// const currentPlot = ref('')
// const currentCounting = ref('')

const currentState = reactive<state>({
  SiJiNum: 0,
  plot: '',
  counting: '',
})

const defaultToolbox = {
  show: true,
  left: 'right',
  top: 'top',
  feature: {
    saveAsImage: {},
  },
}

const SiJiSelected = ref<number[]>([])

const changePlotShowing = (item: { feat: string; value: string; variant: string }) => {
  currentState.plot = item.value
  plot.value.forEach((item) => {
    item.variant = 'outline'
  })
  item.variant = 'base'
}

const changeCountingWay = (item: { feat: string; value: string }) => {
  currentState.counting = item.value
}

const initOptions = ref({
  locale: 'EN',
})

const option = ref()

const updateChartOption = () => {
  if (currentState.SiJiNum === 0 || currentState.plot === '') {
    // error message
    return
  }

  if (currentState.SiJiNum === 1 && currentState.plot === 'line') {
    const semester = []
    for (let i = 0; i < 4; i++) {
      semester.push(`${SiJiSelected.value[0] + i}-1`)
      semester.push(`${SiJiSelected.value[0] + i}-2`)
    }

    const insOption = {
      xAxis: {
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
          type: currentState.plot,
        },
      ],
      toolbox: defaultToolbox,
    }
    option.value = insOption
  }
}

watch(SiJiSelected, () => {
  SiJiSelected.value.sort((a, b) => a - b)
  currentState.SiJiNum = SiJiSelected.value.length
})

watch(currentState, () => {
  updateChartOption()
})

onUpdated(() => {
  updateChartOption()
})
</script>
