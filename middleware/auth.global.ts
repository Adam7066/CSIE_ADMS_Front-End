import { useAuthStore } from '@/stores/auth'

interface IsAdmin {
  code: number
  error: string
  data: boolean
}

export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const isLoggedIn = computed(() => authStore.isLoggedIn)

  if (!isLoggedIn.value && to.path !== '/') return navigateTo('/')
  if (isLoggedIn.value) {
    const { data } = await useFetch<IsAdmin>(config.public.apiBase + '/is_admin', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + authStore.getToken,
      },
    })
    if (data.value) {
      if (data.value.code === -1 || data.value.error) {
        authStore.logout()
        return navigateTo('/')
      }
      authStore.setRole(data.value.data ? 'admin' : 'user')
    }

    const isAdmin = computed(() => authStore.isAdmin)

    if (to.path === '/') return navigateTo('/dashboard')
    if (to.path.includes('admin') && !isAdmin.value) return navigateTo('/dashboard')
  }
})
