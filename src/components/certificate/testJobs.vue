<template>
    <!-- 큐레이션 -->

    <!-- 자격증 정보 카드 -->
    <div class="recruitment-cards">
      <div class="row"  v-if="goToPagecertificate === ('testJobs')">
      <!-- 시험 일정 데이터 표시 -->
      <div class="test-job-list">
        <ul>
          <li v-for="job in testJobs" :key="job.implSeq">
            <div>
              <i class="fas fa-calendar-day" style="color: #4caf50"></i> 시험명:
              {{ job.qualgbNm }}
            </div>
            <div>
              <i class="fas fa-info-circle" style="color: #2196f3"></i> 설명:
              {{ job.description }}
            </div>
            <div>
              <i class="fas fa-calendar-alt" style="color: #ff9800"></i> 문서
              등록 기간: {{ job.docRegStartDt }} ~ {{ job.docRegEndDt }}
            </div>
            <div>
              <i class="fas fa-calendar-check" style="color: #ff5722"></i> 문서
              시험 기간: {{ job.docExamStartDt }} ~ {{ job.docExamEndDt }}
            </div>
            <div>
              <i class="fas fa-calendar-day" style="color: #8bc34a"></i> 문서
              합격일: {{ job.docPassDt }}
            </div>
            <div>
              <i class="fas fa-calendar-day" style="color: #009688"></i> 실기
              등록 기간: {{ job.pracRegStartDt }} ~ {{ job.pracRegEndDt }}
            </div>
            <div>
              <i class="fas fa-calendar-check" style="color: #673ab7"></i> 실기
              시험 기간: {{ job.pracExamStartDt }} ~ {{ job.pracExamEndDt }}
            </div>
            <div>
              <i class="fas fa-calendar-day" style="color: #ff5722"></i> 실기
              합격일: {{ job.pracPassDt }}
            </div>
          </li>
        </ul>
      </div>
      </div>
    </div>

</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;
const testJobs = ref([]);
const showTestJobs = ref(false);
const goToPagecard = ref('');  // 초기 값 설정

const goToPagecertificate = (category) => {
  goToPagecard.value = category;
};

// 시험 일정 데이터 호출
const fetchTestJobs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/testjob`);

    const items = response.data.response.body.items.item;
    if (Array.isArray(items)) {
      testJobs.value = items;
      showTestJobs.value = true;
    } else {
      console.error("예상된 배열이 아닙니다:", items);
      showTestJobs.value = false;
    }
  } catch (error) {
    console.error("시험 일정 정보를 가져오는 중 오류 발생:", error);
    showTestJobs.value = false;
  }
};

// 페이지 로드 시 시험 일정 정보 가져오기
onMounted(() => {
  fetchTestJobs();
});
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css");

.recruitment-cards {
  width: 100%;
}



@media (max-width: 1200px) {
  .col-md-3 {
    width: 33.33%;
  }
}

@media (max-width: 992px) {
  .col-md-3 {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .curation-main-container {
    width: 100%;
    padding: 1rem;
  }
  .col-md-3 {
    width: 100%;
  }
}

/* 시험 일정 데이터 표시 스타일 */
.test-job-list {
  padding: 20px;
}

.test-job-list h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.test-job-list ul {
  list-style-type: none;
  padding: 0;
}

.test-job-list li {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.test-job-list li:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.test-job-list div {
  margin-bottom: 8px;
  font-size: 1rem;
}

.test-job-list div:first-child {
  font-weight: 600;
}

.test-job-list div:last-child {
  margin-bottom: 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .test-job-list {
    padding: 15px;
  }

  .test-job-list li {
    padding: 10px;
  }
}
</style>
