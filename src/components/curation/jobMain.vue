<template>
  <div class="curation-main-container">

    <!-- 큐레이션 -->
    <div class="curation-index">
      <div class="curation-item" @click="selectCategory('home')">
        <i class="fas fa-home" style="color: #4caf50"></i>
        <p>홈</p>
      </div>
      <div class="curation-item" @click="selectCategory('employment')">
        <i class="fas fa-briefcase" style="color: #2196f3"></i>
        <p>고용센터</p>
      </div>
      <div class="curation-item" @click="selectCategory('elderlyJobs')">
        <i class="fas fa-user-friends" style="color: #ff9800"></i>
        <p>노인일자리</p>
      </div>
      <div class="curation-item" @click="selectCategory('womenJobs')">
        <i class="fas fa-female" style="color: #e91e63"></i>
        <p>여성일자리</p>
      </div>
      <div class="curation-item" @click="selectCategory('studentJobs')">
        <i class="fas fa-graduation-cap" style="color: #673ab7"></i>
        <p>대학생일자리</p>
      </div>
    </div>

  
  <!-- 검색창 -->
  <div class="header-container">
    <h2 class="section-title">
    {{ selectedCategory === 'womenJobs' ? '여성 일자리' :
      selectedCategory === 'studentJobs' ? '대학생 일자리' :
      selectedCategory === 'elderlyJobs' ? '노인 일자리' :
      selectedCategory === 'employment' ? '고용센터' : '채용 정보' }}
  </h2>
  <div class="search-box">
    <div class="input-wrapper">
      <input
        type="text"
        class="search-input-box"
        placeholder="분야를 입력해주세요."
        v-model="searchTerm"
      />
      <img
        src="@/assets/img/search-icon.svg"
        class="search-icon"
        @click="handleSearch"
        alt="검색 아이콘"
      />
    </div>
  </div>
</div>

    <!-- 채용정보 카드 -->
    <div v-if="selectedCategory === 'home'">
    <div class="recruitment-cards">
      <div class="row">
        <div v-for="job in paginatedJobs" :key="job.jobId" class="col-md-3">
          <div class="card" @click="goToDetail(job.jobId)">
            <div class="card-body">
              <div class="bookmark-icon" @click.stop="toggleBookmark(job)">
                <i :class="['fas', 'fa-bookmark', { 'bookmarked': isBookmarked(job.jobId) }]"></i>
              </div>
              <h5 class="card-title">{{ job.jobInfoTitle }}</h5>
              <p class="card-text company"><i class="fas fa-building"></i> {{ job.jobCompanyName }}</p>
              <p class="card-text location"><i class="fas fa-map-marker-alt"></i> {{ job.jobLocation }}</p>
              <p class="card-text career"><i class="fas fa-briefcase"></i> {{ job.jobCareerCondition }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <WomenJobs v-if="selectedCategory === 'womenJobs'" :jobs="paginatedJobs" />
    <UniversityJob v-if="selectedCategory === 'studentJobs'" :jobs="paginatedJobs" />
    <ElderlyJobs v-if="selectedCategory === 'elderlyJobs'" :jobs="paginatedJobs" />
    <Employment v-if="selectedCategory === 'employment'" :jobs="paginatedJobs" />



    <!-- 페이지네이션 -->
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(currentPage - 1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(currentPage + 1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>


  </div>
</template>
  
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { getChoseong } from "es-hangul";

import Employment from '../curation/employment.vue';
import ElderlyJobs from '../curation/ElderlyJobs.vue';
import WomenJobs from '../curation/womenJobs.vue';
import UniversityJob from '../curation/universityJob.vue'


const API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const searchTerm = ref('');
const jobs = ref([]);
const currentPage = ref(1);
const itemsPerPage = 16;
const bookmarks = ref([]);
const selectedCategory = ref('home');

// localStorage에서 북마크 불러오기
const loadBookmarks = () => {
  const savedBookmarks = localStorage.getItem('bookmarks');
  if (savedBookmarks) {
    bookmarks.value = JSON.parse(savedBookmarks);
  }
};

// 북마크 저장하기
const saveBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value));
};

// 북마크 변경 감지 및 저장
watch(bookmarks, saveBookmarks, { deep: true });

// 자격증 데이터 가져오기 함수
const fetchJobs = async () => {
  try {
    // 경기도잡아바 API 호출
    const response1 = await axios.get(`${API_URL}/api/v1/jobaba/jobinfo?param=someValue`, { withCredentials: true });
    const jobData1 = response1.data.GGJOBABARECRUSTM.row;
    const jobsFromJobaba = jobData1.map(job => ({
      jobId: job.ENTRPRS_NM,  // 프론트엔드에서 사용하는 속성 이름을 백엔드 JSON 구조에 맞게 수정
      jobInfoTitle: job.PBANC_CONT,
      jobCompanyName: job.ENTRPRS_NM,
      jobLocation: job.WORK_REGION_CONT,
      jobCareerCondition: job.CAREER_DIV,
      apiType: 'jobaba'  // API 유형 추가
    }));

    // 서울시 채용 API 호출
    const response2 = await axios.get(`${API_URL}/api/v1/seoul/jobinfo`, { withCredentials: true });
    const jobData2 = response2.data.GetJobInfo.row;
    const jobsFromSeoul = jobData2.map(job => ({
      jobId: job.JO_REQST_NO,
      jobInfoTitle: job.JO_SJ,
      jobCompanyName: job.CMPNY_NM,
      jobLocation: job.WORK_PARAR_BASS_ADRES_CN,
      jobCareerCondition: job.CAREER_CND_NM,
      apiType: 'seoul'  // API 유형 추가
    }));

    // 두 API에서 가져온 데이터를 통합
    jobs.value = [...jobsFromJobaba, ...jobsFromSeoul];
  } catch (error) {
    console.error('채용 정보를 가져오는 데 실패했습니다.', error);
  }
};

