<template>
    <div class="profile-page">
      <div class="main-content">
        <h1 class="profile-title">프로필</h1>
        <div class="profile-line"></div>
        <div class="profile-info">
          <div class="profile-image">
            <!-- <img src="path_to_profile_image.jpg" alt="프로필 이미지" /> -->
          </div>
          <div class="profile-details">
            <h2>신주연</h2>
            <p class="job-title">주니어 천재 개발자</p>
            <div class="contact-info">
              <p><i class="fas fa-envelope"></i> joo@naver.com</p>
              <p><i class="fas fa-phone"></i> 010-1234-5678</p>
            </div>
          </div>
        </div>
        <div class="additional-info">
          <h3>기본 정보</h3>
          <p>나이: 25세</p>
          <p>주소: 서울특별시 강남구</p>
          <h3>주요 자격증</h3>
          <ul>
            <li>정보처리기사</li>
            <li>SQLD</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // 필요한 경우 여기에 스크립트를 추가합니다.
  </script>
  
  <style scoped>
  .profile-page {
    display: flex;
    font-family: 'Inter', sans-serif;
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #E6F3FF;
  }
  
  .main-content {
    position: absolute;
    width: 693px;
    height: auto;
    left: 0;
    top: 0;
    background: #FFFFFF;
    border-radius: 15px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }
  
  .profile-title {
    position: relative;
    left: 38px;
    top: 27px;
    font-size: 16px;
    font-weight: 400;
  }
  
  .profile-line {
    position: relative;
    width: 631px;
    height: 0px;
    left: 20px;
    top: 54px;
    border: 1px solid #000000;
  }
  
  .profile-info {
    display: flex;
    margin-top: 80px;
  }
  
  .profile-image {
    width: 117px;
    height: 106px;
    background: #D9D9D9;
    border-radius: 50%;
    overflow: hidden;
  }
  
  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .profile-details {
    margin-left: 30px;
  }
  
  .profile-details h2 {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 5px;
  }
  
  .job-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
  }
  
  .contact-info p {
    font-size: 16px;
    margin: 5px 0;
  }
  
  .contact-info i {
    margin-right: 10px;
    color: #0166FF;
  }
  
  .additional-info {
    margin-top: 30px;
  }
  
  .additional-info h3 {
    font-size: 16px;
    font-weight: 400;
    margin-bottom: 10px;
  }
  
  .additional-info p, .additional-info li {
    font-size: 16px;
    margin: 5px 0;
  }
  </style>