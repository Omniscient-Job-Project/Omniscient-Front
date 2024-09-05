<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2024 전직시. All Rights Reserved.</p>
      <nav class="footer-menu">
        <RouterLink to="/terms">이용약관</RouterLink>
        <RouterLink to="/privacy">개인정보 처리방침</RouterLink>
        <RouterLink to="/contact">문의하기</RouterLink>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import '@/assets/css/footer.css';  // 별도의 CSS 파일을 사용하는 경우
</script>

<style scoped>
.footer {
  background-color: #343a40;
  color: white;
  padding: 20px;
  text-align: center;
  position: relative;
  bottom: 0;
  width: 100%;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.footer-menu {
  display: flex;
  gap: 15px;
}

.footer-menu a {
  color: white;
  text-decoration: none;
}

.footer-menu a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
