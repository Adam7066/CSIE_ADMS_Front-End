<template>
  <div class="h-full w-full">
    <ClientOnly>
      <div class="bg-blue-50 px-8 py-12">
        <div class="flex flex-col items-center justify-center">
          <div class="m-2 self-start bg-white">
            <t-dropdown :options="SiJi" trigger="click">
              <t-space>
                <t-button variant="text">
                  系級
                  <template #suffix> <t-icon name="chevron-down" size="16" /></template>
                </t-button>
              </t-space>
            </t-dropdown>
          </div>
          <div class="flex flex-row content-start justify-between">
            <div class="m-2 min-h-[768px] w-1/2 rounded-md border-2 border-gray-300 bg-pink-50 p-4">
              <t-table :columns="colSmall" :data="stuData" row-key="id"> </t-table>
            </div>
            <div
              class="m-2 min-h-[768px] w-1/2 rounded-md border-2 border-gray-300 bg-green-50 p-4"
            >
              <VChart :init-options="initOptions" :option="option" class="h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'

const initOptions = ref({
  locale: 'EN',
})

const option = ref({
  xAxis: {
    type: 'category',
    data: ['110-1', '110-2', '111-1', '111-2', '112-1', '112-2', '113-1', '113-2'],
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
})

interface studentData {
  id: number
  admission_year: string
  student_code: string
  name: string
  admission_method: string
  graduated_school: string
}

const SiJi = ref([
  { content: '107級', value: '107' },
  { content: '108級', value: '108' },
  { content: '109級', value: '109' },
  { content: '110級', value: '110' },
])

const colSmall = ref([
  { title: '入學年度', colKey: 'admission_year' },
  { title: '學號', colKey: 'student_code' },
  { title: '姓名', colKey: 'name' },
  { title: '入學方式', colKey: 'admission_method' },
  { title: '畢業學校', colKey: 'graduated_school' },
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
])
</script>