// 페이지 로드 시 채용 정보 가져오기
onMounted(() => {
  fetchJobs();
  loadBookmarks();
});


// 필터링된 자격증 반환
const filteredCertificates = computed(() => {
  let filtered = gradeCertificates.value;

  // 검색어 필터
  if (searchTerm.value) {
    const searchChoseong = getChoseong(searchTerm.value);
    filtered = filtered.filter((certificate) => {
      const certificateChoseong = getChoseong(
        certificate.jmNm + certificate.instiNm
      );
      return certificateChoseong.includes(searchChoseong);
    });
  }

  return filtered;
});

// 검색어 변경 시 필터링
watch(searchTerm, (newTerm) => {
  if (!newTerm) {
    fetchJobs();  // 검색어가 비어 있으면 모든 채용 정보를 다시 가져옴
  } else {
    searchJobs();  // 검색어가 있을 경우 필터링
  }
});

// 검색어에 맞게 필터링된 채용 정보 반환
const filteredJobs = computed(() => {
  // 각 카테고리별로 작업을 필터링
  if (selectedCategory.value === 'womenJobs') {
    return jobs.value.filter(job => job.apiType === 'women');
  } else if (selectedCategory.value === 'studentJobs') {
    return jobs.value.filter(job => job.apiType === 'student');
  } else if (selectedCategory.value === 'elderlyJobs') {
    return jobs.value.filter(job => job.apiType === 'elderly');
  } else if (selectedCategory.value === 'employment') {
    return jobs.value.filter(job => job.apiType === 'employment');
  }
  
  return jobs.value; // 기본적으로 모든 작업 반환
});

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage));

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredJobs.value.slice(start, end);
});

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const goToDetail = (jobId) => {
  router.push({ name: 'curationDetail', params: { id: jobId } });
};

const toggleBookmark = (job) => {
  const index = bookmarks.value.findIndex(item => item.jobId === job.jobId);
  if (index > -1) {
    bookmarks.value.splice(index, 1);
  } else {
    bookmarks.value.push(job);
  }
};

const isBookmarked = (jobId) => {
  return bookmarks.value.some(item => item.jobId === jobId);
};

// 검색 메소드 추가
const searchJobs = () => {
  if (!searchTerm.value) {
    fetchJobs();
  } else {
    jobs.value = jobs.value.filter(job =>
      job.jobInfoTitle.includes(searchTerm.value) || job.jobCompanyName.includes(searchTerm.value)
    );
  }
};

const selectCategory = (category) => {
  selectedCategory.value = category;
};

</script>

  
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

body {
  background-color: #E6F3FF;
  color: #333;
  font-family: 'Arial', sans-serif;
}

.curation-main-container {
  margin: 2rem auto;
  background-color: #E6F3FF;
  backdrop-filter: blur(10px);
  padding: 2rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

.section-title {
  font-size: 1.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  width: 100%;
  text-align: left;
  padding-left: 10px;
  border-left: 5px solid #0166FF;
}

.curation-index, .search-bar {
  width: 100%;
  background-color: #ffffff;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.curation-index:hover, .search-bar:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 1rem;
}

.form-control {
  width: 100%;
  height: 45px;
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #0166FF;
  box-shadow: 0 0 0 2px rgba(1, 102, 255, 0.2);
}

.button-container {
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
}

.btn-primary {
  background-color: #0166FF;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

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

.card-input {
  display: flex;
  align-items: center;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem; /* 제목과 카드 사이의 간격을 위해 추가 */
}

.search-box {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.search-box:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-input-box::placeholder {
  color: #999;
} 

.input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-input-box {
  flex-grow: 1;
  padding: 8px 12px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}


.recruitment-cards {
  width: 100%;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: -15px;
}

.col-md-3 {
  width: 25%;
  padding: 15px;
  box-sizing: border-box;
}

.card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.card-body {
  padding: 1.5rem;
  position: relative;
}

.bookmark-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  z-index: 10;
}

.bookmark-icon i {
  color: #B0C4DE;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.bookmark-icon i:hover {
  transform: scale(1.1);
}

.bookmark-icon i.bookmarked {
  color: #FFD700;
}

.card-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.card-text {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #34495e;
  display: flex;
  align-items: center;
}

.card-text i {
  margin-right: 0.5rem;
  width: 20px;
  text-align: center;
}

.card-text.company i { color: #3498db; }
.card-text.location i { color: #e74c3c; }
.card-text.career i { color: #2ecc71; }

.pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin-top: 2rem;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  display: block;
  padding: 8px 12px;
  border: 1px solid #0166FF;
  color: #0166FF;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.page-link:hover {
  background-color: #0166FF;
  color: white;
}

.page-item.active .page-link {
  background-color: #0166FF;
  color: white;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

@media (max-width: 1200px) {
  .col-md-3 { width: 33.33%; }
}

@media (max-width: 992px) {
  .col-md-3 { width: 50%; }
}

@media (max-width: 768px) {
  .curation-main-container { width: 100%; padding: 1rem; }
  .col-md-3 { width: 100%; }
  .search-bar .card-input { flex-direction: column; }
  .search-bar input {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
    border-radius: 8px;
  }
  .search-button {
    width: 100%;
    border-radius: 8px;
  }
}
</style>
