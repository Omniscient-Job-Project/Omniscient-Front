<template>
  <div class="resume-management">
    <!-- 이력서 관리 페이지 제목 (편집 중이 아닐 때만 표시) -->
    <h1 class="page-title" v-if="!isEditing"><i class="fas fa-file-alt"></i> 이력서 관리</h1>

    <!-- 새 이력서 작성 버튼 (편집 중이 아닐 때만 표시) -->
    <div v-if="!isEditing" class="action-buttons">
      <button class="action-button create-resume" @click="createNewResume">
        <i class="fas fa-plus"></i> 새 이력서 작성
      </button>
    </div>

    <!-- 이력서 목록 (편집 중이 아닐 때만 표시) -->
    <div v-if="!isEditing" class="resume-list">
      <div class="resume-item" v-for="resume in resumes" :key="resume.id">
        <!-- 이력서 아이콘 -->
        <div class="resume-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <!-- 이력서 제목 및 정보 -->
        <div class="resume-details">
          <h3>{{ resume.title }}</h3>
          <p><i class="fas fa-calendar-alt"></i> 최종 수정일: {{ resume.lastModified }}</p>
          <p><i class="fas fa-eye"></i> 조회수: {{ resume.views }}</p>
        </div>
        <!-- 이력서 수정 및 삭제 버튼 -->
        <div class="resume-actions">
          <button class="resume-action edit" @click="editResume(resume)"><i class="fas fa-edit"></i> 수정</button>
          <button class="resume-action delete" @click="deleteResume(resume.id)"><i class="fas fa-trash-alt"></i> 삭제</button>
        </div>
      </div>
    </div>
    
    <!-- 이력서 편집 폼 (편집 중일 때만 표시) -->
    <div v-if="isEditing" class="resume-edit">
      <h1 class="page-title"><i class="fas fa-edit"></i> {{ editingResumeId ? '이력서 수정' : '새 이력서 작성' }}</h1>
      <form @submit.prevent="saveResume">
        <!-- 개인 정보 섹션 -->
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

        <!-- 학력 섹션 -->
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
          <!-- 학력 추가 버튼 -->
          <button type="button" @click="addEducation" class="add-button"><i class="fas fa-plus"></i> 학력 추가</button>
        </section>

        <!-- 경력 섹션 -->
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
          <!-- 경력 추가 버튼 -->
          <button type="button" @click="addExperience" class="add-button"><i class="fas fa-plus"></i> 경력 추가</button>
        </section>

        <!-- 기술 스택 섹션 -->
        <section class="resume-section">
          <h2><i class="fas fa-code"></i> 기술 스택</h2>
          <div class="form-group">
            <label for="skills">기술 (쉼표로 구분)</label>
            <input type="text" id="skills" v-model="editingResume.skills">
          </div>
        </section>

        <!-- 자격증 섹션 -->
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
          <!-- 자격증 추가 버튼 -->
          <button type="button" @click="addCertificate" class="add-button"><i class="fas fa-plus"></i> 자격증 추가</button>
        </section>

        <!-- 자기소개서 섹션 -->
        <section class="resume-section">
          <h2><i class="fas fa-pen"></i> 자기소개서</h2>
          <div class="form-group">
            <label for="introduction">자기소개</label>
            <textarea id="introduction" v-model="editingResume.introduction" rows="5" required></textarea>
          </div>
        </section>

        <!-- 저장 및 취소 버튼 그룹 -->
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

// 상태 관리 변수
const isEditing = ref(false);  // 편집 모드 여부
const editingResumeId = ref(null);  // 편집 중인 이력서 ID
const resumes = ref([
  { id: 1, title: '소프트웨어 개발자 이력서', lastModified: '2023-05-15', views: 12 },
  { id: 2, title: '프론트엔드 개발자 이력서', lastModified: '2023-05-10', views: 8 },
  { id: 3, title: '백엔드 개발자 이력서', lastModified: '2023-05-05', views: 10 }
]);  // 이력서 목록

