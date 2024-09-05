<template>
  <div class="certificates-page">
    <h1>자격증 관리</h1>
    <div class="certificate-list">
      <div v-for="(cert, index) in certificates" :key="index" class="certificate-item">
        <div class="certificate-header" @click="toggleCertificate(index)">
          <span>{{ cert.name }}</span>
          <i :class="cert.isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </div>
        <div v-show="cert.isOpen" class="certificate-details">
          <p><strong>취득일:</strong> {{ cert.date }}</p>
          <p><strong>발급기관:</strong> {{ cert.issuer }}</p>
          <p><strong>자격증 번호:</strong> {{ cert.number }}</p>
          <button @click="editCertificate(index)" class="edit-btn">
            <i class="fas fa-edit"></i> 수정
          </button>
          <button @click="deleteCertificate(index)" class="delete-btn">
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
import { ref } from 'vue';

const certificates = ref([
  { name: '정보처리기사', date: '2023-05-15', issuer: '한국산업인력공단', number: '23-12-1234', isOpen: false },
  { name: 'SQLD', date: '2023-08-20', issuer: '한국데이터산업진흥원', number: 'SQL-2023-12345', isOpen: false },
]);

const showForm = ref(false);
const isEditing = ref(false);
const editIndex = ref(-1);
const formData = ref({ name: '', date: '', issuer: '', number: '' });

const toggleCertificate = (index) => {
  certificates.value[index].isOpen = !certificates.value[index].isOpen;
};

const showAddForm = () => {
  showForm.value = true;
  isEditing.value = false;
  formData.value = { name: '', date: '', issuer: '', number: '' };
};

const editCertificate = (index) => {
  showForm.value = true;
  isEditing.value = true;
  editIndex.value = index;
  formData.value = { ...certificates.value[index] };
};

const deleteCertificate = (index) => {
  if (confirm('정말로 이 자격증을 삭제하시겠습니까?')) {
    certificates.value.splice(index, 1);
  }
};

const submitForm = () => {
  if (isEditing.value) {
    certificates.value[editIndex.value] = { ...formData.value, isOpen: false };
  } else {
    certificates.value.push({ ...formData.value, isOpen: false });
  }
  showForm.value = false;
};

const cancelForm = () => {
  showForm.value = false;
};
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