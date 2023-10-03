<template>
  <t-layout>
    <AppHeader />
    <t-layout>
      <AppAside />
      <t-layout>
        <t-content>
          <slot />
        </t-content>
      </t-layout>
    </t-layout>
  </t-layout>
</template>
