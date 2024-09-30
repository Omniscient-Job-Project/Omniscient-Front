<template>
    <div class="curation-main-container">
        <!-- 큐레이션 -->
        <div class="curation-index">
          <router-link to="/certificates" class="curation-item">
            <i class="fas fa-certificate" style="color: #4caf50"></i>
            <p>자격증</p>
          </router-link>
          <router-link to="/certificate" class="curation-item">
            <i class="fas fa-star" style="color: #ffc107"></i>
            <p>상위종목</p>
          </router-link>
          <router-link to="/testJobs" class="curation-item">
            <i class="fas fa-calendar-alt" style="color: #2196f3"></i>
            <p>시험일정</p>
          </router-link>
        </div>
  
  
      <!-- 자격증 정보 카드 -->
      <div class="recruitment-cards">
        <div class="info-search-container">
          <h2 class="section-title">자격증 정보</h2>
          <div class="info-search-container">
            <div class="search-box" @click="ToggleFilter">
              <div class="input-wrapper">
                <input
                  type="text"
                  class="search-input-box"
                  placeholder="분야를 입력해주세요."
                  v-model="searchTerm"
                  @focus="handleInputFocus"
                  @blur="handleInputBlur"
                  @keydown="handleKeyDown"
                />
                <img
                  src="@/assets/img/search-icon.svg"
                  class="search-icon"
                  @click="handleSearch"
                  alt="검색 아이콘"
                />
              </div>
            </div>
  
            <div class="filter-section">
              <label for="gradeFilter">등급:</label>
              <select v-model="selectedGrade" id="gradeFilter">
                <option value="">전체</option>
                <option value="기술사">기술사</option>
                <option value="기능장">기능장</option>
                <option value="기사">기사</option>
                <option value="산업기사">산업기사</option>
                <option value="1급">1급</option>
                <option value="2급">2급</option>
                <option value="기능사">기능사</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 시험 일정 데이터 표시 -->
        <div v-if="showTestJobs" class="test-job-list">
          <ul>
            <li v-for="job in testJobs" :key="job.implSeq">
              <div>
                <i class="fas fa-calendar-day" style="color: #4caf50"></i> 시험명: {{ job.qualgbNm }}
              </div>
              <div>
                <i class="fas fa-info-circle" style="color: #2196f3"></i> 설명: {{ job.description }}
              </div>
              <div>
                <i class="fas fa-calendar-alt" style="color: #ff9800"></i> 문서 등록 기간: {{ job.docRegStartDt }} ~ {{ job.docRegEndDt }}
              </div>
              <div>
                <i class="fas fa-calendar-check" style="color: #ff5722"></i> 문서 시험 기간: {{ job.docExamStartDt }} ~ {{ job.docExamEndDt }}
              </div>
              <div>
                <i class="fas fa-calendar-day" style="color: #8bc34a"></i> 문서 합격일: {{ job.docPassDt }}
              </div>
              <div>
                <i class="fas fa-calendar-day" style="color: #009688"></i> 실기 등록 기간: {{ job.pracRegStartDt }} ~ {{ job.pracRegEndDt }}
              </div>
              <div>
                <i class="fas fa-calendar-check" style="color: #673ab7"></i> 실기 시험 기간: {{ job.pracExamStartDt }} ~ {{ job.pracExamEndDt }}
              </div>
              <div>
                <i class="fas fa-calendar-day" style="color: #ff5722"></i> 실기 합격일: {{ job.pracPassDt }}
              </div>
            </li>
          </ul>
        </div>
      </div>
  
  
    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="goToTestJobsPage(1)" :disabled="currentTestJobsPage === 1" class="page-btn">
          <i class="fas fa-angle-double-left"></i>
      </button>
      <button @click="prevTestJobsPage" :disabled="currentTestJobsPage === 1" class="page-btn">
          <i class="fas fa-angle-left"></i>
      </button>
      <div class="page-numbers">
          <button v-for="pageNumber in displayedTestJobsPageNumbers" :key="pageNumber"
                  @click="goToTestJobsPage(pageNumber)"
                  :class="['page-number', { active: currentTestJobsPage === pageNumber }]">
              {{ pageNumber }}
          </button>
      </div>
      <button @click="nextTestJobsPage" :disabled="currentTestJobsPage === totalTestJobsPages" class="page-btn">
          <i class="fas fa-angle-right"></i>
      </button>
      <button @click="goToTestJobsPage(totalTestJobsPages)" :disabled="currentTestJobsPage === totalTestJobsPages" class="page-btn">
          <i class="fas fa-angle-double-right"></i>
      </button>
    </div>

  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { getChoseong } from "es-hangul";


