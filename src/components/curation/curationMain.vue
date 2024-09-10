<template>
  <div class="curationMaincontainer">
    <!-- 자격증 검색 -->
    <div class="selectcontainer">
      <div class="select">
        <p>보유하고 있는 자격증 또는 취득할 자격증을 선택하세요.</p>
      </div>
      <div class="input-group mb-3">
        <input type="text" v-model="certificate" class="form-control" placeholder="자격증의 이름을 입력하세요." aria-label="자격증"
          aria-describedby="button-addon2" />
      </div>
      <div class="button-container">
        <button class="btn btn-outline-secondary" type="button" @click="onSelectComplete">선택 완료</button>
      </div>
    </div>
    <!-- 자격증 검색 끝 -->

    <!-- 큐레이션 -->
    <div class="curationIndex">
      <div>
        <p>홈</p>
      </div>
      <div>
        <p>자격증</p>
      </div>
      <div>
        <p>지하철</p>
      </div>
      <div>
        <p>등등</p>
      </div>
    </div>

    <!-- 검색창 -->
    <div class="search-bar">
      <div class="cardinput">
        <input type="text" v-model="searchTerm" class="form-control" placeholder="채용 정보를 검색해보세요." aria-label="검색"
          aria-describedby="button-addon2" />
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="searchJobs">검색</button>
      </div>
    </div>

    <!-- 채용정보 카드 -->
    <div class="recruitmentCards">
      <div class="row row-cols-1 row-cols-md-2 g-4">
        <div v-for="job in paginatedJobs" :key="job.jobId" class="col">
          <div class="card" @click="goToDetail(job.jobId)">
            <div class="card-body">
              <h5 class="card-title">{{ job.jobInfoTitle }}</h5>
              <p class="card-text">회사: {{ job.jobCompanyName }}</p>
              <p class="card-text">위치: {{ job.jobLocation }}</p>
              <p class="card-text">경력: {{ job.jobCareerCondition }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(currentPage - 1)">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(currentPage + 1)">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchTerm = ref('');
const jobs = ref([]);
const currentPage = ref(1);
const itemsPerPage = 40; // 한 페이지에 보이는 카드 수

// 채용 정보를 가져오는 함수
const fetchJobs = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/v1/seoul/jobinfo', { withCredentials: true });
    const jobData = response.data.GetJobInfo.row;
    jobs.value = jobData.map(job => ({
      jobId: job.JO_REQST_NO,
      jobInfoTitle: job.JO_SJ,
      jobCompanyName: job.CMPNY_NM,
      jobLocation: job.WORK_PARAR_BASS_ADRES_CN,
      jobCareerCondition: job.CAREER_CND_NM
    }));
  } catch (error) {
    console.error('채용 정보를 가져오는 데 실패했습니다.', error);
  }
};

// 페이지가 로드될 때 채용 정보를 가져옴
onMounted(() => {
  fetchJobs();
});

// 검색된 채용 정보만 필터링
const filteredJobs = computed(() => {
  if (!searchTerm.value) {
    return jobs.value;
  }
  return jobs.value.filter(job =>
    job.jobInfoTitle.includes(searchTerm.value) || job.jobCompanyName.includes(searchTerm.value)
  );
});

// 페이지네이션을 위한 데이터
const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage));
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredJobs.value.slice(start, end);
});

// 페이지 변경 함수
const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

// 디테일 페이지 이동
const goToDetail = (jobId) => {
  router.push({ name: 'curationDetail', params: { id: jobId } });
};
</script>

<style>
body {
  background-color: #E6F3FF;
}

/* 전체 컨테이너 레이아웃 */
.curationMaincontainer {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  position: relative;
}

/* 자격증 검색 큐레이션 css */
.selectcontainer {
  width: 100%;
  border: 1px solid #ddd;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 20px;
}

.select p {
  margin-top: 10px;
  text-align: center;
}

.input-group {
  width: 100%;
}

