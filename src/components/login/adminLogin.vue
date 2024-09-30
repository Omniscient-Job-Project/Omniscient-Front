<template>
    <div class="auth-container">
      <div class="login-content">
        <div class="login-form">
          <div class="omniscientLogo">
            <h1>관리자 로그인</h1>
          </div>
          <div class="auth-box">
            <form @submit.prevent="handleAdminLogin">
              <div class="form-floating mb-3">
                <label for="userId">관리자 ID</label>
                <input
                  type="text"
                  class="form-control"
                  id="userId"
                  v-model="userId"
                  placeholder="관리자 ID를 입력해주세요"
                  required
                  minlength="3"
                />
              </div>
              <div class="form-floating">
                <label for="password">패스워드</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  placeholder="패스워드를 입력해주세요"
                  required
                />
              </div>
              <div class="loginbutton">
                <button type="submit" class="btn btn-primary mb-3">로그인</button>
              </div>
            </form>
          </div>
        </div>
        <div class="login-image">
          <div class="image-content">
            <h2>Make a Dream.</h2>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth';
  
  const API_URL = import.meta.env.VITE_API_URL;
  const userId  = ref('');
  const password = ref('');
  const router = useRouter();
  const authStore = useAuthStore();
  
  const handleAdminLogin = async () => {
  try {
    console.log('관리자 로그인 시도 - 요청 데이터:', { userId: userId.value, password: '123456789' });
    const response = await axios.post(`${API_URL}/api/v1/login/admin/login`, {
      userId: userId.value,
      password: password.value,
    });

    console.log('로그인 응답:', response.data);

    if (response.status === 200) {
      const { accessToken, userRole } = response.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('isAdmin', userRole === 'ADMIN');
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      authStore.login(accessToken, userRole === 'ADMIN');
      console.log('관리자 로그인 성공');
      router.push('/manager');
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    if (error.response) {
      console.error('에러 응답:', error.response.data);
      console.error('에러 상태:', error.response.status);
      if (error.response.status === 401) {
        alert('로그인 실패: 아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        alert('로그인 실패: ' + (error.response.data.errorMessage || '알 수 없는 오류가 발생했습니다.'));
      }
    } else if (error.request) {
      console.error('에러 요청:', error.request);
      alert('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      console.error('에러 메시지:', error.message);
      alert('로그인 처리 중 오류가 발생했습니다.');
    }
  }
};
  </script>
  
  <style scoped>
  /* 스타일은 일반 사용자 로그인과 비슷하게 설정 */
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .login-content {
    display: flex;
    width: 90%;
    max-width: 1400px;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    height: 80vh;
  }
  
  .login-image {
    flex: 1;
    background-color: #0000ff;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }
  
  .login-form {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
  }
  
  .btn-primary {
    margin-top: 10px;
    width: 100%;
    background-color: #0000ff;
    border: none;
    padding: 10px;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }

  .form-control {
    /* height: 50px; */
    width: 600px;
   
  }
  </style>
  