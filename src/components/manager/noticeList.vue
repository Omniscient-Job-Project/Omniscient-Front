<template>
  <div class="notice-page-container">
    <div class="noticeHeader">
      <h1>공지 목록</h1>
    </div>
    <table class="table table-striped table-hover">
      <thead>
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
          <td>{{ notification.noticeId }}</td>
          <td>
            <a href="javascript:void(0);" @click="viewDetail(notification.noticeId)">
              {{ notification.noticeTitle }}
            </a>
          </td>
          <td>{{ formatDate(notification.noticeCreateAt) }}</td>
          <td>
            <button @click="editNotice(notification.noticeId)" class="btn btn-custom btn-sm">
              수정
            </button>
          </td>
          <td>
            <button @click="deleteNotice(notification.noticeId)" class="btn btn-custom btn-sm">
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="selectedNotice">
      <div class="noticeDetail">
        <h2>{{ selectedNotice.noticeTitle }}</h2>
        <p>{{ selectedNotice.noticeContent }}</p>
        <button @click="selectedNotice = null" class="btn btn-custom">
          목록으로 돌아가기
        </button>
      </div>
    </div>
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
        const response = await axios.get('/api/notices');
        console.log('공지 목록 응답:', response.data);
        this.noticeList = response.data;
      } catch (error) {
        console.error('공지사항 목록을 가져오는 중 오류가 발생했습니다!', error);
      }
    },

    async deleteNotice(noticeId) {
      try {
        await axios.delete(`/api/notices/${noticeId}`);
        console.log('공지 삭제 성공');
        this.fetchNotices(); // 삭제 후 목록 새로 고침
      } catch (error) {
        console.error('공지사항을 삭제하는 중 오류가 발생했습니다!', error);
      }
    },

    editNotice(noticeId) {
      this.$router.push({ path: '/manager/notice/noticeModify', query: { id: noticeId } });
    },

    async viewDetail(noticeId) {
      try {
        const response = await axios.get(`/api/notices/${noticeId}`);
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
.notice-page-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #AFF6C3;
  margin-top: 40px;
}

.noticeHeader {
  text-align: center;
  margin-bottom: 20px;
}

.noticeHeader h1 {
  font-size: 2.5em;
  font-weight: bold;
}

.table {
  width: 100%;
  margin-bottom: 20px;
}

.noticeDetail {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
  margin-top: 40px;
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
  background-color: #1eaf49;
  color: white;
  border: none;
}

.btn-custom:hover {
  background-color: #1eaf49; /* Hover 상태에서 조금 더 어두운 색상 */
}
</style>
