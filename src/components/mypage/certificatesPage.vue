<template>
  <div class="certificates-page">
    <h1>자격증 관리</h1>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div class="certificate-list">
      <div v-for="(cert, index) in certificates" :key="cert.id" class="certificate-item">
        <div class="certificate-header" @click="toggleCertificate(index)">
          <span>{{ cert.name }}</span>
          <i :class="cert.isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </div>
        <div v-show="cert.isOpen" class="certificate-details">
          <p><strong>취득일:</strong> {{ formatDateForDisplay(cert.date) }}</p>
          <p><strong>발급기관:</strong> {{ cert.issuer }}</p>
          <p><strong>자격증 번호:</strong> {{ cert.number }}</p>
          <button @click="editCertificate(cert)" class="edit-btn">
            <i class="fas fa-edit"></i> 수정
          </button>
          <button @click="showDeleteModal(cert.id)" class="delete-btn">
            <i class="fas fa-trash-alt"></i> 삭제
          </button>
        </div>
      </div>
    </div>
    <button @click="showAddForm" class="add-btn">
      <i class="fas fa-plus"></i> 자격증 추가
    </button>
    
    <!-- 자격증 추가/수정 폼 -->
    <div v-if="showForm" class="certificate-form">
      <h2>{{ isEditing ? '자격증 수정' : '자격증 추가' }}</h2>
      <form @submit.prevent="showConfirmModal">
        <div class="form-group">
          <label for="certName">자격증명</label>
          <input type="text" id="certName" v-model="formData.name" required>
        </div>
        <div class="form-group">
          <label for="certDate">취득일</label>
          <input type="date" id="certDate" v-model="formData.date" required>
        </div>
        <div class="form-group">
          <label for="certIssuer">발급기관</label>
          <input type="text" id="certIssuer" v-model="formData.issuer" required>
        </div>
        <div class="form-group">
          <label for="certNumber">자격증 번호</label>
          <input type="text" id="certNumber" v-model="formData.number" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-btn">{{ isEditing ? '수정' : '추가' }}</button>
          <button type="button" @click="cancelForm" class="cancel-btn">취소</button>
        </div>
      </form>
    </div>

    <!-- 확인 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3><i class="fas fa-question-circle"></i> 확인</h3>
        <p>{{ modalMessage }}</p>
        <p v-if="modalType !== 'delete'"><strong>자격증명:</strong> {{ formData.name }}</p>
        <div class="modal-actions">
          <button @click="confirmAction" class="confirm-button">
            <i class="fas fa-check"></i> 예
          </button>
          <button @click="closeModal" class="cancel-button">
            <i class="fas fa-times"></i> 아니오
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090/api/v1/certificates';
console.log('API_URL:', API_URL);

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8090/api/v1/certificates',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

const certificates = ref([]);
const showForm = ref(false);
const isEditing = ref(false);
const formData = ref({ id: null, name: '', date: '', issuer: '', number: '' });
const error = ref(null);
const showModal = ref(false);
const modalType = ref('');
const modalMessage = ref('');
const deletingCertId = ref(null);

