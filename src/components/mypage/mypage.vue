<template>
    <div class="page-background">
      <Header />
      <div class="mypage-container">
        <div class="sidebar">
          <ul>
            <!-- 동적으로 생성되는 메뉴 항목 -->
            <li>
            <router-link to="/profilePage" custom v-slot="{ navigate, isActive }">
              <a @click="navigate" :class="{ active: isActive }" class="custom-link">
                <i class="fas fa-user"></i> 프로필
              </a>
            </router-link>
          </li>
          <li>
            <router-link to="/resume" custom v-slot="{ navigate, isActive }">
              <a @click="navigate" :class="{ active: isActive }" class="custom-link">
                <i class="fas fa-file-alt"></i> 이력서 관리
              </a>
            </router-link>
          </li>
          <li>
            <router-link to="/applications" custom v-slot="{ navigate, isActive }">
              <a @click="navigate" :class="{ active: isActive }" class="custom-link">
                <i class="fas fa-briefcase"></i> 지원 현황
              </a>
            </router-link>  
          </li>
          <li>
            <router-link to="/scrap" custom v-slot="{ navigate, isActive }">
              <a @click="navigate" :class="{ active: isActive }" class="custom-link">
                <i class="fas fa-bookmark"></i> 스크랩
              </a>
            </router-link>
          </li>
          <li>
            <router-link to="/certificates" custom v-slot="{ navigate, isActive }">
              <a @click="navigate" :class="{ active: isActive }" class="custom-link">
                <i class="fas fa-certificate"></i> 자격증 관리
              </a>
            </router-link>
          </li>
          </ul>
        </div>
        <div class="main-content">
          <div class="welcome-message">
            <!-- 웰컴 메시지에 아이콘 추가 -->
            <i class="fas fa-hand-wave"></i> {{ userName }}님 환영합니다!
          </div>
          <div class="action-buttons">
            <!-- 버튼에 아이콘 추가 -->
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
            <h3><i class="fas fa-chart-line"></i> 활동 요약</h3>
            <!-- 활동 요약을 그리드 레이아웃으로 변경 -->
            <div class="summary-grid">
              <div class="summary-item">
                <i class="fas fa-building"></i>
                <p>지원한 회사</p>
                <span>{{ appliedCompanies }}</span>
              </div>
              <div class="summary-item">
                <i class="fas fa-eye"></i>
                <p>열람된 이력서</p>
                <span>{{ viewedResumes }}</span>
              </div>
              <div class="summary-item">
                <i class="fas fa-award"></i>
                <p>보유 자격증</p>
                <span>{{ certifications }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Header from '@/components/header/header.vue';
  import Footer from '@/components/footer/footer.vue';
  

  
  // 사용자 정보 및 통계 데이터
  const userName = ref('신주연')
  const appliedCompanies = ref(5)
  const viewedResumes = ref(3)
  const certifications = ref(1)
  
  // 버튼 클릭 핸들러
  const writeResume = () => {
    console.log('이력서 작성 페이지로 이동')
  }
  
  const showRecommendations = () => {
    console.log('추천 채용공고 표시')
  }
  </script>
  
  <style scoped>
  /* Font Awesome 아이콘 라이브러리 추가 
     이를 통해 다양한 아이콘을 사용할 수 있습니다. */
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
  
  /* 페이지 전체 배경 스타일 
     - 연한 파란색 배경으로 전체적인 분위기 조성
     - flex 레이아웃을 사용하여 푸터를 하단에 고정 */
  .page-background {
    background-color: #E6F3FF;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* 메인 컨테이너 스타일 
     - 최대 너비 설정으로 대형 화면에서도 적절한 레이아웃 유지
     - flex 레이아웃으로 사이드바와 메인 콘텐츠 배치
     - flex-grow: 1로 푸터를 하단으로 밀어냄 */
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
  
  /* 사이드바 스타일 
     - 흰색 배경과 그림자로 시각적 구분
     - 둥근 모서리로 모던한 디자인 적용 */
  .sidebar {
    width: 250px;
    background: #FFFFFF;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 30px;
    margin-right: 50px;
    flex-shrink: 0;
  }
  
  /* 사이드바 메뉴 리스트 스타일 */
  .sidebar ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  /* 사이드바 메뉴 항목 스타일 
     - 간격 조정으로 가독성 향상 */
  .sidebar ul li {
    margin-bottom: 15px;
  }
  
  /* 커스텀 링크 스타일
     - 호버 효과와 활성 상태 스타일 정의
     - 부드러운 전환 효과 추가 */
  .custom-link {
    display: flex;
    align-items: center;
    font-size: 18px;
    color: inherit;
    text-decoration: none;
    padding: 10px;
    border-radius: 8px;
    transition: background-color 0.3s, color 0.3s, transform 0.3s;
  }
  
  .custom-link:hover, .custom-link.active {
    background-color: #f0f0f0;
    color: #007bff;
    transform: translateX(5px);
  }
  
  /* 사이드바 메뉴 아이콘 스타일 */
  .custom-link i {
    margin-right: 10px;
    width: 20px;
  }
  
  /* 메인 콘텐츠 영역 스타일 
     - 흰색 배경과 그림자로 시각적 구분
     - 둥근 모서리로 일관된 디자인 유지 */
  .main-content {
    flex-grow: 1;
    background: #FFFFFF;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 50px;
    display: flex;
    flex-direction: column;
  }
  
  /* 환영 메시지 스타일 
     - 가운데 정렬과 큰 폰트 사이즈로 강조
     - 아이콘(fa-hand-wave)을 텍스트 왼쪽에 배치 */
  .welcome-message {
    text-align: center;
    margin-bottom: 30px;
    font-size: 28px;
    color: #333;
  }
  
  /* 환영 메시지 아이콘 스타일 */
  .welcome-message i {
    color: #FFD700;
    margin-right: 10px;
  }
  
  /* 액션 버튼 컨테이너 스타일 */
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 40px;
  }
  
  /* 액션 버튼 스타일 (이력서 작성, 추천 채용공고)
     - 둥근 모서리와 파란색 배경으로 눈에 띄게 설계
     - 호버 시 확대 효과로 상호작용성 강화
     - 각 버튼 왼쪽에 아이콘 배치 (fa-pen, fa-bullhorn) */
  .resume-writing,
  .job-recommendations {
    width: 200px;
    height: 60px;
    background: #007bff;
    color: #FFFFFF;
    border-radius: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    font-size: 18px;
  }
  
  .resume-writing:hover,
  .job-recommendations:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  
  /* 액션 버튼 내 아이콘 스타일 */
  .resume-writing i,
  .job-recommendations i {
    margin-right: 10px;
  }
  
  /* 추가 콘텐츠 영역 스타일 (활동 요약) 
     - 연한 회색 배경으로 시각적 구분
     - 둥근 모서리로 일관된 디자인 유지 */
  .additional-content {
    background: #F8F9FA;
    border-radius: 15px;
    padding: 25px;
    margin-top: auto;
  }
  
  /* 활동 요약 제목 스타일 
     - 아이콘(fa-chart-line)을 제목 왼쪽에 배치 */
  .additional-content h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }
  
  /* 활동 요약 그리드 레이아웃 
     - 3개의 열로 구성하여 정보를 균형있게 배치 */
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  
  /* 활동 요약 개별 항목 스타일 
     - 흰색 배경과 그림자로 카드 형태 디자인
     - 호버 시 약간 위로 떠오르는 효과로 상호작용성 강화
     - 각 항목 상단에 아이콘 배치 (fa-building, fa-eye, fa-award) */
  .summary-item {
    background: #FFFFFF;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
  }
  
  .summary-item:hover {
    transform: translateY(-5px);
  }
  
  /* 활동 요약 항목 내 아이콘 스타일 */
  .summary-item i {
    font-size: 24px;
    color: #007bff;
    margin-bottom: 10px;
  }
  
  /* 활동 요약 항목 내 텍스트 스타일 */
  .summary-item p {
    margin: 5px 0;
    font-size: 16px;
    color: #666;
  }
  
  /* 활동 요약 항목 내 숫자 스타일 */
  .summary-item span {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  </style>