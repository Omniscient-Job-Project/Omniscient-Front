<template>
    <div class="curation-index">
      <div class="curation-item"><i class="fas fa-home"></i><p>홈</p></div>
      <div class="curation-item"><i class="fas fa-certificate"></i><p>자격증</p></div>
      <div class="curation-item"><i class="fas fa-subway"></i><p>지하철</p></div>
      <div class="curation-item"><i class="fas fa-ellipsis-h"></i><p>등등</p></div>
    </div>
  </template>
  
  <script setup>
// 필터기능 추가 예정

  </script>
  
  <style scoped>
  .curation-index {
    display: flex;
    justify-content: space-around;
    padding: 1rem;
  }
  
  .curation-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .curation-item:hover {
    transform: translateY(-3px);
  }
  
  .curation-item i {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #0166FF;
  }
  
  .curation-item p {
    margin: 0;
    font-size: 0.9rem;
    color: #555;
  }
  </style>
  