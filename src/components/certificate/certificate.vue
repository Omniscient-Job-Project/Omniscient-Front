<template>
  <Header />

  <div class="box-container">

    <div class="box1">
      <div>분야</div>
      <div>자격증 종류</div>
      <div>일정</div>
    </div>
    
    <div class="box2">
      <!-- 박스 안 검색창 -->
      <div class="search-box">
        <input 
          type="text" 
          class="search-input-box" 
          placeholder="분야를 입력해주세요" 
          :value="searchTerm" 
          @input="handleInput" 
          @blur="() => setListOpen(false)" 
          @focus="() => setListOpen(true)" 
        />
        <div class="search-icon-box"></div>
        
        <!-- 자동완성 리스트 -->
        <ul v-if="isFocus && filteredList.length > 0" class="autocomplete-list">
          <li v-for="item in filteredList" :key="item.id" @mousedown="selectItem(item)">
            {{ item.name }}
          </li>
        </ul>
      </div>

      <!-- 정보 박스 -->
      <div class="info-box">
        <div class="info-item">경영 회계 사무</div>
        <div class="info-item">국가 기술 자격</div>
        <div class="info-item">시험일</div>
      </div>

      <!-- 검색 버튼 -->
      <button class="search-button-box" @click="handleSearch">
        검색
      </button>
    </div>
  </div>

  <Footer />
</template>


<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import Header from '@/components/header/header.vue'; // 헤더 컴포넌트 임포트
import Footer from '@/components/footer/footer.vue'; // 풋터 불러오기

// 나중에 자격증 api 가져오면 여기에 api list를 넣으면 됨.
// 상태 정의
const dataList = ref([
  { id: 1, name: '정보처리기사' },
  { id: 2, name: '정보처리산업기사' },
  { id: 3, name: '네트워크관리사' },
  { id: 4, name: '리눅스마스터' },
  { id: 5, name: '컴퓨터활용능력' },
  // 추가 항목들
]);

const searchTerm = ref('');
const isFocus = ref(false);
const selectedObj = ref(null);
const router = useRouter();


// 메서드 정의
const handleInput = (e) => {
  searchTerm.value = e.target.value;
};

const handleSearch = () => {
  console.log('검색어:', searchTerm.value); // 콘솔 로그 출력
  router.push({ name: 'certificateSearch', query: { searchTerm: searchTerm.value } });
};

const setListOpen = (isOpen) => {
  isFocus.value = isOpen;
};

const selectItem = (item) => {
  selectedObj.value = item;
  searchTerm.value = item.name;
  setListOpen(false); // 자동완성 리스트 닫기
};

// 필터링된 리스트 계산
const filteredList = computed(() => {
  if (searchTerm.value === '') {
    return [];
  }
  return dataList.value.filter(item => 
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
</script>


<style scoped>
  /* 전체 레이아웃 */
  body {
    
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 80vh; /* 페이지 전체를 채우도록 설정 */
  }
  
  /* 박스 컨테이너 스타일 */
  .box-container {
    background-color: #E6F3FF;
    height: 70vh;
    display: flex;
    flex-direction: column; /* 박스를 세로로 나열 */
    align-items: center; /* 박스를 중앙 정렬 */
  }
  
  .box1 {
    display: flex;
    justify-content: space-between; /* 내부 박스들 사이에 균등하게 간격을 둠 */
    border: 2px solid #000;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    margin: 10px;
    width: 55%; /* 너비를 반으로 줄임 */
  }

  .box1 div {
    flex: 1; /* 각 항목이 컨테이너 내에서 동일한 비율로 확장 */
    text-align: center; /* 텍스트 중앙 정렬 */
    padding: 10px;
  }

  .box2 {
    display: flex;
    flex-direction: column; /* 세로로 나열 */
    align-items: flex-start; /* 왼쪽 정렬 */
    padding: 20px;
    border: 2px solid #000;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    margin: 10px;
    width: 50%; /* 너비를 반으로 줄임 */
    position: relative; /* 위치 조정을 위한 relative 설정 */
    max-width: 1000px; /* 최대 너비 설정 */
    height: 400px; /* 높이를 600px로 설정 */
    box-sizing: border-box;
  }

  /* 검색창 스타일 */
  .search-box {
    position: relative; /* 아이콘을 input 박스에 상대적으로 위치시키기 위해 설정 */
    display: flex;
    align-items: center;
    width: 40%; /* 필요에 따라 조정 */
  }

.search-input-box {
  width: 100%; /* 전체 너비 사용 */
  padding: 10px;
  padding-right: 40px; /* 아이콘 크기만큼 여백 추가 */
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  }

.search-icon-box {
  position: absolute; /* 절대 위치로 아이콘을 위치시킴 */
  right: 10px; /* 입력 박스 오른쪽에서 10px 떨어지도록 위치 조정 */
  width: 20px;
  height: 20px;
  cursor: pointer;
  }


  /* 자동완성 리스트 스타일 */
  .autocomplete-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 1000;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
  }

  .autocomplete-list li {
    padding: 10px;
    cursor: pointer;
  }

  .autocomplete-list li:hover {
    background-color: #f0f0f0;
  }

  /* 정보 박스 스타일 */
  .info-box {
    display: flex;
    justify-content: space-between; /* 항목들 사이에 간격을 둡니다 */
    width: 100%; /* 박스의 너비를 설정 */
    margin:10px 0 60px; /* 검색 버튼과의 겹침 방지를 위한 여백 추가 */
  }

  .info-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  flex: 1;
  margin: 0 5px; /* 각 박스 사이 간격 설정 */
  }

  .info-box div {
    padding: 10px;
    border: 2px solid #000;
    border-radius: 5px;
    text-align: center;
    flex: 1; /* 각 항목이 동일한 비율로 확장 */
  }

  /* 검색 버튼 스타일 */
  .search-button-box {
  padding: 5px 40px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  position: absolute; /* 절대 위치 설정 */
  bottom: 20px; /* 박스 바닥에서 20px 위로 위치 조정 */
  right: 20px; /* 박스 오른쪽에서 20px 위치 조정 */
  text-decoration: none; /* 기본 밑줄 제거 */
  }
</style>
