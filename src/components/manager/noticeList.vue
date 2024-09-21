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
        <tr v-for="notice in noticeList" :key="notice.noticeId">
          <td>{{ notice.displayId }}</td>
          <td>
            <a href="javascript:void(0);" @click="viewDetail(notice.noticeId)">
              {{ notice.noticeTitle }}
            </a>
          </td>
          <td>{{ formatDate(notice.noticeCreateAt) }}</td>
          <td>
            <button @click="editNotice(notice.noticeId)" class="btn btn-custom btn-sm">
              수정
            </button>
          </td>
          <td>
            <button @click="deleteNotice(notice.noticeId)" class="btn btn-custom btn-sm">
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

const API_URL = import.meta.env.VITE_API_URL;

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
        const response = await axios.get(`${API_URL}/api/v1/notice`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.noticeList = response.data
          .filter(notice => notice.noticeStatus !== false)
          .map((notice, index) => ({
            ...notice,
            displayId: index + 1
          }))
          .sort((a, b) => b.noticeId - a.noticeId);
      } catch (error) {
        console.error('공지사항 목록을 가져오는 중 오류가 발생했습니다!', error.response?.data || error.message);
      }
    },

    async deleteNotice(noticeId) {
  try {
    await axios.put(`${API_URL}/api/v1/notice/delete/${noticeId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('공지사항이 성공적으로 삭제되었습니다.');
    this.fetchNotices(); // 공지사항 목록을 다시 불러옵니다.
  } catch (error) {
    console.error('공지사항을 삭제하는 중 오류가 발생했습니다:', error.response?.data || error.message);
  }
},

    editNotice(noticeId) {
      if (!noticeId) {
        console.error('공지사항 ID가 유효하지 않습니다.');
        return;
      }
      this.$router.push({
        path: '/manager/noticeModify',
        query: { id: noticeId }
      });
    },

    async viewDetail(noticeId) {
      try {
        const response = await axios.get(`${API_URL}/api/v1/notice/${noticeId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        this.selectedNotice = response.data;
        console.log('공지사항 상세 정보를 불러왔습니다:', this.selectedNotice);
      } catch (error) {
        console.error('공지사항 상세 정보를 불러오는 중 오류가 발생했습니다:', error.response?.data || error.message);
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
