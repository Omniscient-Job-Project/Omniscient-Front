<template>
  <div class="main-container">
    <!-- 히어로 섹션 -->
    <section class="hero">
    <h2 class="hero-title">당신의 꿈을 위한 첫걸음</h2>
    <p class="hero-subtitle">수천 개의 채용 정보에서 당신에게 맞는 직업을 찾아보세요</p>
    <div class="search-bar">
      <input type="text" v-model="searchTerm" placeholder="직무, 회사, 키워드 검색" class="search-input" @input="searchJobs">
      <button @click="searchJobs" class="search-button">
        <i class="fas fa-search"></i> 검색
      </button>
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
        <button @click="goToPage(1)" :disabled="currentPage === 1" class="page-btn">
          <i class="fas fa-angle-double-left"></i>
        </button>
        <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
          <i class="fas fa-angle-left"></i>
        </button>
        <div class="page-numbers">
          <button v-for="pageNumber in displayedPageNumbers" :key="pageNumber"
                  @click="goToPage(pageNumber)"
                  :class="['page-number', { active: currentPage === pageNumber }]">
            {{ pageNumber }}
          </button>
        </div>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
          <i class="fas fa-angle-right"></i>
        </button>
        <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages" class="page-btn">
          <i class="fas fa-angle-double-right"></i>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
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

const filteredJobs = computed(() => {
  if (!searchTerm.value) return jobs.value;
  return jobs.value.filter(job =>
    job.jobInfoTitle.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    job.jobCompanyName.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage));

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredJobs.value.slice(start, end);
});

const displayedPageNumbers = computed(() => {
  const range = 2; // 이 값을 조정하여 표시되는 페이지 번호의 개수를 변경할 수 있습니다
  let start = Math.max(currentPage.value - range, 1);
  let end = Math.min(currentPage.value + range, totalPages.value);

  // 시작 페이지나 끝 페이지에 가까울 때 더 많은 페이지 번호를 표시하도록 조정
  if (start <= 3) {
    end = Math.min(5, totalPages.value);
  }
  if (end >= totalPages.value - 2) {
    start = Math.max(1, totalPages.value - 4);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

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

const goToPage = (page) => {
  currentPage.value = page;
};

const searchJobs = () => {
  currentPage.value = 1; // 검색 후 첫 페이지로 리셋
};

watch(searchTerm, () => {
  searchJobs();
});

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
  padding: 80px 40px;
  background: linear-gradient(135deg, #f0f4f8 0%, #d9e6f2 100%);
  color: #2c3e50;
  border-radius: 15px;
  margin: 40px 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}


.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #34495e;
}

.hero-subtitle {
  font-size: 20px;
  margin-bottom: 40px;
  color: #5d6d7e;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-bar {
  display: flex;
  justify-content: center;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex-grow: 1;
  padding: 15px 20px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.search-button {
  padding: 15px 30px;
  background-color: #3498db;
  border: none;
  border-radius: 30px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.search-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
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
  padding: 10px 15px;
  background-color: #0166FF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  margin: 0 5px;
}

.page-btn:hover:not(:disabled) {
  background-color: #014fd3;
  transform: translateY(-2px);
}

.page-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  margin: 0 10px;
}

.page-number {
  padding: 5px 10px;
  margin: 0 5px;
  background-color: transparent;
  border: 1px solid #0166FF;
  color: #0166FF;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-number.active,
.page-number:hover {
  background-color: #0166FF;
  color: white;
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

@media (max-width: 768px) {
  .hero {
    padding: 60px 20px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .search-bar {
    flex-direction: column;
  }

  .search-input, .search-button {
    width: 100%;
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
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

  .page-numbers {
    display: none;
  }

  .pagination {
    justify-content: space-between;
  }
}
</style>