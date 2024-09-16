<template>
  <div class="resume-form-container">
    <h2 class="form-title">이력서 등록</h2>
    <form @submit.prevent="submitResume" class="resume-form">
      <!-- 기본 정보 -->
      <div class="form-group">
        <label for="title">이력서 제목</label>
        <input type="text" id="title" v-model="resumeData.title" required>
      </div>
      
      <!-- 학력 정보 -->
      <div class="form-section">
        <h3>학력 정보</h3>
        <div v-for="(edu, index) in resumeData.education" :key="index" class="education-item">
          <input v-model="edu.school" placeholder="학교명" required>
          <input v-model="edu.major" placeholder="전공" required>
          <input v-model="edu.degree" placeholder="학위" required>
          <input v-model="edu.graduationYear" placeholder="졸업년도" required>
          <button type="button" @click="removeEducation(index)" class="remove-btn">삭제</button>
        </div>
        <button type="button" @click="addEducation" class="add-btn">학력 추가</button>
      </div>

      <!-- 경력 정보 -->
      <div class="form-section">
        <h3>경력 정보</h3>
        <div v-for="(exp, index) in resumeData.experience" :key="index" class="experience-item">
          <input v-model="exp.company" placeholder="회사명" required>
          <input v-model="exp.position" placeholder="직위" required>
          <input v-model="exp.startDate" type="date" required>
          <input v-model="exp.endDate" type="date">
          <textarea v-model="exp.description" placeholder="업무 설명" required></textarea>
          <button type="button" @click="removeExperience(index)" class="remove-btn">삭제</button>
        </div>
        <button type="button" @click="addExperience" class="add-btn">경력 추가</button>
      </div>

      <!-- 기술 스택 -->
      <div class="form-group">
        <label for="skills">기술 스택 (쉼표로 구분)</label>
        <input type="text" id="skills" v-model="resumeData.skills">
      </div>

      <!-- 자격증 -->
      <div class="form-section">
        <h3>자격증</h3>
        <div v-for="(cert, index) in resumeData.certificates" :key="index" class="certificate-item">
          <input v-model="cert.name" placeholder="자격증명" required>
          <input v-model="cert.date" type="date" required>
          <button type="button" @click="removeCertificate(index)" class="remove-btn">삭제</button>
        </div>
        <button type="button" @click="addCertificate" class="add-btn">자격증 추가</button>
      </div>

      <!-- 자기소개 -->
      <div class="form-group">
        <label for="introduction">자기소개</label>
        <textarea id="introduction" v-model="resumeData.introduction" rows="5" required></textarea>
      </div>

      <button type="submit" class="submit-btn">이력서 등록</button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const resumeData = reactive({
  title: '',
  education: [{ school: '', major: '', degree: '', graduationYear: '' }],
  experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
  skills: '',
  certificates: [{ name: '', date: '' }],
  introduction: ''
});

const addEducation = () => {
  resumeData.education.push({ school: '', major: '', degree: '', graduationYear: '' });
};

const removeEducation = (index) => {
  resumeData.education.splice(index, 1);
};

const addExperience = () => {
  resumeData.experience.push({ company: '', position: '', startDate: '', endDate: '', description: '' });
};

const removeExperience = (index) => {
  resumeData.experience.splice(index, 1);
};

const addCertificate = () => {
  resumeData.certificates.push({ name: '', date: '' });
};

const removeCertificate = (index) => {
  resumeData.certificates.splice(index, 1);
};

const submitResume = async () => {
  try {
    const formattedData = {
      ...resumeData,
      skills: resumeData.skills.split(',').map(skill => skill.trim())
    };
    const response = await axios.post(`${API_URL}/api/v1/mypage/resumes`, formattedData);
    console.log('Resume submitted successfully:', response.data);
    alert('이력서가 성공적으로 등록되었습니다.');
    // 여기에 성공 후 처리 로직 (예: 페이지 리다이렉트) 추가
  } catch (error) {
    console.error('Error submitting resumes:', error);
    alert('이력서 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};
</script>

<style scoped>
.resume-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-title {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.resume-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-section {
  background-color: #fff;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.form-section h3 {
  margin-top: 0;
  color: #444;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  resize: vertical;
}

.education-item, .experience-item, .certificate-item {
  display: grid;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.add-btn, .remove-btn, .submit-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
}

.remove-btn {
  background-color: #f44336;
  color: white;
}

.submit-btn {
  background-color: #2196F3;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  align-self: center;
}

.add-btn:hover, .submit-btn:hover {
  opacity: 0.9;
}

.remove-btn:hover {
  background-color: #d32f2f;
}

@media (max-width: 600px) {
  .resume-form-container {
    padding: 10px;
  }

  .education-item, .experience-item, .certificate-item {
    grid-template-columns: 1fr;
  }
}
</style>