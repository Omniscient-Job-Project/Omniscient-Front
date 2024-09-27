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
    <div class="pagination">
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="page-btn"
      >
        <i class="fas fa-angle-double-left"></i>
      </button>
      <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
        <i class="fas fa-angle-left"></i>
      </button>
      <div class="page-numbers">
        <button
          v-for="pageNumber in displayedPageNumbers"
          :key="pageNumber"
          @click="goToPage(pageNumber)"
          :class="['page-number', { active: currentPage === pageNumber }]"
        >
          {{ pageNumber }}
        </button>
      </div>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        <i class="fas fa-angle-right"></i>
      </button>
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        <i class="fas fa-angle-double-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { getChoseong } from "es-hangul";

import Employment from "../curation/employment.vue";
import ElderlyJobs from "../curation/ElderlyJobs.vue";
import WomenJobs from "../curation/womenJobs.vue";
import UniversityJob from "../curation/universityJob.vue";

const API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const searchTerm = ref("");
const jobs = ref([]);
const currentPage = ref(1);
const itemsPerPage = 16;
const bookmarks = ref([]);
const selectedCategory = ref("");

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

// localStorage에서 북마크 불러오기
const loadBookmarks = () => {
  const savedBookmarks = localStorage.getItem("bookmarks");
  if (savedBookmarks) {
    bookmarks.value = JSON.parse(savedBookmarks);
  }
};

// 북마크 저장하기
const saveBookmarks = () => {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks.value));
};

// 북마크 변경 감지 및 저장
watch(bookmarks, saveBookmarks, { deep: true });

// 자격증 데이터 가져오기 함수
const fetchJobs = async () => {
  try {
    // 중복 방지를 위한 Set 생성
    const jobIds = new Set();

    // 경기도잡아바 API 호출
    const response1 = await axios.get(
      `${API_URL}/api/v1/jobaba/jobinfo?param=someValue`,
      { withCredentials: true }
    );
    const jobData1 = response1.data.GGJOBABARECRUSTM.row;
    const jobsFromJobaba = jobData1.map((job) => {
      const jobEntry = {
        jobId: job.ENTRPRS_NM, // 프론트엔드에서 사용하는 속성 이름을 백엔드 JSON 구조에 맞게 수정
        jobInfoTitle: job.PBANC_CONT,
        jobCompanyName: job.ENTRPRS_NM,
        jobLocation: job.WORK_REGION_CONT,
        jobCareerCondition: job.CAREER_DIV,
        apiType: "jobaba", // API 유형 추가
      };
      return jobEntry;
    });

    // 중복된 데이터 필터링 및 추가
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
    const jobsFromSeoul = jobData2.map((job) => {
      const jobEntry = {
        jobId: job.JO_REQST_NO,
        jobInfoTitle: job.JO_SJ,
        jobCompanyName: job.CMPNY_NM,
        jobLocation: job.WORK_PARAR_BASS_ADRES_CN,
        jobCareerCondition: job.CAREER_CND_NM,
        apiType: "seoul", // API 유형 추가
      };
      return jobEntry;
    });

    // 중복된 데이터 필터링 및 추가
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
    fetchJobs(); // 검색어가 비어 있으면 모든 채용 정보를 다시 가져옴
  } else {
    searchJobs(); // 검색어가 있을 경우 필터링
  }
});

// 검색어에 맞게 필터링된 채용 정보 반환
const filteredJobs = computed(() => {
  // 각 카테고리별로 작업을 필터링
  if (selectedCategory.value === "womenJobs") {
    return jobs.value.filter((job) => job.apiType === "women");
  } else if (selectedCategory.value === "studentJobs") {
    return jobs.value.filter((job) => job.apiType === "student");
  } else if (selectedCategory.value === "elderlyJobs") {
    return jobs.value.filter((job) => job.apiType === "elderly");
  } else if (selectedCategory.value === "employment") {
    return jobs.value.filter((job) => job.apiType === "employment");
  }

  return jobs.value; // 기본적으로 모든 작업 반환
});

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

const goToDetail = (jobId) => {
  router.push({ name: "curationDetail", params: { id: jobId } });
};

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

// 검색 메소드 추가
const searchJobs = () => {
  if (!searchTerm.value) {
    fetchJobs();
  } else {
    const lowerCaseSearchTerm = searchTerm.value.toLowerCase(); // 입력된 검색어를 소문자로 변환

    jobs.value = jobs.value.filter((job) => {
      return (
        job.jobInfoTitle.toLowerCase().includes(lowerCaseSearchTerm) || // 제목을 소문자로 변환하여 비교
        job.jobCompanyName.toLowerCase().includes(lowerCaseSearchTerm) // 회사 이름을 소문자로 변환하여 비교
      );
    });
  }
};

const selectCategory = (category) => {
  selectedCategory.value = category;
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

const displayedPageNumbers = computed(() => {
  const range = 2; // 현재 페이지 기준으로 보여줄 페이지 수 범위
  let start = Math.max(currentPage.value - range, 1);
  let end = Math.min(currentPage.value + range, totalPages.value);

  // 첫 번째 페이지들에 있을 때: 처음 5개 페이지를 표시
  if (currentPage.value <= 3) {
    start = 1;
    end = Math.min(5, totalPages.value);
  }

  // 마지막 페이지들에 있을 때: 마지막 5개 페이지를 표시
  if (currentPage.value >= totalPages.value - 2) {
    start = Math.max(totalPages.value - 4, 1);
    end = totalPages.value;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});
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
  align-items: center;
  margin-top: 40px;
}

.page-btn {
  padding: 10px 15px;
  background-color: #0166ff;
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
  border: 1px solid #0166ff;
  color: #0166ff;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-number.active,
.page-number:hover {
  background-color: #0166ff;
  color: white;
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

@media (max-width: 576px) {
  .pagination {
    flex-direction: column;
    gap: 10px;
  }

  .page-btn {
    width: 100%;
  }

  .page-numbers {
    flex-direction: column;
    gap: 5px;
  }

  .page-number {
    width: 100%;
    text-align: center;
  }
}
</style>
