<template>
  <Header />

  <div class="main-container">
    <Sidebar />
    
    <div class="content-container">
      <div class="box2">
        <div class="search-box" @click="toggleFilter">
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

          <ul v-if="isFocus && filteredList.length > 0" class="autocomplete-list">
            <li 
              v-for="(item, index) in filteredList" 
              :key="item.id" 
              @mousedown="selectItem(item)"
              :class="{ 'highlighted': index === selectedIndex.value }"
              ref="autocompleteItem"
            >
              {{ item.name }}
            </li>
          </ul>
          
        </div>

      </div>
    </div>
  </div>

  <Footer />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, computed, nextTick } from 'vue';
import { getChoseong } from 'es-hangul';
import { disassemble } from 'es-hangul';
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
const selectedIndex = ref(-1);
const router = useRouter();

const handleSearch = () => {
  console.log('검색어:', searchTerm.value);
  router.push({ name: 'certificateSearch', query: { searchTerm: searchTerm.value } });
};

const setListOpen = (isOpen) => {
  isFocus.value = isOpen;
};

const selectItem = (item) => {
  // 항목이 undefined인지 체크
  if (item && item.name) {
    searchTerm.value = item.name;
  }
  setListOpen(false);
};

const filteredList = computed(() => {
  const searchChoseong = getChoseong(searchTerm.value);
  
  return dataList.value.filter(item => {
    const itemChoseong = getChoseong(item.name);
    return itemChoseong.includes(searchChoseong);
  });
});

const handleKeyDown = (e) => {
  if (!isFocus.value || filteredList.value.length === 0) return;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex.value = (selectedIndex.value + 1) % filteredList.value.length;
      nextTick(() => {
        updateHighlight();
      });
      console.log(`ArrowDown pressed. New selectedIndex: ${selectedIndex.value}`);
      break;
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex.value = (selectedIndex.value - 1 + filteredList.value.length) % filteredList.value.length;
      nextTick(() => {
        updateHighlight();
      });
      console.log(`ArrowUp pressed. New selectedIndex: ${selectedIndex.value}`);
      break;
    case 'Enter':
      e.preventDefault();
      if (selectedIndex.value >= 0 && selectedIndex.value < filteredList.value.length) {
        const selectedItem = filteredList.value[selectedIndex.value];
        // 선택된 항목이 undefined인지 체크
        if (selectedItem && selectedItem.name) {
          selectItem(selectedItem);
        } else {
          console.error('선택된 항목이 없습니다.');
        }
        console.log(`Enter pressed. Selected item: ${selectedItem?.name}`);
      }
      break;
    default:
      break;
  }
};

const updateHighlight = () => {
  const items = document.querySelectorAll('.autocomplete-list li');
  items.forEach(item => item.classList.remove('highlighted'));
  if (items[selectedIndex.value]) {
    items[selectedIndex.value].classList.add('highlighted');
    items[selectedIndex.value].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

const handleInputFocus = () => {
  setListOpen(true);
  if(!document.hasFocus){
    document.addEventListener('keydown', handleKeyDown);
  }
  
};

const handleInputBlur = () => {
  setListOpen(false);
  document.removeEventListener('keydown', handleKeyDown);
};
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

.search-box {
  position: relative;
  margin-bottom: 20px;
  width: 50%; /* 검색 창 너비를 반으로 줄이기 */
  margin-left: 0; /* 왼쪽 정렬 */
}

.input-wrapper {
  position: relative;
  display: flex; /* flexbox를 사용하여 아이콘과 버튼을 정렬 */
  align-items: center; /* 아이콘과 버튼을 수직으로 정렬 */
}

.search-input-box {
  flex: 1; /* 검색 창이 가능한 많은 공간을 차지하도록 설정 */
  padding: 15px;
  border: 2px solid #007bff;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
}

.search-icon {
  position: absolute;
  right: 10px; /* 입력창 안에서 오른쪽에 위치하게 조정 */
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 22px;
  fill: #1D1B20;
  cursor: pointer;
}

.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
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
  transition: background-color 0.2s, color 0.2s; /* 배경색과 글자색 전환 추가 */
}

/* 선택된 항목 강조 스타일 */
.autocomplete-list li.highlighted {
  background-color: #007bff; /* 강조 배경색 */
  color: white; /* 강조 글자색 */
}

.autocomplete-list li:hover {
  background-color: #f0f0f0;
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
  }
}
</style>
