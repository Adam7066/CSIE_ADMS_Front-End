<template>
  <t-aside class="h-[calc(100vh-56px)] !w-fit overflow-auto border-t-2">
    <t-menu v-model="menuVal" :collapsed="collapsed">
      <t-menu-item
        v-for="item in anaList"
        :key="item.value"
        :value="item.value"
        class="text-lg font-semibold"
        @click="curComponent = item.comp"
      >
        <template #icon>
          <t-icon :name="item.icon" />
        </template>
        {{ item.feat }}
      </t-menu-item>
      <template #operations>
        <t-button variant="text" shape="square" @click="changeCollapsed">
          <template #icon>
            <t-icon :name="collapsedIconName" />
          </template>
        </t-button>
      </template>
    </t-menu>
  </t-aside>

  <t-content class="h-[calc(100vh-56px)] w-[calc(100vw-232px)] overflow-auto">
    <keep-alive>
      <component :is="curComponent" />
    </keep-alive>
  </t-content>
</template>

<script setup lang="ts">
import AnalyzeDefault from '@/components/analyze/default.vue'
import AnalyzeExample from '@/components/analyze/example.vue'
import AnalyzeStudentData from '@/components/analyze/studentData.vue'
import AnalyzeGroup from '@/components/analyze/group.vue'
import AnalyzeAdmissionStuData from '@/components/analyze/admissionStuData.vue'

definePageMeta({
  layout: 'aside',
})

const collapsed = ref(false)
const collapsedIconName = computed(() => (collapsed.value ? 'chevron-right' : 'chevron-left'))
const changeCollapsed = () => {
  collapsed.value = !collapsed.value
}

const menuVal = ref()
const curComponent = shallowRef(AnalyzeDefault)
const anaList = [
  { feat: '圖表範例', value: 1, comp: AnalyzeExample, icon: 'circle' },
  { feat: '學生資料', value: 2, comp: AnalyzeStudentData, icon: 'circle' },
  { feat: '入學組別', value: 3, comp: AnalyzeGroup, icon: 'circle' },
  { feat: '個人申請', value: 4, comp: AnalyzeAdmissionStuData, icon: 'circle' },
  // { feat: '排名分佈', value: 2 },
  // { feat: '趨勢分析', value: 3 },
  // { feat: '大專院校排名', value: 4 },
  // { feat: '地區組成', value: 5 },
  // { feat: '考試檢定', value: 6 },
]
</script>
