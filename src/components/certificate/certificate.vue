<template>
  <div class="curation-main-container">
    <!-- 큐레이션 -->
    <div class="curation-index">
      <router-link to="/certificates" class="curation-item">
        <i class="fas fa-certificate" style="color: #4caf50"></i>
        <p>자격증</p>
      </router-link>
      <div class="curation-item" @click="goToPagecertificate('/gradeJobs')">
        <i class="fas fa-star" style="color: #ffc107"></i>
        <p>상위종목</p>
      </div>
      <div class="curation-item" @click="goToPagecertificate('/testJobs')">
        <i class="fas fa-calendar-alt" style="color: #2196f3"></i>
        <p>시험일정</p>
      </div>
    </div>

    <!-- 검색 창 -->
    <div class="recruitment-cards">
      <div class="info-search-container">
        <h2 class="section-title">자격증 정보</h2>
        <div class="info-search-container">
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

          <!-- 필터링 -->
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

      <!-- 자격증 카드 -->
      <div class="row">
        <div
          v-for="gradecertificate in paginatedCertificates"
          :key="gradecertificate.jmNm"
          class="col-md-3"
        >
          <div class="card">
            <div class="card-body">
              <!-- 북마크 아이콘 추가 -->
              <div
                class="bookmark-icon"
                @click.stop="toggleBookmark(gradecertificate)"
              >
                <i
                  :class="[
                    'fas',
                    'fa-bookmark',
                    { bookmarked: isBookmarked(gradecertificate.jmNm) },
                  ]"
                ></i>
              </div>
              <h5 class="card-title">
                <i class="fas fa-certificate" style="color: #4caf50"></i>
                {{ gradecertificate.jmNm }}
              </h5>
              <p class="card-text">
                <i class="fas fa-building" style="color: #2196f3"></i>
                기관: {{ gradecertificate.instiNm }}
              </p>
              <p class="card-text">
                <i class="fas fa-trophy" style="color: #ff9800"></i>
                등급: {{ gradecertificate.grdNm }}
              </p>
              <p class="card-text">
                <i class="fas fa-chart-line" style="color: #673ab7"></i>
                자격증 취득률: {{ gradecertificate.preyyAcquQualIncRate }}%
              </p>
              <p class="card-text">
                <i class="fas fa-chart-bar" style="color: #3f51b5"></i>
                전년도 자격증 취득 수: {{ gradecertificate.preyyQualAcquCnt }}
              </p>
              <p class="card-text">
                <i class="fas fa-chart-pie" style="color: #ff5722"></i>
                총 자격증 취득 수: {{ gradecertificate.qualAcquCnt }}
              </p>
              <p class="card-text">
                <i class="fas fa-calendar-alt" style="color: #009688"></i>
                통계 연도: {{ gradecertificate.statisYy }}
              </p>
              <p class="card-text">
                <i class="fas fa-calendar-check" style="color: #8bc34a"></i>
                합계 연도: {{ gradecertificate.sumYy }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TestJobs v-if="goToPagecard === '/testJobs'" />
    <GradeJobs v-if="goToPagecard === '/gradeJobs'" />

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
import { getChoseong } from "es-hangul";
import TestJobs from "./testJobs.vue";
import GradeJobs from "./gradeJobs.vue";

// 자격증 및 필터 상태
const API_URL = import.meta.env.VITE_API_URL;
const searchTerm = ref("");
const gradeCertificates = ref([]);
const selectedCategory = ref("");
const selectedGrade = ref(""); // 선택된 등급
const goToPagecard = ref(""); // 초기 값 설정

const goToPagecertificate = (category) => {
  goToPagecard.value = category;
};

// 북마크 상태
const bookmarks = ref([]);

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

// 페이지네이션 상태
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

// 북마크 관련 함수
const loadBookmarks = () => {
  const savedBookmarks = localStorage.getItem("bookmarks");
  if (savedBookmarks) {
    bookmarks.value = JSON.parse(savedBookmarks);
    console.log("북마크 데이터 로드됨:", bookmarks.value);
  } else {
    bookmarks.value = [];
    console.log("저장된 북마크 없음");
  }
};

// 북마크 저장 함수
const saveBookmarks = () => {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks.value));
};

// 북마크 배열 감시 및 저장
watch(bookmarks, saveBookmarks, { deep: true });

