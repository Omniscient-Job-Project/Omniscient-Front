<template>
  <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div v-for="(group, groupIndex) in jobGroups" :key="groupIndex" :class="['carousel-item', { active: groupIndex === 0 }]">
        <div class="row">
          <div class="col-4" v-for="(job, index) in group" :key="index">
            <div class="card" @click="goToDetail(job.jobId)">
              <div class="card-body">
                <h5 class="card-title">{{ job.jobInfoTitle }}</h5>
                <p class="card-text company"><i class="fas fa-building"></i> {{ job.jobCompanyName }}</p>
                <p class="card-text location"><i class="fas fa-map-marker-alt"></i> {{ job.jobLocation }}</p>
                <p class="card-text career"><i class="fas fa-briefcase"></i> {{ job.jobCareerCondition }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden"><<</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">>></span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter(); // Add this line

const jobs = ref([]);

const goToDetail = (jobId) => {
  router.push({ name: 'curationDetail', params: { id: jobId } });
};

const fetchJobs = async () => {
  try {
    const response1 = await axios.get('http://localhost:8090/api/v1/jobaba/jobinfo', { withCredentials: true });
    const jobData1 = response1.data.GGJOBABARECRUSTM.row;
    const jobsFromJobaba = jobData1.map(job => ({
      jobId: job.ENTRPRS_NM,
      jobInfoTitle: job.PBANC_CONT,
      jobCompanyName: job.ENTRPRS_NM,
      jobLocation: job.WORK_REGION_CONT,
      jobCareerCondition: job.CAREER_DIV,
      apiType: 'jobaba'
    }));

    const response2 = await axios.get('http://localhost:8090/api/v1/seoul/jobinfo', { withCredentials: true });
    const jobData2 = response2.data.GetJobInfo.row;
    const jobsFromSeoul = jobData2.map(job => ({
      jobId: job.JO_REQST_NO,
      jobInfoTitle: job.JO_SJ,
      jobCompanyName: job.CMPNY_NM,
      jobLocation: job.WORK_PARAR_BASS_ADRES_CN,
      jobCareerCondition: job.CAREER_CND_NM,
      apiType: 'seoul'
    }));

    jobs.value = [...jobsFromJobaba, ...jobsFromSeoul].slice(0, 6); // 처음 6개의 항목만 가져오기
  } catch (error) {
    console.error('채용 정보를 가져오는 데 실패했습니다.', error);
  }
};

// 3개씩 그룹화된 배열로 변환하는 계산된 속성
const jobGroups = computed(() => {
  const chunkSize = 3;
  const groups = [];
  for (let i = 0; i < jobs.value.length; i += chunkSize) {
    groups.push(jobs.value.slice(i, i + chunkSize));
  }
  return groups;
});

onMounted(() => {
  fetchJobs();
});

</script>

<style scoped>
.carousel-item {
  height: auto;
}

.card {
  height: 100%;
  width: 50%;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
}

.card-body {
  padding: 15px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-text {
  font-size: 14px;
  color: #666;
}
</style>
