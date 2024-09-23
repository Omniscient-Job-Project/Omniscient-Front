<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const notices = ref([]);

const fetchNotices = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/notice`);
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
    <div class="board">
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
            <td>{{ notice.displayId }}</td>
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
</template>

<style scoped>

.container {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
  min-height: 70vh;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.board {
  width: 100%;
  font-family: Arial, sans-serif;
  background-color: transparent;
  border-radius: 8px;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #495057;
}

td a {
  color: #007bff;
  text-decoration: none;
}

td a:hover {
  text-decoration: underline;
}

th:first-child, td:first-child {
  width: 60px;
}

th:last-child, td:last-child {
  width: 100px;
}

tbody tr {
  transition: background-color 0.3s, box-shadow 0.3s;
}

tbody tr:hover {
  background-color: #f1f3f5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>