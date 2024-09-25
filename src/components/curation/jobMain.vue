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
        {{ categoryLabel }}
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
                  <i
                    :class="[
                      'fas',
                      'fa-bookmark',
                      { bookmarked: isBookmarked(job.jobId) },
                    ]"
                  ></i>
                </div>
                <h5 class="card-title">{{ job.jobInfoTitle }}</h5>
                <p class="card-text company">
                  <i class="fas fa-building"></i> {{ job.jobCompanyName }}
                </p>
                <p class="card-text location">
                  <i class="fas fa-map-marker-alt"></i> {{ job.jobLocation }}
                </p>
                <p class="card-text career">
                  <i class="fas fa-briefcase"></i> {{ job.jobCareerCondition }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <WomenJobs v-if="selectedCategory === 'womenJobs'" :jobs="paginatedJobs" />
    <UniversityJob
      v-if="selectedCategory === 'studentJobs'"
      :jobs="paginatedJobs"
    />
    <ElderlyJobs
      v-if="selectedCategory === 'elderlyJobs'"
      :jobs="paginatedJobs"
    />
    <Employment
      v-if="selectedCategory === 'employment'"
      :jobs="paginatedJobs"
    />

    <!-- 페이지네이션 -->
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="changePage(currentPage - 1)"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: page === currentPage }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{
            page
          }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="changePage(currentPage + 1)"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { getChoseong } from "es-hangul";

// 컴포넌트 임포트
import Employment from "../curation/employment.vue";
import ElderlyJobs from "../curation/ElderlyJobs.vue";
import WomenJobs from "../curation/womenJobs.vue";
import UniversityJob from "../curation/universityJob.vue";

// 상수 및 변수 설정
const API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const searchTerm = ref("");
const jobs = ref([]);
const currentPage = ref(1);
const itemsPerPage = 16;
const bookmarks = ref([]);
const selectedCategory = ref(""); // 선택된 카테고리 초기값 설정

// 카테고리 라벨 계산
const categoryLabel = computed(() => {
  switch (selectedCategory.value) {
    case "womenJobs":
      return "여성 일자리";
    case "studentJobs":
      return "대학생 일자리";
    case "elderlyJobs":
      return "노인 일자리";
    case "employment":
      return "고용센터";
    default:
      return "채용 정보"; // 기본값 설정
  }
});

// 북마크 관련 함수
const loadBookmarks = () => {
  const savedBookmarks = localStorage.getItem("bookmarks");
  if (savedBookmarks) {
    bookmarks.value = JSON.parse(savedBookmarks);
  }
};

const saveBookmarks = () => {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks.value));
};

watch(bookmarks, saveBookmarks, { deep: true });

// 자격증 데이터 가져오기 함수
const fetchJobs = async () => {
  try {
    const jobIds = new Set();
    jobs.value = []; // jobs 배열 초기화

    // 경기도잡아바 API 호출
    const response1 = await axios.get(
      `${API_URL}/api/v1/jobaba/jobinfo?param=someValue`,
      { withCredentials: true }
    );
    const jobData1 = response1.data.GGJOBABARECRUSTM.row;
    const jobsFromJobaba = jobData1.map((job) => ({
      jobId: job.ENTRPRS_NM,
      jobInfoTitle: job.PBANC_CONT,
      jobCompanyName: job.ENTRPRS_NM,
      jobLocation: job.WORK_REGION_CONT,
      jobCareerCondition: job.CAREER_DIV,
      apiType: "jobaba", // API 유형 추가
    }));

    jobsFromJobaba.forEach((job) => {
      if (!jobIds.has(job.jobId)) {
        jobIds.add(job.jobId);
        jobs.value.push(job);
      }
    });

    // 서울시 채용 API 호출
    const response2 = await axios.get(`${API_URL}/api/v1/seoul/jobinfo`, {
      withCredentials: true,
    });
    const jobData2 = response2.data.GetJobInfo.row;
    const jobsFromSeoul = jobData2.map((job) => ({
      jobId: job.JO_REQST_NO,
      jobInfoTitle: job.JO_SJ,
      jobCompanyName: job.CMPNY_NM,
      jobLocation: job.WORK_PARAR_BASS_ADRES_CN,
      jobCareerCondition: job.CAREER_CND_NM,
      apiType: "seoul", // API 유형 추가
    }));

    jobsFromSeoul.forEach((job) => {
      if (!jobIds.has(job.jobId)) {
        jobIds.add(job.jobId);
        jobs.value.push(job);
      }
    });
  } catch (error) {
    console.error("채용 정보를 가져오는 데 실패했습니다.", error);
  }
};

// 페이지 로드 시 작업 가져오기
onMounted(() => {
  fetchJobs();
  loadBookmarks();
});

