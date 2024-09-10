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
          <button @click="deleteCertificate(cert.id)" class="delete-btn">
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
      <form @submit.prevent="submitForm">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090/api/v1/certificates';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const certificates = ref([]);
const showForm = ref(false);
const isEditing = ref(false);
const formData = ref({ id: null, name: '', date: '', issuer: '', number: '' });
const error = ref(null);

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
  if (confirm('정말로 이 자격증을 삭제하시겠습니까?')) {
    try {
      log(`자격증 삭제 시작: ID ${id}`);
      await axiosInstance.delete(`/${id}`);
      certificates.value = certificates.value.filter(cert => cert.id !== id);
      log(`자격증 삭제 완료: ID ${id}`);
    } catch (err) {
      handleError('자격증 삭제에 실패했습니다', err);
    }
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
  formData.value = { ...cert, date: formatDateForInput(cert.date) };
};

const submitForm = () => {
  if (isEditing.value) {
    updateCertificate();
  } else {
    addCertificate();
  }
};

const cancelForm = () => {
  showForm.value = false;
};

const validateFormData = () => {
  const { name, date, issuer, number } = formData.value;
  if (!name.trim() || !date || !issuer.trim() || !number.trim()) {
    throw new Error('모든 필드를 입력해주세요.');
  }
};

const handleError = (message, err) => {
  log(`에러 발생: ${message}`, 'error');
  console.error(err);
  if (err.response) {
    log(`서버 응답: ${JSON.stringify(err.response.data)}`, 'error');
  }
  error.value = `${message}: ${err.message}`;
  setTimeout(() => {
    error.value = null;
  }, 5000);
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('ko-KR', options);
};

const formatDateForServer = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

onMounted(fetchCertificates);
</script>

<style scoped>
.certificates-page {
  padding: 20px;
}

.certificate-list {
  margin-bottom: 20px;
}

.certificate-item {
  background-color: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.certificate-header:hover {
  background-color: #0056b3;
}

.certificate-details {
  padding: 20px;
  background-color: white;
}

.edit-btn, .delete-btn, .add-btn, .submit-btn, .cancel-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
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
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

.form-actions {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .certificate-header, .certificate-details {
    padding: 10px;
  }
  
  .edit-btn, .delete-btn, .add-btn, .submit-btn, .cancel-btn {
    padding: 6px 10px;
    font-size: 14px;
  }
}
</style>