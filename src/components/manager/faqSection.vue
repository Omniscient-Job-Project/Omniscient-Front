<script setup>
import { useManagerFaq } from "@/stores/rootstore";
import { computed, watch } from "vue";
import { useRoute } from 'vue-router';
import FaqList from "@/components/manager/faqList.vue";
import FaqModify from "@/components/manager/faqModify.vue"; 
import FaqPost from "@/components/manager/faqPost.vue";

// Pinia 스토어 사용
const store = useManagerFaq();
const root = computed(() => store.root); // 상태 값 가져오기
const setRoot = store.setRoot; // 상태 값 변경 함수

// 라우트 변경 시 상태 변경
const route = useRoute();

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/manager/faqList') {
      setRoot('faqList');
    } else if (newPath === '/manager/faqPost') {
      setRoot('faqPost');
    } else if (newPath === '/manager/faqModify') {
      setRoot('faqModify');
    } 
  },
  { immediate: true } // 컴포넌트가 처음 로드될 때도 상태를 설정하도록 함
);
</script>

<template>
  <div>
    <div v-if="root === 'faqList'">
      <FaqList />
    </div>
    <div v-if="root === 'faqModify'">
      <FaqModify />
    </div>
    <div v-if="root === 'faqPost'">
      <FaqPost />
    </div>
  </div>
</template>

<style scoped></style>