// 이력서 편집 양식 데이터
const editingResume = reactive({
  name: '',
  email: '',
  phone: '',
  education: [],
  experience: [],
  skills: '',
  certificates: [],
  introduction: ''
});

// 새 이력서 작성 함수
function createNewResume() {
  isEditing.value = true;
  editingResumeId.value = null;
  resetForm();
}

// 이력서 수정 함수
function editResume(resume) {
  isEditing.value = true;
  editingResumeId.value = resume.id;
  Object.assign(editingResume, {
    name: '홍길동',  // 실제로는 해당 resume의 데이터를 불러와서 채움
    email: 'hong@example.com',
    phone: '010-1234-5678',
    education: [
      { school: '서울대학교', degree: '학사', major: '컴퓨터공학', graduationYear: 2020 }
    ],
    experience: [
      { company: 'ABC Corp', position: '소프트웨어 엔지니어', startDate: '2020-01-01', endDate: '2022-12-31', description: '백엔드 개발 담당' }
    ],
    skills: 'JavaScript, Vue.js, Node.js',
    certificates: [
      { name: '정보처리기사', date: '2019-11-30' }
    ],
    introduction: '열정적인 개발자 홍길동입니다.'
  });
}

// 이력서 저장 함수
function saveResume() {
  if (editingResumeId.value) {
    // 기존 이력서 업데이트
    const index = resumes.value.findIndex(r => r.id === editingResumeId.value);
    if (index !== -1) {
      resumes.value[index] = {
        id: editingResumeId.value,
        title: editingResume.name + '의 이력서',
        lastModified: new Date().toISOString().slice(0, 10),
        views: resumes.value[index].views
      };
    }
  } else {
    // 새 이력서 저장
    resumes.value.push({
      id: resumes.value.length + 1,
      title: editingResume.name + '의 이력서',
      lastModified: new Date().toISOString().slice(0, 10),
      views: 0
    });
  }
  isEditing.value = false;
}

// 이력서 삭제 함수
function deleteResume(id) {
  const index = resumes.value.findIndex(r => r.id === id);
  if (index !== -1) {
    resumes.value.splice(index, 1);
  }
}

// 편집 취소 함수
function cancelEdit() {
  isEditing.value = false;
}

// 폼 리셋 함수
function resetForm() {
  Object.assign(editingResume, {
    name: '',
    email: '',
    phone: '',
    education: [],
    experience: [],
    skills: '',
    certificates: [],
    introduction: ''
  });
}

// 학력 추가 함수
function addEducation() {
  editingResume.education.push({ school: '', degree: '', major: '', graduationYear: '' });
}

// 경력 추가 함수
function addExperience() {
  editingResume.experience.push({ company: '', position: '', startDate: '', endDate: '', description: '' });
}

// 자격증 추가 함수
function addCertificate() {
  editingResume.certificates.push({ name: '', date: '' });
}
</script>

<style scoped>
/* 전역 스타일 */
.resume-management {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* 페이지 제목 스타일 */
.page-title {
  font-size: 24px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 액션 버튼들 스타일 */
.action-buttons {
  margin-bottom: 20px;
}

.action-button {
  background-color: #28a745;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-button.create-resume {
  background-color: #007bff;
}

/* 이력서 목록 스타일 */
.resume-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.resume-item {
  display: flex;
  gap: 15px;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.resume-icon {
  font-size: 40px;
  color: #007bff;
}

.resume-details h3 {
  margin: 0;
  font-size: 18px;
}

.resume-details p {
  margin: 5px 0;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
}

.resume-actions {
  margin-left: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resume-action {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 5px;
}

.resume-action.edit {
  background-color: #ffc107;
}

.resume-action.delete {
  background-color: #dc3545;
}

/* 이력서 편집 폼 스타일 */
.resume-edit {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.resume-section {
  margin-bottom: 20px;
}

.resume-section h2 {
  font-size: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-button {
  background-color: #007bff;
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.save-button {
  background-color: #28a745;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.cancel-button {
  background-color: #6c757d;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