const log = (message, level = 'info') => {
  const logMessage = `[${new Date().toISOString()}] ${message}`;
  if (level === 'error') {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
};

const fetchCertificates = async () => {
  try {
    log('자격증 목록 조회 시작');
    const response = await axiosInstance.get('');
    certificates.value = response.data.map(cert => ({ 
      ...cert, 
      isOpen: false
    }));
    log(`자격증 목록 조회 완료: ${certificates.value.length}개 조회됨`);
  } catch (err) {
    handleError('자격증 목록을 가져오는데 실패했습니다', err);
  }
};

const formatDateForServer = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const addCertificate = async () => {
  try {
    log('자격증 추가 시작');
    validateFormData();
    const dataToSend = {
      ...formData.value,
      date: formatDateForServer(formData.value.date)
    };
    log('전송할 데이터:', dataToSend);
    const response = await axiosInstance.post('', dataToSend);
    certificates.value.push({ ...response.data, isOpen: false });
    showForm.value = false;
    log(`자격증 추가 완료: ID ${response.data.id}`);
  } catch (err) {
    handleError('자격증 추가에 실패했습니다', err);
  }
};

const updateCertificate = async () => {
  try {
    log(`자격증 수정 시작: ID ${formData.value.id}`);
    validateFormData();
    const dataToSend = {
      ...formData.value,
      date: formatDateForServer(formData.value.date)
    };
    log('전송할 데이터:', dataToSend);
    const response = await axiosInstance.put(`/${formData.value.id}`, dataToSend);
    const index = certificates.value.findIndex(cert => cert.id === formData.value.id);
    certificates.value[index] = { ...response.data, isOpen: false };
    showForm.value = false;
    log(`자격증 수정 완료: ID ${response.data.id}`);
  } catch (err) {
    handleError('자격증 수정에 실패했습니다', err);
  }
};

const deleteCertificate = async (id) => {
  try {
    log(`자격증 삭제 시작: ID ${id}`);
    await axiosInstance.delete(`/${id}`);
    certificates.value = certificates.value.filter(cert => cert.id !== id);
    log(`자격증 삭제 완료: ID ${id}`);
  } catch (err) {
    handleError('자격증 삭제에 실패했습니다', err);
  }
};

const toggleCertificate = (index) => {
  certificates.value[index].isOpen = !certificates.value[index].isOpen;
};

const showAddForm = () => {
  showForm.value = true;
  isEditing.value = false;
  formData.value = { id: null, name: '', date: '', issuer: '', number: '' };
};

const editCertificate = (cert) => {
  showForm.value = true;
  isEditing.value = true;
  formData.value = { ...cert };
};

const showConfirmModal = () => {
  if (validateFormData()) {
    modalType.value = isEditing.value ? 'edit' : 'add';
    modalMessage.value = isEditing.value ? '자격증을 수정하시겠습니까?' : '새 자격증을 등록하시겠습니까?';
    showModal.value = true;
  }
};

const showDeleteModal = (id) => {
  modalType.value = 'delete';
  modalMessage.value = '정말로 이 자격증을 삭제하시겠습니까?';
  deletingCertId.value = id;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalType.value = '';
  modalMessage.value = '';
  deletingCertId.value = null;
};

const confirmAction = () => {
  if (modalType.value === 'delete') {
    deleteCertificate(deletingCertId.value);
  } else if (modalType.value === 'edit') {
    updateCertificate();
  } else {
    addCertificate();
  }
  closeModal();
};

const cancelForm = () => {
  showForm.value = false;
};

const validateFormData = () => {
  const { name, date, issuer, number } = formData.value;
  if (!name.trim() || !date || !issuer.trim() || !number.trim()) {
    throw new Error('모든 필드를 입력해주세요.');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(formatDateForServer(date))) {
    throw new Error('날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식이어야 합니다.');
  }
  return true;
};

const handleError = (message, err) => {
  log(`에러 발생: ${message}`, 'error');
  console.error(err);
  if (err.response) {
    log(`서버 응답 상태: ${err.response.status}`, 'error');
    log(`서버 응답 데이터: ${JSON.stringify(err.response.data)}`, 'error');
  }
  error.value = `${message}: ${err.response?.data?.message || err.message}`;
  setTimeout(() => {
    error.value = null;
  }, 5000);
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ko-KR', options);
};

onMounted(fetchCertificates);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');

.certificates-page {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Noto Sans KR', sans-serif;
  min-height: 100vh;
  box-sizing: border-box;
}

.certificate-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  margin-bottom: 40px;
}

.certificate-item {
  background-color: #f8f9fa;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1000px;
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 20px;
}

.certificate-header:hover {
  background-color: #0056b3;
}

.certificate-details {
  padding: 30px;
  background-color: white;
  font-size: 18px;
}

.edit-btn, .delete-btn, .add-btn, .submit-btn, .cancel-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 15px;
  font-size: 18px;
}

.edit-btn {
  background-color: #ffc107;
  color: #212529;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.add-btn, .submit-btn {
  background-color: #28a745;
  color: white;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.certificate-form {
  background-color: #f8f9fa;
  padding: 40px;
  border-radius: 15px;
  margin-top: 40px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-size: 18px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 18px;
}

.form-actions {
  margin-top: 40px;
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

.confirm-button,
.cancel-button {
  padding: 15px 30px;
  border: none;
  border-radius: 30px;
  font-size: 20px;
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
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 1200px) {
  .certificates-page {
    max-width: 95%;
    padding: 30px;
  }

  .certificate-item,
  .certificate-form {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .certificate-header, .certificate-details {
    padding: 20px;
  }
  
  .edit-btn, .delete-btn, .add-btn, .submit-btn, .cancel-btn {
    padding: 10px 20px;
    font-size: 16px;
  }

  .modal-content {
    padding: 40px;
  }

  .modal-content h3 {
    font-size: 28px;
  }

  .modal-content p {
    font-size: 18px;
  }

  .confirm-button,
  .cancel-button {
    padding: 12px 24px;
    font-size: 18px;
  }
}
</style>