<template>
  <div v-if="jobDetail" class="job-detail-container">
    <div class="job-header">
      <div class="job-title-section">
        <h1 class="job-title">{{ jobDetail.title || '제목 없음' }}</h1>
        <h2 class="company-name">{{ jobDetail.companyName || '회사명 없음' }}</h2>
        <p class="receipt-period">
          <i class="fas fa-calendar-alt"></i> 접수기간: {{ jobDetail.receiptPeriod || '정보 없음' }}
        </p>
      </div>
      <div class="action-buttons">
        <button @click="toggleBookmark" class="bookmark-btn">
          <i :class="['fas', isBookmarked ? 'fa-bookmark' : 'fa-bookmark-o']"></i>
          {{ isBookmarked ? '스크랩됨' : '스크랩' }}
        </button>
        <a :href="jobDetail.applyUrl || '#'" target="_blank" class="apply-btn">
          <i class="fas fa-external-link-alt"></i> 홈페이지 지원
        </a>
      </div>
    </div>

    <div class="job-content">
      <section class="job-summary">
        <h3><i class="fas fa-info-circle"></i> 채용 내용</h3>
        <p>{{ jobDetail.description || '정보 없음' }}</p>
        <p>{{ jobDetail.summary || '정보 없음' }}</p>
      </section>

      <section class="job-details">
        <h3><i class="fas fa-list-ul"></i> 모집 부문 및 자격요건</h3>
        <ul>
          <li><i class="fas fa-briefcase"></i> 고용형태: {{ jobDetail.employmentType || '정보 없음' }}</li>
          <li><i class="fas fa-user-graduate"></i> 경력: {{ jobDetail.experience || '정보 없음' }}</li>
          <li><i class="fas fa-graduation-cap"></i> 학력: {{ jobDetail.education || '정보 없음' }}</li>
          <li><i class="fas fa-tasks"></i> 채용부문: {{ jobDetail.field || '정보 없음' }}</li>
          <li><i class="fas fa-calendar-week"></i> 근무일: {{ jobDetail.workDays || '정보 없음' }}</li>
          <li><i class="fas fa-clock"></i> 근무시간: {{ jobDetail.workHours || '정보 없음' }}</li>
          <li><i class="fas fa-money-bill-wave"></i> 급여: {{ jobDetail.salary || '정보 없음' }}</li>
          <li><i class="fas fa-map-marker-alt"></i> 근무지역: {{ jobDetail.location || '정보 없음' }}</li>
        </ul>
      </section>

      <section class="application-info">
        <h3><i class="fas fa-file-alt"></i> 지원 정보</h3>
        <ul>
          <li><i class="fas fa-paper-plane"></i> 접수방법: {{ jobDetail.applicationMethod || '정보 없음' }}</li>
          <li><i class="fas fa-comments"></i> 면접방식: {{ jobDetail.interviewMethod || '정보 없음' }}</li>
          <li><i class="fas fa-gift"></i> 복리후생: {{ jobDetail.benefits || '정보 없음' }}</li>
        </ul>
      </section>

      <section class="company-info">
        <h3><i class="fas fa-building"></i> 회사 정보</h3>
        <ul>
          <li><i class="fas fa-map-pin"></i> 회사위치: {{ jobDetail.companyLocation || '정보 없음' }}</li>
          <li><i class="fas fa-phone"></i> 회사번호: {{ jobDetail.companyPhone || '정보 없음' }}</li>
          <li><i class="fas fa-user"></i> 담당자: {{ jobDetail.contactPerson || '정보 없음' }}</li>
        </ul>
      </section>
    </div>
  </div>

  <div v-else class="loading">
    <i class="fas fa-spinner fa-spin"></i> 로딩 중...
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const jobId = route.params.id;
const jobDetail = ref(null);
const isBookmarked = ref(false);
const API_URL = import.meta.env.VITE_API_URL;

const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
  if (isBookmarked.value) {
    addToBookmarks();
  } else {
    removeFromBookmarks();
  }
};

const addToBookmarks = () => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  const newBookmark = {
    jobId: jobId,
    jobInfoTitle: jobDetail.value.title,
    jobCompanyName: jobDetail.value.companyName,
    jobLocation: jobDetail.value.location,
    jobCareerCondition: jobDetail.value.experience
  };
  bookmarks.push(newBookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};

const removeFromBookmarks = () => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  const updatedBookmarks = bookmarks.filter(bookmark => bookmark.jobId !== jobId);
  localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
};

