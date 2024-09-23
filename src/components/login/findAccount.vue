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
        <form @submit.prevent="findId">
          <div class="form-group">
            <label for="name">이름</label>
            <input type="text" id="name" v-model="name" required>
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
        <form @submit.prevent="resetPassword">
          <div class="form-group">
            <label for="name">이름</label>
            <input type="text" id="name" v-model="name" required>
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
          <div class="form-group">
            <label for="newPassword">새 비밀번호</label>
            <input type="password" id="newPassword" v-model="newPassword" required>
          </div>
          <button type="submit" class="submit-btn">비밀번호 재설정</button>
        </form>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const isOpen = ref(false);
const activeTab = ref('id');
const email = ref('');
const userId = ref('');
const authCode = ref('');
const name = ref('');
const newPassword = ref(''); // 새 비밀번호 추가

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  resetForm();
};

const resetForm = () => {
  activeTab.value = 'id';
  email.value = '';
  userId.value = '';
  authCode.value = '';
  name.value = '';
  newPassword.value = ''; // 새 비밀번호 초기화
};

const sendAuthCode = async () => {
  if (!email.value) {
    alert('이메일을 입력해주세요.');
    return;
  }
  try {
    const response = await axios.post(`${API_URL}/api/v1/login/send-code`, {
      email: email.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    alert(response.data);
  } catch (error) {
    console.error('Error sending auth code:', error);
    if (error.response) {
      console.error('Error response:', error.response);
      if (error.response.status === 404) {
        alert('해당 이메일로 등록된 계정이 없습니다.');
      } else {
        alert(`오류 발생: ${error.response.data}`);
      }
    } else if (error.request) {
      alert('서버로부터 응답이 없습니다.');
    } else {
      alert('요청 설정 중 오류가 발생했습니다.');
    }
  }
};

const findId = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/login/find-id`, {
      email: email.value,
      authCode: authCode.value
    });

    if (response.status === 200) {
      alert('아이디가 이메일로 전송되었습니다.');
      closeModal();
    } else {
      alert('아이디 찾기에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error finding ID:', error);
    if (error.response && error.response.status === 404) {
      alert('해당 이메일로 등록된 계정이 없습니다.');
    } else {
      alert('아이디 찾기 중 오류가 발생했습니다.');
    }
  }
};

const resetPassword = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/login/reset-password`, {
      email: email.value,
      newPassword: newPassword.value, // 새 비밀번호 사용
      code: authCode.value
    });

    if (response.status === 200) {
      alert('비밀번호가 성공적으로 재설정되었습니다.');
      closeModal();
    } else {
      alert('비밀번호 재설정에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error resetting password:', error);
    alert('비밀번호 재설정 중 오류가 발생했습니다.');
  }
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
  background: linear-gradient(135deg, #ccbbde 0%, #f5f7fa 100%);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 0.5rem;
}

.send-code-btn:hover {
  background: linear-gradient(135deg, #d9b3e6 0%, #f5f7fa 100%);
}
</style>
