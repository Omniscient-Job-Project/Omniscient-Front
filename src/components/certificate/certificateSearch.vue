<template>
    <Header/>
    <div class="search-results-container">
      <!-- <h1 class="search-results">검색 결과</h1>
      <ul v-if="filteredResults.length > 0">
        <li v-for="item in filteredResults" :key="item.id">
          {{ item.name }}
        </li>
      </ul>
      <p v-else>검색 결과가 없습니다.</p> -->
  
      <!-- 추가된 박스 -->
      <div class="additional-box">
        <div class="certificate-info">
          <div class="certificate-header">
            <div class="certificate-name"
            v-if="filteredResults.length > 0"
            v-for="item in filteredResults" :key="item.id">{{item.name}}</div>
            <div class="apply-button">접수 바로가기</div>
          </div>
          <div class="certificate-details">
            <div class="details-section">
              <strong>자격증 정보 :</strong>
              <p>자격증 정보를 여기에 입력하세요.</p>
            </div>
            <div class="details-section">
              <strong>응시 자격 :</strong>
              <p>응시 자격을 여기에 입력하세요.</p>
            </div>
            <div class="details-section">
              <strong>시험 내용 :</strong>
              <p>시험 내용을 여기에 입력하세요.</p>
            </div>
            <div class="details-section">
              <strong>시험 일정 :</strong>
              <p>시험 일정을 여기에 입력하세요.</p>
            </div>
            <div class="details-section">
              <strong>접수 방법 :</strong>
              <p>접수 방법을 여기에 입력하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </template>
  
  
  <script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import Header from '@/components/header/header.vue'; // 헤더 컴포넌트 임포트
import Footer from '@/components/footer/footer.vue'; // 풋터 불러오기

  // 현재 라우트의 쿼리 파라미터를 가져옵니다.
  const route = useRoute();
  const searchTerm = computed(() => route.query.searchTerm || '');
  
  // 자격증 api list로 넣으면 됨.
  // 데이터 리스트 (예시)
  const dataList = [
    { id: 1, name: '정보처리기사' },
    { id: 2, name: '정보처리산업기사' },
    { id: 3, name: '네트워크관리사' },
    { id: 4, name: '리눅스마스터' },
    { id: 5, name: '컴퓨터활용능력' },
    // 추가 데이터...
  ];
  
  // 필터링된 결과 계산
  const filteredResults = computed(() => {
    if (!searchTerm.value) {
      return [];
    }
    return dataList.filter(item =>
      item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  });
  </script>
  
  <style scoped>
  .search-results-container {
    padding: 20px;
    height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .search-results {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .additional-box {
  padding: 20px;
  border: 2px solid #000;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  background-color: #f9f9f9;
  margin-top: 20px;
  text-align: center; /* 내용 중앙 정렬 */
  width: 80%;
  max-width: 800px;
}
.certificate-info {
  display: flex;
  flex-direction: column;
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #000;
}

.certificate-name {
  font-size: 1.2em;
  font-weight: bold;
}

.apply-button {
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  text-decoration: none;
  font-size: 1em;
}

.apply-button:hover {
  background-color: #0056b3;
}

.certificate-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.details-section {
  margin-bottom: 15px;
}

.details-section strong {
  display: block;
  margin-bottom: 5px;
}

.details-section p {
  margin: 0;
}
  </style>
  