.form-control {
  width: 100%;
  height: 6vh;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.btn {
  width: 150px;
  /* 너비를 더 넓히기 */
  height: 6vh;
  background-color: #0166FF;
  color: white;
}

.btn:hover {
  background-color: #002e83;
  color: white;
}

/* 검색창 스타일 */
.search-bar {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 30px;
  /* 검색창 아래에 여유 공간 추가 */
}

.search-bar .cardinput {
  display: flex;
  align-items: center;
  /* input과 버튼을 수직으로 가운데 정렬 */
}

.search-bar input {
  height: 40px;
  width: 300px;
  margin-right: 10px;
  /* 인풋창과 버튼 사이의 간격 추가 */
}

.search-bar .btn {
  height: 45px;
  width: 80px;
}

/* 버튼 색상 및 호버 효과 */
.btn-outline-secondary {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-outline-secondary:hover {
  background-color: #0056b3;
  color: white;
  transition: background-color 0.3s;
}

/* 큐레이션 박스 스타일 */
.curationIndex {
  border: 1px solid #ddd;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.curationIndex div {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 채용정보 카드 스타일 */
.recruitmentCards {
  width: 100%;
  margin: 0 auto;
  /* 가운데 정렬 */
}

.recruitmentCards .row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.recruitmentCards .col {
  width: calc(50% - 10px);
  margin-bottom: 20px;
  display: flex;
}

.card {
  border: 1px solid #ddd;
  margin: 0px 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-body {
  padding: 15px;
  flex-grow: 1;
}

/* 페이지네이션 스타일 */
.pagination {
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
}

.pagination .page-item {
  margin: 0 5px;
}

.pagination .page-link {
  display: block;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  color: blue; /* 글자 색상 변경 */
  text-decoration: none; /* 밑줄 제거 */
  border-radius: 4px; /* 모서리 둥글게 */
}

.pagination .page-link:hover {
  background-color: #f8f9fa; /* 호버 시 배경색 변경 */
  border-color: #007bff; /* 호버 시 테두리 색상 변경 */
}

.pagination .page-item.disabled .page-link {
  color: #6c757d; /* 비활성화된 링크 색상 */
  pointer-events: none; /* 클릭 방지 */
}

.pagination .page-item.active .page-link {
  background-color: #007bff; /* 현재 페이지 색상 */
  color: white; /* 현재 페이지 글자 색상 */
  border-color: #007bff; /* 현재 페이지 테두리 색상 */
}
</style>


<!-- `withCredentials` 옵션을 사용하는 이유는 브라우저에서 **크로스 도메인 요청**을 할 때, **쿠키, 인증 헤더, 세션 정보와 같은 자격 증명**을 서버에 함께 전송하도록 설정하기 위함입니다. 기본적으로 브라우저는 보안상의 이유로 **다른 도메인으로의 요청**에 자격 증명을 포함하지 않습니다. 이를 해결하기 위해 `withCredentials: true`를 사용하면, 자격 증명을 포함하여 요청을 보낼 수 있습니다.

### `withCredentials`의 역할

1. **쿠키 및 인증 헤더 전송**:
   - 만약 백엔드에서 **세션 기반 인증**을 사용하거나, 클라이언트와 서버 간에 **쿠키**를 통해 인증 정보를 주고받는 경우, 프론트엔드에서 `withCredentials: true` 옵션을 추가해야 요청과 함께 해당 쿠키나 세션 정보가 서버로 전송됩니다.

2. **크로스 오리진 환경에서 자격 증명 허용**:
   - 크로스 오리진 요청이란, 서로 다른 도메인 간의 요청을 의미합니다. 예를 들어, 프론트엔드(`localhost:8083`)에서 백엔드(`localhost:8090`)로 요청을 보내는 것은 크로스 오리진 상황입니다.
   - 이때, 자격 증명(쿠키, HTTP 인증 등)이 필요하다면 `withCredentials: true`를 사용해 이를 활성화해야 합니다.

3. **CORS 정책에 맞는 설정**:
   - 서버 쪽에서 `Access-Control-Allow-Credentials: true` 헤더가 설정되어 있어야 클라이언트가 `withCredentials` 옵션을 통해 자격 증명을 포함한 요청을 보낼 수 있습니다. 이때, 서버는 CORS 설정에서 자격 증명을 허용하도록 설정되어 있어야 합니다.
   
   ```java
   registry.addMapping("/**")
           .allowedOrigins("http://localhost:8083")  // Vue.js 실행되는 주소
           .allowedMethods("GET", "POST", "PUT", "DELETE")
           .allowedHeaders("*")
           .exposedHeaders("Custom-Header")
           .allowCredentials(true);  // 자격 증명 허용
   ```

### 사용 시기
- **로그인 상태를 유지해야 할 때**: 서버와 세션 쿠키를 주고받으며 로그인 상태를 유지할 때 자주 사용됩니다.
- **JWT 토큰**: 토큰 기반 인증을 사용하는 경우에도 이 옵션을 통해 요청 시 토큰을 자동으로 포함시킬 수 있습니다.
  
`withCredentials`는 서버와의 상호작용에서 클라이언트가 인증된 상태로 요청할 수 있도록 해주는 중요한 옵션입니다. -->