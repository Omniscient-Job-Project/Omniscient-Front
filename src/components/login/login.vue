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
  </div>

  

</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; // auth 스토어 임포트
import FindAccountModal from './findAccount.vue'; // 모달 컴포넌트 import

const API_URL = import.meta.env.VITE_API_URL;
const emit = defineEmits();
const userId = ref(''); // 사용자 아이디
const password = ref(''); // 패스워드
const router = useRouter(); // 라우터 인스턴스 가져오기
const authStore = useAuthStore(); // Pinia auth 스토어 사용



// 로그인 요청 처리
const handleSubmit = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/login/post`, {
      userId: userId.value,
      password: password.value,
    });

    // 로그인 성공 시 처리
    if (response.status === 200) {

      alert('로그인 성공!'); // 로그인 성공 메시지
      localStorage.setItem('token', response.data.accessToken); // JWT 토큰 저장
      localStorage.setItem('refreshToken', response.data.refreshToken); // Refresh 토큰 저장
      
      // Axios 기본 헤더에 Authorization 추가
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;

        // Pinia 스토어의 로그인 상태 갱신
      authStore.login(); // 로그인 상태 업데이트

       // 로그인 상태 확인
       console.log('로그인 상태 업데이트 후:', authStore.isLoggedIn); // 여기 추가

      
      router.push('/'); // 홈 페이지로 이동
    }
  } catch (error) {
    // 로그인 실패 시 처리
    if (error.response) {
      alert(error.response.data); // 서버에서 보낸 에러 메시지 표시
    } else {
      alert('로그인 요청 중 오류가 발생했습니다.'); // 일반 오류 메시지
    }
  }
};

// 토큰 갱신 함수
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/token/refresh`, {
      refreshToken: localStorage.getItem('refreshToken'),
    });
    localStorage.setItem('token', response.data.accessToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    logout(); // 로그아웃 처리
  }
};

// 로그아웃 처리
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  delete axios.defaults.headers.common['Authorization'];
  router.push('/login'); // 로그인 페이지로 이동
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

  // 401 Unauthorized 에러 발생 시
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true; // 무한 루프 방지
    await refreshAccessToken();
    return axios(originalRequest); // 원래 요청 재시도
  }

  return Promise.reject(error);
});

// 컴포넌트가 마운트될 때 호출되는 함수
onMounted(() => {
  if (!authStore.isLoggedIn) {
    alert('Welcome to 전직시! 로그인 해주세요.'); // 로그인하지 않은 경우 환영 메시지 표시
  }
});


const findAccountModalRef = ref(null); // ref 정의

const openFindAccountModal = () => {
  if (findAccountModalRef.value) {
    findAccountModalRef.value.openModal(); // 모달 열기
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
</style>
