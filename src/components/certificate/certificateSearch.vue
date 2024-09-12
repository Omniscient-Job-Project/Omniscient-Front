<template>
    <div class="page-background">
      <Header/>
      <div class="main-container">
        <div class="search-results-container">
          <h1 class="search-results-title">검색 결과</h1>
          <div class="search-results-content" v-if="filteredResults.length > 0">
            <div class="certificate-card" v-for="item in filteredResults" :key="item.id">
              <div class="certificate-header">
                <h2 class="certificate-name">{{ item.name }}</h2>
                <button class="apply-button">접수 바로가기</button>
              </div>
              <div class="certificate-details">
                <div class="details-section">
                  <strong>자격증 정보</strong>
                  <p>자격증 정보를 여기에 입력하세요.</p>
                </div>
                <div class="details-section">
                  <strong>응시 자격</strong>
                  <p>응시 자격을 여기에 입력하세요.</p>
                </div>
                <div class="details-section">
                  <strong>시험 내용</strong>
                  <p>시험 내용을 여기에 입력하세요.</p>
                </div>
                <div class="details-section">
                  <strong>시험 일정</strong>
                  <p>시험 일정을 여기에 입력하세요.</p>
                </div>
                <div class="details-section">
                  <strong>접수 방법</strong>
                  <p>접수 방법을 여기에 입력하세요.</p>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="no-results">검색 결과가 없습니다.</p>
        </div>
        <div class="sidebar">
          <div class="sidebar-section">
            <h3>최근 게시물</h3>
            <ul>
              <li v-for="post in recentPosts" :key="post.id">
                <a :href="post.link">{{ post.title }}</a>
              </li>
            </ul>
          </div>
          <div class="sidebar-section">
            <h3>인기 게시물</h3>
            <ul>
              <li v-for="post in popularPosts" :key="post.id">
                <a :href="post.link">{{ post.title }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import Header from '@/components/header/header.vue';
  import Footer from '@/components/footer/footer.vue';
  
  const route = useRoute();
  const searchTerm = computed(() => route.query.searchTerm || '');
  
  const dataList = [
    { id: 1, name: '정보처리기사' },
    { id: 2, name: '정보처리산업기사' },
    { id: 3, name: '네트워크관리사' },
    { id: 4, name: '리눅스마스터' },
    { id: 5, name: '컴퓨터활용능력' },
  ];
  
  const filteredResults = computed(() => {
    if (!searchTerm.value) return [];
    return dataList.filter(item =>
      item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  });
  
  // 최근 게시물 데이터 (예시)
  const recentPosts = ref([
    { id: 1, title: '2023년 정보처리기사 시험 일정', link: '#' },
    { id: 2, title: '네트워크관리사 자격증의 중요성', link: '#' },
    { id: 3, title: 'IT 자격증 취득 전략', link: '#' },
    { id: 4, title: '리눅스마스터 실습 팁', link: '#' },
    { id: 5, title: '컴퓨터활용능력 1급 vs 2급', link: '#' },
  ]);
  
  // 인기 게시물 데이터 (예시)
  const popularPosts = ref([
    { id: 1, title: 'IT 취업을 위한 필수 자격증', link: '#' },
    { id: 2, title: '자격증 공부 효율적으로 하는 방법', link: '#' },
    { id: 3, title: '정보처리기사 합격 수기', link: '#' },
    { id: 4, title: '프로그래밍 언어별 추천 자격증', link: '#' },
    { id: 5, title: '자격증 취득 후 연봉 상승 사례', link: '#' },
  ]);
  </script>
  
  <style scoped>
  .page-background {
    background-color: #E6F3FF;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .main-container {
    display: flex;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
    padding: 50px 20px;
    width: 100%;
  }
  
  .search-results-container {
    flex: 1;
    margin-right: 30px;
  }
  
  .search-results-title {
    font-size: 28px;
    color: #333;
    margin-bottom: 30px;
  }
  
  .search-results-content {
    display: grid;
    gap: 30px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  
  .certificate-card {
    background: #FFFFFF;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
    padding: 30px;
    transition: transform 0.3s ease;
  }
  
  .certificate-card:hover {
    transform: translateY(-5px);
  }
  
  .certificate-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .certificate-name {
    font-size: 20px;
    color: #007bff;
    margin: 0;
  }
  
  .apply-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .apply-button:hover {
    background-color: #0056b3;
  }
  
  .certificate-details {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .details-section strong {
    display: block;
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
  }
  
  .details-section p {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
  
  .no-results {
    text-align: center;
    font-size: 18px;
    color: #666;
    margin-top: 50px;
  }
  
  .sidebar {
    width: 300px;
    flex-shrink: 0;
  }
  
  .sidebar-section {
    background: #FFFFFF;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 30px;
  }
  
  .sidebar-section h3 {
    font-size: 20px;
    color: #007bff;
    margin-bottom: 15px;
  }
  
  .sidebar-section ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar-section li {
    margin-bottom: 10px;
  }
  
  .sidebar-section a {
    color: #333;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .sidebar-section a:hover {
    color: #007bff;
  }
  
  @media (max-width: 1024px) {
    .main-container {
      flex-direction: column;
    }
  
    .search-results-container {
      margin-right: 0;
      margin-bottom: 30px;
    }
  
    .sidebar {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    .search-results-content {
      grid-template-columns: 1fr;
    }
  
    .certificate-card {
      padding: 20px;
    }
  
    .certificate-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }
  
    .apply-button {
      width: 100%;
    }
  }
  </style>