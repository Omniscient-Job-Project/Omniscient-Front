<template>
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">&times;</button>
        <h2>계정 찾기</h2>
        <div class="tab-container">
          <button 
            :class="['tab-btn', { active: activeTab === 'id' }]" 
            @click="activeTab = 'id'"
          >
            아이디 찾기
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'password' }]" 
            @click="activeTab = 'password'"
          >
            비밀번호 찾기
          </button>
        </div>
        
        <!-- 아이디 찾기 -->
      <div v-if="activeTab === 'id'" class="tab-content">
        <form @submit.prevent="verifyId">
          <div class="form-group">
            <label for="name">이름</label>
            <input type="text" id="name" v-model="name" required>
          </div>
          <div class="form-group">
            <label for="birthDate">생년월일</label>
            <input type="date" id="birthDate" v-model="birthDate" required>
          </div>
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" v-model="email" required>
            <button type="button" class="send-code-btn" @click="sendAuthCode">인증번호 발송</button>
          </div>
          <div class="form-group">
            <label for="authCode">인증번호</label>
            <input type="text" id="authCode" v-model="authCode" required>
          </div>
          <button type="submit" class="submit-btn">인증확인</button>
        </form>
      </div>

      <!-- 비밀번호 찾기 -->
      <div v-else class="tab-content">
        <form @submit.prevent="verifyPassword">
          <div class="form-group">
            <label for="name">이름</label>
            <input type="text" id="name" v-model="name" required>
          </div>
          <div class="form-group">
            <label for="birthDate">생년월일</label>
            <input type="date" id="birthDate" v-model="birthDate" required>
          </div>
          <div class="form-group">
            <label for="userId">아이디</label>
            <input type="text" id="userId" v-model="userId" required>
          </div>
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" v-model="email" required>
            <button type="button" class="send-code-btn" @click="sendAuthCode">인증번호 발송</button>
          </div>
          <div class="form-group">
            <label for="authCode">인증번호</label>
            <input type="text" id="authCode" v-model="authCode" required>
          </div>
          <button type="submit" class="submit-btn">인증확인</button>
        </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isOpen = ref(false);
  const activeTab = ref('id');
  const email = ref('');
  const userId = ref('');
  const userEmail = ref('');
  
  const openModal = () => {
    isOpen.value = true;
  };
  
  const closeModal = () => {
    isOpen.value = false;
    activeTab.value = 'id';
    email.value = '';
    userId.value = '';
    userEmail.value = '';
  };
  
  const findId = async () => {
    // 여기에 아이디 찾기 로직 구현
    console.log('Finding ID for email:', email.value);
    // API 호출 및 결과 처리
  };
  
  const findPassword = async () => {
    // 여기에 비밀번호 찾기 로직 구현
    console.log('Resetting password for user:', userId.value, 'with email:', userEmail.value);
    // API 호출 및 결과 처리
  };
  
  defineExpose({ openModal });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 2rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 400px;
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #333;
  }
  
  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 1.5rem;
  }
  
  .tab-container {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1.5rem;
  }
  
  .tab-btn {
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    color: #666;
    transition: all 0.3s ease;
  }
  
  .tab-btn.active {
    color: #0000ff;
    border-bottom: 2px solid #0000ff;
  }
  
  .tab-content {
    background-color: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
  }
  
  .submit-btn {
    width: 100%;
    padding: 0.75rem;
    background-color: #0000ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .submit-btn:hover {
    background-color: #0000cc;
  }

  .send-code-btn {
  padding: 0.4rem 0.5rem;
  background: linear-gradient(135deg, #ccbbde 0%, #a0b2d2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.4rem;
  margin-left: 0rem; /* 이메일 입력칸과 버튼 간격 */
  transition: background-color 0.3s ease;
}

.send-code-btn:hover {
  background: linear-gradient(135deg, #7b7185 0%, #7a879c 100%);
}

/* 모바일 및 작은 화면 대응 */
@media (max-width: 768px) {
  .send-code-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}







  </style>