const checkIfBookmarked = () => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
  isBookmarked.value = bookmarks.some(bookmark => bookmark.jobId === jobId);
};

const fetchJobData = async () => {
  try {
    let response;
    // 잡아바 API 호출
    try {
      response = await axios.get(`${API_URL}/api/v1/jobaba/jobinfo/${jobId}`);
      if (response.data.ENTRPRS_NM) {
        jobDetail.value = transformJobabaData(response.data);
        return;
      }
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        throw error;
      }
    }

    // 서울시 API 호출
    response = await axios.get(`${API_URL}/api/v1/seoul/jobinfo/${jobId}`);
    if (response.data.JO_REQST_NO) {
      jobDetail.value = transformSeoulData(response.data);
    } else {
      throw new Error('알 수 없는 API 응답 형식입니다.');
    }
  } catch (error) {
    console.error('세부 정보를 가져오는 데 실패했습니다.', error);
  }
};

// 잡아바 데이터 변환
const transformJobabaData = (data) => ({
  companyName: data.ENTRPRS_NM || '정보없음',
  title: data.PBANC_CONT || '정보없음',
  receiptPeriod: `${data.RCPT_BGNG_DE || '정보없음'} ~ ${data.RCPT_END_DE || ''}`,
  description: data.PBANC_CONT || '정보없음',
  summary: data.BSNS_SUMRY_CN || '정보없음',
  employmentType: data.PBANC_FORM_DIV || '정보없음',
  experience: data.CAREER_DIV || '정보없음',
  education: data.ACDMCR_DIV || '정보없음',
  field: data.RECRUT_FIELD_NM || '정보없음',
  workDays: data.HOLIDAY_NM || '정보없음',
  workHours: `${data.WORK_TM_NM || '정보없음'}, ${data.WORK_TIME_NM || '정보없음'}`,
  salary: data.SALARY_COND || '정보없음',
  location: data.WORK_REGION_CONT || '정보없음',
  applicationMethod: `${data.PRESENTN_PAPERS_NM || '정보없음'}, ${data.RCEPT_MTH_NM || ''}`,
  interviewMethod: data.MODEL_MTH_NM || '정보없음',
  benefits: `${data.JO_FEINSR_SBSCRB_NM || '정보없음'} , ${data.RET_GRANTS_NM || ''}`,
  receptionMethod: data.RCEPT_MTH_IEM_NM || '정보없음',
  companyLocation: data.WORK_REGION_CONT || '정보없음',
  companyPhone: data.MNGR_PHON_NO || '정보없음',
  applyUrl: data.URL || '정보없음',
  contactPerson: data.MNGR_NM || '정보없음'
});

// 서울시 데이터 변환
const transformSeoulData = (data) => ({
  companyName: data.CMPNY_NM,
  title: data.JO_SJ,
  receiptPeriod: `${data.JO_REG_DT} ~ ${data.RCEPT_CLOS_NM}`,
  description: data.GUI_LN,
  summary: data.BSNS_SUMRY_CN,
  employmentType: data.EMPLYM_STLE_CMMN_MM,
  experience: data.CAREER_CND_NM,
  education: data.ACDMCR_NM,
  field: data.JOBCODE_NM,
  workDays: data.HOLIDAY_NM,
  workHours: `${data.WORK_TM_NM}, ${data.WORK_TIME_NM}`,
  salary: data.HOPE_WAGE,
  location: data.BASS_ADRES_CN,
  applicationMethod: `${data.PRESENTN_PAPERS_NM}, ${data.RCEPT_MTH_NM}`,
  interviewMethod: data.MODEL_MTH_NM,
  benefits: `${data.JO_FEINSR_SBSCRB_NM} , ${data.RET_GRANTS_NM}`,
  receptionMethod: data.RCEPT_MTH_IEM_NM,
  companyLocation: data.WORK_PARAR_BASS_ADRES_CN,
  companyPhone: data.MNGR_PHON_NO,
  applyUrl: data.jobWebInfoUrl,  // URL 필드가 있다면
  contactPerson: data.MNGR_NM
});

onMounted(() => {
  fetchJobData();
  checkIfBookmarked();
});

watch(jobDetail, checkIfBookmarked);
</script>

<style scoped>
/* 전체 페이지 스타일 */
body {
  font-family: 'Roboto', 'Arial', sans-serif;
  background-color: #f0f4f8;
  color: #333;
  line-height: 1.6;
}

.job-detail-container {
  max-width: 850px;
  margin: 3rem auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  transition: all 0.3s ease;
}

