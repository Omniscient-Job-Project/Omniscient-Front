<template>
  <div class="resume-edit-container">
    <h1 class="page-title"><i class="fas fa-edit"></i> {{ editingResumeId ? '이력서 수정' : '새 이력서 작성' }}</h1>
    <form @submit.prevent="saveResume">
      <!-- 개인 정보 섹션 -->
      <div class="accordion-section">
        <div class="accordion-header" @click="toggleSection('personalInfo')">
          <i class="fas fa-user"></i> 개인 정보
          <i :class="['fas', openSections.personalInfo ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </div>
        <div class="accordion-content" :class="{ 'active': openSections.personalInfo }">
          <div v-if="openSections.personalInfo" class="accordion-body">
            <div class="form-group">
              <label for="name">이름</label>
              <input type="text" id="name" v-model="editingResume.name" required>
            </div>
            <div class="form-group">
              <label for="email">이메일</label>
              <input type="email" id="email" v-model="editingResume.email" required>
            </div>
            <div class="form-group">
              <label for="phone">전화번호</label>
              <input type="tel" id="phone" v-model="editingResume.phone" required>
            </div>
          </div>
        </div>
      </div>

      <!-- 학력 섹션 -->
      <div class="accordion-section">
        <div class="accordion-header" @click="toggleSection('education')">
          <i class="fas fa-graduation-cap"></i> 학력
          <i :class="['fas', openSections.education ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </div>
        <div class="accordion-content" :class="{ 'active': openSections.education }">
          <div v-if="openSections.education" class="accordion-body">
            <div v-for="(edu, index) in editingResume.education" :key="index" class="education-item">
              <div class="form-group">
                <label :for="'school'+index">학교명</label>
                <input type="text" :id="'school'+index" v-model="edu.school" required>
              </div>
              <div class="form-group">
                <label :for="'degree'+index">학위</label>
                <input type="text" :id="'degree'+index" v-model="edu.degree" required>
              </div>
              <div class="form-group">
                <label :for="'major'+index">전공</label>
                <input type="text" :id="'major'+index" v-model="edu.major" required>
              </div>
              <div class="form-group">
                <label :for="'graduationYear'+index">졸업년도</label>
                <input type="number" :id="'graduationYear'+index" v-model="edu.graduationYear" required>
              </div>
            </div>
            <button type="button" @click="addEducation" class="add-button">
              <i class="fas fa-plus"></i> 학력 추가
            </button>
          </div>
        </div>
      </div>

      <!-- 경력 섹션 -->
      <div class="accordion-section">
        <div class="accordion-header" @click="toggleSection('experience')">
          <i class="fas fa-briefcase"></i> 경력
          <i :class="['fas', openSections.experience ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </div>
        <div class="accordion-content" :class="{ 'active': openSections.experience }">
          <div v-if="openSections.experience" class="accordion-body">
            <div v-for="(exp, index) in editingResume.experience" :key="index" class="experience-item">
              <div class="form-group">
                <label :for="'company'+index">회사명</label>
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
                <textarea :id="'description'+index" v-model="exp.description" rows="3" required></textarea>
              </div>
            </div>
            <button type="button" @click="addExperience" class="add-button">
              <i class="fas fa-plus"></i> 경력 추가
            </button>
          </div>
        </div>
      </div>

      <!-- 기술 스택 섹션 -->
      <div class="accordion-section">
        <div class="accordion-header" @click="toggleSection('skills')">
          <i class="fas fa-code"></i> 기술 스택
          <i :class="['fas', openSections.skills ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </div>
        <div class="accordion-content" :class="{ 'active': openSections.skills }">
          <div v-if="openSections.skills" class="accordion-body">
            <div class="form-group">
              <label for="skills">기술 (쉼표로 구분)</label>
              <input type="text" id="skills" v-model="editingResume.skills">
            </div>
          </div>
        </div>
      </div>

      <!-- 자격증 섹션 -->
      <div class="accordion-section">
        <div class="accordion-header" @click="toggleSection('certificates')">
          <i class="fas fa-certificate"></i> 자격증
          <i :class="['fas', openSections.certificates ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </div>
        <div class="accordion-content" :class="{ 'active': openSections.certificates }">
          <div v-if="openSections.certificates" class="accordion-body">
            <div v-for="(cert, index) in editingResume.certificates" :key="index" class="certificate-item">
              <div class="form-group">
                <label :for="'certName'+index">자격증명</label>
                <input type="text" :id="'certName'+index" v-model="cert.name" required>
              </div>
              <div class="form-group">
                <label :for="'certDate'+index">취득일</label>
                <input type="date" :id="'certDate'+index" v-model="cert.date" required>
              </div>
            </div>
            <button type="button" @click="addCertificate" class="add-button">
              <i class="fas fa-plus"></i> 자격증 추가
            </button>
          </div>
        </div>
      </div>

      <!-- 자기소개서 섹션 -->
      <div class="accordion-section">
        <div class="accordion-header" @click="toggleSection('introduction')">
          <i class="fas fa-pen"></i> 자기소개서
          <i :class="['fas', openSections.introduction ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </div>
        <div class="accordion-content" :class="{ 'active': openSections.introduction }">
          <div v-if="openSections.introduction" class="accordion-body">
            <div class="form-group">
              <label for="introduction">자기소개</label>
              <textarea id="introduction" v-model="editingResume.introduction" rows="5" required></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="button-group">
        <button type="submit" class="save-button"><i class="fas fa-save"></i> 저장</button>
        <button type="button" @click="cancelEdit" class="cancel-button"><i class="fas fa-times"></i> 취소</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const editingResumeId = ref(null);
