<template>
    <div class="curation-main-container">
      <!-- 큐레이션 -->
      <div class="curation-index">
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
        </div>
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
          <h2>시험 일정</h2>
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
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
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
  import { ref, computed, onMounted } from "vue";
  import axios from "axios";
  import { getChoseong } from "es-hangul";
  
  const searchTerm = ref("");
  const gradeCertificates = ref([]);
  const selectedCategory = ref("");
  const selectedGrade = ref(""); // 선택된 등급
  const testJobs = ref([]);
  const showTestJobs = ref(false);
  
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
  
    // 카테고리 필터
    if (selectedCategory.value) {
      filtered = filtered.filter(
        (certificate) => certificate.grdCd === selectedCategory.value
      );
    }
  
    // 추가 필터: 선택된 등급
    if (selectedGrade.value) {
      filtered = filtered.filter(
        (certificate) => certificate.grdNm === selectedGrade.value
      );
    }
  
    return filtered;
  });
  
  const currentPage = ref(1);
  const itemsPerPage = 16;
  const totalPages = computed(() =>
    Math.ceil(filteredCertificates.value.length / itemsPerPage)
  );
  
  const paginatedCertificates = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCertificates.value.slice(start, end);
  });
  
  const paginatedTestJobs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return testJobs.value.slice(start, end);
  });
  
  // 필터링된 grdCds를 기반으로 자격증 데이터를 가져오는 함수
  const fetchGradeCertificates = async () => {
    // 필터링된 grdCd 배열 생성
    const grdCds = selectedCategory.value ? [selectedCategory.value] : ["10", "20", "30", "31", "32", "33", "40"];
    
    // 개별 API 호출을 위한 비동기 함수
    const fetchCertificatesByGrade = async (grdCd) => {
      try {
        const response = await axios.get(`http://localhost:8090/api/v1/gradejob?grdCd=${grdCd}`);
        if (response.data && response.data.response && response.data.response.body) {
          const items = response.data.response.body.items.item;
          if (Array.isArray(items)) {
            return items;
          } else {
            console.error(`아이템 배열이 예상되었으나, ${grdCd}에 대해 다음이 반환되었습니다:`, items);
            return [];
          }
        } else {
          console.error(`응답 데이터 구조가 예상과 일치하지 않습니다: ${grdCd}`, response.data);
          return [];
        }
      } catch (error) {
        console.error(`자격증 정보를 가져오는 중 오류 발생 (${grdCd}):`, error);
        return [];
      }
    };
  
    // 모든 grdCd 값에 대해 비동기 호출을 수행
    const allCertificates = await Promise.all(grdCds.map(fetchCertificatesByGrade));
  
    // 모든 결과를 하나의 배열로 결합
    gradeCertificates.value = allCertificates.flat();
  };
  
  // 시험 일정 데이터 호출
  const fetchTestJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/v1/testjob");
  
      // 응답 데이터 구조 확인
      console.log("전체 응답 데이터:", response.data);
  
      // 응답 데이터에서 items 추출
      const items = response.data.response.body.items.item;
  
      // items가 배열인지 확인
      if (Array.isArray(items)) {
        testJobs.value = items;
        showTestJobs.value = true; // 시험 일정 표시
      } else {
        console.error("예상된 배열이 아닙니다:", items);
        showTestJobs.value = false; // 오류 발생 시 표시 안 함
      }
  
      console.log("시험 일정 데이터:", testJobs.value);
    } catch (error) {
      console.error("시험 일정 정보를 가져오는 중 오류 발생:", error);
      showTestJobs.value = false; // 오류 발생 시 표시 안 함
    }
  };
  
  // 페이지 번호 변경 함수
  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
      currentPage.value = pageNumber;
    }
  };
  
  // 페이지 로드 시 자격증 정보와 시험 일정 가져오기
  onMounted(() => {
    fetchGradeCertificates();
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

/* 큐레이션 컨테이너 */
.curation-main-container {
  margin: 2rem auto;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 2rem;
  box-sizing: border-box;
  width: 95%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
}

/* 큐레이션 인덱스 */
.curation-index {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  width: 100%;
  background-color: #ffffff;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-radius: 15px;
  transition: all 0.3s ease;
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
  text-decoration: none; /* 호버 상태에서도 밑줄 제거 */
}

.curation-item i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.curation-item p {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
  margin: 0; /* p 태그의 기본 여백 제거 */
}

/* 자격증 정보 카드 */
.recruitment-cards {
  width: 100%;
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

/* 필터링 섹션 */
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

/* 페이지네이션 */
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

/* 시험 일정 데이터 표시 */
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
  background-color: #f9f9f9;
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

  </style>
  