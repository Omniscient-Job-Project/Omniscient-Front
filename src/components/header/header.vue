<template>
  <header>
    <div class="logo">
      <RouterLink to="/">
      전직시
      </RouterLink>
    </div>
    <nav class="menu">
      <RouterLink to="/certificate">자격증</RouterLink>
      <RouterLink to="/curation">채용</RouterLink>
      <RouterLink to="/board">자유게시판</RouterLink>
      <RouterLink to="/mypage">마이페이지</RouterLink>
      <RouterLink 
      to="/" 
      @click.prevent="handleAuth">
      {{ isLoggedIn ? '로그아웃' : '로그인' }}
    </RouterLink>

    </nav>
  </header>
</template>
  
<script setup>
import { RouterLink } from 'vue-router';
import '@/assets/css/header.css';
import { useAuthStore } from '@/stores/auth'; // auth 스토어 임포트
import { useRouter } from 'vue-router';
import { computed } from 'vue';



const authStore = useAuthStore();
const router = useRouter(); // 라우터 사용


// computed로 로그인 상태 확인
const isLoggedIn = computed(() => authStore.isLoggedIn);

const handleAuth = () => {
  if (authStore.isLoggedIn) {
    authStore.logout(); // 로그아웃 처리
    console.log('로그인 상태:', authStore.isLoggedIn); // 여기 추가
    router.push('/login');
  } else {
    console.log('로그인 상태:', authStore.isLoggedIn); // 여기 추가
    router.push('/login'); // 로그인 페이지로 이동
  }
};

</script>

<style scoped>
</style>