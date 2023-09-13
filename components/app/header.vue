<template>
  <div>
    <t-head-menu theme="light" class="drop-shadow">
      <t-menu-item value="item1"> 功能１ </t-menu-item>
      <template #operations>
        <t-dropdown>
          <t-button variant="text" shape="square">
            <template #icon><t-icon name="user" /></template>
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item :value="1">
              <nuxt-link to="/login"> 登入 </nuxt-link>
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
        <!-- <nuxt-link v-if="!isLogin" to="/login">
          <t-button>登入</t-button>
        </nuxt-link> -->
      </template>
    </t-head-menu>
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue'

// const isLogin = ref(false)
</script>
