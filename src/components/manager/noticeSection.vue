<template>
  <div>
    <!-- 상태에 따라 다른 컴포넌트를 렌더링 -->
    <div v-if="root === 'noticeList'">
      <ManagerNoticeList />
    </div>
    <div v-if="root === 'noticePost'">
      <ManagerNoticePost />
    </div>
    <div v-if="root === 'noticeModify'">
      <ManagerNoticeModify />
    </div>
  </div>
</template>

<script setup>
import { useManagerNotice } from "@/stores/rootstore";
import { computed, watch } from "vue";
import { useRoute } from 'vue-router';
import ManagerNoticePost from "@/components/manager/noticePost.vue";
import ManagerNoticeList from "@/components/manager/noticeList.vue";
import ManagerNoticeModify from "@/components/manager/noticeModify.vue";

// Pinia 스토어 사용
const store = useManagerNotice();
const root = computed(() => store.root); // 상태 값 가져오기
const setRoot = store.setRoot; // 상태 값 변경 함수

// 라우트 변경 시 상태 변경
const route = useRoute();

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/manager/notice/noticeList') {
      setRoot('noticeList');
    } else if (newPath === '/manager/notice/noticePost') {
      setRoot('noticePost');
    } else if (newPath === '/manager/notice/noticeModify') {
      setRoot('noticeModify');
    }
  },
  { immediate: true } // 컴포넌트가 처음 로드될 때도 상태를 설정하도록 함
);
</script>

<style scoped>
/* 스타일 추가 가능 */
</style>
