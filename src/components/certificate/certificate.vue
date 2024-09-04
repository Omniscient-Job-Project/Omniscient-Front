<template>
  <Header />

  <div class="box-container">
    <div class="box1">
      <div class="box1-item">분야</div>
      <div class="box1-item">자격증 종류</div>
      <div class="box1-item">일정</div>
    </div>
    
    <div class="box2">
      <div class="info-box">
        <div class="info-item">경영 회계 사무</div>
        <div class="info-item">국가 기술 자격</div>
        <div class="info-item">시험일</div>
      </div>

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
        
        <ul v-if="isFocus && filteredList.length > 0" class="autocomplete-list">
          <li v-for="item in filteredList" :key="item.id" @mousedown="selectItem(item)">
            {{ item.name }}
          </li>
        </ul>
      </div>

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
import Header from '@/components/header/header.vue';
import Footer from '@/components/footer/footer.vue';

const dataList = ref([
  { id: 1, name: '정보처리기사' },
  { id: 2, name: '정보처리산업기사' },
  { id: 3, name: '네트워크관리사' },
  { id: 4, name: '리눅스마스터' },
  { id: 5, name: '컴퓨터활용능력' },
]);

const searchTerm = ref('');
const isFocus = ref(false);
const selectedObj = ref(null);
const router = useRouter();

const handleInput = (e) => {
  searchTerm.value = e.target.value;
};

const handleSearch = () => {
  console.log('검색어:', searchTerm.value);
  router.push({ name: 'certificateSearch', query: { searchTerm: searchTerm.value } });
};

const setListOpen = (isOpen) => {
  isFocus.value = isOpen;
};

const selectItem = (item) => {
  selectedObj.value = item;
  searchTerm.value = item.name;
  setListOpen(false);
};

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
.box-container {
  background-color: #E6F3FF;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.box1 {
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
}

.box1-item {
  flex: 1;
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 10px;
  text-align: center;
  margin: 0 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.box2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
  position: relative; /* 자식 요소의 절대 위치를 위한 relative 설정 */
  height: 600px; /* 높이 값을 늘림 */
  margin-bottom: 0; /* box2와 footer 사이의 공백 제거 */
  /* 필요에 따라 overflow: hidden;을 추가할 수 있습니다. */
}


.search-box {
  position: absolute;
  top: 20px; /* box2의 상단에서 20px 아래에 위치 */
  left: 20px; /* box2의 왼쪽에서 20px 오른쪽에 위치 */
  width: 100%;
  max-width: 500px;
  margin-bottom: 40px; /* search-box와 info-box 사이의 간격을 넓힘 */
}

.search-input-box {
  width: 100%;
  padding: 15px;
  padding-right: 40px;
  border: 2px solid #007bff;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
}

.search-icon-box {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  cursor: pointer;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="20px" height="20px"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>');
  background-repeat: no-repeat;
  background-size: contain;
}

.autocomplete-list {
  position: absolute;
  top: 100%; /* search-box의 하단에 위치 */
  left: 0; /* search-box의 왼쪽에 맞추어 위치 */
  width: 100%; /* search-box의 너비에 맞추어 너비 설정 */
  max-width: 500px; /* search-box의 최대 너비와 동일하게 설정 */
  background: white;
  border: 1px solid #ccc;
  border-radius: 20px;
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.autocomplete-list li {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.autocomplete-list li:hover {
  background-color: #f0f0f0;
}

.info-box {
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  width: 100%;
  max-width: 800px; /* 중앙에 배치되도록 최대 너비 설정 */
  margin: 80px 0 0; /* 상단 여백 조정: search-box와의 간격을 넓힘 */
}

.info-item {
  flex: 1;
  padding: 15px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  text-align: center;
  margin: 0 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.info-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.search-button-box {
  position: absolute;
  bottom: 20px; /* box2의 하단에서 20px 위에 위치 */
  right: 20px; /* box2의 오른쪽에서 20px 왼쪽에 위치 */
  padding: 12px 40px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.search-button-box:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .box1, .info-box {
    flex-direction: column;
  }

  .box1-item, .info-item {
    margin: 5px 0;
  }

  .search-input-box {
    font-size: 14px;
  }

  .search-button-box {
    padding: 10px 30px;
    font-size: 14px;
  }
}


</style>