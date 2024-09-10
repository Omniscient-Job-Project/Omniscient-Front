<template>
    <div v-if="jobDetail" class="container">
        <div class="top">
            <div>
                <h4>{{ jobDetail.companyName }}</h4>
                <h2>{{ jobDetail.infoTitle }}</h2>
                <h5>접수기간: {{ jobDetail.postedDate }} ~ {{ jobDetail.closingDate }}</h5>
            </div>
            <div class="buttons">
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
                <div class="homepagelink">
                    <a class="btn btn-primary" :href="jobDetail.webInfoUrl" role="button" target="_blank">홈페이지 지원</a>
                </div>
            </div>
        </div>

        <div class="middle">
            <div>{{ jobDetail.workRegionCont }}</div>
            <br />
            <div>{{ jobDetail.jobSummary }}</div>
        </div>

        <div class="bottom">
            <div>
                <h3>모집 부문 및 자격요건</h3>
            </div>
            <div>고용형태: {{ jobDetail.employmentType }}</div>
            <div>
                <h3>자격요건</h3>
            </div>
            <div>경력: {{ jobDetail.careerCondition }}</div>
            <div>학력: {{ jobDetail.academicCondition }}</div>
            <div>채용부문: {{ jobDetail.recruitFieldNm }}</div>
            <div></div>
            <div>근무일: {{ jobDetail.holiday }} <br />
                근무시간: {{ jobDetail.workTime }}
            </div>
            <div>급여: {{ jobDetail.salary }}</div>
            <div>근무지역: {{ jobDetail.location }}</div>
            <div>접수방법: {{ jobDetail.submissionMethod }}</div>
            <div>면접방식: {{ jobDetail.interviewMethod }}</div>
            <div>복리후생: {{ jobDetail.benefits }}</div>
        </div>

        <div class="office">
            <div>{{ jobDetail.contactMethod }}</div>
            <div>회사위치: {{ jobDetail.companyLocation }}</div>
            <div>회사번호: {{ jobDetail.companyPhone }}</div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const jobId = route.params.id;
const apiType = route.params.apiType;

const jobDetail = ref(null);
const isBookmarked = ref(false);

// 디테일 정보를 가져오는 함수
const fetchJobDetail = async () => {
    try {
        let response;
        if (apiType === 'jobaba') {
            response = await axios.get(`http://localhost:8090/api/v1/jobaba/jobinfo/${jobId}`);
            // Jobaba API에서 받아온 데이터 가공
            const job = response.data;
            jobDetail.value = {
                companyName: job.ENTRPRS_NM,
                infoTitle: job.PBANC_CONT,
                postedDate: job.PBANC_POST_DT,
                closingDate: job.PBANC_CLOSE_DT,
                workRegionCont: job.WORK_REGION_CONT,
                jobSummary: job.PBANC_SUMRY_CONT,
                employmentType: job.EMPLOYMENT_TYPE,
                careerCondition: job.CAREER_CND_NM,
                academicCondition: job.ACADMY_CND_NM,
                recruitFieldNm: job.RECRUIT_FIELD_NM,
                holiday: job.HOLIDAY,
                workTime: job.WORK_TIME,
                salary: job.SALARY,
                location: job.LOCATION,
                submissionMethod: job.SUBMISSION_METHOD,
                interviewMethod: job.INTERVIEW_METHOD,
                benefits: job.BENEFITS,
                contactMethod: job.CONTACT_METHOD,
                companyLocation: job.COMPANY_LOCATION,
                companyPhone: job.COMPANY_PHONE,
                webInfoUrl: job.WEB_INFO_URL
            };
        } else if (apiType === 'seoul') {
            response = await axios.get(`http://localhost:8090/api/v1/seoul/jobinfo/${jobId}`);
            // 서울시 API에서 받아온 데이터 가공
            const job = response.data;
            jobDetail.value = {
                companyName: job.CMPNY_NM,
                infoTitle: job.JO_SJ,
                postedDate: job.JO_POSTED_DT,
                closingDate: job.JO_CLOSING_DT,
                workRegionCont: job.WORK_PARAR_BASS_ADRES_CN,
                jobSummary: job.JO_SUMMARY,
                employmentType: job.JO_EMPLOYMENT_TYPE,
                careerCondition: job.CAREER_CND_NM,
                academicCondition: job.JO_ACADMY_CND,
                recruitFieldNm: job.JO_RECRUIT_FIELD,
                holiday: job.JO_HOLIDAY,
                workTime: job.JO_WORK_TIME,
                salary: job.JO_SALARY,
                location: job.JO_LOCATION,
                submissionMethod: job.JO_SUBMISSION_METHOD,
                interviewMethod: job.JO_INTERVIEW_METHOD,
                benefits: job.JO_BENEFITS,
                contactMethod: job.JO_CONTACT_METHOD,
                companyLocation: job.JO_COMPANY_LOCATION,
                companyPhone: job.JO_COMPANY_PHONE,
                webInfoUrl: job.JO_WEB_INFO_URL
            };
        }
    } catch (error) {
        console.error('디테일 정보를 가져오는 데 실패했습니다.', error);
    }
};

// 페이지가 로드될 때 디테일 정보를 가져옴
onMounted(() => {
    fetchJobDetail();
});

// 북마크 토글 함수
const toggleBookmark = () => {
    isBookmarked.value = !isBookmarked.value;
};
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