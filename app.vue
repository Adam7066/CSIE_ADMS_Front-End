<template>
  <t-config-provider :global-config="globalConfig">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </t-config-provider>
</template>

<script setup lang="ts">
import merge from 'lodash/merge'
import enConfig from 'tdesign-vue-next/es/locale/zh_TW'

const globalConfig = merge(enConfig)

useHead({
  title: '招生委員會獨門秘笈',
  meta: [{ name: 'description', content: '招生委員會獨門秘笈' }],
})
</script>