// 검색어에 맞게 필터링된 채용 정보 반환
const filteredJobs = computed(() => {
  if (!searchTerm.value) return jobs.value;

  const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
  return jobs.value.filter(job => {
    const titleChoseong = getChoseong(job.jobInfoTitle).toLowerCase();
    const companyChoseong = getChoseong(job.jobCompanyName).toLowerCase();
    
    return (
      job.jobInfoTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
      job.jobCompanyName.toLowerCase().includes(lowerCaseSearchTerm) ||
      titleChoseong.includes(lowerCaseSearchTerm) ||
      companyChoseong.includes(lowerCaseSearchTerm)
    );
  });
});


// 페이지네이션 관련 함수
const totalPages = computed(() =>
  Math.ceil(filteredJobs.value.length / itemsPerPage)
);

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredJobs.value.slice(start, end);
});

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

// 북마크 관련 함수
const toggleBookmark = (job) => {
  const index = bookmarks.value.findIndex((item) => item.jobId === job.jobId);
  if (index > -1) {
    bookmarks.value.splice(index, 1);
    console.log("북마크 삭제됨:", bookmarks.value);
  } else {
    bookmarks.value.push(job);
    console.log("북마크 추가됨:", bookmarks.value);
  }
};

const isBookmarked = (jobId) => {
  return bookmarks.value.some((item) => item.jobId === jobId);
};

// 검색 관련 함수
const searchJobs = () => {
  if (!searchTerm.value) {
    fetchJobs();
  } else {
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase();
    jobs.value = jobs.value.filter((job) => {
      return (
        job.jobInfoTitle.toLowerCase().includes(lowerCaseSearchTerm) ||
        job.jobCompanyName.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });

    console.log('검색된 결과:', jobs.value);
  }
};

// 검색어 변경 감지
watch(searchTerm, (newTerm) => {
  if (!newTerm) {
    fetchJobs();
  } else {
    searchJobs();
  }
});

// 카테고리 선택 함수
const selectCategory = (category) => {
  console.log(`카테고리가 변경되었습니다: ${category}`);
  selectedCategory.value = category;
  // 카테고리 변경 시 검색 결과도 초기화
  fetchJobs();
};

// 상세 페이지로 이동
const goToDetail = (jobId) => {
  router.push({ name: "curationDetail", params: { id: jobId } });
};
</script>



<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

body {
  background-color: #e6f3ff;
  color: #333;
  font-family: "Arial", sans-serif;
}

.curation-main-container {
  margin: 2rem auto;
  background-color: #e6f3ff;
  backdrop-filter: blur(10px);
  padding: 2rem;
  box-sizing: border-box;
  width: 100%;
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
  border-left: 5px solid #0166ff;
}

.curation-index,
.search-bar {
  width: 100%;
  background-color: #ffffff;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.curation-index:hover,
.search-bar:hover {
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
  border-color: #0166ff;
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
  background-color: #0166ff;
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
  color: #0166ff;
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
  min-width: 800px; /* 원하는 최소 너비 설정 (예: 800px) */
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
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  display: flex; /* 카드 내부의 요소를 flexbox로 설정 */
  flex-direction: column; /* 수직 정렬 */
  height: 100%; /* 기본적으로 카드 높이를 100%로 설정 */
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
  color: #b0c4de;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.bookmark-icon i:hover {
  transform: scale(1.1);
}

.bookmark-icon i.bookmarked {
  color: #ffd700;
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

.card-text.company i {
  color: #3498db;
}
.card-text.location i {
  color: #e74c3c;
}
.card-text.career i {
  color: #2ecc71;
}

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
  border: 1px solid #0166ff;
  color: #0166ff;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.page-link:hover {
  background-color: #0166ff;
  color: white;
}

.page-item.active .page-link {
  background-color: #0166ff;
  color: white;
}

.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}

@media (max-width: 1200px) {
  .col-md-3 {
    width: 33.33%;
  }
}

@media (max-width: 992px) {
  .col-md-3 {
    width: 50%;
  }
}

/* 카드가 2개 이하일 때의 스타일 조정 */
@media (max-width: 768px) {
  .col-md-3 {
    width: 100%; /* 작은 화면에서는 카드가 100% 너비를 차지하도록 설정 */
  }

  /* 카드가 2개 이하일 때 높이를 고정 */
  .row:has(.col-md-3:only-child) .card,
  .row:has(.col-md-3:nth-child(-n + 2)) .card {
    height: 300px; /* 원하는 고정 높이로 설정 */
  }

  .row:has(.col-md-3:only-child) {
    justify-content: center; /* 중앙 정렬 */
  }

  .row:has(.col-md-3:nth-child(-n + 2)) {
    justify-content: center; /* 2개 이하일 때 중앙 정렬 */
  }
}
</style>
