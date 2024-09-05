<template>
  <div class="resume-management">
    <h1 class="page-title">
      <i class="fas fa-file-alt"></i> 이력서 관리
    </h1>
    
    <div class="resume-list">
      <div v-for="resume in resumes" :key="resume.id" class="resume-item">
        <div class="resume-header" @click="toggleResume(resume.id)">
          <span>{{ resume.title }}</span>
          <i :class="resume.isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </div>
        <div v-show="resume.isOpen" class="resume-content">
          <div class="resume-section">
            <h3>개인 정보</h3>
            <p><strong>이름:</strong> {{ resume.name }}</p>
            <p><strong>이메일:</strong> {{ resume.email }}</p>
            <p><strong>전화번호:</strong> {{ resume.phone }}</p>
          </div>
          
          <div class="resume-section">
            <h3>학력</h3>
            <div v-for="(edu, index) in resume.education" :key="index" class="sub-section">
              <p><strong>학교:</strong> {{ edu.school }}</p>
              <p><strong>전공:</strong> {{ edu.major }}</p>
              <p><strong>학위:</strong> {{ edu.degree }}</p>
              <p><strong>졸업년도:</strong> {{ edu.graduationYear }}</p>
            </div>
          </div>
          
          <div class="resume-section">
            <h3>경력</h3>
            <div v-for="(exp, index) in resume.experience" :key="index" class="sub-section">
              <p><strong>회사:</strong> {{ exp.company }}</p>
              <p><strong>직위:</strong> {{ exp.position }}</p>
              <p><strong>기간:</strong> {{ exp.startDate }} - {{ exp.endDate }}</p>
              <p><strong>업무:</strong> {{ exp.description }}</p>
            </div>
          </div>
          
          <div class="resume-section">
            <h3>기술 스택</h3>
            <p>{{ resume.skills }}</p>
          </div>
          
          <div class="resume-section">
            <h3>자격증</h3>
            <div v-for="(cert, index) in resume.certificates" :key="index" class="sub-section">
              <p><strong>자격증명:</strong> {{ cert.name }}</p>
              <p><strong>취득일:</strong> {{ cert.date }}</p>
            </div>
          </div>
          
          <div class="resume-section">
            <h3>자기소개서</h3>
            <p>{{ resume.introduction }}</p>
          </div>
          
          <div class="resume-actions">
            <button @click="editResume(resume)" class="edit-btn">
              <i class="fas fa-edit"></i> 수정
            </button>
            <button @click="deleteResume(resume.id)" class="delete-btn">
              <i class="fas fa-trash-alt"></i> 삭제
            </button>
          </div>
        </div>
      </div>
    </div>

    <button @click="showAddForm" class="add-btn">
      <i class="fas fa-plus"></i> 새 이력서 작성
    </button>
    
    <!-- 이력서 추가/수정 폼 -->
    <div v-if="showForm" class="resume-form">
      <h2>{{ isEditing ? '이력서 수정' : '새 이력서 작성' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="form-section">
          <h3>개인 정보</h3>
          <div class="form-group">
            <label for="resumeTitle">이력서 제목</label>
            <input type="text" id="resumeTitle" v-model="formData.title" required>
          </div>
          <div class="form-group">
            <label for="name">이름</label>
            <input type="text" id="name" v-model="formData.name" required>
          </div>
          <div class="form-group">
            <label for="email">이메일</label>
            <input type="email" id="email" v-model="formData.email" required>
          </div>
          <div class="form-group">
            <label for="phone">전화번호</label>
            <input type="tel" id="phone" v-model="formData.phone" required>
          </div>
        </div>

        <div class="form-section">
          <h3>학력</h3>
          <div v-for="(edu, index) in formData.education" :key="index" class="sub-form">
            <div class="form-group">
              <label :for="'school'+index">학교</label>
              <input type="text" :id="'school'+index" v-model="edu.school" required>
            </div>
            <div class="form-group">
              <label :for="'major'+index">전공</label>
              <input type="text" :id="'major'+index" v-model="edu.major" required>
            </div>
            <div class="form-group">
              <label :for="'degree'+index">학위</label>
              <input type="text" :id="'degree'+index" v-model="edu.degree" required>
            </div>
            <div class="form-group">
              <label :for="'graduationYear'+index">졸업년도</label>
              <input type="number" :id="'graduationYear'+index" v-model="edu.graduationYear" required>
            </div>
          </div>
          <button type="button" @click="addEducation" class="add-btn">학력 추가</button>
        </div>

        <div class="form-section">
          <h3>경력</h3>
          <div v-for="(exp, index) in formData.experience" :key="index" class="sub-form">
            <div class="form-group">
              <label :for="'company'+index">회사</label>
              <input type="text" :id="'company'+index" v-model="exp.company" required>
            </div>
            <div class="form-group">
              <label :for="'position'+index">직위</label>
              <input type="text" :id="'position'+index" v-model="exp.position" required>
            </div>
            <div class="form-group">
              <label :for="'startDate'+index">시작일</label>
              <input type="date" :id="'startDate'+index" v-model="exp.startDate" required>
            </div>
            <div class="form-group">
              <label :for="'endDate'+index">종료일</label>
              <input type="date" :id="'endDate'+index" v-model="exp.endDate">
            </div>
            <div class="form-group">
              <label :for="'description'+index">업무 설명</label>
              <textarea :id="'description'+index" v-model="exp.description" required></textarea>
            </div>
          </div>
          <button type="button" @click="addExperience" class="add-btn">경력 추가</button>
        </div>

        <div class="form-section">
          <h3>기술 스택</h3>
          <div class="form-group">
            <label for="skills">기술 (쉼표로 구분)</label>
            <input type="text" id="skills" v-model="formData.skills">
          </div>
        </div>

        <div class="form-section">
          <h3>자격증</h3>
          <div v-for="(cert, index) in formData.certificates" :key="index" class="sub-form">
            <div class="form-group">
              <label :for="'certName'+index">자격증명</label>
              <input type="text" :id="'certName'+index" v-model="cert.name" required>
            </div>
            <div class="form-group">
              <label :for="'certDate'+index">취득일</label>
              <input type="date" :id="'certDate'+index" v-model="cert.date" required>
            </div>
          </div>
          <button type="button" @click="addCertificate" class="add-btn">자격증 추가</button>
        </div>

        <div class="form-section">
          <h3>자기소개서</h3>
          <div class="form-group">
            <label for="introduction">자기소개</label>
            <textarea id="introduction" v-model="formData.introduction" rows="5" required></textarea>
          </div>
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
import { ref, reactive } from 'vue';

const resumes = ref([
  {
    id: 1,
    title: '소프트웨어 개발자 이력서',
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    education: [
      { school: '서울대학교', major: '컴퓨터공학', degree: '학사', graduationYear: 2020 }
    ],
    experience: [
      { company: 'ABC 기업', position: '주니어 개발자', startDate: '2020-03-01', endDate: '2022-12-31', description: '웹 애플리케이션 개발' }
    ],
    skills: 'JavaScript, Vue.js, Python, Django',
    certificates: [
      { name: '정보처리기사', date: '2019-12-20' }
    ],
    introduction: '열정적이고 끊임없이 학습하는 개발자입니다.',
    isOpen: false
  },
  // 추가 이력서 데이터...
]);

const showForm = ref(false);
const isEditing = ref(false);
const editingResumeId = ref(null);
const formData = reactive({
  title: '',
  name: '',
  email: '',
  phone: '',
  education: [],
  experience: [],
  skills: '',
  certificates: [],
  introduction: ''
});

const toggleResume = (id) => {
  const resume = resumes.value.find(r => r.id === id);
  if (resume) {
    resume.isOpen = !resume.isOpen;
  }
};

const showAddForm = () => {
  showForm.value = true;
  isEditing.value = false;
  resetForm();
};

const editResume = (resume) => {
  showForm.value = true;
  isEditing.value = true;
  editingResumeId.value = resume.id;
  Object.assign(formData, resume);
};

const deleteResume = (id) => {
  if (confirm('정말로 이 이력서를 삭제하시겠습니까?')) {
    resumes.value = resumes.value.filter(r => r.id !== id);
  }
};

const submitForm = () => {
  if (isEditing.value) {
    const index = resumes.value.findIndex(r => r.id === editingResumeId.value);
    if (index !== -1) {
      resumes.value[index] = { ...resumes.value[index], ...formData, isOpen: false };
    }
  } else {
    resumes.value.push({
      id: Date.now(),
      ...formData,
      isOpen: false
    });
  }
  showForm.value = false;
};

const cancelForm = () => {
  showForm.value = false;
  resetForm();
};

const resetForm = () => {
  Object.assign(formData, {
    title: '',
    name: '',
    email: '',
    phone: '',
    education: [],
    experience: [],
    skills: '',
    certificates: [],
    introduction: ''
  });
};

const addEducation = () => {
  formData.education.push({ school: '', major: '', degree: '', graduationYear: '' });
};

const addExperience = () => {
  formData.experience.push({ company: '', position: '', startDate: '', endDate: '', description: '' });
};

const addCertificate = () => {
  formData.certificates.push({ name: '', date: '' });
};
</script>

<style scoped>
.resume-management {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
  font-family: Arial, sans-serif;
  color: #333;
}

.page-title {
  font-size: 32px;
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
}

.resume-list {
  margin-bottom: 30px;
}

.resume-item {
  background-color: #f8f9fa;
  border-radius: 15px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 18px;
}

.resume-header:hover {
  background-color: #2980b9;
}

.resume-content {
  padding: 25px;
}

.resume-section {
  margin-bottom: 20px;
}

.resume-section h3 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.sub-section {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #ecf0f1;
  border-radius: 8px;
}

.edit-btn, .delete-btn, .add-btn, .submit-btn, .cancel-btn {
  padding: 10px 15px;
  border: none;
}
</style>