import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    token: null,
  }),
  actions: {
    login(token) {
      this.isLoggedIn = true;
      this.token = token;
    },
    logout() {
      this.isLoggedIn = false;
      this.token = null;
    },
  },
});