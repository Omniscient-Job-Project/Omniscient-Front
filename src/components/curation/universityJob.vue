<template>

    <div class="recruitment-cards">
      <h2 class="section-title">대학생 일자리 정보</h2>
        <div class="row">
          <div v-for="employment in employments" :key="employment.instNm" class="col-md-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">{{ employment.instNm }}</h5>
                  <p class="card-text">
                    <i class="fas fa-phone" style="color: #4caf50;"></i> 
                    <strong>연락처:</strong> {{ employment.contctNm }}
                  </p>
                  <p class="card-text">
                    <i class="fas fa-map-marker-alt" style="color: #2196f3;"></i>
                    <strong>주소:</strong> {{ employment.refineLotnoAddr }} (우편번호: {{ employment.refineZipNo }})
                  </p>
                  <p class="card-text">
                    <i class="fas fa-road" style="color: #ff9800;"></i>
                    <strong>도로명 주소:</strong> {{ employment.refineRoadnmAddr }}
                  </p>
                  <p class="card-text">
                    <i class="fas fa-map" style="color: #673ab7;"></i>
                    <strong>지역:</strong> {{ employment.regionNm }}
                  </p>
                  <p class="card-text">
                    <i class="fas fa-tag" style="color: #e91e63;"></i>
                    <strong>분류:</strong> {{ employment.divNm }}
                  </p>
  
                  <a :href="employment.hmpgNm" target="_blank" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i> 홈페이지 방문
                  </a>
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
  
  const fetchCertificatesByEmployment = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/employment`);
      if (response.data && response.data.GGEMPLTSP && response.data.GGEMPLTSP.row) {
        employments.value = response.data.GGEMPLTSP.row
          .filter(row => row.DIV_NM === '대학생 일자리')
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