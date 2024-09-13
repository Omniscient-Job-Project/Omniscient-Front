<template>
    <div class="curation-main-container">
  
        <!-- 큐레이션 -->
        <div class="curation-index">
            <div class="curation-item">
                <i class="fas fa-certificate" style="color: #4CAF50;"></i> <!-- 녹색: 자격증 -->
                <p>자격증</p>
            </div>
            <div class="curation-item">
                <i class="fas fa-star" style="color: #FFC107;"></i> <!-- 금색: 상위종목 -->
                <p>상위종목</p>
            </div>
            <div class="curation-item">
                <i class="fas fa-calendar-alt" style="color: #2196F3;"></i> <!-- 파란색: 시험일정 -->
                <p>시험일정</p>
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
            >
            <img 
              src="@/assets/img/search-icon.svg"
              class="search-icon" 
              @click="handleSearch"
              alt="검색 아이콘"
            />
          </div>
        </div>

         <!-- 필터링 섹션 -->
         <div class="filter-section">
          <label for="categoryFilter">카테고리:</label>
          <select v-model="selectedCategory" id="categoryFilter">
            <option value="">전체</option>
            <option value="10">기술사</option>
            <option value="20">기능장</option>
            <option value="30">기사</option>
            <option value="31">산업기사</option>
            <option value="32">1급</option>
            <option value="33">2급</option>
            <option value="40">기능사</option>

          </select>
        </div>
        <div class="filter-section">
        </div>
        <button @click="applyFilters">필터 적용</button>




      </div>
      </div>
        


        
        <div class="row">
          <div v-for="gradecertificate in paginatedCertificates" :key="gradecertificate.grdNm" class="col-md-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">
                <i class="fas fa-certificate" style="color: #4CAF50;"></i> <!-- 녹색: 자격증 -->
                {{ gradecertificate.jmNm }}
                </h5>
                <p class="card-text">
                <i class="fas fa-building" style="color: #2196F3;"></i> <!-- 파란색: 기관 -->
                기관: {{ gradecertificate.instiNm }}
                </p>
                <p class="card-text">
                <i class="fas fa-trophy" style="color: #FF9800;"></i> <!-- 주황색: 등급 -->
                등급: {{ gradecertificate.grdNm }}
                </p>
                <p class="card-text">
                <i class="fas fa-chart-line" style="color: #673AB7;"></i> <!-- 보라색: 취득률 -->
                자격증 취득률: {{ gradecertificate.preyyAcquQualIncRate }}%
                </p>
                <p class="card-text">
                <i class="fas fa-chart-bar" style="color: #3F51B5;"></i> <!-- 파란색: 전년도 자격증 취득 수 -->
                전년도 자격증 취득 수: {{ gradecertificate.preyyQualAcquCnt }}
                </p>
                <p class="card-text">
                <i class="fas fa-chart-pie" style="color: #FF5722;"></i> <!-- 주황색: 총 자격증 취득 수 -->
                총 자격증 취득 수: {{ gradecertificate.qualAcquCnt }}
                </p>
                <!-- <p class="card-text">
                <i class="fas fa-medal" style="color: #FFC107;"></i>
                등급: {{ gradecertificate.qualAcquRank }}
                </p> -->
                <p class="card-text">
                <i class="fas fa-calendar-alt" style="color: #009688;"></i> <!-- 청록색: 통계 연도 -->
                통계 연도: {{ gradecertificate.statisYy }}
                </p>
                <p class="card-text">
                <i class="fas fa-calendar-check" style="color: #8BC34A;"></i> <!-- 연두색: 합계 연도 -->
                합계 연도: {{ gradecertificate.sumYy }}
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  
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
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import { getChoseong } from 'es-hangul';
  import { useRouter } from 'vue-router';
  
  // 상태 관리, 라우터
  const router = useRouter();
  const searchTerm = ref('');
  const gradeCertificates = ref([]);
  const selectedCategory = ref('');
  
  const filteredCertificates = computed(() => {
    if (!searchTerm.value) return gradeCertificates.value;
    const searchChoseong = getChoseong(searchTerm.value);
    return gradeCertificates.value.filter(certificate => {
      const certificateChoseong = getChoseong(certificate.jmNm + certificate.instiNm);
      return certificateChoseong.includes(searchChoseong);
    });
  });
  
  const currentPage = ref(1);
  const itemsPerPage = 16;
  const totalPages = computed(() => Math.ceil(filteredCertificates.value.length / itemsPerPage));
  const paginatedCertificates = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCertificates.value.slice(start, end);
  });
  
  // API 호출 함수
  const fetchGradeCertificates = async () => {
    try {
      const response = await axios.get('http://localhost:8090/api/v1/gradejob');
      if (response.data && response.data.response && response.data.response.body && response.data.response.body.items) {
        const items = response.data.response.body.items.item;
        if (Array.isArray(items)) {
          gradeCertificates.value = items;
        } else {
          console.error('아이템 배열이 예상되었으나, 다음이 반환되었습니다:', items);
        }
      } else {
        console.error('응답 데이터 구조가 예상과 일치하지 않습니다:', response.data);
      }
    } catch (error) {
      console.error('자격증 정보를 가져오는 중 오류 발생:', error);
    }
  };
  
  // 페이지 로드 시 자격증 정보 가져오기
  onMounted(() => {
    fetchGradeCertificates();
  });
  
  // 검색 메소드
  const handleSearch = () => {
    if (!searchTerm.value) {
      fetchGradeCertificates();
    } else {
      router.push({ name: 'certificateSearch', query: { searchTerm: searchTerm.value } });
    }
  };
  
  // 페이지 변경 함수
  const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
  };
  
  // 이벤트 핸들러
  const handleInputFocus = () => {
    document.addEventListener('keydown', handleKeyDown);
  };
  
  const handleInputBlur = () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
  
  const handleKeyDown = (e) => {
    if (!filteredCertificates.value.length) return;
  
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        currentPage.value = Math.min(currentPage.value + 1, totalPages.value);
        break;
      case 'ArrowUp':
        e.preventDefault();
        currentPage.value = Math.max(currentPage.value - 1, 1);
        break;
      case 'Enter':
        e.preventDefault();
        handleSearch();
        break;
    }
  };
  
  // 필터 적용 함수
  const applyFilters = () => {
    // 여기서 필터 적용 로직을 구현할 수 있습니다
    console.log('선택된 카테고리:', selectedCategory.value);
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

  .info-search-container {
    display: flex; /* 가로로 나열 */
    justify-content: space-between;
    align-items: center; /* 요소들 수직 가운데 정렬 */
    gap: 1rem; /* 요소들 사이 간격 */
  }
  
  .section-title {
    flex: 1;
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    width: 50%;
    text-align: left;
    padding-left: 10px;
    border-left: 5px solid #0166FF;
    display: flex;
    align-items: center;
  }
  .search-box {
    flex: 1;
    width: 50%;
    display: flex;
    align-items: center;
    border: 1px solid #ddd; /* 검색창 테두리 색상 */
    border-radius: 8px; /* 검색창 테두리 둥글기 */
    background-color: #fff; /* 검색창 배경색 */
    padding: 5px 10px; /* 검색창 패딩 */
  }

  .input-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .search-input-box {
    width: calc(100% - 2rem); /* 아이콘과의 여백을 고려하여 너비 조정 */
    border: none;
    outline: none;
    padding: 5px;
    font-size: 1rem;
    border-radius: 8px;
  }

  .search-icon {
    width: 24px; /* 아이콘 크기 */
    height: 24px; /* 아이콘 크기 */
    margin-left: 5px; /* 아이콘과 입력 박스 사이의 여백 */
    cursor: pointer;
  }
  
  .select-container, .curation-index{
    width: 100%;
    background-color: #ffffff;
    border: none;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    margin-bottom: 2rem;
    border-radius: 15px;
    transition: all 0.3s ease;
  }
  
  .select-container:hover, .curation-index:hover{
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
  }
  </style>