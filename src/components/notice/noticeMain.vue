<script setup>
  import Header from '@/components/header/header.vue'; // 헤더 컴포넌트 임포트
  import Footer from '@/components/footer/footer.vue'; // 풋터 불러오기
  import '@/assets/css/footer.css';
  
 
  
</script>

<template>
   <Header />
    <h2>공지사항</h2>

    

    
  <div class="container">
    <nav class="sidebar">
      <ul>
        <li><a href="#members">회원 관리</a></li>
        <li><a href="#notices">공지사항</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
    </nav>
    <main class="content">
      <section id="notices">
        <div class="notice-header">
          <span class="notice-id">공지번호</span>
          <span class="notice-title">제목</span>
          <span class="notice-date">등록일</span>
        </div>
        <!-- <ul class="notice-list">
          <li>
            <span class="notice-id">001</span>
            <div class="notice-content">
              <h3>공지사항 제목 1</h3>
            </div>
            <span class="notice-date">2024-09-01</span>
          </li>
          <li>
            <span class="notice-id">002</span>
            <div class="notice-content">
              <h3>공지사항 제목 2</h3>
            </div>
            <span class="notice-date">2024-09-02</span>
          </li> -->
          <!-- 추가 공지사항 리스트 아이템 -->
        <!-- </ul> -->
      </section>
    </main>
  </div>

  <Footer />
</template>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.container {
  display: flex;
}

.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  margin: 10px 0;
}

.sidebar ul li a {
  text-decoration: none;
  color: #333;
}

.content {
  flex: 1;
  padding: 20px;
}

.notice-header, .notice-list {
  display: flex;
  font-weight: bold;
  margin-bottom: 10px;
}

.notice-header span, .notice-list span, .notice-content {
  flex: 1;
  text-align: center;
}

.notice-header span {
  background-color: #f4f4f4; /* 배경색을 추가하여 헤더 항목 구분 */
  padding: 5px;
  border-bottom: 1px solid #ddd; /* 헤더와 리스트 항목 사이에 구분선 추가 */
}

.notice-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #ddd; /* 리스트 상단에 구분선 추가 */
}

.notice-list li {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  display: flex;
  align-items: center;
}

.notice-list .notice-id,
.notice-list .notice-date {
  flex: 1;
  text-align: center;
}

.notice-content {
  flex: 2; /* 남은 공간을 더 차지하도록 설정합니다 */
}

.notice-list h3 {
  margin: 0;
  color: #333;
}

.notice-list p {
  margin: 5px 0 0;
  color: #666;
}
</style>