<template>
  <t-aside style="border-top: 1px solid var(--component-border)" class="min-h-screen">
    <t-menu>
      <t-menu-item v-for="item in alist" :key="item.value" :value="item.value">
        {{ item.feat }}
      </t-menu-item>
    </t-menu>
  </t-aside>
</template>

<script setup lang="ts">
const alist = [
  { feat: '排名分佈', value: 2 },
  { feat: '趨勢分析', value: 3 },
  { feat: '大專院校排名', value: 4 },
  { feat: '地區組成', value: 5 },
  { feat: '考試檢定', value: 6 },
]
</script>
