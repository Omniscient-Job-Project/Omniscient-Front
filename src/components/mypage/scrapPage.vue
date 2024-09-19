<template>
  <div class="scrap-page">
    <h1 class="page-title"><i class="fas fa-bookmark"></i> 스크랩</h1>

    <!-- 채용공고 스크랩 리스트 -->
    <div v-if="hasJobScrapItems" class="scrap-list">
      <div v-for="(item, index) in jobScrapItems" :key="item.jobId" class="scrap-item">
        <div class="scrap-content">
          <h3>{{ item.jobInfoTitle }}</h3>
          <p>{{ item.jobCompanyName }}</p>
          <p>{{ item.jobLocation }}</p>
          <p>{{ item.jobCareerCondition }}</p>
        </div>
        <div class="scrap-actions">
          <button @click="removeScrap(index, 'job')" class="remove-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 자격증 스크랩 리스트 -->
    <div v-if="hasCertScrapItems" class="scrap-list">
      <div v-for="(item, index) in certScrapItems" :key="item.jmNm" class="scrap-item">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">
              <i class="fas fa-certificate" style="color: #4caf50"></i>
              {{ item.jmNm }}
            </h5>
            <p class="card-text">
              <i class="fas fa-building" style="color: #2196f3"></i>
              기관: {{ item.instiNm }}
            </p>
            <p class="card-text">
              <i class="fas fa-trophy" style="color: #ff9800"></i>
              등급: {{ item.grdNm }}
            </p>
            <p class="card-text">
              <i class="fas fa-chart-line" style="color: #673ab7"></i>
              자격증 취득률: {{ item.preyyAcquQualIncRate }}%
            </p>
            <p class="card-text">
              <i class="fas fa-chart-bar" style="color: #3f51b5"></i>
              전년도 자격증 취득 수: {{ item.preyyQualAcquCnt }}
            </p>
            <p class="card-text">
              <i class="fas fa-chart-pie" style="color: #ff5722"></i>
              총 자격증 취득 수: {{ item.qualAcquCnt }}
            </p>
            <p class="card-text">
              <i class="fas fa-calendar-alt" style="color: #009688"></i>
              통계 연도: {{ item.statisYy }}
            </p>
            <p class="card-text">
              <i class="fas fa-calendar-check" style="color: #8bc34a"></i>
              합계 연도: {{ item.sumYy }}
            </p>
            <div class="scrap-actions">
              <button @click="removeScrap(index, 'cert')" class="remove-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 스크랩 항목이 없는 경우 -->
    <div v-if="!hasJobScrapItems && !hasCertScrapItems" class="empty-state">
      <i class="fas fa-folder-open"></i>
      <p>스크랩한 항목이 없습니다.</p>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// 스크랩 항목 데이터
const scrapItems = ref([]);

// 채용공고와 자격증 스크랩 항목 분리
const jobScrapItems = computed(() => scrapItems.value.filter(item => item.jobId));
const certScrapItems = computed(() => scrapItems.value.filter(item => item.jmNm));

// 스크랩 항목이 있는지 여부
const hasJobScrapItems = computed(() => jobScrapItems.value.length > 0);
const hasCertScrapItems = computed(() => certScrapItems.value.length > 0);

const loadScrapItems = () => {
  const savedItems = localStorage.getItem('bookmarks');
  if (savedItems) {
    scrapItems.value = JSON.parse(savedItems);
  }
};

const saveScrapItems = () => {
  localStorage.setItem('bookmarks', JSON.stringify(scrapItems.value));
};

const removeScrap = (index, type) => {
  if (type === 'job') {
    // Remove job item based on its unique property
    const jobIdToRemove = jobScrapItems.value[index].jobId;
    scrapItems.value = scrapItems.value.filter(item => item.jobId !== jobIdToRemove);
  } else if (type === 'cert') {
    // Remove cert item based on its unique property
    const certIdToRemove = certScrapItems.value[index].jmNm;
    scrapItems.value = scrapItems.value.filter(item => item.jmNm !== certIdToRemove);
  }
};

onMounted(loadScrapItems);

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