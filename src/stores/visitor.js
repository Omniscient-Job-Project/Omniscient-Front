import { defineStore } from 'pinia';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;


export const useVisitorStore = defineStore('visitor', {
  actions: {
    async trackVisitor() {
      try {
        const currentDate = new Date().toISOString().split('T')[0]; // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
        const lastVisitDate = localStorage.getItem('lastVisitDate');

        // 오늘 처음 방문한 경우에만 방문자 수 증가
        if (lastVisitDate !== currentDate) {
          await axios.post(`${API_URL}/api/v1/todayVisitor`);
          localStorage.setItem('lastVisitDate', currentDate); // 로컬 스토리지에 오늘 날짜 저장
        }
      } catch (error) {
        console.error('Failed to track visitor:', error.message || error);
      }
    }
  }
});
