<template>
    <div class="curation-main-container">
      <!-- 자격증 카드 -->
      <div class="test-cards">
        <h2 class="section-title">자격증 정보</h2>
        <div class="row">
          <div
            v-for="testCertificate in paginatedCertificates"
            :key="testCertificate.implSeq"
            class="col-md-3"
          >
            <div class="card" @click="goToDetail(testCertificate.implSeq)">
              <div class="card-body">
                <div
                  class="bookmark-icon"
                  @click.stop="toggleBookmark(testCertificate)"
                >
                  <i :class="['fas', 'fa-bookmark', { 'bookmarked': isBookmarked(testCertificate.implSeq) }]"></i>
                </div>
                <h5 class="card-title">{{ testCertificate.description }}</h5>
                <p class="card-text description">{{ testCertificate.description }}</p>
                <p class="card-text reg-date">
                  등록기간: {{ testCertificate.docRegStartDt }} ~ {{ testCertificate.docRegEndDt }}
                </p>
                <p class="card-text exam-date">
                  시험기간: {{ testCertificate.docExamStartDt }} ~ {{ testCertificate.docExamEndDt }}
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
            <a
              class="page-link"
              href="#"
              @click.prevent="changePage(page)"
            >
              {{ page }}
            </a>
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
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const certificate = ref('');
const searchTerm = ref('');
const testCertificates = ref([]);
const currentPage = ref(1);
const itemsPerPage = 16;
const bookmarks = ref([]);

// 북마크 로드 및 저장 함수
const loadBookmarks = () => {
  const savedBookmarks = localStorage.getItem('bookmarks');
  if (savedBookmarks) {
    bookmarks.value = JSON.parse(savedBookmarks);
  }
};

const saveBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks.value));
};

watch(bookmarks, saveBookmarks, { deep: true });

// 자격증 데이터 가져오기 함수
const fetchTestCertificates = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/v1/testjob');
    console.log('API 응답:', response.data); // 응답 데이터를 로깅하여 구조 확인
    const items = response.data.response.body.items.item;
    if (Array.isArray(items)) {
      testCertificates.value = items; // 받아온 자격증 정보를 testCertificates에 저장
    } else {
      console.error('아이템 배열이 예상되었으나, 다음이 반환되었습니다:', items);
    }
  } catch (error) {
    console.error('자격증 정보를 가져오는 중 오류 발생:', error);
  }
};

onMounted(() => {
  fetchTestCertificates();
  loadBookmarks();
});

const filteredCertificates = computed(() => {
  if (!Array.isArray(testCertificates.value)) return [];
  if (!searchTerm.value) return testCertificates.value;
  return testCertificates.value.filter(certificate =>
    certificate.qualgbNm.includes(searchTerm.value) ||
    certificate.description.includes(searchTerm.value)
  );
});

const totalPages = computed(() => Math.ceil(filteredCertificates.value.length / itemsPerPage));
const paginatedCertificates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCertificates.value.slice(start, end);
});

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

const goToDetail = (testId) => {
  router.push({ name: 'detail', params: { id: testId } });
};

const toggleBookmark = (certificate) => {
  const index = bookmarks.value.findIndex(item => item.implSeq === certificate.implSeq);
  if (index > -1) {
    bookmarks.value.splice(index, 1);
  } else {
    bookmarks.value.push(certificate);
  }
};

const isBookmarked = (testId) => {
  return bookmarks.value.some(item => item.implSeq === testId);
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

.section-title {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 1rem;
    width: 100%;
    text-align: left;
    padding-left: 10px;
    border-left: 5px solid #0166FF;
}

.select-container,
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

.select-container:hover,
.curation-index:hover,
.search-bar:hover {
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

.search-bar .card-input {
    display: flex;
    align-items: center;
}

.search-bar input {
    flex-grow: 1;
    margin-right: 10px;
    height: 45px;
    padding: 10px 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px 0 0 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.search-bar input:focus {
    border-color: #0166FF;
    box-shadow: 0 0 0 2px rgba(1, 102, 255, 0.2);
}

.search-button {
    height: 68px;
    padding: 0 20px;
    border: none;
    border-radius: 0 8px 8px 0;
    background-color: #0166FF;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.search-button:hover {
    background-color: #0056b3;
}

.search-button i {
    margin-right: 8px;
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

    .search-bar .card-input {
        flex-direction: column;
    }

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