// 북마크 토글 함수
const toggleBookmark = (gradecertificate) => {
  console.log(`북마크 토글: 자격증 이름 - ${gradecertificate.jmNm}`);

  if (gradecertificate && gradecertificate.jmNm) {
    const isAlreadyBookmarked = bookmarks.value.some(
      (item) => item.jmNm === gradecertificate.jmNm
    );
    console.log(`현재 북마크 상태: ${isAlreadyBookmarked}`);

    if (isAlreadyBookmarked) {
      bookmarks.value = bookmarks.value.filter(
        (item) => item.jmNm !== gradecertificate.jmNm
      ); // 북마크 제거
      console.log(`북마크 제거됨: 자격증 이름 - ${gradecertificate.jmNm}`);
    } else {
      bookmarks.value = [...bookmarks.value, gradecertificate]; // 북마크 추가
      console.log(`북마크 추가됨: 자격증 이름 - ${gradecertificate.jmNm}`);
    }

    console.log("변경된 북마크 목록:", bookmarks.value);
  } else {
    console.error("유효하지 않은 자격증 객체:", gradecertificate);
  }
};

// 자격증이 북마크된 상태인지 확인하는 함수
const isBookmarked = (certificateName) => {
  if (certificateName) {
    const result = bookmarks.value.some(
      (item) => item.jmNm === certificateName
    );
    if (result) {
      console.log(`북마크 상태: ${result} (자격증 이름: ${certificateName})`);
    }
    return result;
  } else {
    console.error("유효하지 않은 자격증 이름:", certificateName);
    return false;
  }
};

// 자격증 데이터 가져오기 함수
const fetchGradeCertificates = async () => {
  // 필터링된 grdCd 배열 생성
  const grdCds = selectedCategory.value
    ? [selectedCategory.value]
    : ["10", "20", "30", "31", "32", "33", "40"];

  // 개별 API 호출을 위한 비동기 함수
  const fetchCertificatesByGrade = async (grdCd) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/v1/gradejob?grdCd=${grdCd}`
      );
      if (
        response.data &&
        response.data.response &&
        response.data.response.body
      ) {
        const items = response.data.response.body.items.item;
        if (Array.isArray(items)) {
          return items;
        } else {
          console.error(
            `아이템 배열이 예상되었으나, ${grdCd}에 대해 다음이 반환되었습니다:`,
            items
          );
          return [];
        }
      } else {
        console.error(
          `응답 데이터 구조가 예상과 일치하지 않습니다: ${grdCd}`,
          response.data
        );
        return [];
      }
    } catch (error) {
      console.error(`자격증 정보를 가져오는 중 오류 발생 (${grdCd}):`, error);
      return [];
    }
  };

  // 모든 grdCd 값에 대해 비동기 호출을 수행
  const allCertificates = await Promise.all(
    grdCds.map(fetchCertificatesByGrade)
  );

  // 모든 결과를 하나의 배열로 결합
  gradeCertificates.value = allCertificates.flat();
};

// 페이지 변경 함수
const changePage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
  }
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
  const range = 2;
  let start = Math.max(currentPage.value - range, 1);
  let end = Math.min(currentPage.value + range, totalPages.value);

  if (start <= 3) {
    end = Math.min(5, totalPages.value);
  }
  if (end >= totalPages.value - 2) {
    start = Math.max(1, totalPages.value - 4);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// 페이지 로드 시 자격증 정보와 북마크 가져오기
onMounted(() => {
  fetchGradeCertificates();
  loadBookmarks();
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
  margin: 0; /* p 태그의 기본 여백 제거 */
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

.page-info {
  margin: 0 20px;
  font-weight: 500;
}

@media (max-width: 1200px) {
  .col-md-3 {
    width: 50%; /* 2열 레이아웃 */
  }
}

@media (max-width: 992px) {
  .col-md-3 {
    width: 50%; /* 2열 레이아웃 */
  }
}

@media (max-width: 768px) {
  .col-md-3 {
    width: 100%; /* 1열 레이아웃 */
  }

  .section-title {
    font-size: 1.25rem; /* 모바일 화면에서 제목 크기 조정 */
  }

  .info-search-container {
    font-size: 20px;
    padding: 15px; /* 모바일 화면에서 패딩 조정 */
  }

  .search-input-box {
    font-size: 14px;
  }

  .btn {
    font-size: 0.9rem;
    padding: 8px 16px;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-text {
    font-size: 0.8rem;
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
