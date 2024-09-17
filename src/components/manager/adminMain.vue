<template>
  <div class="header-container mb-4">
    <h1 class="title">회원 권한 설정</h1>
    <div class="filter-container">
      <div class="btn-group">
        <button @click="filterRole(null)" :class="{'active': selectedRole === null}" class="btn">전체</button>
        <button @click="filterRole('USER')" :class="{'active': selectedRole === 'USER'}" class="btn">회원</button>
        <button @click="filterRole('ADMIN')" :class="{'active': selectedRole === 'ADMIN'}" class="btn">관리자</button>
      </div>
    </div>
  </div>
  <div class="table-container">
    <table class="table table-striped table-bordered">
      <thead class="thead-dark">
        <tr>
          <th scope="col">순번</th>
          <th scope="col">회원 종류</th>
          <th scope="col">아이디</th>
          <th scope="col">이메일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user,) in filteredUsers" :key="user.userId">
          <td>{{ user.userId }}</td>
          <td>
            <select v-model="user.role" class="form-select">
              <option value="USER">회원</option>
              <option value="ADMIN">관리자</option>
            </select>
          </td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="text-end mt-4"> <!-- 오른쪽 정렬을 위한 text-end 사용 -->
    <button @click="submitChanges" class="btn btn-primary">확인</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const users = ref([]);
const selectedRole = ref(null);

const fetchUsers = async () => {
  try {
    // const response = await axios.get('/api/v1/user');
    const response = await axios.get(`${API_URL}/api/v1/user`);
    users.value = response.data;
  } catch (error) {
    console.error('회원 목록을 가져오는 중 오류가 발생했습니다!', error);
  }
};

const submitChanges = async () => {
  try {
    for (const user of users.value) {
      // await axios.put('/api/v1/user', user);
      await axios.put(`${API_URL}/api/v1/user`, user);
      console.log(`사용자 ${user.userId} 업데이트 성공`);
    }
  } catch (error) {
    console.error('사용자 업데이트 실패:', error);
  }
};

const filterRole = (role) => {
  selectedRole.value = role;
};

const filteredUsers = computed(() => {
  if (selectedRole.value === null) {
    return users.value;
  }
  return users.value.filter(user => user.role === selectedRole.value);
});

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #F0F2F5; /* 부드러운 배경색 */
}

.container {
  width: 80%;
  margin: 20px auto;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid #ddd; /* 컨테이너 테두리 추가 */
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 제목과 필터 버튼을 양쪽으로 배치 */
  margin-bottom: 20px;
}

.title {
  font-size: 24px; /* 제목 폰트 크기 조정 */
  margin: 0; /* 제목 상하 여백 제거 */
}

.filter-container {
  display: flex;
  align-items: center; /* 버튼을 세로로 중앙 정렬 */
  margin-left: auto; /* 오른쪽 정렬을 위해 auto 사용 */
}

.btn-group {
  display: flex;
  gap: 10px; /* 버튼 사이의 간격 */
}

.btn {
  background-color: #AFF6C3; /* 버튼 배경색 */
  color: rgb(4, 4, 4);
  border: none;
  padding: 8px 20px; /* 버튼의 padding 조정 */
  border-radius: 20px; /* 버튼 모서리를 둥글게 */
  cursor: pointer;
  font-size: 14px; /* 버튼 폰트 크기 조정 */
  line-height: 1.2; /* 버튼 텍스트 높이 조정 */
  min-width: 100px; /* 버튼의 최소 너비 설정 */
  text-align: center; /* 텍스트 중앙 정렬 */
}

.btn.active {
  background-color: #AFF6C3; /* 활성화된 버튼 배경색 */
}

.table-container {
  max-height: 300px; /* 테이블 높이 제한 */
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
  position: sticky; /* 헤더 고정을 위한 sticky 속성 */
  top: 0; /* 테이블 상단에 고정 */
}

.thead-dark th {
  background-color: #AFF6C3; /* 헤더 배경색 */
  color: rgb(4, 4, 4);
  font-weight: bold;
}

.form-select {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 12px; /* 선택박스 폰트 크기 조정 */
}

.btn-primary {
  background-color: #AFF6C3; /* 버튼 배경색 */
  color: rgb(4, 4, 4);
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  height: 40px; /* 버튼 높이 */
  line-height: 20px; /* 버튼 텍스트 높이 */
}

.btn-primary:hover {
  background-color: #AFF6C3; /* 버튼 hover 색상 */
}

.text-end {
  text-align: right; /* 오른쪽 정렬 */
}
</style>
