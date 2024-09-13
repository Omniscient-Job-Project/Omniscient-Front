<template>
    <div>
      <!-- 상태에 따라 다른 컴포넌트를 렌더링 -->
      <div v-if="root === 'noticeDetail'">
        <NoticeDetail />
      </div>
      <div v-if="root === 'noticeFAQ'">
        <NoticeFAQ />
      </div>
      <div v-if="root === 'noticeMain'">
        <NoticeMain />
      </div>
    </div>
  </template>
  
  <script setup>
  import { useManagerNotice } from "@/stores/rootstore";
  import { computed, watch } from "vue";
  import { useRoute } from 'vue-router';
  import NoticeDetail from "@/components/notice/noticeDetail.vue";
  import NoticeFAQ from "@/components/notice/noticeFAQ.vue";
  import NoticeMain from "@/components/notice/noticeMain.vue";
  
  // Pinia 스토어 사용
  const store = useManagerNotice();
  const root = computed(() => store.root); // 상태 값 가져오기
  const setRoot = store.setRoot; // 상태 값 변경 함수
  
  // 라우트 변경 시 상태 변경
  const route = useRoute();
  
  watch(
    () => route.path,
    (newPath) => {
      if (newPath === '/notice/noticeDetail') {
        setRoot('noticeDetail');
      } else if (newPath === '/notice/noticeFAQ') {
        setRoot('noticeFAQ');
      } else if (newPath === '/notice/noticeMain') {
        setRoot('noticeMain');
      }
    },
    { immediate: true } // 컴포넌트가 처음 로드될 때도 상태를 설정하도록 함
  );
  </script>
  
  <style scoped>
  /* 스타일 추가 가능 */
  </style>
  