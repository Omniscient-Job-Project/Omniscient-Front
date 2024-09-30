<template>
    <div class="auth-container">
      <div class="login-content">
        <div class="login-form">
          <div class="omniscientLogo">
            <h1>관리자 회원가입</h1>
          </div>
          <p class="subtitle">관리자 권한으로 시스템을 관리하세요!</p>
          <div class="auth-box">
            <form @submit.prevent="handleAdminSubmit" class="signup-form">
              <div class="form-floating mb-3">
                <label for="userId">관리자 아이디</label>
                <input
                  type="text"
                  class="form-control"
                  id="userId"
                  v-model="userId"
                  placeholder="4-20자리 / 영문, 숫자, 특수문자 '_' 사용가능"
                  required
                  minlength="4"
                  maxlength="20"
                />
                <small>4 ~ 20자의 영문, 숫자와 특수문자 '_'만 사용해주세요.</small>
              </div>
  
              <div class="form-floating mb-3">
                <label for="password">비밀번호</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  placeholder="8-16자리 / 영문 대소문자, 숫자, 특수문자 조합"
                  required
                  minlength="8"
                  maxlength="16"
                />
              </div>
  
              <div class="form-floating mb-3">
                <label for="username">관리자 이름</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                  placeholder="이름 입력"
                  required
                />
              </div>
  
              <div class="loginbutton">
                <button type="submit" class="btn btn-primary mb-3">관리자 회원가입</button>
              </div>
            </form>
          </div>
        </div>
        <div class="login-image">
          <div class="image-content">
            <h2>Admin Dashboard.</h2>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const API_URL = import.meta.env.VITE_API_URL;
  console.log('API_URL:', API_URL); // 디버깅을 위해 추가
  const userId = ref('');
  const password = ref('');
  const username = ref('');
  const router = useRouter();
  
  const handleAdminSubmit = async () => {
    if (!userId.value || !password.value || !username.value) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }
  
    try {
  const response = await axios.post(`${API_URL}/api/v1/signup/admin/signup`, {
    userId: userId.value,
    username: username.value,
    password: password.value,
  });

  if (response.status === 200) {
    alert('관리자 계정이 성공적으로 생성되었습니다.');
    router.push('/adminLogin');
  }
} catch (error) {
  if (error.response && error.response.status === 409) {
    alert('이미 존재하는 아이디입니다. 다른 아이디를 선택해 주세요.');
    userId.value = ''; // 입력 필드 초기화
  } else {
    alert('회원가입 중 오류가 발생했습니다: ' + (error.response?.data || error.message));
  }
}
  };
  </script>
  
  <style scoped >
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
  
  .login-form {
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
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
  
  .image-content h2 {
    font-size: 36px;
    margin-bottom: 20px;
  }
  
  .omniscientLogo h1 {
    font-size: 30px;
    margin-bottom: 10px;
    color: #333;
  }
  
  .subtitle {
    color: #666;
    margin-bottom: 20px;
  }
  
  .form-floating {
    margin-bottom: 15px;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .btn-primary {
    width: 100%;
    background-color: #0000ff;
    border: none;
    padding: 10px;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }
  
  .btn-primary:hover {
    background-color: #0000cc;
  }
  
  small {
    display: block;
    margin-top: 0.25rem;
    color: #7f8c8d;
  }
  </style>