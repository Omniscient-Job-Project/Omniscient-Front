<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Header from '@/components/header/header.vue';
import Footer from '@/components/footer/footer.vue';

const notice = ref(null);
const route = useRoute();
const noticeId = route.params.id;

const fetchNoticeDetail = async () => {
  try {
    const response = await axios.get(`http://localhost:8090/api/v1/notice/${noticeId}`);
    notice.value = response.data;
  } catch (error) {
    console.error('공지사항을 가져오는 중 오류가 발생했습니다.', error);
  }
};

onMounted(fetchNoticeDetail);
</script>

<template>
  <div>
      <div class="main-content" v-if="notice">
        <div class="notice-detail">
          <h2>{{ notice.noticeTitle }}</h2>
          <div class="notice-meta">
            <span class="notice-date">
              <i class="far fa-calendar-alt"></i> {{ new Date(notice.noticeCreateAt).toLocaleDateString() }}
            </span>
            <span class="notice-views">
              <i class="far fa-eye"></i> 조회수: {{ notice.noticeViews }}
            </span>
          </div>
          <div class="notice-body">
            <div class="notice-content">
              <p>{{ notice.noticeContent }}</p>
            </div>
            <div class="notice-attachments" v-if="notice.attachments && notice.attachments.length">
              <h4>첨부 파일</h4>
              <ul>
                <li v-for="attachment in notice.attachments" :key="attachment.id">
                  <a :href="attachment.url" download>
                    <i class="fas fa-paperclip"></i> {{ attachment.name }}
                  </a>
                </li>
              </ul>
            </div>
            <div class="back-to-list">
              <router-link to="/notice/noticeMain" class="btn-back">
                <i class="fas fa-arrow-left"></i> 목록으로 돌아가기
              </router-link>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
/* CSS 생략 */
</style>


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