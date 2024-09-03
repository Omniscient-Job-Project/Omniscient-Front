<script setup>
import Header from '@/components/header/header.vue'; // 헤더 컴포넌트 임포트
import Footer from '@/components/footer/footer.vue'; // 풋터 불러오기
</script>

<template>
  <Header />
  <!-- 박스 두 개 추가 -->
  <div class="box-container">
    <div class="box1">
      <div>분야</div>
      <div>자격증 종류</div>
      <div>일정</div>
    </div>
    <div class="box2">
      <!-- 박스 안 검색창 -->
      <div class="search-box">
        <input type="text" class="search-input-box" placeholder="분야를 입력해주세요" />
        <div class="search-icon-box"></div>
      </div>
      <!-- 정보 박스 -->
      <div class="info-box">
  <div class="info-item">경영 회계 사무</div>
  <div class="info-item">국가 기술 자격</div>
  <div class="info-item">시험일</div>
</div>
      <!-- 검색 버튼 -->
      <button class="search-button-box">검색</button>
    </div>
  </div>

  <Footer />
</template>

<style scoped>
  /* 전체 레이아웃 */
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 80vh; /* 페이지 전체를 채우도록 설정 */
  }

  .container {
    height: 80vh;
  }
  
  /* 박스 컨테이너 스타일 */
  .box-container {
    display: flex;
    flex-direction: column; /* 박스를 세로로 나열 */
    align-items: center; /* 박스를 중앙 정렬 */
    margin: 20px;
  }
  
  .box1 {
    display: flex;
    justify-content: space-between; /* 내부 박스들 사이에 균등하게 간격을 둠 */
    border: 2px solid #000;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    margin: 10px;
    width: 55%; /* 너비를 반으로 줄임 */
  }

  .box1 div {
    flex: 1; /* 각 항목이 컨테이너 내에서 동일한 비율로 확장 */
    text-align: center; /* 텍스트 중앙 정렬 */
    padding: 10px;
  }

  .box2 {
  display: flex;
  flex-direction: column; /* 세로로 나열 */
  align-items: flex-start; /* 왼쪽 정렬 */
  padding: 20px;
  border: 2px solid #000;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  margin: 10px;
  width: 50%; /* 너비를 반으로 줄임 */
  position: relative; /* 위치 조정을 위한 relative 설정 */
  }

  /* 검색창 스타일 */
  .search-box {
  position: relative; /* 아이콘을 input 박스에 상대적으로 위치시키기 위해 설정 */
  display: flex;
  align-items: center;
  width: 40%; /* 필요에 따라 조정 */
  }

.search-input-box {
  width: 100%; /* 전체 너비 사용 */
  padding: 10px;
  padding-right: 40px; /* 아이콘 크기만큼 여백 추가 */
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  }

.search-icon-box {
  position: absolute; /* 절대 위치로 아이콘을 위치시킴 */
  right: 10px; /* 입력 박스 오른쪽에서 10px 떨어지도록 위치 조정 */
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="20px" height="20px"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>');
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
  }

  /* 정보 박스 스타일 */
  .info-box {
    display: flex;
    justify-content: space-between; /* 항목들 사이에 간격을 둡니다 */
    width: 100%; /* 박스의 너비를 설정 */
    margin:10px 0 60px; /* 검색 버튼과의 겹침 방지를 위한 여백 추가 */
  }

  .info-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
  flex: 1;
  margin: 0 5px; /* 각 박스 사이 간격 설정 */
  }

  .info-box div {
    padding: 10px;
    border: 2px solid #000;
    border-radius: 5px;
    text-align: center;
    flex: 1; /* 각 항목이 동일한 비율로 확장 */
  }

  /* 검색 버튼 스타일 */
  .search-button-box {
  padding: 5px 40px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  position: absolute; /* 절대 위치 설정 */
  bottom: 20px; /* 박스 바닥에서 20px 위로 위치 조정 */
  right: 20px; /* 박스 오른쪽에서 20px 위치 조정 */
  }
</style>
