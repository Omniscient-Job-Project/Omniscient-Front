<template>
  <Header />

  <div class="main-container">
    <Sidebar />
    
    <div class="content-container">
      <div class="box2">
        <!-- 인포그래픽 또는 설명 섹션 -->
        <div class="info-section">
          <h2>자격증 검색</h2>
          <p>자격증을 검색하여 필요한 정보를 빠르게 찾아보세요. 인기 있는 자격증과 유용한 검색 팁도 제공됩니다.</p>
        </div>

        <!-- 인기 자격증 섹션 -->
        <div class="popular-certifications">
          <h3>인기 자격증</h3>
          <ul>
            <li>정보처리기사</li>
            <li>정보처리산업기사</li>
            <li>네트워크관리사</li>
          </ul>
        </div>

        <div class="search-box">
          <div class="input-wrapper">
            <input 
              type="text" 
              class="search-input-box" 
              placeholder="분야를 입력해주세요." 
              :value="searchTerm" 
              @input="handleInput" 
              @blur="() => setListOpen(false)" 
              @focus="() => setListOpen(true)" 
            />
            <img 
              src="@/assets/img/search-icon.svg"
              class="search-icon" 
              @click="handleSearch"
              alt="검색 아이콘"
            />
          </div>

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
  </div>

  <Footer />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import Header from '../header/header.vue';
import Footer from '../footer/footer.vue';
import Sidebar from './certificateSidebar.vue';

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
/* 전체 레이아웃 */
.main-container {
  display: flex;
  min-height: 70vh;
}

.content-container {
  flex: 1;
  padding: 20px;
  background-color: #E6F3FF;
}

/* 사이드바 스타일 */
.sidebar {
  width: 300px;
  background: #fff;
  padding: 20px;
  border-right: 1px solid #ddd;
  position: sticky;
  top: 0;
  height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.info-section {
  text-align: center;
  margin: 30px 30px;
}

.info-section h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.info-section p {
  font-size: 16px;
  color: #555;
}

.popular-certifications {
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
}

.popular-certifications h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.popular-certifications ul {
  list-style: none;
  padding: 0;
}

.popular-certifications li {
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  position: relative;
  min-height: 400px;
  margin-bottom: 0;
}

.search-box {
  position: absolute;
  top: 20px;
  left: 20px;
  width: calc(100% - 40px); /* 아이콘을 위한 공간 확보 */
  max-width: 500px;
}

.search-input-box {
  width: 95%;
  padding: 15px;
  border: 2px solid #007bff;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
}

.search-icon {
  position: absolute;
  right: 0px; /* 오른쪽에서 약간 떨어진 위치 */
  top: 50%;
  transform: translateY(-50%); /* 수직 가운데 정렬 */
  width: 40px;
  height: 22px;
  fill: #1D1B20; /* 아이콘 색상 */
  cursor: pointer; /* 클릭 가능한 아이콘으로 설정 */
}

.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-width: 500px;
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

.search-button-box {
  position: absolute;
  bottom: 20px;
  right: 20px;
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
  .main-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
    position: static;
    box-shadow: none;
  }

  .content-container {
    padding: 10px;
  }

  .search-input-box {
    font-size: 14px;
  }

  .search-button-box {
    padding: 10px 30px;
    font-size: 14px;
  }

  .search-box {
    width: calc(100% - 40px);
    max-width: 100%;
    left: 10px;
    right: 10px;
  }
}
</style>