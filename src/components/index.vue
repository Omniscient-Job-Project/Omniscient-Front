<template>
  <div class="main-container">
    <!-- 히어로 섹션 -->
    <section class="hero">
      <h2 class="hero-title">당신의 꿈을 위한 첫걸음</h2>
      <p class="hero-subtitle">수천 개의 채용 정보에서 당신에게 맞는 직업을 찾아보세요</p>
      <div class="search-bar">
        <input type="text" v-model="searchTerm" placeholder="직무, 회사, 키워드 검색" class="search-input">
        <button @click="searchJobs" class="search-button">검색</button>
      </div>
    </section>

    <!-- 주요 카테고리 섹션 -->
    <section class="categories">
      <h3 class="section-title">주요 카테고리</h3>
      <div class="category-grid">
        <div v-for="category in categories" :key="category.id" class="category-item">
          <i :class="category.icon"></i>
          <span>{{ category.name }}</span>
        </div>
      </div>
    </section>

    <!-- 채용 정보 리스팅 -->
    <section class="job-listing">
      <h3 class="section-title">최신 채용 정보</h3>
      <div class="job-grid">
        <div v-for="job in paginatedJobs" :key="job.jobId" class="job-card">
          <div class="job-card-content" @click="goToDetail(job.jobId)">
            <h4 class="job-title">{{ job.jobInfoTitle }}</h4>
            <p class="company-name"><i class="fas fa-building"></i> {{ job.jobCompanyName }}</p>
            <p class="job-location"><i class="fas fa-map-marker-alt"></i> {{ job.jobLocation }}</p>
            <p class="job-career"><i class="fas fa-briefcase"></i> {{ job.jobCareerCondition }}</p>
          </div>
          <button @click.stop="toggleBookmark(job)" class="bookmark-btn">
            <i :class="['fas', job.bookmarked ? 'fa-bookmark' : 'fa-bookmark-o']"></i>
          </button>
        </div>
      </div>
      <!-- 페이지네이션 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">이전</button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">다음</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const jobs = ref([]);
const currentPage = ref(1);
const itemsPerPage = 16;
const searchTerm = ref('');

const categories = [
  { id: 1, name: 'IT', icon: 'fas fa-laptop-code' },
  { id: 2, name: '마케팅', icon: 'fas fa-bullhorn' },
  { id: 3, name: '디자인', icon: 'fas fa-paint-brush' },
  { id: 4, name: '영업', icon: 'fas fa-handshake' },
  { id: 5, name: '금융', icon: 'fas fa-chart-line' },
  { id: 6, name: '교육', icon: 'fas fa-graduation-cap' },
];

const fetchJobs = async () => {
  try {
    const response1 = await axios.get('http://localhost:8090/api/v1/jobaba/jobinfo', { withCredentials: true });
    const response2 = await axios.get('http://localhost:8090/api/v1/seoul/jobinfo', { withCredentials: true });
    
    const jobsFromJobaba = response1.data.GGJOBABARECRUSTM.row.map(job => ({
      jobId: job.ENTRPRS_NM,
      jobInfoTitle: job.PBANC_CONT,
      jobCompanyName: job.ENTRPRS_NM,
      jobLocation: job.WORK_REGION_CONT,
      jobCareerCondition: job.CAREER_DIV,
      apiType: 'jobaba',
      bookmarked: false
    }));

    const jobsFromSeoul = response2.data.GetJobInfo.row.map(job => ({
      jobId: job.JO_REQST_NO,
      jobInfoTitle: job.JO_SJ,
      jobCompanyName: job.CMPNY_NM,
      jobLocation: job.WORK_PARAR_BASS_ADRES_CN,
      jobCareerCondition: job.CAREER_CND_NM,
      apiType: 'seoul',
      bookmarked: false
    }));

    jobs.value = [...jobsFromJobaba, ...jobsFromSeoul];
  } catch (error) {
    console.error('채용 정보를 가져오는 데 실패했습니다.', error);
  }
};

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return jobs.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(jobs.value.length / itemsPerPage));

const goToDetail = (jobId) => {
  router.push({ name: 'curationDetail', params: { id: jobId } });
};

