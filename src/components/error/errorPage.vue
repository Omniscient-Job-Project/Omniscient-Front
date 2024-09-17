<template>
    <div class="not-found">
      <div class="logo-container">
        <img src="../../assets/img/logo/omniscientLogo.png" alt="전독시" class="logo" />
      </div>
      <h1>원하시는 페이지를 찾을 수 없습니다.</h1>
      <p>
        찾으려는 페이지의 주소가 잘못 입력되었거나, 주소의 변경 혹은 삭제로 인해 사용할 수 없습니다.<br />
        입력하신 페이지의 주소가 정확한지 다시 한 번 확인해 주세요.
      </p>
      <router-link to="/" class="home-link">
        전독시 홈으로 돌아가기
      </router-link>
    </div>
  </template>
  
  <script setup>

  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 10vh;
    font-family: 'Noto Sans', sans-serif;
    color: #555;
  }
  
  .logo-container {
    margin-bottom: 20px;
  }
  
  .logo {
    width: 60px;
    height: 60px;
  }
  
  h1 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 30px;
  }
  
  .home-link {
    display: inline-block;
    padding: 10px 20px;
    background-color: #000;
    color: #fff;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
  }
  
  .home-link:hover {
    background-color: #333;
  }
  </style>