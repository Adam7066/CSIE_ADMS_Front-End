<template>
  <t-header>
    <t-head-menu theme="light" class="drop-shadow">
      <!-- <t-menu-item v-for="item in adminList" :key="item.value">
          <nuxt-link :to="item.link">
            {{ item.feat }}
          </nuxt-link>
        </t-menu-item> -->
      <t-menu-item v-if="role === 'admin'">
        <nuxt-link to="/admin/users"> 系統成員管理 </nuxt-link>
      </t-menu-item>
      <t-menu-item v-if="role === 'admin'">
        <nuxt-link to="/admin/data"> 上傳/管理資料 </nuxt-link>
      </t-menu-item>
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
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const role = authStore.role

// const adminList = [
//   { feat: '系統成員管理', value: 51, link: '/admin/users' },
//   { feat: '上傳/管理資料', value: 52, link: '/admin/data' },
// ]

const isLogin = ref(false)
const featList = [
  { feat: '登入畫面', link: '/', value: 1000 },
  { feat: '首頁', link: '/dashboard', value: 1 },
]
</script>
