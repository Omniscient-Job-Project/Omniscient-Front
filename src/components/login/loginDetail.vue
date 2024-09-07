<template>
    <div class="signup-container">
      <h1 class="title">회원가입</h1>
      <p class="subtitle">당신의 꿈의 직장을 찾아보세요!</p>
      <form @submit.prevent="submitForm" class="signup-form">
        <div class="form-group">
          <label for="userid">아이디</label>
          <input type="text" id="userid" v-model="userid" placeholder="4-20자리 / 영문, 숫자, 특수문자 '_' 사용가능">
          <small>4 ~ 20자의 영문, 숫자와 특수문자 '_'만 사용해주세요.</small>
        </div>
        
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" placeholder="8-16자리/영문 대소문자, 숫자, 특수문자 조합">
        </div>
        
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" v-model="name" placeholder="이름 입력">
        </div>
        
        <div class="form-group">
          <label for="birthdate">생년월일</label>
          <input type="text" id="birthdate" v-model="birthdate" placeholder="YYYYMMDD">
        </div>
        
        <div class="form-group">
          <label for="phone">휴대폰</label>
          <div class="phone-input-group">
            <input type="text" id="phone" v-model="phone" placeholder="'-' 빼고 숫자만 입력">
            <button type="button" class="btn-verify" @click="requestVerification">인증요청</button>
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="email" placeholder="email@example.com">
        </div>
        
        <div class="info-box">
          <i class="fas fa-info-circle"></i>
          <small class="info-text">취업에 관련된 정보를 받을 때 편리해요</small>
        </div>
        
        <button type="submit" class="btn-signup">회원가입</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const userid = ref('')
  const password = ref('')
  const name = ref('')
  const birthdate = ref('')
  const phone = ref('')
  const email = ref('')
  
  const submitForm = () => {
    // 여기에 폼 제출 로직을 구현합니다.
    console.log('Form submitted')
  }
  
  const requestVerification = () => {
    // 휴대폰 인증 요청 로직을 구현합니다.
    console.log('Verification requested')
  }
  </script>
  
  <style scoped>
  .signup-container {
    max-width: 480px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
  }
  
  .title {
    color: #2c3e50;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    color: #7f8c8d;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #34495e;
    font-weight: 600;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  input:focus {
    border-color: #3498db;
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
  
  .btn-verify {
    padding: 0.75rem 1rem;
    background-color: #ecf0f1;
    color: #2c3e50;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-verify:hover {
    background-color: #bdc3c7;
  }
  
  .info-box {
    display: flex;
    align-items: center;
    background-color: #f0f7fb;
    border-left: 5px solid #3498db;
    padding: 0.75rem;
    margin-bottom: 1.5rem;
    border-radius: 0 4px 4px 0;
  }
  
  .info-box i {
    color: #3498db;
    margin-right: 0.5rem;
  }
  
  .btn-signup {
    width: 100%;
    padding: 0.75rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .btn-signup:hover {
    background-color: #2980b9;
  }
  
  @media (max-width: 768px) {
    .signup-container {
      margin: 1rem;
      padding: 1.5rem;
    }
  }
  </style>