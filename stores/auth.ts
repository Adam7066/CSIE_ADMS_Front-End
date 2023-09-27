import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    username: '',
  }),
  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUsername(username: string) {
      this.username = username
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    getToken: (state) => state.token,
    getUsername: (state) => state.username,
  },
  persist: true,
})
