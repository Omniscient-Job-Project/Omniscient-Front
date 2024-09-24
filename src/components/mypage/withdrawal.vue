<template>
    <div class="withdrawal-container">
      <h1>회원 탈퇴</h1>
      <p>정말로 회원 탈퇴를 하시겠습니까?</p>
      <button @click="confirmWithdrawal">탈퇴하기</button>
      <router-link to="/myHome">취소</router-link>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const confirmWithdrawal = () => {
    // 회원 탈퇴 로직 추가
    console.log('회원 탈퇴 요청');
    // TODO: 서버에 회원 탈퇴 요청
  };
  </script>
  
  <style scoped>
  .withdrawal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  
  h1 {
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #d9534f;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
  }
  
  button:hover {
    background-color: #c9302c;
  }
  
  a {
    color: #007bff;
    text-decoration: none;
  }
  </style>
  