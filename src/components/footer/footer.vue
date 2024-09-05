<template>

  <footer>
      <div class="footer">
        <RouterLink to="/notice" style="text-decoration: none;">공지사항</RouterLink>
        <div>이용약관</div>
        <div>자주 묻는 질문(FAQ)</div>
        <div><a href="https://github.com/Omniscient-Job-Project" target="_blank" style="text-decoration: none;">깃허브</a>
        </div>
        <div>전직시</div>
      </div>
    </footer>
  
    </template>
    <script setup>
    import { RouterLink } from 'vue-router';
     import '@/assets/css/footer.css';
   </script>
  
   
  