const editingResume = reactive({
  name: '',
  email: '',
  phone: '',
  education: [{ school: '', degree: '', major: '', graduationYear: null }],
  experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
  skills: '',
  certificates: [{ name: '', date: '' }],
  introduction: ''
});

const openSections = reactive({
  personalInfo: true,
  education: false,
  experience: false,
  skills: false,
  certificates: false,
  introduction: false
});

const toggleSection = (section) => {
  openSections[section] = !openSections[section];
};

const addEducation = () => {
  editingResume.education.push({ school: '', degree: '', major: '', graduationYear: null });
};

const addExperience = () => {
  editingResume.experience.push({ company: '', position: '', startDate: '', endDate: '', description: '' });
};

const addCertificate = () => {
  editingResume.certificates.push({ name: '', date: '' });
};

const saveResume = () => {
  // 이력서 저장 로직
  console.log('이력서 저장:', editingResume);
};

const cancelEdit = () => {
  // 편집 취소 로직
};
</script>

<style>
.resume-edit-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.resume-edit-container .page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.resume-edit-container .accordion-section {
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.resume-edit-container .accordion-header {
  background-color: #f5f5f5;
  padding: 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  transition: background-color 0.3s;
}

.resume-edit-container .accordion-header:hover {
  background-color: #e9e9e9;
}

.resume-edit-container .accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.resume-edit-container .accordion-content.active {
  max-height: 1000px; /* 충분히 큰 값으로 설정 */
}

.resume-edit-container .accordion-body {
  padding: 15px;
}

.resume-edit-container .form-group {
  margin-bottom: 15px;
}

.resume-edit-container label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.resume-edit-container input[type="text"],
.resume-edit-container input[type="email"],
.resume-edit-container input[type="tel"],
.resume-edit-container input[type="number"],
.resume-edit-container input[type="date"],
.resume-edit-container textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.resume-edit-container .add-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.resume-edit-container .add-button i {
  margin-right: 5px;
}

.resume-edit-container .button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.resume-edit-container .save-button,
.resume-edit-container .cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.resume-edit-container .save-button {
  background-color: #007bff;
  color: white;
}

.resume-edit-container .cancel-button {
  background-color: #dc3545;
  color: white;
}

.resume-edit-container .save-button i,
.resume-edit-container .cancel-button i {
  margin-right: 5px;
}
</style>