<template>
  <div class="resume-management">
    <h1 class="page-title" v-if="!isEditing"><i class="fas fa-file-alt"></i> 이력서 관리</h1>
    <div v-if="!isEditing" class="action-buttons">
      <button class="action-button create-resume" @click="createNewResume">
        <i class="fas fa-plus"></i> 새 이력서 작성
      </button>
    </div>
    <div v-if="!isEditing" class="resume-list">
      <div class="resume-item" v-for="resume in resumes" :key="resume.id">
        <div class="resume-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <div class="resume-details">
          <h3>{{ resume.title }}</h3>
          <p><i class="fas fa-calendar-alt"></i> 최종 수정일: {{ resume.lastModified }}</p>
          <p><i class="fas fa-eye"></i> 조회수: {{ resume.views }}</p>
        </div>
        <div class="resume-actions">
          <button class="resume-action edit" @click="editResume(resume)"><i class="fas fa-edit"></i> 수정</button>
          <button class="resume-action delete" @click="deleteResume(resume.id)"><i class="fas fa-trash-alt"></i> 삭제</button>
        </div>
      </div>
    </div>
    
    <!-- 이력서 편집 폼 -->
    <div v-if="isEditing" class="resume-edit">
      <h1 class="page-title"><i class="fas fa-edit"></i> {{ editingResumeId ? '이력서 수정' : '새 이력서 작성' }}</h1>
      <form @submit.prevent="saveResume">
        <section class="resume-section">
          <h2><i class="fas fa-user"></i> 개인 정보</h2>
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
        </section>

        <section class="resume-section">
          <h2><i class="fas fa-graduation-cap"></i> 학력</h2>
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
          <button type="button" @click="addEducation" class="add-button"><i class="fas fa-plus"></i> 학력 추가</button>
        </section>

        <section class="resume-section">
          <h2><i class="fas fa-briefcase"></i> 경력</h2>
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
          <button type="button" @click="addExperience" class="add-button"><i class="fas fa-plus"></i> 경력 추가</button>
        </section>

        <section class="resume-section">
          <h2><i class="fas fa-code"></i> 기술 스택</h2>
          <div class="form-group">
            <label for="skills">기술 (쉼표로 구분)</label>
            <input type="text" id="skills" v-model="editingResume.skills">
          </div>
        </section>

        <section class="resume-section">
          <h2><i class="fas fa-certificate"></i> 자격증</h2>
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
          <button type="button" @click="addCertificate" class="add-button"><i class="fas fa-plus"></i> 자격증 추가</button>
        </section>

        <section class="resume-section">
          <h2><i class="fas fa-pen"></i> 자기소개서</h2>
          <div class="form-group">
            <label for="introduction">자기소개</label>
            <textarea id="introduction" v-model="editingResume.introduction" rows="5" required></textarea>
          </div>
        </section>

        <div class="button-group">
          <button type="submit" class="save-button"><i class="fas fa-save"></i> 저장</button>
          <button type="button" @click="cancelEdit" class="cancel-button"><i class="fas fa-times"></i> 취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const isEditing = ref(false);
const editingResumeId = ref(null);
const resumes = ref([
  { id: 1, title: '소프트웨어 개발자 이력서', lastModified: '2023-05-15', views: 12 },
  { id: 2, title: '프론트엔드 개발자 이력서', lastModified: '2023-05-10', views: 8 },
  { id: 3, title: '백엔드 개발자 이력서', lastModified: '2023-05-05', views: 15 },
]);

const emptyResume = {
  name: '',
  email: '',
  phone: '',
  education: [{ school: '', degree: '', major: '', graduationYear: null }],
  experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
  skills: '',
  certificates: [{ name: '', date: '' }],
  introduction: ''
};

const editingResume = reactive({ ...emptyResume });

const createNewResume = () => {
  isEditing.value = true;
  editingResumeId.value = null;
  Object.assign(editingResume, emptyResume);
};

const editResume = (resume) => {
  isEditing.value = true;
  editingResumeId.value = resume.id;
  // 여기서 실제로는 서버에서 이력서 데이터를 가져와야 합니다.
  // 지금은 간단히 빈 이력서 데이터로 채웁니다.
  Object.assign(editingResume, emptyResume);
};

const deleteResume = (id) => {
  // 여기에 이력서 삭제 로직을 구현합니다.
  resumes.value = resumes.value.filter(resume => resume.id !== id);
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
  // 여기에 이력서 저장 로직을 구현합니다.
  console.log('이력서 저장:', editingResume);
  isEditing.value = false;
  editingResumeId.value = null;
};

const cancelEdit = () => {
  isEditing.value = false;
  editingResumeId.value = null;
};
</script>

<style scoped>
.resume-management {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
}

.page-title i {
  margin-right: 10px;
  color: #007bff;
}

.action-buttons {
  margin-bottom: 20px;
}

.action-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.action-button i {
  margin-right: 8px;
}

.resume-list {
  display: grid;
  gap: 20px;
}

.resume-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.resume-icon {
  font-size: 40px;
  color: #007bff;
  margin-right: 20px;
}

.resume-details {
  flex-grow: 1;
}

.resume-details h3 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #333;
}

.resume-details p {
  margin: 5px 0;
  color: #666;
}

.resume-actions {
  display: flex;
  gap: 10px;
}

.resume-action {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 16px;
}

.resume-action:hover {
  text-decoration: underline;
}

.resume-edit {
  background: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.resume-section {
  margin-bottom: 30px;
}

.resume-section h2 {
  font-size: 22px;
  color: #007bff;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="number"],
input[type="date"],
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.add-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.save-button, .cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.save-button {
  background-color: #007bff;
  color: white;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

@media (max-width: 768px) {
  .resume-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .resume-icon {
    margin-bottom: 10px;
  }

  .resume-actions {
    margin-top: 10px;
  }

  .button-group {
    flex-direction: column;
  }

  .save-button, .cancel-button {
    width: 100%;
  }
}
</style>
