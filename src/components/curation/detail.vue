<template>
    <div v-if="jobDetail" class="container">
        <div class="top">
            <div>
                <h4>{{ jobDetail.companyName }}</h4>
                <h2>{{ jobDetail.title }}</h2>
                <h5>접수기간 : {{ jobDetail.receiptPeriod }}</h5>
            </div>
            <div class="buttons">
                <!-- 스크랩 버튼 -->
                <div class="scrapbutton" @click="toggleBookmark">
                    <svg v-if="!isBookmarked" xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                        fill="currentColor" class="bi bi-bookmark" viewBox="0 0 16 16">
                        <path
                            d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2" />
                    </svg>
                    <svg v-if="isBookmarked" xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                        fill="currentColor" class="bi bi-bookmark-fill" viewBox="0 0 16 16">
                        <path
                            d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                    </svg>
                </div>
                <!-- 홈페이지 지원 버튼 -->
                <div class="homepagelink">
                    <a class="btn btn-primary" :href="jobDetail.applyUrl" role="button" target="_blank">홈페이지 지원</a>
                </div>
            </div>
        </div>

        <div class="middle">
            <div>{{ jobDetail.description }}</div>
            <br />
            <div>{{ jobDetail.summary }}</div>
        </div>

        <div class="bottom">
            <div>
                <h3>모집 부문 및 자격요건</h3>
            </div>
            <div>고용형태: {{ jobDetail.employmentType }}</div>
            <div>
                <h3>자격요건</h3>
            </div>
            <div>경력: {{ jobDetail.experience }}</div>
            <div>학력: {{ jobDetail.education }}</div>
            <div>채용부문: {{ jobDetail.field }}</div>
            <div></div>
            <div>근무일: {{ jobDetail.workDays }} <br />
                근무시간: {{ jobDetail.workHours }}
            </div>
            <div>급여: {{ jobDetail.salary }}</div>
            <div>근무지역: {{ jobDetail.location }}</div>
            <div>접수방법: {{ jobDetail.applicationMethod }}</div>
            <div>면접방식: {{ jobDetail.interviewMethod }}</div>
            <div>복리후생: {{ jobDetail.benefits }}</div>
        </div>

        <div class="office">
            <div>{{ jobDetail.receptionMethod }}</div>
            <div>회사위치: {{ jobDetail.companyLocation }}</div>
            <div>회사번호: {{ jobDetail.companyPhone }}</div>
            <div>회사이름: {{ jobDetail.companyName }}</div>
            <div>담당자: {{ jobDetail.contactPerson }}</div>
        </div>
    </div>

    <!-- 정보 받아오기 전까지 나오는 글 -->
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
    companyName: data.ENTRPRS_NM,
    title: data.PBANC_CONT,
    receiptPeriod: `${data.RCPT_BGNG_DE} ~ ${data.RCPT_END_DE}`,
    description: data.PBANC_CONT,
    summary: data.BSNS_SUMRY_CN,
    employmentType: data.PBANC_FORM_DIV,
    experience: data.CAREER_DIV,
    education: data.ACDMCR_DIV,
    field: data.RECRUT_FIELD_NM,
    workDays: data.HOLIDAY_NM,
    workHours: `${data.WORK_TM_NM}, ${data.WORK_TIME_NM}`,
    salary: data.SALARY_COND,
    location: data.WORK_REGION_CONT,
    applicationMethod: `${data.PRESENTN_PAPERS_NM}, ${data.RCEPT_MTH_NM}`,
    interviewMethod: data.MODEL_MTH_NM,
    benefits: `${data.JO_FEINSR_SBSCRB_NM} , ${data.RET_GRANTS_NM}`,
    receptionMethod: data.RCEPT_MTH_IEM_NM,
    companyLocation: data.WORK_REGION_CONT,
    companyPhone: data.MNGR_PHON_NO,
    applyUrl: data.URL,  // URL 필드가 있다면
    contactPerson: data.MNGR_NM
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