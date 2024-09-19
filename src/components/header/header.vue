<template>
  <header>
    <div class="logo">
      <RouterLink to="/">
        <img src="../../assets/img/logo/omniscientLogo.png" alt="전직시 로고" class="logo-image" />
      </RouterLink>
    </div>
    <nav class="menu">
      <RouterLink to="/certificate">자격증</RouterLink>
      <RouterLink to="/curation">채용</RouterLink>
      <RouterLink to="/board">자유게시판</RouterLink>
      <RouterLink to="/mypage">마이페이지</RouterLink>
      <RouterLink
       to="/"
       @click.prevent="handleAuth">
        {{ isLoggedIn ? '로그아웃' : '로그인' }}
      </RouterLink>
    </nav>

    <!-- 모달 컴포넌트 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3><i :class="modalIcon"></i> {{ modalTitle }}</h3>
        <p>{{ modalMessage }}</p>
        <div class="modal-actions">
          <button @click="confirmModal" class="confirm-button">
            <i class="fas fa-check"></i> 확인
          </button>
          <button @click="closeModal" class="cancel-button">
            <i class="fas fa-times"></i> 취소
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import '@/assets/css/header.css';
import { useAuthStore } from '@/stores/auth'; // auth 스토어 임포트
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter(); // 라우터 사용

// computed로 로그인 상태 확인
const isLoggedIn = computed(() => authStore.isLoggedIn);

// 모달 관련 상태
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const modalIcon = ref('');
const modalConfirmAction = ref(null);

// 모달 열기 함수
const openModal = (title, message, icon, confirmAction) => {
  modalTitle.value = title;
  modalMessage.value = message;
  modalIcon.value = icon;
  modalConfirmAction.value = confirmAction;
  showModal.value = true;
};

// 모달 닫기 함수
const closeModal = () => {
  showModal.value = false;
  modalConfirmAction.value = null;
};

// 모달 확인 함수
const confirmModal = () => {
  if (modalConfirmAction.value) {
    modalConfirmAction.value();
  }
  closeModal();
};

// 인증 처리 함수 (로그인/로그아웃)
const handleAuth = () => {
  if (authStore.isLoggedIn) {
    // 로그아웃 확인 모달 띄우기
    openModal(
      '로그아웃 확인',
      '정말 로그아웃 하시겠습니까?',
      'fas fa-sign-out-alt',
      () => {
        authStore.logout(); // 로그아웃 처리
        console.log('로그아웃 처리 완료');
        router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
      }
    );
  } else {
    router.push('/login'); // 로그인 페이지로 이동
  }
};
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  max-width: 120px; /* 최대 너비 설정, 원하는 크기로 조정 */
  max-height: 60px; /* 최대 높이 설정, 원하는 크기로 조정 */
  width: auto; /* 비율 유지 */
  height: auto; /* 비율 유지 */
  object-fit: contain; /* 이미지 비율 유지하면서 컨테이너에 맞추기 */
  cursor: pointer; /* 클릭 시 포인터 커서 변경 */
}

/* 모달 스타일 */
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
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  color: #007bff;
  font-size: 24px;
  margin-bottom: 20px;
}

.modal-content p {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.confirm-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-button {
  background-color: #28a745;
  color: white;
}

.confirm-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
}
</style>