<template>
    <div class="curation-main-container">
        <!-- 자격증 검색 -->
        <div class="select-container">
            <div class="select">
                <p>보유하고 있는 자격증 또는 취득할 자격증을 선택하세요.</p>
            </div>
            <div class="input-group">
                <input type="text" v-model="certificate" class="form-control" placeholder="자격증의 이름을 입력하세요."
                    aria-label="자격증" aria-describedby="button-addon2" />
            </div>
            <div class="button-container">
                <button class="btn btn-primary" type="button" @click="onSelectComplete">선택 완료</button>
            </div>
        </div>

        <!-- 큐레이션 -->
        <div class="curation-index">
            <div><p>홈</p></div>
            <div><p>자격증</p></div>
            <div><p>지하철</p></div>
            <div><p>등등</p></div>
        </div>

        <!-- 검색창 -->
        <div class="search-bar">
            <div class="card-input">
                <input type="text" v-model="searchTerm" class="form-control" placeholder="채용 정보를 검색해보세요."
                    aria-label="검색" aria-describedby="button-addon2" />
                <button class="btn btn-primary" type="button" id="button-addon2"
                    @click="searchJobs">검색</button>
            </div>
        </div>

        <!-- 채용정보 카드 -->
        <div class="recruitment-cards">
        <div class="row">
            <div v-for="job in paginatedJobs" :key="job.jobId" class="col-md-3">
                <div class="card" @click="goToDetail(job.jobId)">
                    <div class="card-body">
                        <div class="bookmark-icon" @click.stop="toggleBookmark(job.jobId)">
                            <i :class="['fas', 'fa-bookmark', { 'bookmarked': isBookmarked(job.jobId) }]"></i>
                        </div>
                        <h5 class="card-title">{{ job.jobInfoTitle }}</h5>
                        <p class="card-text company"><i class="fas fa-building"></i> {{ job.jobCompanyName }}</p>
                        <p class="card-text location"><i class="fas fa-map-marker-alt"></i> {{ job.jobLocation }}</p>
                        <p class="card-text career"><i class="fas fa-briefcase"></i> {{ job.jobCareerCondition }}</p>
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
const itemsPerPage = 16; // 4x4 레이아웃을 위해 16개로 설정
const bookmarks = ref([]);

// 채용 정보를 가져오는 함수
const fetchJobs = async () => {
    try {
        const response = await axios.get('http://localhost:8090/api/v1/jobaba/jobinfo', { withCredentials: true });
        const jobData = response.data.GGJOBABARECRUSTM.row;
        jobs.value = jobData.map(job => ({
            jobId: job.ENTRPRS_NM,
            jobInfoTitle: job.PBANC_CONT,
            jobCompanyName: job.ENTRPRS_NM,
            jobLocation: job.WORK_REGION_CONT,
            jobCareerCondition: job.CAREER_DIV
        }));
    } catch (error) {
        console.error('채용 정보를 가져오는 데 실패했습니다.', error);
    }
};

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

const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
};

const goToDetail = (jobId) => {
    router.push({ name: 'curationDetail', params: { id: jobId } });
};

const toggleBookmark = (jobId) => {
    const index = bookmarks.value.indexOf(jobId);
    if (index > -1) {
        bookmarks.value.splice(index, 1);
    } else {
        bookmarks.value.push(jobId);
    }
};

const isBookmarked = (jobId) => {
    return bookmarks.value.includes(jobId);
};
</script>

<style scoped>
body {
    background-color: #E6F3FF;
}

.curation-main-container {
    font-family: Arial, sans-serif;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    padding: 20px;
    box-sizing: border-box;
    width: 90%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 15px;
}

.select-container {
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
    margin-bottom: 10px;
}

.form-control {
    width: 100%;
    height: 40px;
    padding: 5px 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
}

.button-container {
    display: flex;
    justify-content: flex-end;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-primary {
    background-color: #0166FF;
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.curation-index {
    border: 1px solid #ddd;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.search-bar {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 20px;
}

.card-input {
    display: flex;
    align-items: center;
}

.search-bar input {
    height: 40px;
    width: 300px;
    margin-right: 10px;
}

.recruitment-cards {
    width: 100%;
}

.row {
    display: flex;
    flex-wrap: wrap;
    margin: -15px;
}

.col-md-3 {
    width: 25%;
    padding: 15px;
    box-sizing: border-box;
}

.card {
    border: none;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
    height: 100%;
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.card-body {
    padding: 20px;
    position: relative;
}

.bookmark-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    z-index: 10;
}

.bookmark-icon i {
    color: #B0C4DE;
    transition: color 0.3s ease, transform 0.3s ease;
    font-size: 1.2em;
}

.bookmark-icon i:hover {
    transform: scale(1.1);
}

.bookmark-icon i.bookmarked {
    color: #4169E1;
}

.card-title {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 15px;
    color: #2c3e50;
}

.card-text {
    font-size: 0.9em;
    margin-bottom: 8px;
    color: #34495e;
    display: flex;
    align-items: center;
}

.card-text i {
    margin-right: 8px;
    width: 16px;
}

.card-text.company i {
    color: #3498db;
}

.card-text.location i {
    color: #e74c3c;
}

.card-text.career i {
    color: #2ecc71;
}

.pagination {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin-top: 20px;
}

.page-item {
    margin: 0 5px;
}

.page-link {
    display: block;
    padding: 8px 12px;
    border: 1px solid #007bff;
    color: #007bff;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;
}

.page-link:hover {
    background-color: #007bff;
    color: white;
}

.page-item.active .page-link {
    background-color: #007bff;
    color: white;
}

.page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #fff;
    border-color: #dee2e6;
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

@media (max-width: 576px) {
    .col-md-3 {
        width: 100%;
    }
}
</style>