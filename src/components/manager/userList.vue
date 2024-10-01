<template>
  <h1 class="title">회원 목록</h1>
  <div class="filter-container">
    <div class="btn-group">
      <button @click="filterRole(null)" :class="{'active': selectedRole === null}" class="btn">전체</button>
      <button @click="filterRole('USER')" :class="{'active': selectedRole === 'USER'}" class="btn">회원</button>
      <button @click="filterRole('ADMIN')" :class="{'active': selectedRole === 'ADMIN'}" class="btn">관리자</button>
    </div>
  </div>
  <div class="table-container" v-if="users.length > 0">
    <table class="table table-striped table-bordered">
      <thead class="thead-dark">
        <tr>
          <th scope="col">순번</th>
          <th scope="col">회원 종류</th>
          <th scope="col">아이디</th>
          <th scope="col">이메일</th>
          <th scope="col">작업</th> <!-- 작업 버튼 추가 -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in filteredUsers" :key="user.userId">
          <td>{{ index + 1 }}</td> <!-- 오름차순 순번 -->
          <td>{{ user.role }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <button @click="deleteUser(user.userId)" class="btn btn-danger">삭제</button> <!-- 삭제 버튼 -->
            <button @click="updateRole(user)" class="btn btn-primary">권한 변경</button> <!-- 권한 변경 버튼 -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    <p>회원 목록을 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_URL = import.meta.env.VITE_API_URL;
const users = ref([]);
const selectedRole = ref(null);
let changesToSubmit = ref([]);

// Pinia store 가져오기
const authStore = useAuthStore(); // Pinia 스토어의 useAuthStore 인스턴스 가져오기

// 사용자 목록 불러오기
const fetchUsers = async () => {
  const token = authStore.token; // Pinia 스토어의 token 사용
  if (!token) {
    console.error("인증 토큰이 없습니다. 로그인 해주세요.");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/api/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}` // 인증 헤더에 토큰 추가
      }
    });
    users.value = response.data;
  } catch (error) {
    console.error('회원 목록을 가져오는 중 오류가 발생했습니다!', error);
  }
};

// 사용자 삭제 함수
const deleteUser = async (userId) => {
  const token = authStore.token; // Pinia 스토어의 token 사용
  if (!token) {
    alert("인증 토큰이 없습니다. 로그인 해주세요.");
    return;
  }

  try {
    await axios.put(`${API_URL}/api/v1/user/delete/${userId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // 삭제된 사용자를 목록에서 제거
    users.value = users.value.filter(user => user.userId !== userId);
    alert('사용자가 삭제되었습니다.');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert("권한이 없습니다. 관리자 계정으로 로그인 해주세요.");
    } else {
      console.error('사용자 삭제 실패:', error.response ? error.response.data : error.message);
      alert('사용자 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }
};

// 역할 업데이트 함수
const updateRole = async (user) => {
  const token = authStore.token; // Pinia 스토어의 token 사용
  if (!token) {
    alert("인증 토큰이 없습니다. 로그인 해주세요.");
    return;
  }

  try {
    await axios.put(`${API_URL}/api/v1/user/${user.userId}/role`, { role: user.role }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    alert('사용자 권한이 성공적으로 업데이트되었습니다.');
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert("권한이 없습니다. 관리자 계정으로 로그인 해주세요.");
    } else {
      console.error('사용자 권한 업데이트 실패:', error.response ? error.response.data : error.message);
      alert('사용자 권한 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }
};

// 역할에 따른 사용자 필터링
const filterRole = (role) => {
  selectedRole.value = role;
};

// 필터링된 사용자 목록
const filteredUsers = computed(() => {
  if (selectedRole.value === null) {
    return users.value;
  }
  return users.value.filter(user => user.role === selectedRole.value);
});

// 컴포넌트 마운트 시 사용자 목록 불러오기
onMounted(() => {
  fetchUsers();
});
</script>


<style scoped>
/* 동일한 스타일 */
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
}

.btn-group {
    display: flex;
    gap: 10px; /* 버튼 사이의 간격 */
}

.btn {
    background-color: #AFF6C3; /* 버튼 배경색 */
    color: rgb(6, 6, 6);
    border: none;
    padding: 8px 20px; /* 버튼의 padding 조정 */
    border-radius: 20px; /* 버튼 모서리를 둥글게 */
    cursor: pointer;
    font-size: 14px; /* 버튼 폰트 크기 조정 */
    line-height: 1.2; /* 버튼 텍스트 높이 조정 */
    min-width: 100px; /* 버튼의 최소 너비 설정 */
    text-align: center; /* 텍스트 중앙 정렬 */
}
.filter-container {
    display: flex;
    justify-content: flex-end; /* 버튼들을 오른쪽 정렬 */
    margin-bottom: 20px; /* 버튼과 표 사이의 간격 추가 */
}

.btn.active {
    background-color: #AFF6C3; /* 활성화된 버튼 배경색 */
}

.table-container {
    max-height: 300px; /* 테이블 높이 제한 */
    overflow-y: auto; /* 수직 스크롤 추가 */
    position: relative; /* 헤더 고정을 위해 상대 위치 설정 */
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


.table-bordered {
    border: 1px solid #ddd;
}

.thead-dark {
    position: sticky; /* 헤더 고정을 위한 sticky 속성 */
    top: 0; /* 테이블 상단에 고정 */
}

.thead-dark th {
    background-color: #AFF6C3; /* 헤더 배경색 */
    color: rgb(6, 6, 6);
    font-weight: bold;
}

.form-select {
    display: none; /* 선택박스 숨김 */
}

.btn-primary {
    display: none; /* 버튼 숨김 */
}
</style>
