<template>
  <body>
  <Header />
<div class="container">
  
  <div class="main-content">
    <div class="notice-detail">
      <h2>{{ notice.title }}</h2>
      <div class="notice-meta">
        <span class="notice-date">
          <i class="far fa-calendar-alt"></i> {{ notice.date }}
        </span>
        <span class="notice-views">
          <i class="far fa-eye"></i> 조회수: {{ notice.views }}
        </span>
      </div>
      <div class="notice-body">
        <div class="notice-content">
          <p>{{ notice.content }}</p>
        </div>
        <div class="notice-attachments" v-if="notice.attachments">
          <h4>첨부 파일</h4>
          <ul>
            <li v-for="attachment in notice.attachments" :key="attachment.id">
              <a :href="attachment.url" download>
                <i class="fas fa-paperclip"></i> {{ attachment.name }}
              </a>
            </li>
          </ul>
        </div>
         <!-- 버튼 추가 부분 -->
      <div class="back-to-list">
        <router-link to="/noticeMain" class="btn-back">
          <i class="fas fa-arrow-left"></i> 목록으로 돌아가기
        </router-link>
      </div>
    </div>
  </div>
</div>
</div>
    
<Footer />
</body>
</template>


<script setup>
import { ref } from 'vue';
import Header from '@/components/header/header.vue'; // 헤더 컴포넌트 임포트
import Footer from '@/components/footer/footer.vue'; // 풋터 컴포넌트 임포트
import { useRoute } from 'vue-router';

// 예시 데이터
const notices = [
{
  id: 1,
  title: '[전직시] 9/5(목) 02:00 ~ 06:00 전체 서비스 일시 중지 안내',
  date: '2024.08.08',
  views: 2,
  content: '안녕하세요, 전직시 운영팀입니다.\n\n서비스 개선 및 안정화를 위한 정기 점검으로 인해 전체 서비스가 일시적으로 중지됩니다. 점검 중에는 서비스 이용이 불가능하오니 양해 부탁드립니다.\n\n■ 점검 일시: 2024년 9월 5일(목) 02:00 ~ 06:00 (4시간)\n■ 점검 내용: 서버 안정화 및 성능 개선\n■ 영향: 전체 서비스 이용 불가\n\n더 나은 서비스 제공을 위해 최선을 다하겠습니다. 감사합니다.',
  attachments: [
    { id: 1, name: '점검_상세_일정.pdf', url: '#' },
    { id: 2, name: '사용자_안내문.docx', url: '#' }
  ]
},

{
  id: 2,
  title: '[전직시] 이벤트에 참여하세요!',
  date: '2024.08.08',
  views: 3,
  content: `안녕하세요, 고객님들께 특별한 이벤트 소식을 전해드립니다!

  2024년 8월 15일부터 30일까지, 우리 서비스에서 진행하는 특별 이벤트에 참여하실 수 있습니다.\n   이번 이벤트는 다양한 혜택과 경품을 준비하였으며, 참여만 해도 소중한 선물을 받을 기회가 주어집니다.
  이벤트 참여 방법은 다음과 같습니다:
  1. 웹사이트에 로그인 후, 이벤트 페이지로 이동합니다.
  2. 이벤트 참여 버튼을 클릭하여 간단한 설문에 응답합니다.
  3. 응답 완료 후, 추첨을 통해 다양한 경품을 받을 수 있습니다.

  자세한 내용과 규칙은 이벤트 페이지에서 확인하실 수 있습니다. 많은 참여 부탁드리며, \n   여러분의 많은 관심과 성원 부탁드립니다.

  추가로, 이벤트에 대한 문의 사항은 고객센터를 통해 문의 주시면 상세히 안내해 드리겠습니다.

  감사합니다.`,
  attachments: [
    { id: 1, name: '이벤트 혜택.pdf', url: '#' }
    
  ]
},

{
  id: 3,
  title: '[전직시]개인정보 처리방침 개정 내용 사전 안내',
  date: '2024.08.08',
  views: 3,
  content: `안녕하세요, 고객님.

  개인정보 처리방침이 2024년 9월 1일부터 개정됩니다. 이번 개정은 개인정보 보호를 강화하고, 투명성을 높이기 위한 조치입니다. 주요 개정 내용은 다음과 같습니다:

  - 개인정보 수집 항목 및 방법의 명확화
  - 개인정보 보관 기간의 구체화
  - 제3자 제공 및 위탁 처리에 대한 사항 추가
  - 고객님의 권리와 관련된 사항 강화

  개정된 개인정보 처리방침은 웹사이트 및 모바일 애플리케이션에서 확인하실 수 있습니다. 개정 내용에 대해 궁금하신 점이나 의견이 있으시면 고객센터로 연락주시면 됩니다.

  개인정보 보호는 저희 서비스의 최우선 과제입니다. 고객님의 소중한 개인정보를 안전하게 보호하기 위해 지속적으로 노력하겠습니다.

  감사합니다.`,
  attachments: [
    { id: 1, name: '이벤트 혜택.pdf', url: '#' }
    
  ]
},

{
  id: 4,
  title: '[전직시]지금 우린 커뮤니티ing',
  date: '2024.08.08',
  views: 3,
  content: `안녕하세요, 고객님들!

  저희 커뮤니티가 활발히 진행되고 있음을 알려드립니다. 다양한 소통의 장을 마련하여, 고객님들과의 소통을 강화하고자 합니다.

  커뮤니티 참여 방법:
  - 웹사이트 내 커뮤니티 게시판에 접속합니다.
  - 관심 있는 토픽에 참여하여 의견을 나누거나, 질문을 하실 수 있습니다.
  - 유용한 정보를 공유하고, 다른 사용자들과 소통하며 즐거운 시간을 보내세요.

  또한, 커뮤니티 활동에 참여하신 분들께는 다양한 혜택을 제공할 예정이니 많은 참여 부탁드립니다. 자세한 내용은 커뮤니티 페이지에서 확인하실 수 있습니다.

  고객님들의 많은 참여와 활발한 소통을 기다립니다.

  감사합니다.`,
  attachments: [
    { id: 1, name: '커뮤니티 가이드.pdf', url: '#' }
  ]
},

];

