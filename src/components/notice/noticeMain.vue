<script setup>
  import Header from '@/components/header/header.vue'; // 헤더 컴포넌트 임포트
  import Footer from '@/components/footer/footer.vue'; // 풋터 불러오기
  import '@/assets/css/footer.css';

</script>


<template>
    <body>
        

   <Header />
   <div class="container">
     <!-- 사이드바 -->
     <div class="sidebar">
       <ul>
        
         <li><a href="#">공지사항</a></li>
         <li><a href="#">FAQ</a></li>
       </ul>
     </div>

     <!-- 메인 콘텐츠 -->
     <div class="main-content">
       <div class="notice-board">
         <h2>공지사항</h2>
         
         <table>
           <thead>
             <tr>
               <th>번호</th>
               <th>제목</th>
               <th>등록일</th>
               <th>조회수</th>
              
             </tr>
           </thead>
           <tbody>
             <tr>
               <td>1</td>
               <td>[전직시]9/5(목) 02:00 ~ 06:00 전체 서비스 일시 중지 안내</td>
               <td>2024.08.08</td>
               <td>2</td>
              
             </tr>
             <tr>
               <td>2</td>
               <td>[전직시]이벤트에 참여하세요!</td>
               <td>2024.08.08</td>
               <td>3</td>
            
             </tr>
             <tr>
               <td>3</td>
               <td>[전직시]개인정보 처리방침 개정 내용 사전 안내</td>
               <td>2024.08.08</td>
               <td>4</td>
            
             </tr>

             <tr>
               <td>4</td>
               <td>[전직시]지금 우린 커뮤니티ing</td>
               <td>2024.08.08</td>
               <td>4</td>
            
             </tr>

             
           </tbody>
         </table>
       </div>
     </div>
   </div>

  
 
  <Footer />
</body>
</template>


<style scoped>
body{  background-color: #E6F3FF;
}

.container {
  display: flex;
  /* margin-top: 100px; */
  margin: 0 auto 0 auto;
  max-width: 1200px; /* 컨테이너의 최대 너비 설정 */
  height: 70vh;
  border: 3px solid transparent; 
  /* 배경색을 통해 투명 테두리 효과를 더 명확히 보이게 할 수 있습니다. */
  background-color: white; /* 배경색을 추가해 투명성을 확인할 수 있습니다. */
 
  border-radius: 10px; /* 테두리 둥글게 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
  
}

.sidebar {
   
  width: 130px; /* 사이드바 너비 */
  background-color: #f4f4f4; /* 배경색 */
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  margin: 15px 0;
  transition: background-color 0.3s, border-radius 0.3s, box-shadow 0.3s;
  line-height: 3.5; 
}

.sidebar ul li a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  display: block;
  padding: 10px;
  border-radius: 5px; /* 둥근 모서리 */
  transition: color 0.3s;
}

.sidebar ul li a:hover {
  background-color: #bcdef7; /* 호버 시 배경색 변경 */
  color: white; /* 호버 시 텍스트 색상 변경 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 호버 시 그림자 추가 */
  border-radius: 10px; /* 호버 시 둥근 모서리 확대 */
}

.main-content {
  flex: 1; /* 남은 공간을 차지하도록 설정 */
  padding: 40px;
  margin-left: 20px; /* 사이드바와의 간격 설정 */
  background-color: white; /* 배경색 설정 */
  max-width: 1000px; /* 최대 너비 설정 */
  margin-top: 10px; /* 상단 여백 추가 */
}


.notice-board {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: center;
  border: 1px solid #ddd;
  padding: 8px;
  
}

th {
    text-align: center;
  background-color: #f2f2f2;
}

tbody tr {
  transition: background-color 0.3s, box-shadow 0.3s;
}

tbody tr:hover {
  background-color: #e3f2fd; /* 호버 시 배경색 변경 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 호버 시 그림자 추가 */
  transform: scale(1.02); /* 호버 시 약간 확대 */
}
thead th {
  background-color: #6996c9; /* 헤더 배경색 */
  color: white; /* 헤더 텍스트 색상 */
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #4992df; /* 헤더 아래쪽 테두리 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 호버 시 그림자 추가 */
}

tbody td {
  padding: 12px;
  border-bottom: 1px solid #ddd; /* 데이터 셀 아래쪽 테두리 */
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* 짝수 행 배경색 */
}

tbody tr:hover {
  background-color: #e3f2fd; /* 호버 시 배경색 변경 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 호버 시 그림자 추가 */
  transform: scale(1.02); /* 호버 시 약간 확대 */
}
.pagination {
  margin-top: 20px;
  text-align: center;
}

.search-button {
  padding: 8px 16px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.search-button:hover {
  background-color: #0056b3; /* 호버 시 색상 변경 */
  transform: scale(1.05); /* 호버 시 버튼 확대 */
}
</style>