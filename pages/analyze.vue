<template>
  <t-aside class="border-t-2">
    <t-menu v-model="menuVal">
      <t-menu-item
        v-for="item in anaList"
        :key="item.value"
        :value="item.value"
        class="text-lg font-semibold"
        @click="curComponent = item.comp"
      >
        {{ item.feat }}
      </t-menu-item>
    </t-menu>
  </t-aside>

  <t-content>
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

definePageMeta({
  layout: 'aside',
})

const menuVal = ref()
const curComponent = shallowRef(AnalyzeDefault)
const anaList = [
  { feat: '圖表範例', value: 1, comp: AnalyzeExample },
  { feat: '學生資料', value: 2, comp: AnalyzeStudentData },
  { feat: '入學組別', value: 3, comp: AnalyzeGroup },
  // { feat: '排名分佈', value: 2 },
  // { feat: '趨勢分析', value: 3 },
  // { feat: '大專院校排名', value: 4 },
  // { feat: '地區組成', value: 5 },
  // { feat: '考試檢定', value: 6 },
]
</script>
