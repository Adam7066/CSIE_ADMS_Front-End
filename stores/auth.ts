import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    username: '',
    role: '',
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUsername(username: string) {
      this.username = username
    },
    setRole(role: string) {
      this.role = role
    },
    logout() {
      this.token = ''
      this.username = ''
      this.role = ''
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
    getToken: (state) => state.token,
    getUsername: (state) => state.username,
    getRole: (state) => state.role,
  },
  persist: true,
})