const API_URL = import.meta.env.VITE_API_URL;
const searchTerm = ref("");
const gradeCertificates = ref([]);
const selectedCategory = ref("");
const selectedGrade = ref(""); // 선택된 등급
const testJobs = ref([]);
const showTestJobs = ref(false);

// 자격증 필터링 로직
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

// 시험 일정 필터링 및 페이지네이션 로직
const currentTestJobsPage = ref(1);
const itemsPerTestJobsPage = 10;
const totalTestJobsPages = computed(() =>
  Math.ceil(testJobs.value.length / itemsPerTestJobsPage)
);

const paginatedTestJobs = computed(() => {
  const start = (currentTestJobsPage.value - 1) * itemsPerTestJobsPage;
  const end = start + itemsPerTestJobsPage;
  return testJobs.value.slice(start, end);
});

// 시험 일정 데이터 호출
const fetchTestJobs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/testjob`);

    const items = response.data.response.body.items.item;
    if (Array.isArray(items)) {
      testJobs.value = items;
      showTestJobs.value = true;
    } else {
      console.error("예상된 배열이 아닙니다:", items);
      showTestJobs.value = false;
    }
  } catch (error) {
    console.error("시험 일정 정보를 가져오는 중 오류 발생:", error);
    showTestJobs.value = false;
  }
};

// 페이지 변경 함수 (시험 일정)
const changeTestJobsPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalTestJobsPages.value) {
    currentTestJobsPage.value = pageNumber;
  }
};

const prevTestJobsPage = () => {
  if (currentTestJobsPage.value > 1) currentTestJobsPage.value--;
};

const nextTestJobsPage = () => {
  if (currentTestJobsPage.value < totalTestJobsPages.value) currentTestJobsPage.value++;
};

const goToTestJobsPage = (page) => {
  currentTestJobsPage.value = page;
};

const displayedTestJobsPageNumbers = computed(() => {
  const range = 2;
  let start = Math.max(currentTestJobsPage.value - range, 1);
  let end = Math.min(currentTestJobsPage.value + range, totalTestJobsPages.value);

  if (start <= 3) {
    end = Math.min(5, totalTestJobsPages.value);
  }
  if (end >= totalTestJobsPages.value - 2) {
    start = Math.max(1, totalTestJobsPages.value - 4);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// 페이지 로드 시 시험 일정 정보 가져오기
onMounted(() => {
  fetchTestJobs();
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
  
  .info-search-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background-color: #f9f9f9; /* 밝은 배경 */
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }
  
  .section-title {
    flex: 1;
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    width: 50%;
    text-align: left;
    padding-left: 10px;
    border-left: 5px solid #0166ff;
    display: flex;
    align-items: center;
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
  
  
  /* 필터링 섹션 스타일 */
  .filter-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .filter-section label {
    font-size: 16px;
    color: #555;
  }
  
  .filter-section select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    background-color: #fff;
    color: #333;
    transition: border-color 0.3s ease;
  }
  
  .filter-section select:focus {
    border-color: #333;
  }
  
  .select-container,
  .curation-index {
    width: 100%;
    background-color: #ffffff;
    border: none;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-radius: 15px;
    transition: all 0.3s ease;
  }
  
  .select-container:hover,
  .curation-index:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .select p {
    margin-top: 10px;
    text-align: center;
    color: #555;
  }
  
  .input-group {
    margin-bottom: 1rem;
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
    text-decoration: none; /* 링크의 밑줄 제거 */
    color: inherit; /* 텍스트 색상 상속 */
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
  
  @media (max-width: 768px) {
    .curation-main-container {
      width: 100%;
      padding: 1rem;
    }
    .col-md-3 {
      width: 100%;
    }
  }

  /* 시험 일정 데이터 표시 스타일 */
.test-job-list {
  padding: 20px;
}

.test-job-list h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.test-job-list ul {
  list-style-type: none;
  padding: 0;
}

.test-job-list li {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.test-job-list li:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.test-job-list div {
  margin-bottom: 8px;
  font-size: 1rem;
}

.test-job-list div:first-child {
  font-weight: 600;
}

.test-job-list div:last-child {
  margin-bottom: 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .test-job-list {
    padding: 15px;
  }

  .test-job-list li {
    padding: 10px;
  }
}
  </style>