<template>
  <div class="h-full w-full">
    <ClientOnly>
      <VChart :init-options="initOptions" :option="option" class="h-full w-full" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'

const initOptions = ref({
  locale: 'EN',
})

const option = ref({
  title: {
    text: 'Taiwan Map',
    left: 'left',
  },
  tooltip: {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
  },
  visualMap: {
    left: 'right',
    min: 0,
    max: 1000,
    inRange: {
      color: [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026',
      ],
    },
    text: ['High', 'Low'],
    calculable: true,
  },
  toolbox: {
    show: true,
    left: 'right',
    top: 'top',
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {},
    },
  },
  series: [
    {
      name: 'Random data',
      map: 'taiwan',
      type: 'map',
      roam: true,
      scaleLimit: {
        min: 1,
        max: 4,
      },
      data: [{ name: '臺北市', value: 1000 }],
    },
  ],
})
</script>
