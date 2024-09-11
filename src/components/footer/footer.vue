<template>
  <footer>
    <div class="footer">
      <RouterLink to="/notice" class="footer-link">공지사항</RouterLink>
      <div class="footer-link">이용약관</div>
      <RouterLink to="/noticeFAQ" class="footer-link">자주 묻는 질문(FAQ)</RouterLink>
      <div class="footer-link">
        <a href="https://github.com/Omniscient-Job-Project" target="_blank" class="footer-link">깃허브</a>
      </div>
      <div class="footer-link">전직시</div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import '@/assets/css/footer.css';
</script>
