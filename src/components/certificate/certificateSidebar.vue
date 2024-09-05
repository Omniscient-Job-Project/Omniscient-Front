<template>
  <aside class="sidebar">
    <div class="sidebar-section">
      <h3>카테고리</h3>
      <ul>
        <li>IT</li>
        <li>비즈니스</li>
        <li>언어</li>
        <li>기술</li>
      </ul>
    </div>

    <div class="sidebar-section">
      <h3>인기 자격증</h3>
      <ul>
        <li>정보처리기사</li>
        <li>정보처리산업기사</li>
        <li>네트워크관리사</li>
      </ul>
    </div>

    <div class="sidebar-section">
      <h3>자주 묻는 질문</h3>
      <ul>
        <li>자격증 취득 절차</li>
        <li>시험 준비 방법</li>
        <li>자격증 발급 관련</li>
      </ul>
    </div>

    <div class="sidebar-section">
      <h3>공지사항</h3>
      <p>최신 시험 일정 변경 공지</p>
    </div>

    <div class="sidebar-section">
      <h3>추천 자격증</h3>
      <ul>
        <li>리눅스마스터</li>
        <li>컴퓨터활용능력</li>
      </ul>
    </div>

    <div class="sidebar-section">
      <h3>뉴스 & 블로그</h3>
      <ul>
        <li>자격증 취득 트렌드</li>
        <li>성공 사례</li>
        <li>전문가 인터뷰</li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
/* 카테고리 항목 */
.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-section h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
}

.sidebar-section ul {
  list-style: none;
  padding: 0;
}

.sidebar-section ul li {
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar-section ul li:hover {
  background-color: #e0e0e0;
  color: #007bff;
}

.sidebar-section ul li.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

/* 자주 묻는 질문(FAQ) */
.faq-item {
  cursor: pointer;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.faq-item:hover {
  background-color: #f8f8f8;
}

.faq-answer {
  display: none;
  padding-top: 10px;
  font-size: 14px;
  color: #666;
}

.faq-item.active .faq-answer {
  display: block;
}

/* 공지사항 및 뉴스 */
.sidebar-section .news-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar-section .news-item:hover {
  background-color: #f8f8f8;
  color: #007bff;
}

.sidebar-section .news-item a {
  text-decoration: none;
  color: inherit;
}

/* 추천 자격증 */
.recommended-certifications {
  list-style: none;
  padding: 0;
}

.recommended-certifications li {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
}

.recommended-certifications li:hover {
  background-color: #e0e0e0;
  color: #007bff;
}
</style>