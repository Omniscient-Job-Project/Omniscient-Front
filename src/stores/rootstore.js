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



export const useManagerMainV = defineStore("useManagerMainV", {
  state: () => ({
    root: "managerMain",
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
  },
});

export const useManagerMain = defineStore("useManagerMain", {
  state: () => ({
    root: "managerMain",
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
  },
});

export const useManagerFaq= defineStore("useManagerFaq", {
  state: () => ({
    root: "faqList", // 초기값 설정
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
  },
});

export const useManager = defineStore("useManager", {
  state: () => ({
    root: "userList", // 초기값 설정
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
  },
});

export const useManagerAdmin = defineStore("useManagerAdmin", {
  state: () => ({
    root: "adminMain", // 초기값 설정
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
  },
});

export const useManagerNotice = defineStore("useManagerNotice", {
  state: () => ({
    root: "noticeList",
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
  },
});

export const useManagerUser = defineStore("useManagerUser", {
  state: () => ({
    root: "userList", // 초기값 설정
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
  },
});

