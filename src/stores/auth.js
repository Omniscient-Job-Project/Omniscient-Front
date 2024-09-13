import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: !!localStorage.getItem('token'), // 로그인 상태를 토큰으로 판단
  }),
  actions: {
    login(token) {
      this.isLoggedIn = true;
      localStorage.setItem('token', token); // 로그인 시 토큰 저장
      console.log('로그인 상태:', this.isLoggedIn);
    },
    logout() {
      this.isLoggedIn = false;
      localStorage.removeItem('token'); // 로그아웃 시 토큰 제거
      alert('로그아웃 되었습니다.'); // 로그아웃 시 알림창 표시
      console.log('로그아웃 상태:', this.isLoggedIn); // 상태 변화 로그
    },
  },
});
