<template>
  <div class="auth-container">
    <div class="login-content">
      <!-- 회원가입 폼 -->
      <div class="signup-content">
        <h1 class="title">회원가입</h1>
        <p class="subtitle">당신의 꿈의 직장을 찾아보세요!</p>
        <form @submit.prevent="handleSubmit" class="signup-form">
          <div class="form-group">
            <label for="userId">아이디</label>
            <input type="text" id="userId" v-model="userId" placeholder="4-20자리 / 영문, 숫자, 특수문자 '_' 사용가능">
            <small>4 ~ 20자의 영문, 숫자와 특수문자 '_'만 사용해주세요.</small>
          </div>

          <div class="form-group">
            <label for="password">비밀번호</label>
            <input type="password" id="password" v-model="password" placeholder="8-16자리/영문 대소문자, 숫자, 특수문자 조합">
          </div>

          <div class="form-group">
            <label for="username">이름</label>
            <input type="text" id="username" v-model="username" placeholder="이름 입력">
          </div>

          <div class="form-group">
            <label for="birthDate">생년월일</label>
            <input type="text" id="birthDate" v-model="birthDate" placeholder="YYYYMMDD">
          </div>

          <div class="form-group">
            <label for="phoneNumber">휴대폰</label>
            <div class="phone-input-group">
              <input type="text" id="phoneNumber" v-model="phoneNumber" placeholder="'-' 빼고 숫자만 입력">
            </div>
          </div>

          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" v-model="email" placeholder="email@example.com">
          </div>

          <!-- <div class="info-box">
            <i class="fas fa-info-circle"></i>
            <small class="info-text">취업에 관련된 정보를 받을 때 편리해요</small>
          </div> -->

          <button type="submit" class="btn-signup">회원가입</button>
        </form>
      </div>

      <!-- 이미지 섹션 -->
      <div class="login-image">
        <div class="image-content">
          <h2>Make a Dream.</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'  // Axios 임포트

const API_URL = import.meta.env.VITE_API_URL;
const userId = ref('')
const password = ref('')
const username = ref('')
const birthDate = ref('')
const phoneNumber = ref('')
const email = ref('')


const handleSubmit = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/signup/post`, {
      userId: userId.value,
      username: username.value,
      password: password.value,
      birthDate: birthDate.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
    },{
      timeout: 5000 
    });

    console.log(response); // 응답 데이터 확인
    if (response.status === 200) {
      alert(response.data); // 서버에서 받은 메시지 출력
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
    } else {
      alert('회원가입 실패: ' + response.data);
    }
  } catch (error) {
    console.error('Error details:', error);
    if (error.response) {
      // 서버 응답이 2xx 범위를 벗어난 상태 코드를 반환한 경우
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      alert(`서버 에러: ${error.response.status} - ${error.response.data}`);
    } else if (error.request) {
      // 요청이 이루어졌으나 응답을 받지 못한 경우
      console.error('Request made but no response received');
      alert('서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.');
    } else {
      // 요청 설정 중에 문제가 발생한 경우
      console.error('Error setting up the request:', error.message);
      alert('요청 설정 중 오류가 발생했습니다: ' + error.message);
    }
  }
};

</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-content {
  display: flex;
  width: 90%; /* 너비를 90%로 변경 */
  max-width: 1400px; /* 최대 너비를 1400px로 변경 */
  height: 90vh; /* 높이를 80vh로 설정 */
}

/* 회원가입 폼 스타일 */
.signup-content {
  width: 680px; /* 너비 조정 */
  padding: 10px; /* 여백 조정 */
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
}

/* 이미지 섹션 */
.login-image {
  flex: 1; /* 이미지 섹션이 남은 공간을 꽉 채움 */
  width: 50px;
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

.title, .subtitle {
  text-align: center;
  margin-top: 8px;
}

.form-group1 {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: 600;
}

input {
  width: 90%;
  padding: 0.60rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  border-color: #0000ff;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  outline: none;
}

small {
  display: block;
  color: #7f8c8d;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.phone-input-group {
  display: flex;
  gap: 0.5rem;
}

.btn-signup {
  width: 93%;
  padding: 0.65rem;
  margin-top: 0.95rem;
  background-color: #0000ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-signup:hover {
  background-color: #5e5bf1;
}
</style>
