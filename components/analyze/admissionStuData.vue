<template>
  <div class="h-full w-full">
    <ClientOnly>
      <div class="bg-blue-50 px-8 py-12">
        <div class="flex flex-col items-center justify-center">
          <div class="flex w-full flex-row justify-between bg-yellow-50">
            <div class="m-2 self-start bg-white">
              <t-select v-model="SiJiSelected" :options="SiJi" placeholder="系級"></t-select>
            </div>
            <div class="m-2 self-end bg-white">
              <t-button variant="text" @click="isMagInputExpand = !isMagInputExpand">
                篩選倍率調整
                <template #icon>
                  <chevron-down-icon />
                </template>
              </t-button>
            </div>
          </div>
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
          <div class="flex flex-row content-start justify-between bg-green-50">
            <!-- <div
                          class="m-2 min-h-[768px] w-full rounded-md border-2 border-gray-300 bg-green-50 p-4"
                        >
                          <VChart :init-options="initOptions" :option="option" class="h-full w-full" />
                        </div> -->
            <div
              class="m-2 min-h-[768px] w-full rounded-md border-2 border-gray-300 bg-pink-50 p-4"
            >
              <t-table
                :columns="colSmall"
                :data="stuData"
                row-key="id"
                :selected-row-keys="selectedRowKeys"
                :active-row-type="activeRow ? 'single' : undefined"
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
import { ChevronDownIcon } from 'tdesign-icons-vue-next'
const magnification = ref({
  chi: 1.0,
  eng: 1.0,
  math: 1.0,
  nat: 1.0,
  soc: 1.0,
})

interface studentData {
  id: number
  admission_year: string
  student_code: string
  name: string
  graduated_school: string
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
const colSmall = ref([
  { title: '', colKey: 'row-select', type: 'multiple', width: 50 },
  { title: '入學年度', colKey: 'admission_year' },
  { title: '學號', colKey: 'student_code' },
  { title: '姓名', colKey: 'name' },
  { title: '畢業學校', colKey: 'graduated_school' },
  { title: '國文', colKey: 'chinese' },
  { title: '英文', colKey: 'english' },
  { title: '數學', colKey: 'math' },
  { title: '自然', colKey: 'nature' },
  { title: '社會', colKey: 'society' },
  { title: '英聽', colKey: 'listening' },
  { title: '總級分', colKey: 'sum_score' },
])
const SiJi = ref([
  { content: '107級', value: 107 },
  { content: '108級', value: 108 },
  { content: '109級', value: 109 },
  { content: '110級', value: 110 },
])
const stuRawData = ref<studentData[]>([
  {
    id: 1,
    admission_year: '113',
    student_code: '40947043S',
    name: '徐政皓',
    graduated_school: '國立新竹高中',
    chinese: 13,
    english: 13,
    math: 13,
    nature: 13,
    society: 13,
    listening: 'A',
    sum_score: 65,
  },
  {
    id: 2,
    admission_year: '113',
    student_code: '40947026S',
    name: '余原齊',
    graduated_school: '某所私立高中',
    chinese: 12,
    english: 13,
    math: 15,
    nature: 15,
    society: 14,
    listening: 'A',
    sum_score: 69,
  },
])

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
</script>
