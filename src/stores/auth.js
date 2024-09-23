import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    token: null
  }),
  actions: {
    login(token, isAdmin = false) {
      this.isLoggedIn = true
      this.isAdmin = isAdmin
      this.token = token
    },
    logout() {
      this.isLoggedIn = false
      this.isAdmin = false
      this.token = null
    }
  }
})