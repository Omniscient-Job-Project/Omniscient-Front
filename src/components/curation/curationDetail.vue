<template>
    <div v-if="jobDetail" class="container">
      <div class="top">
        <div>
          <h1>{{ jobDetail.jobCompanyName }}</h1>
          <h2>{{ jobDetail.jobInfoTitle }}</h2>
        </div>
        <div class="buttons">
          <!-- 스크랩 버튼 -->
          <div class="scrapbutton" @click="toggleBookmark">
            <svg v-if="!isBookmarked" xmlns="http://www.w3.org/2000/svg" width="35" height="35"
              fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2" />
            </svg>
            <svg v-if="isBookmarked" xmlns="http://www.w3.org/2000/svg" width="35" height="35"
              fill="currentColor" class="bi bi-bookmark-fill" viewBox="0 0 16 16">
              <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
            </svg>
          </div>
          <!-- 홈페이지 지원 버튼 -->
          <div class="homepagelink">
            <a class="btn btn-primary" :href="jobDetail.jobWebInfoUrl" role="button" target="_blank">홈페이지 지원</a>
          </div>
        </div>
      </div>
  
      <div class="middle">
        <div>경력: {{ jobDetail.jobCareerCondition }}</div>
        <div>급여: {{ jobDetail.jobSalary }}</div>
        <div>학력: {{ jobDetail.academicCondition }}</div>
        <div>근무지역: {{ jobDetail.jobLocation }}</div>
        <div>근무형태: {{ jobDetail.jobEmploymentType }}</div>
      </div>
  
      <div class="bottom">
        <p>{{ jobDetail.detailDescription }}</p>
      </div>
    </div>
  
    <div v-else>로딩 중...</div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const jobId = route.params.id;
  const jobDetail = ref(null);
  
  // 북마크 상태
  const isBookmarked = ref(false);
  const toggleBookmark = () => {
    isBookmarked.value = !isBookmarked.value;
  };
  
  onMounted(async () => {
    try {
      const response = await axios.get(`http://localhost:8090/api/jobinfo/${jobId}`);
      jobDetail.value = response.data; // API에서 받은 세부 정보
    } catch (error) {
      console.error('세부 정보를 가져오는 데 실패했습니다.', error);
    }
  });
  </script>
  

<style>
body {
    background-color: #E6F3FF;
}

.container {
    border: 2px solid #000000;
    background-color: #ffffff;
    padding: 20px;
    margin: 0 auto;
    max-width: 800px;
    box-sizing: border-box;
    height: 80vh;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
    margin-top: 10px;
}

.companyname {
    font-weight: bold;
    font-size: 18px;
    margin-right: 10px;
}

.subject {
    font-size: 24px;
    font-weight: bold;
    flex-grow: 1;
}

.buttons {
    display: flex;
    align-items: center;
}

.scrapbutton {
    margin-right: 20px;
    cursor: pointer;
}

.homepagelink a {
    padding: 10px 20px;
    border: 1px solid #000;
    text-decoration: none;
    color: #000;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.homepagelink a:hover {
    background-color: #0091ff;
    color: #fff;
}

.middle {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
}

.middle div {
    font-size: 16px;
}

.bottom {
    padding: 10px 0;
    font-size: 16px;
    margin-bottom: 10px;
}
</style>
