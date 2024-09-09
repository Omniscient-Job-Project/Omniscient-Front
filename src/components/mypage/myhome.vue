<template>
    <div>
      <div class="welcome-message">
        <i class="fas fa-hand-wave"></i> {{ userName }}님 환영합니다!
      </div>
      <!-- 액션 버튼 -->
      <div class="action-buttons">
        <router-link :to="{ name: 'resumePage' }" class="resume-writing">
          <i class="fas fa-pen"></i>
          <span>이력서 작성</span>
        </router-link>
        <div class="job-recommendations" @click="showRecommendations">
          <i class="fas fa-bullhorn"></i>
          <span>추천 채용공고</span>
        </div>
      </div>
      <!-- 추가 콘텐츠: 활동 요약 -->
      <div class="additional-content">
        <h3 class="summary-title"><i class="fas fa-chart-line"></i> 활동 요약</h3>
        <div class="summary-grid">
          <div v-for="item in summaryItems" :key="item.label" class="summary-item">
            <i :class="item.icon"></i>
            <p>{{ item.label }}</p>
            <span>{{ item.value }}</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const userName = ref('신주연');
  const certificates = ref([
    { name: '정보처리기사', date: '2023-05-15', issuer: '한국산업인력공단', number: '23-12-1234' },
    { name: 'SQLD', date: '2023-08-20', issuer: '한국데이터산업진흥원', number: 'SQL-2023-12345' },
  ]);
  
  const summaryItems = computed(() => [
    { label: '지원한 회사', value: 5, icon: 'fas fa-building' },
    { label: '열람된 이력서', value: 3, icon: 'fas fa-eye' },
    { label: '보유 자격증', value: certificates.value.length, icon: 'fas fa-award' },
  ]);
  
  const showRecommendations = () => {
    console.log('추천 채용공고 표시');
  };
  </script>
  
  <style scoped>
  .welcome-message {
    text-align: center;
    margin-bottom: 30px;
    font-size: 28px;
    color: #333;
  }
  
  .welcome-message i {
    color: #FFD700;
    margin-right: 10px;
  }
  
  .action-buttons {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  }
  
  .action-buttons .resume-writing,
  .action-buttons .job-recommendations {
    background: #007bff;
    color: #fff;
    padding: 15px 25px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    margin: 0 5px;
    text-decoration: none;
  }
  
  .action-buttons .resume-writing:hover,
  .action-buttons .job-recommendations:hover {
    background: #0056b3;
  }
  
  .action-buttons i {
    margin-right: 10px;
  }
  
  .additional-content {
    text-align: left;
  }
  
  .summary-title {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  .summary-item {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .summary-item i {
    color: #007bff;
    margin-bottom: 10px;
    font-size: 24px;
  }
  
  .summary-item p {
    margin: 5px 0;
    font-size: 14px;
    color: #666;
  }
  
  .summary-item span {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  @media (max-width: 768px) {
    .action-buttons {
      flex-direction: column;
    }
  
    .action-buttons .resume-writing,
    .action-buttons .job-recommendations {
      margin: 10px 0;
    }
  
    .summary-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>