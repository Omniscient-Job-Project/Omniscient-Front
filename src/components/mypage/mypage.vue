<template>
  <div class="page-background">
    <Header />
    <div class="mypage-container">
      <div class="sidebar">
        <ul>
          <li v-for="item in menuItems" :key="item.page">
            <a @click="setCurrentPage(item.page)" :class="{ active: currentPage === item.page }">
              <i :class="item.icon"></i> {{ item.label }}
            </a>
          </li>
        </ul>
      </div>

      <div class="main-content">
        <!-- 조건부 렌더링 -->
        <div v-if="currentPage === 'myHome' || !currentPage" class="default-content">
          <div class="welcome-message">
            <i class="fas fa-hand-wave"></i> {{ userName }}님 환영합니다!
          </div>
          <div class="action-buttons">
            <div class="resume-writing" @click="writeResume">
              <i class="fas fa-pen"></i>
              <span>이력서 작성</span>
            </div>
            <div class="job-recommendations" @click="showRecommendations">
              <i class="fas fa-bullhorn"></i>
              <span>추천 채용공고</span>
            </div>
          </div>
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
        <ProfilePage v-else-if="currentPage === 'profilePage'" />
        <div v-else-if="currentPage === 'resumePage'" class="resume-page">
          <h1>이력서 관리</h1>
        </div>
        <div v-else-if="currentPage === 'applicationsPage'" class="applications-page">
          <h1>지원 현황</h1>
        </div>
        <div v-else-if="currentPage === 'scrapPage'" class="scrap-page">
          <h1>스크랩</h1>
        </div>
        <div v-else-if="currentPage === 'certificatesPage'" class="certificates-page">
          <h1>자격증 관리</h1>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '../header/header.vue';
import Footer from '../footer/footer.vue';
import ProfilePage from './ProfilePage.vue';

// 현재 페이지 상태
const currentPage = ref(null);

// 사용자 정보
const userName = ref('신주연');

// 메뉴 항목
const menuItems = [
  { page: 'myHome', label: 'MyHome', icon: 'fas fa-home' },
  { page: 'profilePage', label: '프로필', icon: 'fas fa-user' },
  { page: 'resumePage', label: '이력서 관리', icon: 'fas fa-file-alt' },
  { page: 'applicationsPage', label: '지원 현황', icon: 'fas fa-briefcase' },
  { page: 'scrapPage', label: '스크랩', icon: 'fas fa-bookmark' },
  { page: 'certificatesPage', label: '자격증 관리', icon: 'fas fa-certificate' },
];

// 요약 항목
const summaryItems = [
  { label: '지원한 회사', value: 5, icon: 'fas fa-building' },
  { label: '열람된 이력서', value: 3, icon: 'fas fa-eye' },
  { label: '보유 자격증', value: 1, icon: 'fas fa-award' },
];

// 버튼 클릭 시 현재 페이지 설정
const setCurrentPage = (page) => {
  currentPage.value = page;
}

// 버튼 클릭 핸들러
const writeResume = () => {
  console.log('이력서 작성 페이지로 이동');
}

const showRecommendations = () => {
  console.log('추천 채용공고 표시');
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

.page-background {
  background-color: #E6F3FF;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.mypage-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 50px 20px;
  box-sizing: border-box;
  flex-grow: 1;
}

.sidebar {
  width: 250px;
  background: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-right: 50px;
  flex-shrink: 0;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  margin-bottom: 15px;
}

.sidebar a {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: inherit;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
  cursor: pointer;
}

.sidebar a:hover, .sidebar a.active {
  background-color: #f0f0f0;
  color: #007bff;
  transform: translateX(5px);
}

.sidebar i {
  margin-right: 10px;
  width: 20px;
}

.main-content {
  flex-grow: 1;
  background: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 50px;
  display: flex;
  flex-direction: column;
}

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
  .mypage-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 30px;
  }

  .main-content {
    width: 100%;
  }

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