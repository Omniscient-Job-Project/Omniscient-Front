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

        <!-- 큐레이션 박스 추가 -->
        <div class="curation-box">
          <div class="card-container">
            <div class="card" v-for="(card, index) in cards" :key="index">
              <!-- 즐겨찾기 아이콘 -->
              <div class="favorite-icon">
                <img 
                  :src="isFavorite(index) ? '/src/assets/img/bookmark-yellow-icon.svg' : '/src/assets/img/bookmark-icon.svg'" 
                  alt="즐겨찾기" 
                  @click="toggleFavorite(index)" 
                />
              </div>
              
              <!-- 회사 로고 -->
              <img 
                :src="card.logo" 
                alt="회사 로고" 
                class="company-logo"
              />
              
              <!-- 채용 제목 -->
              <h3 class="job-title">{{ card.jobTitle }}</h3>
              
              <!-- 회사 이름 -->
              <p class="company-name">{{ card.companyName }}</p>
              
              <!-- 채용 마감 기한 -->
              <p class="deadline">마감 기한: {{ card.deadline }}</p>
              
            </div>
          </div>
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

  // 카드 데이터
  const cards = ref([
    { logo: '/src/assets/img/company1-logo.png', jobTitle: '소프트웨어 엔지니어', companyName: 'ABC Corp', deadline: '2024-10-31' },
    { logo: '/src/assets/img/company2-logo.png', jobTitle: 'UI/UX 디자이너', companyName: 'XYZ Inc', deadline: '2024-11-15' },
    { logo: '/src/assets/img/company3-logo.png', jobTitle: '데이터 분석가', companyName: '123 Ltd', deadline: '2024-12-01' },
    { logo: '/src/assets/img/company4-logo.png', jobTitle: '프로덕트 매니저', companyName: 'Tech Solutions', deadline: '2024-12-15' },
    { logo: '/src/assets/img/company5-logo.png', jobTitle: '시스템 관리자', companyName: 'Global Tech', deadline: '2024-11-25' },
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

  // 즐겨찾기 상태를 관리할 배열
  const favoriteItems = ref([]);

  // 즐겨찾기 토글 함수
  const toggleFavorite = (index) => {
    if (favoriteItems.value.includes(index)) {
      favoriteItems.value = favoriteItems.value.filter(item => item !== index);
    } else {
      favoriteItems.value.push(index);
    }
  };

  // 즐겨찾기 상태를 체크하는 함수
  const isFavorite = (index) => {
    return favoriteItems.value.includes(index);
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

/* 큐레이션 박스 스타일 */
.curation-box {
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  width: 100%; /* 기본적으로 100% 너비 */
  max-width: 1000px; /* 최대 너비 설정 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

/* 카드 컨테이너 스타일 (수평 정렬) */
.card-container {
  display: flex;
  gap: 20px; /* 카드 사이의 간격 */
  height: 100%; /* 컨테이너 높이 */
  width: 100%;
  overflow-x: auto; /* 카드가 컨테이너를 넘을 경우 스크롤 가능 */
  max-width: 1000px; /* 최대 너비 설정 */
}

/* 카드 스타일 */
.card {
  position: relative;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  width: 250px; /* 카드 너비 */
  height: 350px; /* 카드 높이 */
  text-align: center; /* 카드 내 텍스트 가운데 정렬 */
  display: flex;
  flex-direction: column;
  justify-content:space-evenly; /* 카드 내용 수직 정렬 */
}

/* 즐겨찾기 아이콘 스타일 */
.favorite-icon {
  position: absolute;
  top: 10px;
  right: 10px;
}

.favorite-icon img {
  width: 30px; /* 아이콘 크기 조정 */
  height: 30px;
  cursor: pointer;
  transition: filter 0.3s ease; /* 색상 변경 애니메이션 */
}

.favorite-icon img.favorited {
  filter: brightness(0) saturate(100%) invert(24%) sepia(95%) saturate(7441%) hue-rotate(0deg) brightness(93%) contrast(95%);
}

.favorite-icon img {
  width: 24px; /* 아이콘 크기 조정 */
  height: 24px;
  cursor: pointer;
}

/* 회사 로고 스타일 */
.company-logo {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-bottom: 10px;
}

/* 채용 제목 스타일 */
.job-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 회사 이름 스타일 */
.company-name {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

/* 채용 마감 기한 스타일 */
.deadline {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

/* 카드 제목 및 내용 스타일 */
.card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.card p {
  font-size: 14px;
  color: #666;
}

.card button {
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.card button:hover {
  background-color: #0056b3;
}
  </style>
  