<template>
  <div class="scrap-page">
    <h1 class="page-title"><i class="fas fa-bookmark"></i> 스크랩</h1>
    <div class="scrap-list">
      <!-- scrapItems 배열을 순회하며 각 스크랩 항목을 표시 -->
      <div v-for="(item, index) in scrapItems" :key="index" class="scrap-item">
        <div class="scrap-content">
          <h3>{{ item.jobInfoTitle }}</h3>
          <p>{{ item.jobCompanyName }}</p>
          <p>{{ item.jobLocation }}</p>
          <p>{{ item.jobCareerCondition }}</p>
        </div>
        <div class="scrap-actions">
          <!-- 삭제 버튼 클릭 시 removeScrap 함수 호출 -->
          <button @click="removeScrap(index)" class="remove-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
    <!-- 스크랩 항목이 없을 경우 표시할 내용 -->
    <div v-if="scrapItems.length === 0" class="empty-state">
      <i class="fas fa-folder-open"></i>
      <p>스크랩한 채용공고가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

// 스크랩 항목을 저장할 반응형 참조 생성
const scrapItems = ref([]);

// localStorage에서 스크랩 항목을 불러오는 함수
const loadScrapItems = () => {
  // 'bookmarks' 키로 저장된 데이터를 localStorage에서 가져옴
  const savedItems = localStorage.getItem('bookmarks');
  if (savedItems) {
    // 저장된 데이터가 있으면 JSON 형식으로 파싱하여 scrapItems에 할당
    scrapItems.value = JSON.parse(savedItems);
  }
};

// 현재 스크랩 항목을 localStorage에 저장하는 함수
const saveScrapItems = () => {
  // scrapItems의 현재 값을 JSON 문자열로 변환하여 localStorage에 저장
  localStorage.setItem('bookmarks', JSON.stringify(scrapItems.value));
};

// 특정 인덱스의 스크랩 항목을 제거하는 함수
const removeScrap = (index) => {
  // splice 메서드를 사용하여 해당 인덱스의 항목을 제거
  scrapItems.value.splice(index, 1);
  // 항목이 제거된 후 자동으로 watch에 의해 saveScrapItems 함수가 호출됨
};

// 컴포넌트가 마운트될 때 저장된 스크랩 항목을 불러옴
onMounted(loadScrapItems);

// scrapItems가 변경될 때마다 saveScrapItems 함수를 호출하여 localStorage에 저장
// deep: true 옵션은 배열 내부의 객체 변경도 감지하도록 함
watch(scrapItems, saveScrapItems, { deep: true });
</script>


<style scoped>
.scrap-page {
  padding: 20px;
}

.page-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
}

.page-title i {
  color: #007bff;
  margin-right: 10px;
}

.scrap-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.scrap-item {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.3s ease;
}

.scrap-item:hover {
  transform: translateY(-5px);
}

.scrap-content h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.scrap-content p {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
  transition: color 0.3s ease;
}

.remove-btn:hover {
  color: #a71d2a;
}

.empty-state {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 20px;
  color: #007bff;
}

.empty-state p {
  font-size: 18px;
}

@media (max-width: 768px) {
  .scrap-list {
    grid-template-columns: 1fr;
  }
}
</style>