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
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const jobId = route.params.id;
  const jobDetail = ref(null);
  const isBookmarked = ref(false);
  
  const toggleBookmark = () => {
    isBookmarked.value = !isBookmarked.value;
};

const fetchJobData = async () => {
    try {
        let response;
        // 잡아바 API 호출
        try {
            response = await axios.get(`http://localhost:8090/api/v1/jobaba/jobinfo/${jobId}`);
            if (response.data.ENTRPRS_NM) {
                // 잡아바 API일 때
                jobDetail.value = transformJobabaData(response.data);
                // console.log('잡아바 API 응답:', response.data);
                return; // 성공적으로 처리되면 함수 종료
            }
        } catch (error) {
            // 잡아바 API에서 오류 발생 시, 서울시 API로 넘어감
            if (error.response && error.response.status !== 404) {
                throw error; // 404 외의 오류는 다시 던집니다.
            }
        }

        // 서울시 API 호출
        response = await axios.get(`http://localhost:8090/api/v1/seoul/jobinfo/${jobId}`);
        if (response.data.JO_REQST_NO) {
            // 서울시 API일 때
            jobDetail.value = transformSeoulData(response.data);
            //   console.log('서울시 API 응답:', response.data);
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
});
</script>


<style scoped>
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
    height: 100%;
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
    width: 30%;
}

.scrapbutton {
    margin-right: 20px;
    cursor: pointer;
}

.homepagelink .btn {
    background-color: #007bff;
}

.homepagelink a {
    padding: 10px 20px;
    border: 1px solid #000;
    text-decoration: none;
    color: #ffffff;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.homepagelink a:hover {
    background-color: #0026ff;
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