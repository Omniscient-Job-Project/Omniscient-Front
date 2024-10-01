
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    token: localStorage.getItem('token') || null // 초기화 시 로컬 스토리지에서 토큰을 가져옴
  }),
  actions: {
    login(token, isAdmin = false) {
      this.isLoggedIn = true
      this.isAdmin = isAdmin
      this.token = token
      localStorage.setItem('token', token) // 로그인 시 로컬 스토리지에 토큰 저장
    },
    logout() {
      this.isLoggedIn = false
      this.isAdmin = false
      this.token = null
      localStorage.removeItem('token') // 로그아웃 시 로컬 스토리지에서 토큰 제거
    }
  }
})
