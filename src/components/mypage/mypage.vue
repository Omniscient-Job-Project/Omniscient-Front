<template>
    <Header/>
    <div class="mypage-container">
      <div class="sidebar">
        <!-- Group 30 -->
        <ul>
          <li>프로필</li>
          <br>
          <li>이력서 관리</li>
          <br>
          <li>지원 현황</li>
          <br>
          <li>스크랩</li>
          <br>
          <li>자격증 관리</li>
          <br>
        </ul>
      </div>
      <div class="main-content">
        <!-- Group 25 -->
        <div class="welcome-message">{{ userName }}님 환영합니다!</div>
        <div class="action-buttons">
          <!-- Group 26 -->
          <div class="resume-writing" @click="writeResume">
            <span>이력서 작성</span>
          </div>
          <!-- Group 31 -->
          <div class="job-recommendations" @click="showRecommendations">
            <span>추천 채용공고</span>
          </div>
        </div>
        <!-- Group 32 -->
        <div class="additional-content">
          <h3>활동 요약</h3>
          <p>지원한 회사: {{ appliedCompanies }}</p>
          <p>열람된 이력서: {{ viewedResumes }}</p>
          <p>보유 자격증: {{ certifications }}</p>
        </div>

      </div>
    </div>
   <Footer/>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Header from '@/components/header/header.vue'; // 헤더 컴포넌트 임포트
  import Footer from '@/components/footer/footer.vue'; // 풋터 불러오기

  const userName = ref('신주연')
  const appliedCompanies = ref(5)
  const viewedResumes = ref(3)
  const certifications = ref(1)
  
  const writeResume = () => {
    console.log('이력서 작성 페이지로 이동')
  }
  
  const showRecommendations = () => {
    console.log('추천 채용공고 표시')
  }
  </script>
  
  <style scoped>
/* Group 1: mypage-container */
.mypage-container {
  width: 100%;
  max-width: 1400px;
  min-height: 700px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 100px 20px 500px;
  box-sizing: border-box;
}

/* Group 30: sidebar */
.mypage-container .sidebar {
  width: 250px;
  height: 400px;
  background: #FFFFFF;
  border: 1px solid #000000;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 30px;
  margin-right: 50px;
  flex-shrink: 0;
}

.mypage-container .sidebar ul {
  list-style-type: none !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mypage-container .sidebar ul li {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px !important;
  cursor: pointer;
  position: relative;
  padding: 15px 0;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.mypage-container .sidebar ul li:last-child {
  border-bottom: none;
}

/* 복원된 사이드바 애니메이션 */
.mypage-container .sidebar ul li::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background-color: #007bff;
  transition: width 0.3s ease-in-out;
}

.mypage-container .sidebar ul li:hover::before,
.mypage-container .sidebar ul li.active::before {
  width: 100%;
}

.mypage-container .sidebar ul li:hover,
.mypage-container .sidebar ul li.active {
  color: #007bff;
}

/* Group 25: main-content */
.mypage-container .main-content {
  flex-grow: 1;
  width: calc(100% - 300px);
  background: #FFFFFF;
  border: 1px solid #000000;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 50px;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px; /* 하단 여백 추가 */
}

.main-content .welcome-message {
  text-align: center;
  margin-bottom: 30px;
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 100%;
}

/* Group 26 & 31: action-buttons */
.main-content .action-buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
}

.main-content .resume-writing,
.main-content .job-recommendations {
  width: 300px;
  height: 70px;
  background: #FFFFFF;
  border: 1px solid #000000;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.main-content .resume-writing:hover,
.main-content .job-recommendations:hover {
  background-color: #f0f0f0;
}

.main-content .resume-writing span,
.main-content .job-recommendations span {
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 100%;
}

/* Group 32: additional-content */
.main-content .additional-content {
  width: 100%;
  background: #FFFFFF;
  border: 1px solid #000000;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 25px;
  margin-top: auto;
  box-sizing: border-box;
}

.main-content .additional-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 22px;
  text-align: left;
}

.main-content .additional-content p {
  margin: 10px 0;
  font-size: 18px;
  text-align: left;
}
  </style>