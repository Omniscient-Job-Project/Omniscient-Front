<template>
    <div class="profile-page">
      <h1 class="profile-title">프로필</h1>
      <div class="profile-content">
        <div class="profile-left">
          <div class="profile-section basic-info">
            <h2 class="section-title">기본 정보</h2>
            <div class="profile-main">
              <div class="profile-image">
                <img :src="profileImage" alt="프로필 이미지" @click="triggerImageUpload" />
                <input type="file" ref="imageInput" @change="handleImageUpload" style="display: none;" accept="image/*">
                <div v-if="isEditing" class="image-upload-prompt">
                  <i class="fas fa-camera"></i>
                  <span>이미지 변경</span>
                </div>
              </div>
              <div class="profile-details">
                <h2 v-if="!isEditing">{{ name }}</h2>
                <input v-else v-model="name" type="text" class="edit-input">
                <p v-if="!isEditing" class="job-title">{{ jobTitle }}</p>
                <input v-else v-model="jobTitle" type="text" class="edit-input">
                <div class="contact-info">
                  <p v-if="!isEditing"><i class="fas fa-envelope"></i> {{ email }}</p>
                  <input v-else v-model="email" type="email" class="edit-input" placeholder="이메일">
                  <p v-if="!isEditing"><i class="fas fa-phone"></i> {{ phone }}</p>
                  <input v-else v-model="phone" type="tel" class="edit-input" placeholder="전화번호">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-right">
          <div class="profile-section additional-info">
            <h2 class="section-title">추가 정보</h2>
            <div class="info-section">
              <p v-if="!isEditing">나이: {{ age }}세</p>
              <input v-else v-model="age" type="number" class="edit-input" placeholder="나이">
              <p v-if="!isEditing">주소: {{ address }}</p>
              <input v-else v-model="address" type="text" class="edit-input" placeholder="주소">
            </div>
          </div>
          <div class="profile-section certificates">
            <h2 class="section-title">자격증</h2>
            <div class="certificates-section">
              <ul v-if="!isEditing">
                <li v-for="cert in certificates" :key="cert">{{ cert }}</li>
              </ul>
              <div v-else>
                <div v-for="(cert, index) in certificates" :key="index" class="certificate-edit">
                  <input v-model="certificates[index]" type="text" class="edit-input">
                  <button @click="removeCertificate(index)" class="remove-btn"><i class="fas fa-minus-circle"></i></button>
                </div>
                <button @click="addCertificate" class="add-btn"><i class="fas fa-plus-circle"></i> 자격증 추가</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button @click="toggleEditMode" class="edit-button" :class="{ 'save-mode': isEditing }">
          <i :class="isEditing ? 'fas fa-save' : 'fas fa-edit'"></i>
          {{ isEditing ? '저장' : '수정' }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isEditing = ref(false);
  const name = ref('신주연');
  const jobTitle = ref('주니어 천재 개발자');
  const email = ref('joo@naver.com');
  const phone = ref('010-1234-5678');
  const age = ref(25);
  const address = ref('서울특별시 강남구');
  const certificates = ref(['정보처리기사', 'SQLD']);
  const profileImage = ref('https://via.placeholder.com/150');
  const imageInput = ref(null);
  
  const toggleEditMode = () => {
    isEditing.value = !isEditing.value;
    if (!isEditing.value) {
      // Here you would typically save the changes to a backend
      console.log('Changes saved');
    }
  };
  
  const addCertificate = () => {
    certificates.value.push('');
  };
  
  const removeCertificate = (index) => {
    certificates.value.splice(index, 1);
  };
  
  const triggerImageUpload = () => {
    if (isEditing.value) {
      imageInput.value.click();
    }
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profileImage.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  </script>
  
  <style scoped>
  /* 스타일은 이전과 동일하게 유지 */
  .profile-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .profile-title {
    font-size: 36px;
    margin-bottom: 30px;
    text-align: center;
  }
  
  .profile-content {
    display: flex;
    gap: 30px;
  }
  
  .profile-left {
    flex: 1;
    min-width: 300px;
  }
  
  .profile-right {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .profile-section {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 30px;
  }
  
  .basic-info {
    height: 100%;
  }
  
  .additional-info, .certificates {
    flex: 1;
    width: 100%;
  }
  
  .section-title {
    font-size: 28px;
    color: #007bff;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #007bff;
  }
  
  .profile-main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 30px;
    position: relative;
    cursor: pointer;
  }
  
  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .image-upload-prompt {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    text-align: center;
    padding: 8px;
    font-size: 16px;
  }
  
  .profile-details {
    text-align: center;
    width: 100%;
  }
  
  .profile-details h2 {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .job-title {
    font-size: 22px;
    color: #666;
    margin-bottom: 20px;
  }
  
  .contact-info p {
    font-size: 18px;
    margin: 10px 0;
  }
  
  .contact-info i {
    margin-right: 15px;
    color: #007bff;
  }
  
  .info-section p {
    font-size: 18px;
    margin: 15px 0;
  }
  
  .certificates-section ul {
    padding-left: 20px;
  }
  
  .certificates-section li {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .edit-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 18px;
  }
  
  .certificate-edit {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .remove-btn, .add-btn {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: 18px;
    padding: 5px;
  }
  
  .add-btn {
    margin-top: 15px;
  }
  
  .button-container {
    text-align: center;
    margin-top: 30px;
  }
  
  .edit-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 18px;
    display: inline-flex;
    align-items: center;
    transition: background-color 0.3s, transform 0.3s;
  }
  
  .edit-button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
  
  .edit-button.save-mode {
    background-color: #28a745;
  }
  
  .edit-button i {
    margin-right: 10px;
  }
  
  @media (max-width: 1024px) {
    .profile-content {
      flex-direction: column;
    }
  
    .profile-left, .profile-right {
      width: 100%;
    }
  
    .basic-info {
      height: auto;
    }
  
    .additional-info, .certificates {
      width: 100%;
    }
  }
  
  @media (max-width: 768px) {
    .profile-section {
      padding: 20px;
    }
  
    .section-title {
      font-size: 24px;
    }
  
    .profile-details h2 {
      font-size: 28px;
    }
  
    .job-title {
      font-size: 20px;
    }
  
    .edit-button {
      width: 100%;
      justify-content: center;
    }
  }
  </style>