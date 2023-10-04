<template>
  <t-aside style="border-top: 1px solid var(--component-border)" class="min-h-screen">
    <t-menu>
      <div v-if="role === 'admin'">
        <div>Admin</div>
        <t-menu-item v-for="item in adminList" :key="item.value" :value="item.value">
          <nuxt-link :to="item.link">
            {{ item.feat }}
          </nuxt-link>
        </t-menu-item>
      </div>
      <div>分析</div>
      <t-menu-item v-for="item in anaList" :key="item.value" :value="item.value">
        {{ item.feat }}
      </t-menu-item>
    </t-menu>
  </t-aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const role = authStore.role

const adminList = [
  { feat: '系統成員管理', value: 51, link: '/admin/users' },
  { feat: '上傳/管理資料', value: 52, link: '/admin/data' },
]

const anaList = [
  { feat: '排名分佈', value: 2 },
  { feat: '趨勢分析', value: 3 },
  { feat: '大專院校排名', value: 4 },
  { feat: '地區組成', value: 5 },
  { feat: '考試檢定', value: 6 },
]
</script>