const route = useRoute();
const noticeId = Number(route.params.id); // URL에서 ID 가져오기
const notice = ref(notices.find(n => n.id === noticeId)); // ID에 해당하는 공지사항 찾기



</script>



<style scoped>

body {
background-color: #E6F3FF;
}

.container {
display: flex;
margin: 0 auto 0 auto;
flex-direction: column;
min-height: 70vh;
border-radius: 10px; /* 테두리 둥글게 설정 */
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */


}

.main-content {
flex: 1;
padding: 40px;
background-color: white;
margin: 20px auto;
max-width: 1200px;
border-radius: 12px;
margin-top: 0px; /* 상단 여백  */
box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
overflow-y: auto;
max-height: 600px; /* 최대 높이 설정 */

}

.notice-detail {
font-family: 'Arial', sans-serif;
}

.notice-detail h2 {
font-size: 28px;
font-weight: 700;
color: #2c3e50;
margin-bottom: 20px;
padding-bottom: 15px;
border-bottom: 2px solid #3498db;
}

.notice-meta {
display: flex;
justify-content: flex-end; /* 오른쪽으로 정렬 */
margin-bottom: 30px;
font-size: 14px;
color: #7f8c8d;
gap: 15px;
}

.notice-date, .notice-views {
background-color: #f0f3f5;
padding: 8px 12px;
border-radius: 20px;
display: flex;
align-items: center;
}

.notice-date i, .notice-views i {
margin-right: 5px;
}

.notice-body {
font-size: 16px;
line-height: 1.8;
color: #34495e;
}

.notice-content {
background-color: #f9f9f9;
padding: 30px;
border-radius: 8px;
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
margin-bottom: 30px;
white-space: pre-wrap;
}

.notice-content a {
text-decoration: none; /* 밑줄 제거 */
color: #3498db; /* 링크 색상 */

}

.notice-content a:hover {
text-decoration: underline; /* 호버 시 밑줄 추가 */
}

.notice-attachments {
background-color: #e8f4fc;
padding: 10px;
border-radius: 8px;
margin-top: 5px;
}

.notice-attachments h4 {
font-size: 18px;
color: #2980b9;
margin-top: 5px;
margin-bottom: 10px; /* 하단 여백 줄이기 */
}

.notice-attachments ul {
list-style-type: none;
padding: 0;
margin: 0; /* 여백 제거 */
}

.notice-attachments li {
margin-bottom: 10px;
}

.notice-attachments a {
color: #3498db;
text-decoration: none;
display: flex;
align-items: center;
}

.notice-attachments a:hover {
text-decoration: underline;
}

.notice-attachments i {
margin-right: 8px;
}

@media (max-width: 768px) {
.main-content {
  padding: 20px;
  margin: 10px;
}

.notice-detail h2 {
  font-size: 24px;
}

.notice-content {
  padding: 20px;
}

.notice-meta {
  flex-direction: column;
  align-items: flex-start;
}

.notice-date, .notice-views {
  margin-bottom: 10px;
  
}
}

.back-to-list {
margin: 20px 0;
padding-right: 20px;
text-align: right;
}

.btn-back {
display: inline-flex;
align-items: center;
padding: 6px 13px;
background-color: #3498db;
color: white;
text-decoration: none;
border-radius: 5px;
font-family: 'Arial', sans-serif;
font-size: 14px;
transition: all 0.3s ease;
border: none;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.btn-back:hover {
background-color: #2980b9;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
transform: translateY(-2px);
}

.btn-back i {
margin-right: 0px;
font-size: 16px;
}
</style>