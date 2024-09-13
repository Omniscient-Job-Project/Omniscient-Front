<template>
  <div class="noticeHeader">
    <h1 class="title">공지 목록</h1>
  </div>
  <div class="table-container">
    <table class="table table-striped table-hover">
      <thead class="thead-dark">
        <tr>
          <th scope="col">번호</th>
          <th scope="col">제목</th>
          <th scope="col">작성 날짜</th>
          <th scope="col">수정</th>
          <th scope="col">삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="notification in noticeList" :key="notification.noticeId">
          <td>{{ notifice.noticeId }}</td>
          <td>
            <a href="javascript:void(0);" @click="viewDetail(notification.noticeId)">
              {{ notifice.noticeTitle }}
            </a>
          </td>
          <td>{{ formatDate(notifice.noticeCreateAt) }}</td>
          <td>
            <button @click="editNotice(notifice.noticeId)" class="btn btn-custom btn-sm">
              수정
            </button>
          </td>
          <td>
            <button @click="deleteNotice(notifice.noticeId)" class="btn btn-custom btn-sm">
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="selectedNotice" class="noticeDetail">
    <h2>{{ selectedNotice.noticeTitle }}</h2>
    <p>{{ selectedNotice.noticeContent }}</p>
    <button @click="selectedNotice = null" class="btn btn-primary">
      목록으로 돌아가기
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      noticeList: [],
      selectedNotice: null
    };
  },
  mounted() {
    this.fetchNotices();
  },
  methods: {
    async fetchNotices() {
      try {
        const response = await axios.get(`http://localhost:8090/api/v1/notice`);
        // 상태가 true인 공지사항만 표시
        this.noticeList = response.data.filter(notice => notice.noticeStatus !== false);
      } catch (error) {
        console.error('공지사항 목록을 가져오는 중 오류가 발생했습니다!', error);
      }
    },

    async deleteNotice(noticeId) {
      try {
        // 상태를 false로 변경하는 로직 호출
        const response = await axios.put(`http://localhost:8090/api/v1/notice/delete/${noticeId}`);
        console.log('삭제 응답:', response);
        await this.fetchNotices(); // 목록 새로고침
      } catch (error) {
        console.error('공지사항을 삭제하는 중 오류가 발생했습니다!', error);
      }
    },

    editNotice(noticeId) {
      this.$router.push({ path: '/manager/noticeModify', query: { id: noticeId } });
    },

    async viewDetail(noticeId) {
      try {
        const response = await axios.get(`http://localhost:8090/api/v1/notice/${noticeId}`);
        this.selectedNotice = response.data;
      } catch (error) {
        console.error('공지 상세 정보를 가져오는 중 오류가 발생했습니다!', error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  }
};
</script>


<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #F0F2F5; /* 부드러운 배경색 */
}

.notice-page-container {
  width: 80%;
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff; /* 흰색 배경 */
}

.noticeHeader {
  text-align: left;
  margin-bottom: 20px;
}

.noticeHeader .title {
  font-size: 24px;
  margin: 0;
}

.table-container {
  max-height: 400px; /* 테이블 높이 제한 */
  overflow-y: auto; /* 수직 스크롤 추가 */
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 12px;
  text-align: center;
  border: 1px solid #ddd;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}

.table-bordered {
  border: 1px solid #ddd;
}

.thead-dark {
  position: sticky;
  top: 0;
}

.thead-dark th {
  background-color: #AFF6C3;
  color: rgb(4, 4, 4);
  font-weight: bold;
}

.noticeDetail {
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff; /* 흰색 배경 */
  text-align: center;
}

.noticeDetail h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 20px;
}

.noticeDetail p {
  font-size: 1em;
  margin-bottom: 20px;
}

.btn-custom {
  background-color: #AFF6C3;
  color: rgb(4, 4, 4);
  border: none;
}

.btn-custom:hover {
  background-color: #9be1b8; /* Hover 상태에서 조금 더 밝은 색상 */
}

.btn-primary {
  background-color: #AFF6C3;
  color: rgb(4, 4, 4);
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  height: 40px;
  line-height: 20px;
}

.btn-primary:hover {
  background-color: #9be1b8; /* 버튼 hover 색상 */
}
</style>
