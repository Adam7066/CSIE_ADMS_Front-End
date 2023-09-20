<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLogin = ref(false)
const featList = [
  { feat: '登入畫面', link: '/', value: 1000 },
  { feat: '排名分佈', link: 'rank', value: 1 },
  { feat: '趨勢分析', link: 'trend', value: 2 },
  { feat: '大專院校排名', link: 'schoolRank', value: 3 },
  { feat: '地區組成', link: 'areaComposition', value: 4 },
  { feat: '考試檢定', link: 'test', value: 5 },
]
</script>
