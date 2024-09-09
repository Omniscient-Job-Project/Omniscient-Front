<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-sm-6 col-md-3 mb-3">
        <div class="card text-white bg-primary">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-person-raised-hand" viewBox="0 0 16 16">
                <path d="M6 6.207v9.043a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H6.236a1 1 0 0 1-.447-.106l-.33-.165A.83.83 0 0 1 5 2.488V.75a.75.75 0 0 0-1.5 0v2.083c0 .715.404 1.37 1.044 1.689L5.5 5c.32.32.5.754.5 1.207"/>
                <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
              </svg>
            </div>
            <div class="text-end">
              <p class="card-category">방문자수</p>
              <h4 class="card-title">{{ todayVisitorCount }}</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-md-3 mb-3">
        <div class="card text-white bg-info">
          <div class="card-body d-flex justify-content-between align-items-center">
            <div class="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              </svg>
            </div>
            <div class="text-end">
              <p class="card-category">회원수</p>
              <h4 class="card-title">{{ userCount }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <div class="col-12 col-lg-8 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title fixed-title">방문자수 차트</h5>
            <div class="d-flex justify-content-end">
              <select v-model="selectedRange" @change="updateChart">
                <option value="daily">일일</option>
                <option value="monthly">월별</option>
              </select>
            </div>
            <canvas id="visitorsChart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title fixed-title">신규 회원 목록</h5>
            <ul class="list-group list-group-flush members-list">
              <li v-if="users.length === 0" class="list-group-item">
                신규 회원이 없습니다.
              </li>
              <li v-for="(user, index) in users.slice(0, 10)" :key="index" class="list-group-item d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person me-2" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm4-3a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/>
                  <path d="M8 9a5 5 0 0 0-4.546 2.914C3.582 12.83 4.768 14 8 14s4.418-1.17 4.546-2.086A5 5 0 0 0 8 9zM2.869 13.145C3.98 14.596 5.606 16 8 16s4.02-1.404 5.131-2.855C12.454 11.667 10.979 11 8 11c-2.979 0-4.454.667-5.131 2.145z"/>
                </svg>
                {{ user.username }} - {{ user.email }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useVisitorStore } from '@/stores/visitor';
import { fetchTodayVisitorCount } from '@/assets/js/fetchTodayVisitorCount';
import { fetchVisitorData } from '@/assets/js/fetchVisitorData';
import { updateChart } from '@/assets/js/updateChart';
import { fetchUserCount } from '@/assets/js/fetchUserCount';
import axios from 'axios';

const todayVisitorCount = ref(0);
const visitorCount = ref([]);
const visitorCountMonth = ref([]);
const selectedRange = ref('daily');
const users = ref([]);
const userCount = ref(0);
let chartInstance = ref(null);

const visitorStore = useVisitorStore();

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/v1/user'); 
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching user list:', error);
  }
};

onMounted(async () => {
  await visitorStore.trackVisitor();
  await fetchTodayVisitorCount(todayVisitorCount);
  await fetchVisitorData(selectedRange, visitorCount, visitorCountMonth, () => updateChart(selectedRange, visitorCount, visitorCountMonth, chartInstance));
  await fetchUserCount(userCount);
  await fetchUsers();
});

watch(selectedRange, async () => {
  await fetchVisitorData(selectedRange, visitorCount, visitorCountMonth, () => updateChart(selectedRange, visitorCount, visitorCountMonth, chartInstance));
});
</script>

<style scoped>
.card-icon {
  font-size: 3rem;
}
.bg-purple {
  background-color: #6f42c1;
}
.card-body {
  overflow: auto;
}
.card-body canvas {
  height: 400px !important; /* 차트의 고정 높이 줄이기 */
}
.fixed-title {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.members-list {
  max-height: 400px; /* 필요에 따라 높이를 조정 */
  overflow-y: auto; /* 수직 스크롤바 표시 */
}
@media (max-width: 992px) {
  .card-body canvas {
      height: 200px !important; /* 작은 화면에서는 차트 높이 더 줄이기 */
  }
}

.container {
  margin-top: 60px; /* 헤더의 높이만큼 여백 추가 */
}

.content-wrapper {
  display: flex;
  margin-left: 250px; /* 사이드바 너비만큼 왼쪽 여백 추가 */
  padding: 0 15px; /* 추가적인 패딩 조정 */
}

/* 반응형 디자인 */
@media (max-width: 992px) {
  .content-wrapper {
    margin-left: 200px; /* 화면이 작아질 때 사이드바 너비에 맞춰 여백 조정 */
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-left: 150px; /* 화면이 더 작아질 때 사이드바 너비에 맞춰 여백 조정 */
  }
}

@media (max-width: 576px) {
  .content-wrapper {
    margin-left: 0; /* 화면이 매우 작아질 때 여백 제거 */
  }
}
</style>
