<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const notices = ref([]);

const fetchNotices = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/v1/notice');
    // 상태가 false가 아닌 공지사항만 필터링하고 번호 재정렬
    notices.value = response.data
      .filter(notice => notice.noticeStatus !== false)
      .map((notice, index) => ({
        ...notice,
        displayId: index + 1 // 번호를 1부터 순차적으로 부여
      }))
      .sort((a, b) => b.noticeId - a.noticeId); // 내림차순 정렬
  } catch (error) {
    console.error('공지사항 목록을 가져오는 중 오류가 발생했습니다!', error);
  }
};

onMounted(fetchNotices);
</script>

<template>
  <div class="container">
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
            <tr v-for="notice in notices" :key="notice.noticeId">
              <td>{{ notice.displayId }}</td> <!-- 새로 부여된 번호를 표시 -->
              <td>
                <router-link :to="{ name: 'noticeDetail', params: { id: notice.noticeId } }">
                  {{ notice.noticeTitle }}
                </router-link>
              </td>
              <td>{{ new Date(notice.noticeCreateAt).toLocaleDateString() }}</td>
              <td>{{ notice.noticeViews }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
  height: 70vh;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  padding: 40px;
  margin-left: 20px;
  background-color: white;
  max-width: 1000px;
  margin-top: 10px;
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
  background-color: #f2f2f2;
}

/* 번호 칸의 너비를 조정 */
th:first-child, td:first-child {
  width: 60px; /* 너비를 줄입니다 */
}

tbody tr {
  transition: background-color 0.3s, box-shadow 0.3s;
}

tbody tr:hover {
  background-color: #e3f2fd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}
</style>
