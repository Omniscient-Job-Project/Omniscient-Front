import { defineStore } from "pinia";
// Pinia에서 스토어를 정의하기 위해 defineStore를 가져옴

// Curation 페이지에 대한 스토어 정의
export const useCurationStore = defineStore("useCurationStore", {
  state: () => ({
    root: "main", // 초기값 설정, 기본 경로는 'main'
  }),
  actions: {
    setRoot(option) {
      this.root = option; // root 값을 변경하는 함수
    },
  },
});

// ManagerMainV 페이지에 대한 스토어 정의
export const useManagerMainV = defineStore("useManagerMainV", {
  state: () => ({
    root: "managerMain", // 초기값 설정, 기본 경로는 'managerMain'
  }),
  actions: {
    setRoot(option) {
      this.root = option; // root 값을 변경하는 함수
    },
  },
});

// ManagerMain 페이지에 대한 스토어 정의
export const useManagerMain = defineStore("useManagerMain", {
  state: () => ({
    root: "managerMain", // 초기값 설정, 기본 경로는 'managerMain'
  }),
  actions: {
    setRoot(option) {
      this.root = option; // root 값을 변경하는 함수
    },
  },
});

// FAQ 페이지에 대한 스토어 정의
export const useManagerFaq = defineStore("useManagerFaq", {
  state: () => ({
    root: "faqList", // 초기값 설정, 기본 경로는 'faqList'
  }),
  actions: {
    setRoot(option) {
      this.root = option; // root 값을 변경하는 함수
    },
  },
});

// Manager 페이지에 대한 스토어 정의
export const useManager = defineStore("useManager", {
  state: () => ({
    root: "userList", // 초기값 설정, 기본 경로는 'userList'
  }),
  actions: {
    setRoot(option) {
      this.root = option; // root 값을 변경하는 함수
    },
  },
});

// ManagerAdmin 페이지에 대한 스토어 정의
export const useManagerAdmin = defineStore("useManagerAdmin", {
  state: () => ({
    root: "adminMain", // 초기값 설정, 기본 경로는 'adminMain'
  }),
  actions: {
    setRoot(option) {
      this.root = option; // root 값을 변경하는 함수
    },
  },
});

// 공지사항 페이지에 대한 스토어 정의
export const useManagerNotice = defineStore("useManagerNotice", {
  state: () => ({
    root: "noticeList", // 초기값 설정, 기본 경로는 'noticeList'
  }),
  actions: {
    setRoot(option) {
      this.root = option; // root 값을 변경하는 함수
    },
  },
});

// ManagerUser 페이지에 대한 스토어 정의
export const useManagerUser = defineStore("useManagerUser", {
  state: () => ({
    root: "userList", // 초기값 설정, 기본 경로는 'userList'
  }),
  actions: {
    setRoot(option) {
      this.root = option; // root 값을 변경하는 함수
    },
  },
});


// 자격증 페이지 스토어 정의
export const useCertificateStore = defineStore("useCertificateStore", {
  state: () => ({
    root: "certificate",
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
  },
});

// 자유게시판 페이지 스토어 정의
export const useBoardStore = defineStore("useBoardStore", {
  state: () => ({
    root: "boardList",
    posts: [], // 게시글 목록 관리
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
    setPosts(posts) {
      this.posts = posts; // 게시글 목록을 설정하는 함수
    },
  },
});

// 마이페이지 스토어 정의
export const useMypageStore = defineStore("useMypageStore", {
  state: () => ({
    root: "mypage",
    user: null, // 사용자 정보
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
    setUser(user) {
      this.user = user; // 사용자 정보를 저장하는 함수
    },
  },
});

// 로그인 스토어 정의
export const useAuthStore = defineStore("useAuthStore", {
  state: () => ({
    root: "login",
    isAuthenticated: false, // 인증 상태
  }),
  actions: {
    setRoot(option) {
      this.root = option;
    },
    login() {
      this.isAuthenticated = true; // 로그인 상태를 변경
    },
    logout() {
      this.isAuthenticated = false; // 로그아웃 처리
    },
  },
});