.job-detail-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e0e6ed;
}

.job-title-section {
  flex: 1;
}

.job-title {
  font-size: 2.2rem;
  color: #2c3e50;
  margin-bottom: 0.7rem;
  font-weight: 700;
}

.company-name {
  font-size: 1.3rem;
  color: #3498db;
  margin-bottom: 0.7rem;
  font-weight: 500;
}

.receipt-period {
  font-size: 1rem;
  color: #7f8c8d;
  display: flex;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 1.2rem;
}

.bookmark-btn, .apply-btn {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bookmark-btn {
  background-color: #ecf0f1;
  color: #2c3e50;
}

.bookmark-btn:hover {
  background-color: #d5dbdb;
  transform: translateY(-2px);
}

.apply-btn {
  background-color: #3498db;
  color: white;
  text-decoration: none;
}

.apply-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}
.job-content {
  display: grid;
  gap: 2.5rem;
}

.job-content h3 {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 1.2rem;
  border-bottom: 3px solid #3498db;
  padding-bottom: 0.7rem;
  font-weight: 600;
}

.job-content ul {
  list-style-type: none;
  padding: 0;
}

.job-content li {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
}

.job-summary, .job-details, .application-info, .company-info {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.job-summary:hover, .job-details:hover, .application-info:hover, .company-info:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  font-size: 1.4rem;
  color: #7f8c8d;
  margin-top: 3rem;
}

.loading .fa-spinner {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
}

@media (max-width: 768px) {
  .job-header {
    flex-direction: column;
  }

  .action-buttons {
    margin-top: 1.5rem;
    width: 100%;
  }

  .bookmark-btn, .apply-btn {
    flex: 1;
  }

  .job-content {
    grid-template-columns: 1fr;
  }

  .job-detail-container {
    margin: 1.5rem;
    padding: 1.5rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.job-summary, .job-details, .application-info, .company-info {
  animation: fadeIn 0.5s ease-out forwards;
}

.job-summary { animation-delay: 0.1s; }
.job-details { animation-delay: 0.2s; }
.application-info { animation-delay: 0.3s; }
.company-info { animation-delay: 0.4s; }

/* 아이콘 스타일 */
.fas {
  margin-right: 0.8rem;
  font-size: 1.1rem;
}

/* 헤더 섹션 아이콘 */
.receipt-period .fas { color: #e74c3c; }
.bookmark-btn .fas { color: #f39c12; }
.apply-btn .fas { color: #ffffff; }

/* 채용 내용 섹션 아이콘 */
.job-summary h3 .fas { color: #3498db; }

/* 모집 부문 및 자격요건 섹션 아이콘 */
.job-details h3 .fas { color: #2ecc71; }
.job-details .fa-briefcase { color: #e67e22; }
.job-details .fa-user-graduate { color: #9b59b6; }
.job-details .fa-graduation-cap { color: #34495e; }
.job-details .fa-tasks { color: #16a085; }
.job-details .fa-calendar-week { color: #2980b9; }
.job-details .fa-clock { color: #8e44ad; }
.job-details .fa-money-bill-wave { color: #27ae60; }
.job-details .fa-map-marker-alt { color: #c0392b; }

/* 지원 정보 섹션 아이콘 */
.application-info h3 .fas { color: #e74c3c; }
.application-info .fa-paper-plane { color: #3498db; }
.application-info .fa-comments { color: #f39c12; }
.application-info .fa-gift { color: #1abc9c; }

/* 회사 정보 섹션 아이콘 */
.company-info h3 .fas { color: #34495e; }
.company-info .fa-map-pin { color: #e74c3c; }
.company-info .fa-phone { color: #2ecc71; }
.company-info .fa-user { color: #3498db; }

/* 호버 효과 */
.fas:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #121212;
    color: #e0e0e0;
  }

  .job-detail-container {
    background-color: #1e1e1e;
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
  }

  .job-title {
    color: #ecf0f1;
  }

  .company-name {
    color: #3498db;
  }

  .receipt-period {
    color: #bdc3c7;
  }

  .bookmark-btn {
    background-color: #2c3e50;
    color: #ecf0f1;
  }

  .job-content h3 {
    color: #ecf0f1;
    border-bottom-color: #3498db;
  }

  .job-summary, .job-details, .application-info, .company-info {
    background-color: #2c3e50;
  }

  .fas {
    opacity: 0.9;
  }
  
  .job-details h3 .fas,
  .application-info h3 .fas,
  .company-info h3 .fas {
    color: #ecf0f1;
  }
}
</style>