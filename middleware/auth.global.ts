import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const isLoggedIn = computed(() => authStore.isLoggedIn)
  const isAdmin = computed(() => authStore.isAdmin)

  if (!isLoggedIn.value && to.path !== '/') return navigateTo('/')
  if (isLoggedIn.value) {
    if (to.path === '/') return navigateTo('/dashboard')
    if (to.path.includes('admin') && !isAdmin.value) return navigateTo('/dashboard')
  }
})
