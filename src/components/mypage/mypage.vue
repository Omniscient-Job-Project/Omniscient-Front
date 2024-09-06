<template>
  <div class="page-background">
    <Header />
    <div class="mypage-container">
      <!-- 사이드바 시작 -->
      <div class="sidebar">
        <ul>
          <!-- 메뉴 아이템을 동적으로 생성 -->
          <li v-for="item in menuItems" :key="item.page">
            <!-- 클릭 시 setCurrentPage 함수 호출, 현재 페이지일 경우 'active' 클래스 추가 -->
            <a @click="setCurrentPage(item.page)" :class="{ active: currentPage === item.page }">
              <i :class="item.icon"></i> {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
      <!-- 사이드바 끝 -->

      <!-- 메인 콘텐츠 영역 시작 -->
      <div class="main-content">
        <!-- MyHome 페이지 -->
        <div v-if="currentPage === 'myHome'">
          <div class="welcome-message">
            <i class="fas fa-hand-wave"></i> {{ userName }}님 환영합니다!
          </div>
          <!-- 액션 버튼 -->
          <div class="action-buttons">
            <div class="resume-writing" @click="setCurrentPage('resumePage')">
              <i class="fas fa-pen"></i>
              <span>이력서 작성</span>
            </div>
            <div class="job-recommendations" @click="showRecommendations">
              <i class="fas fa-bullhorn"></i>
              <span>추천 채용공고</span>
            </div>
          </div>
          <!-- 추가 콘텐츠: 활동 요약 -->
          <div class="additional-content">
            <h3 class="summary-title"><i class="fas fa-chart-line"></i> 활동 요약</h3>
            <div class="summary-grid">
              <!-- 활동 요약 아이템을 동적으로 생성 -->
              <div v-for="item in summaryItems" :key="item.label" class="summary-item">
                <i :class="item.icon"></i>
                <p>{{ item.label }}</p>
                <span>{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 조건부 렌더링을 사용하여 다른 페이지 컴포넌트 표시 -->
        <ProfilePage v-else-if="currentPage === 'profilePage'" />
        <ResumeManagementPage v-else-if="currentPage === 'resumePage'" />
        <ApplicationsPageComponent v-else-if="currentPage === 'applicationsPage'" />
        <ScrapPage v-else-if="currentPage === 'scrapPage'" />
        <CertificatesPage 
          v-else-if="currentPage === 'certificatesPage'" 
          v-model:certificates="certificates"
          @update:certificates="updateCertificates"
        />
      </div>
      <!-- 메인 콘텐츠 영역 끝 -->
    </div>
    <Footer />
  </div>
</template>

<script setup>
// Vue 3 Composition API 관련 함수들을 import
import { ref, reactive, computed, onMounted } from 'vue';

// 필요한 컴포넌트 import
import Header from '@/components/header/header.vue';
import Footer from '@/components/footer/footer.vue';
import ProfilePage from '@/components/mypage/profilePage.vue';
import ResumeManagementPage from '@/components/mypage/resumeManagementPage.vue';
import CertificatesPage from '@/components/mypage/certificatesPage.vue';
import ScrapPage from '@/components/mypage/scrapPage.vue';
import ApplicationsPageComponent from '@/components/mypage/applicationsPageComponent.vue';

// 반응형 상태 정의
const currentPage = ref(localStorage.getItem('currentPage') || 'myHome');
const userName = ref('신주연');

// 복잡한 상태는 reactive를 사용
const certificates = reactive([
  { name: '정보처리기사', date: '2023-05-15', issuer: '한국산업인력공단', number: '23-12-1234', isOpen: false },
  { name: 'SQLD', date: '2023-08-20', issuer: '한국데이터산업진흥원', number: 'SQL-2023-12345', isOpen: false },
]);

// 메뉴 아이템 데이터
const menuItems = [
  { page: 'myHome', label: 'MyHome', icon: 'fas fa-home' },
  { page: 'profilePage', label: '프로필', icon: 'fas fa-user' },
  { page: 'resumePage', label: '이력서 관리', icon: 'fas fa-file-alt' },
  { page: 'applicationsPage', label: '지원 현황', icon: 'fas fa-briefcase' },
  { page: 'scrapPage', label: '스크랩', icon: 'fas fa-bookmark' },
  { page: 'certificatesPage', label: '자격증 관리', icon: 'fas fa-certificate' },
];

// computed 속성 정의
const summaryItems = computed(() => [
  { label: '지원한 회사', value: 5, icon: 'fas fa-building' },
  { label: '열람된 이력서', value: 3, icon: 'fas fa-eye' },
  { label: '보유 자격증', value: certificates.length, icon: 'fas fa-award' },
]);

// 메서드 정의
const setCurrentPage = (page) => {
  currentPage.value = page;
  localStorage.setItem('currentPage', page);
};

const showRecommendations = () => {
  console.log('추천 채용공고 표시');
};

const updateCertificates = (newCertificates) => {
  Object.assign(certificates, newCertificates);
};

// 생명주기 훅 사용
onMounted(() => {
  // 페이지를 떠날 때 현재 페이지 상태를 로컬 스토리지에 저장
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('currentPage', currentPage.value);
  });
});
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