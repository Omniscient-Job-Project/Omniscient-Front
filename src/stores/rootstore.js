import { defineStore } from "pinia";
import axios from "axios";

// 네비게이션 경로 설정관련 로직
export const useCurationStore = defineStore("useCurationStore", {
  state: () => ({
    root: "main", // 초기값 설정
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
  },
});