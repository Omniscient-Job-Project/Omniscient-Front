<template>
  <header>
    <div class="logo">
      전직시
    </div>
    <nav class="menu">
      <div>자격증</div>
      <div @click="navigateToCuration">채용</div>
      <div>자유게시판</div>
      <div>마이페이지</div>
      <div>로그인</div>
    </nav>
  </header>
</template>
  
<script setup>
import { useRouter } from 'vue-router'; 
import '@/assets/css/header.css';

const router = useRouter();

const navigateToCuration = () => {
  router.push({ name: 'curationselect'});
};
</script>