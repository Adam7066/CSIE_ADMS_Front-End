<template>
  <t-header>
    <t-head-menu theme="light" class="drop-shadow">
      <t-menu-item v-for="item in featList" :key="item.value">
        <nuxt-link :to="item.link">
          {{ item.feat }}
        </nuxt-link>
      </t-menu-item>
      <template #operations>
        <t-dropdown>
          <t-button variant="text" shape="square">
            <template #icon><t-icon name="user" /></template>
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item v-if="isLogin"> 登出 </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </template>
    </t-head-menu>
  </t-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLogin = ref(false)
const featList = [
  { feat: '登入畫面', link: '/', value: 1000 },
  { feat: '首頁', link: '/dashboard', value: 1 },
]
</script>