const toggleBookmark = (job) => {
  job.bookmarked = !job.bookmarked;
  // TODO: 북마크 상태를 서버에 저장하는 로직 추가
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const searchJobs = () => {
  // TODO: 검색 로직 구현
  console.log('Searching for:', searchTerm.value);
};

onMounted(() => {
  fetchJobs();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

.main-container {
  font-family: 'Roboto', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e9ecef;
}

.site-title {
  font-size: 24px;
  font-weight: 700;
  color: #0166FF;
}

.main-nav {
  display: flex;
  gap: 20px;
}

.nav-item {
  text-decoration: none;
  color: #495057;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #0166FF;
}

.hero {
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(135deg, #0166FF 0%, #33a1fd 100%);
  color: white;
  border-radius: 10px;
  margin: 20px 0;
}

.hero-title {
  font-size: 36px;
  margin-bottom: 10px;
}

.hero-subtitle {
  font-size: 18px;
  margin-bottom: 30px;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.search-input {
  width: 50%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
}

.search-button {
  padding: 10px 20px;
  background-color: #ffc107;
  border: none;
  border-radius: 5px;
  color: #212529;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #ffca2c;
}

.section-title {
  font-size: 24px;
  color: #212529;
  margin: 40px 0 20px;
  padding-left: 10px;
  border-left: 5px solid #0166FF;
}

.categories {
  margin: 40px 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.category-item:hover {
  transform: translateY(-5px);
}

.category-item i {
  font-size: 24px;
  color: #0166FF;
  margin-bottom: 10px;
}

.job-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.job-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  position: relative;
}

.job-card:hover {
  transform: translateY(-5px);
}

.job-card-content {
  padding: 20px;
  cursor: pointer;
}

.job-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #212529;
}

.company-name, .job-location, .job-career {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 5px;
}

.company-name i, .job-location i, .job-career i {
  margin-right: 5px;
  color: #0166FF;
}

.bookmark-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: #ffc107;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.page-btn {
  padding: 8px 16px;
  background-color: #0166FF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #014fd3;
}

.page-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.page-info {
  margin: 0 20px;
  font-weight: 500;
}

.stats {
  background-color: white;
  border-radius: 10px;
  padding: 40px;
  margin: 40px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #0166FF;
  display: block;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 16px;
  color: #495057;
}

.footer {
  text-align: center;
  padding: 20px 0;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  color: #6c757d;
  font-size: 14px;
}

@media (max-width: 768px) {
  .main-container {
    padding: 10px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .main-nav {
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
    margin-bottom: 10px;
  }

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .job-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* 추가적인 스타일 개선 */
.job-card {
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.job-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(1, 102, 255, 0.2);
}

.nav-item {
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -5px;
  left: 0;
  background-color: #0166FF;
  visibility: hidden;
  transform: scaleX(0);
  transition: all 0.3s ease-in-out;
}

.nav-item:hover::after {
  visibility: visible;
  transform: scaleX(1);
}

.category-item {
  cursor: pointer;
}

.category-item:hover i {
  transform: scale(1.2);
  transition: transform 0.3s ease;
}

.stat-item {
  position: relative;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background-color: #0166FF;
}

/* 애니메이션 효과 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.hero, .job-card, .category-item, .stat-item {
  animation: fadeIn 1s ease-out;
}

/* 접근성 개선 */
.search-input:focus, .search-button:focus, .page-btn:focus {
  outline: 2px solid #0166FF;
  outline-offset: 2px;
}

/* 다크 모드 지원 (선택적) */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #121212;
    color: #e0e0e0;
  }

  .main-container {
    background-color: #1e1e1e;
  }

  .header, .footer {
    background-color: #252525;
    border-color: #333;
  }

  .nav-item, .job-title {
    color: #e0e0e0;
  }

  .job-card, .category-item, .stats {
    background-color: #252525;
    border-color: #333;
  }

  .company-name, .job-location, .job-career {
    color: #b0b0b0;
  }

  .search-input {
    background-color: #333;
    color: #e0e0e0;
  }

  .stat-number {
    color: #33a1fd;
  }
}
</style>