<template>
  <aside class="sidebar">
    <!-- 자격증 카테고리 -->
    <div class="sidebar-section">
      <h3>자격증 카테고리</h3>
      <ul>
        <li :class="{ active: selectedCategory === '자격증 상세 정보' }" @click="toggleCategoryContent('자격증 상세 정보')">자격증 상세 정보</li>
        <li :class="{ active: selectedCategory === '추천 자격증' }" @click="toggleCategoryContent('추천 자격증')">추천 자격증</li>
        <li :class="{ active: selectedCategory === '인기 자격증' }" @click="toggleCategoryContent('인기 자격증')">인기 자격증</li>
        <li :class="{ active: selectedCategory === '채용 공고' }" @click="toggleCategoryContent('채용 공고')">채용 공고</li>
        <li :class="{ active: selectedCategory === '자격증 취득 팁' }" @click="toggleCategoryContent('자격증 취득 팁')">자격증 취득 팁</li>
        <li :class="{ active: selectedCategory === '커뮤니티 & 포럼' }" @click="toggleCategoryContent('커뮤니티 & 포럼')">커뮤니티 & 포럼</li>
      </ul>
    </div>

    <!-- 자격증 카테고리별 콘텐츠 -->
    <transition name="fade">
      <div v-if="selectedCategory" class="category-content">
        <h3>{{ selectedCategory }}</h3>
        <p v-if="categoryDescription">{{ categoryDescription }}</p>
        <ul v-if="categoryItems">
          <li v-for="(item, index) in categoryItems" :key="index">{{ item }}</li>
        </ul>
      </div>
    </transition>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

const selectedCategory = ref('');
const categoryDescription = ref('');
const categoryItems = ref([]);

const categoryData = {
  '자격증 상세 정보': {
    description: '자격증의 개요, 이점, 산업 내 중요성 등을 제공하세요.',
    items: ['인증 요구 사항', '시험 정보']
  },
  '추천 자격증': {
    description: '유사 자격증 및 관련 자격증을 추천합니다.',
    items: ['유사 자격증', '관련 자격증']
  },
  '인기 자격증': {
    description: '현재 가장 인기 있는 자격증과 최근 트렌드를 제공합니다.',
    items: ['인기 자격증 목록', '트렌드']
  },
  '채용 공고': {
    description: '자격증과 관련된 채용 공고 및 직무 정보를 제공합니다.',
    items: ['관련 채용 공고', '회사 및 직무']
    // 관련 채용 공고 클릭 시 헤더 부분에 있는 채용 <router-link to="">로 연결해주세용~
  },
  '자격증 취득 팁': {
    description: '자격증 취득을 위한 공부 방법과 자주 묻는 질문을 안내합니다.',
    items: ['시험 준비 방법', '자주 묻는 질문(FAQ)']
  },
  '커뮤니티 & 포럼': {
    description: '자격증 관련 사용자 리뷰와 포럼 링크를 제공합니다.',
    items: ['사용자 리뷰', '포럼']
  }
};

const toggleCategoryContent = (category) => {
  if (selectedCategory.value === category) {
    selectedCategory.value = '';
    categoryDescription.value = '';
    categoryItems.value = [];
  } else {
    selectedCategory.value = category;
    categoryDescription.value = categoryData[category].description;
    categoryItems.value = categoryData[category].items;
  }
};
</script>

<style scoped>
/* 사이드바 스타일 */
.sidebar {
  border-radius: 25px;
  overflow: hidden;
  padding: 20px;
  background-color: #fff; /* 사이드바 배경 색상 */
}

.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.sidebar-section ul {
  list-style: none;
  padding: 0;
}

.sidebar-section ul li {
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar-section ul li:hover {
  background-color: #e0e0e0;
  color: #007bff;
}

.sidebar-section ul li.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.category-content {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fff;
  margin-top: 20px;
}
.category-content ul {
  list-style: none;
  padding: 0;
}

.category-content ul li {
  padding: 5px 0;
}
</style>
