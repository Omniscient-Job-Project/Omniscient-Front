<template>

  <div class="recruitment-cards">
    <h2 class="section-title">고용센터 정보</h2>
    <div class="row">
      <div v-for="employment in employments" :key="employment.instNm" class="col-md-3">
        <div class="card">
          <div class="card-body">

              <div class="bookmark-icon" @click="toggleBookmark(employment)">
                <i :class="isBookmarked(employment.instNm) ? 'fas fa-bookmark bookmarked' : 'far fa-bookmark'"></i>
              </div>
              <a :href="employment.hmpgNm" target="_blank" class="home-icon">
                <i class="fas fa-external-link-alt" style="color: #007bff;"></i>
              </a>

            <h5 class="card-title">{{ employment.instNm }}</h5>
            <p class="card-text">
              <i class="fas fa-phone" style="color: #4caf50;"></i> 
              <strong>연락처:</strong> {{ employment.contctNm }}
            </p>
            <p class="card-text">
              <i class="fas fa-map-marker-alt" style="color: #e74c3c;"></i>
              <strong>주소:</strong> {{ employment.refineLotnoAddr }} (우편번호: {{ employment.refineZipNo }})
            </p>
            <p class="card-text">
              <i class="fas fa-map" style="color: #673ab7;"></i>
              <strong>지역:</strong> {{ employment.regionNm }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

    
</template>



<script setup> 
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const API_URL = import.meta.env.VITE_API_URL;
const employments = ref([]);
const bookmarks = ref([]);

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

const toggleBookmark = (employment) => {
  const index = bookmarks.value.findIndex(employment => employment.instNm === employment.instNm);
  if (index > -1) {
    bookmarks.value.splice(index, 1); // 북마크에서 제거
  } else {
    bookmarks.value.push(employment); // 북마크에 추가
  }
};

const isBookmarked = (instNm) => {
  return bookmarks.value.some(employment => employment.instNm === instNm); // 북마크에 있는지 확인
};

const fetchCertificatesByEmployment = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/employment`);
    if (response.data && response.data.GGEMPLTSP && response.data.GGEMPLTSP.row) {
      employments.value = response.data.GGEMPLTSP.row
        .filter(row => row.DIV_NM === '고용센터')
        .map(row => ({
          instNm: row.INST_NM,
          contctNm: row.CONTCT_NM,
          refineLotnoAddr: row.REFINE_LOTNO_ADDR,
          refineZipNo: row.REFINE_ZIPNO,
          refineRoadnmAddr: row.REFINE_ROADNM_ADDR,
          regionNm: row.REGION_NM,
          divNm: row.DIV_NM,
          refineWgs84Lat: row.REFINE_WGS84_LAT,
          refineWgs84Logt: row.REFINE_WGS84_LOGT,
          hmpgNm: row.HMPG_NM,
        }));
    }
  } catch (error) {
    console.error('채용 정보를 가져오는 데 실패했습니다.', error);
    employments.value = [];
  }
};


onMounted(() => {
  fetchCertificatesByEmployment();
  loadBookmarks();
});
</script>
<style scoped>
    body {
  background-color: #E6F3FF;
  color: #333;
  font-family: 'Arial', sans-serif;
}

.job-list {
  width: 100%;
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

/* 페이지네이션 스타일 */
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

@media (max-width: 1200px) {
  .col-md-3 { width: 33.33%; }
}

@media (max-width: 992px) {
  .col-md-3 { width: 50%; }
}

@media (max-width: 768px) {
  .job-list { width: 100%; padding: 1rem; }
  .col-md-3 { width: 100%; }
}

</style>