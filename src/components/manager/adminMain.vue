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
          <th>순번</th>
          <th>회원 종류</th>
          <th>아이디</th>
          <th>이메일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.userId">
          <td>{{ index + 1 }}</td>
          <td>
            <select v-model="user.role" class="form-select" @change="updateRole(user)">
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

  <div class="text-end mt-4">
    <button @click="submitChanges" class="btn btn-primary">확인</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const users = ref([]);
const selectedRole = ref(null);
let changesToSubmit = ref([]); // 변경된 사용자의 목록을 저장

const fetchUsers = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/api/v1/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    users.value = response.data;
  } catch (error) {
    console.error('회원 목록을 가져오는 중 오류가 발생했습니다!', error);
  }
};

const updateRole = (user) => {
  if (!changesToSubmit.value.includes(user)) {
    changesToSubmit.value.push(user);
  }
};

const submitChanges = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert("인증 토큰이 없습니다. 로그인 해주세요.");
    return;
  }

  try {
    const promises = changesToSubmit.value.map(user =>
      axios.put(`${API_URL}/api/v1/user/${user.userId}`, user, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    );
    await Promise.all(promises);
    alert('모든 사용자 정보가 성공적으로 업데이트되었습니다.');
    changesToSubmit.value = [];
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert("권한이 없습니다. 관리자 계정으로 로그인 해주세요.");
    } else {
      console.error('사용자 업데이트 실패:', error.response ? error.response.data : error.message);
      alert('사용자 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }
};

const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`${API_URL}/api/v1/user/delete/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더로 토큰 전송
      }
    });
    users.value = users.value.filter(user => user.userId !== userId);
  } catch (error) {
    console.error('사용자 삭제 중 오류가 발생했습니다!', error);
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
/* 스타일은 동일 */
.container {
  width: 80%;
  margin: 20px auto;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid #ddd; 
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  margin: 0;
}

.filter-container {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.btn {
  background-color: #AFF6C3;
  color: rgb(4, 4, 4);
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  min-width: 100px;
  text-align: center;
}

.btn.active {
  background-color: #AFF6C3;
}

.table-container {
  max-height: 300px;
  overflow-y: auto;
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

.thead-dark th {
  background-color: #AFF6C3;
  color: rgb(4, 4, 4);
  font-weight: bold;
}

.form-select {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 12px;
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

.text-end {
  text-align: right;
}
</style>
