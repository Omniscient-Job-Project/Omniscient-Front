<template>
  <div class="auth-container">
    <div class="login-content">
      <!-- 로그인 폼 -->
      <div class="login-form">
        <div class="omniscientLogo">
          <h1>Welcome to 전직시</h1>
        </div>
        <p class="subtitle">당신의 꿈을 응원합니다!</p>
        <div class="auth-box">
          <form @submit.prevent="handleSubmit">
            <div class="form-floating mb-3">
              <label for="userId">아이디</label>
              <input
                type="text"
                class="form-control"
                id="userId"
                v-model="userId"
                placeholder="아이디를 입력해주세요"
                required
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
        <div class="options">
          <RouterLink to="/signUp" class="link">회원가입</RouterLink> 
          <p class="link" @click="openFindAccountModal">아이디/비밀번호 찾기</p>
          <FindAccountModal ref="findAccountModalRef" />
        </div>
      </div>

      <!-- 이미지 섹션 -->
      <div class="login-image">
        <div class="image-content">
          <h2>Make a Dream.</h2>
        </div>
      </div>
    </div>

<!-- 개선된 모달 컴포넌트 -->
<div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3><i :class="modalIcon"></i> {{ modalTitle }}</h3>
        <p>{{ modalMessage }}</p>
        <div class="modal-actions">
          <button @click="closeModal" class="confirm-button">
            <i class="fas fa-check"></i> 확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import FindAccountModal from './findAccount.vue';

const API_URL = import.meta.env.VITE_API_URL;
const userId = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();
const modalConfirmAction = ref(null);

// 모달 관련 상태
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalIcon = ref('');

// 모달 열기 함수
const openModal = (title, message, icon = 'fas fa-info-circle', onConfirm = null) => {
  modalTitle.value = title;
  modalMessage.value = message;
  modalIcon.value = icon;
  showModal.value = true;
  if (onConfirm) {
    modalConfirmAction.value = onConfirm;
  }
};

// 모달 닫기 함수
const closeModal = () => {
  showModal.value = false;
  if (modalConfirmAction.value) {
    modalConfirmAction.value();
    modalConfirmAction.value = null;
  }
};

// 로그인 요청 처리
const handleSubmit = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/login/post`, {
      userId: userId.value,
      password: password.value,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 200) {
      const { accessToken, refreshToken } = response.data;
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      authStore.login(accessToken);
      console.log('로그인 상태:', authStore.isLoggedIn);
      openModal('로그인 성공', '로그인에 성공했습니다!', 'fas fa-check-circle');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      
      let errorMessage = '알 수 없는 오류가 발생했습니다.';
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      
      openModal('로그인 실패', `로그인 실패: ${errorMessage}`, 'fas fa-exclamation-circle');
    } else if (error.request) {
      console.error('Request:', error.request);
      openModal('연결 오류', '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.', 'fas fa-wifi');
    } else {
      console.error('Error message:', error.message);
      openModal('오류', '로그인 처리 중 오류가 발생했습니다.', 'fas fa-exclamation-triangle');
    }
  }
};

const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(`${API_URL}/api/v1/token/refresh`, { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem('token', accessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    authStore.login(accessToken);  // Pinia 스토어 업데이트
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    logout();
  }
};

// 로그아웃 처리
const logout = () => {
  openModal('로그아웃 확인', '정말 로그아웃 하시겠습니까?', 'fas fa-sign-out-alt', () => {
    // 실제 로그아웃 처리
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    authStore.logout();
    router.push('/login');
  });
};

// Axios 요청 인터셉터 설정
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Axios 응답 인터셉터 설정
axios.interceptors.response.use(response => {
  return response;
}, async error => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      await refreshAccessToken();
      return axios(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
});

// 컴포넌트가 마운트될 때 호출되는 함수
onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    authStore.login(token);
    console.log('토큰이 존재하여 로그인 상태로 설정됨');
  } else {
    console.log('토큰이 없음, 로그아웃 상태');
    openModal('환영합니다', 'Welcome to 전직시! 로그인 해주세요.');
  }
  console.log('초기 로그인 상태:', authStore.isLoggedIn);
});

const findAccountModalRef = ref(null);

const openFindAccountModal = () => {
  if (findAccountModalRef.value) {
    findAccountModalRef.value.openModal();
  }
};
</script>

<style>
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
background-color: white;
border-radius: 10px;
overflow: hidden;
box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
height: 80vh; /* 높이를 80vh로 설정 */
}

/* 로그인 이미지 스타일 */
.login-image {
flex: 1; /* 이미지 섹션이 남은 공간을 꽉 채움 */
background-color: #0000ff;
color: white;
display: flex;
align-items: center;
justify-content: center;
padding: 40px;
}

/* 로그인 폼 스타일 */
.login-form {
flex: 1; /* 로그인 폼이 남은 공간을 꽉 채움 */
padding: 40px;
display: flex;
flex-direction: column;
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

.auth-box {
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
width: 100%; /* 버튼을 꽉 채우기 */
background-color: #0000ff;
border: none;
padding: 10px;
border-radius: 5px;
color: white;
cursor: pointer;
}

/* 회원가입, 아이디/비밀번호 찾기 스타일 */
.options {
display: flex;
justify-content: center;
align-items: center;
gap: 0.5rem;
margin-top: 1rem;
font-size: 0.9rem;
}

.link {
color: #0056b3;
text-decoration: none; /* 기본 상태에서 밑줄 제거 */
cursor: pointer;
}

.link:hover {
color: #2f1ae4; /* 호버 시 글자 색상 변경 */
text-decoration: none; /* 호버 시에도 밑줄 없음 */
}

.image-content h2 {
font-size: 36px;
margin-bottom: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  color: #007bff;
  font-size: 32px;
  margin-bottom: 30px;
}

.modal-content p {
  font-size: 20px;
  margin-bottom: 30px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.confirm-button {
  padding: 15px 30px;
  border: none;
  border-radius: 30px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #28a745;
  color: white;
}

.confirm-button:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .modal-content {
    padding: 40px;
  }

  .modal-content h3 {
    font-size: 28px;
  }

  .modal-content p {
    font-size: 18px;
  }

  .confirm-button {
    padding: 12px 24px;
    font-size: 18px;
  }
}
</style>
