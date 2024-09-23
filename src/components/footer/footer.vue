<template>
  <footer>
    <div class="footer">
      <RouterLink to="/notice" class="footer-link">공지사항</RouterLink>
      <RouterLink to="/terms" class="footer-link">이용약관</RouterLink>
      <RouterLink to="/notice/noticeFAQ" class="footer-link">자주 묻는 질문(FAQ)</RouterLink>
      <div class="footer-link">
        <a href="https://github.com/Omniscient-Job-Project" target="_blank" class="footer-link">깃허브</a>
      </div>
      <RouterLink to="/login" class="footer-link">전직시</RouterLink>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import '@/assets/css/footer.css';
</script>
