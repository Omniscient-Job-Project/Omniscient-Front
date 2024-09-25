import { defineStore } from 'pinia'

export const useUserAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isUser: false,
    token: null
  }),
  actions: {
    login(token, isUser = false) {
      this.isLoggedIn = true
      this.isUser = isUser
      this.token = token
    },
    logout() {
      this.isLoggedIn = false
      this.isUser = false
      this.token = null
    }
  }
})