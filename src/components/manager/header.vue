<template>
  <header class="header">
    <div class="logo">
      전직시
    </div>
    <nav class="menu">
      <RouterLink to="/certificate">자격증</RouterLink>
      <RouterLink to="/curation">채용</RouterLink>
      <RouterLink to="/">자유게시판</RouterLink>
      <RouterLink to="/mypage">마이페이지</RouterLink>
      <RouterLink to="/login">로그인</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import '@/assets/css/header.css';  // 별도의 CSS 파일을 사용하는 경우
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #343a40;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box; /* 패딩과 보더를 포함한 전체 너비를 조정 */
  z-index: 1000; /* 사이드바보다 높은 값으로 설정 */
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.menu {
  display: flex;
  gap: 15px;
}

.menu a {
  color: white;
  text-decoration: none;
}

.menu a:hover {
  text-decoration: underline;
}

/* 페이지 바디에 여백 추가 */
body {
  margin: 0;
  padding-top: 60px; /* 헤더 높이와 일치하도록 조정 */
}
</style>
