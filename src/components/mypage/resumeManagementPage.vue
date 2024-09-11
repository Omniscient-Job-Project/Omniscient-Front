<template>
  <div class="resume-management">
    <h1 class="page-title">
      <i class="fas fa-file-alt"></i> 이력서 관리
    </h1>
    
    <div v-if="!showForm" class="resume-list">
      <div v-for="resume in resumes" :key="resume.id" class="resume-item">
        <div class="resume-header" @click="toggleResume(resume.id)">
          <span>{{ resume.title }}</span>
          <i :class="resume.isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </div>
        <div v-show="resume.isOpen" class="resume-content">
          <div class="resume-view">
            <div class="resume-section">
              <h3>개인 정보</h3>
              <p><strong>이름:</strong> {{ resume.name }}</p>
              <p><strong>이메일:</strong> {{ resume.email }}</p>
              <p><strong>전화번호:</strong> {{ resume.phone }}</p>
            </div>
            <div class="resume-section">
              <h3>학력</h3>
              <div v-for="(edu, index) in resume.education" :key="index" class="resume-item">
                <p><strong>{{ edu.school }}</strong> - {{ edu.major }}</p>
                <p>{{ edu.degree }} ({{ edu.graduationYear }})</p>
              </div>
            </div>
            <div class="resume-section">
              <h3>경력</h3>
              <div v-for="(exp, index) in resume.experience" :key="index" class="resume-item">
                <p><strong>{{ exp.company }}</strong> - {{ exp.position }}</p>
                <p>{{ exp.startDate }} - {{ exp.endDate || '현재' }}</p>
                <p>{{ exp.description }}</p>
              </div>
            </div>
            <div class="resume-section">
              <h3>기술 스택</h3>
              <p>{{ resume.skills }}</p>
            </div>
            <div class="resume-section">
              <h3>자격증</h3>
              <div v-for="(cert, index) in resume.certificates" :key="index" class="resume-item">
                <p><strong>{{ cert.name }}</strong> ({{ cert.date }})</p>
              </div>
            </div>
            <div class="resume-section">
              <h3>자기소개서</h3>
              <p>{{ resume.introduction }}</p>
            </div>
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

    <button v-if="!showForm" @click="showAddForm" class="add-btn">
      <i class="fas fa-plus"></i> 새 이력서 작성
    </button>
    
    <form v-if="showForm" @submit.prevent="showConfirmModal" class="resume-form-enlarged">
      <h2>{{ isEditing ? '이력서 수정' : '새 이력서 작성' }}</h2>
      <div v-for="(section, index) in formSections" :key="index" class="form-section">
        <div class="section-header" @click="toggleSection(index)">
          <h3>{{ section.title }}</h3>
          <i :class="section.isOpen ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </div>
        <div v-show="section.isOpen" class="section-content">
          <div v-if="section.type === 'single'">
            <div v-for="field in section.fields" :key="field.name" class="form-group">
              <label :for="field.name">{{ field.label }}</label>
              <input v-if="field.type !== 'textarea'" 
                     :type="field.type" 
                     :id="field.name" 
                     :name="field.name"
                     v-model="formData[field.name]" 
                     :required="field.required">
              <textarea v-else 
                        :id="field.name" 
                        :name="field.name"
                        v-model="formData[field.name]" 
                        :required="field.required"
                        rows="5"></textarea>
            </div>
          </div>
          <div v-else-if="section.type === 'array'">
            <div v-for="(item, itemIndex) in formData[section.name]" :key="itemIndex" class="sub-form">
              <div v-for="field in section.fields" :key="field.name" class="form-group">
                <label :for="`${field.name}${itemIndex}`">{{ field.label }}</label>
                <input :type="field.type" 
                       :id="`${field.name}${itemIndex}`" 
                       :name="`${field.name}${itemIndex}`"
                       v-model="item[field.name]" 
                       :required="field.required">
              </div>
              <button type="button" @click="removeArrayItem(section.name, itemIndex)" class="remove-btn">항목 삭제</button>
            </div>
            <button type="button" @click="addArrayItem(section.name)" class="add-btn">{{ section.addButtonText }}</button>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="submit-btn">{{ isEditing ? '수정' : '추가' }}</button>
        <button type="button" @click="cancelForm" class="cancel-btn">취소</button>
      </div>
    </form>

    <!-- 확인 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3><i class="fas fa-question-circle"></i> 확인</h3>
        <p>{{ isEditing ? '이력서를 수정하시겠습니까?' : '새 이력서를 등록하시겠습니까?' }}</p>
        <div class="modal-actions">
          <button @click="confirmSave" class="confirm-button">
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
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

// 상태 변수 설정
const resumes = ref([])
const showForm = ref(false)
const isEditing = ref(false)
const editingResumeId = ref(null)
const showModal = ref(false)

// 폼 데이터 및 섹션 구조 정의
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
})

const formSections = reactive([
  {
    title: '개인 정보',
    type: 'single',
    isOpen: true,
    fields: [
      { name: 'title', label: '이력서 제목', type: 'text', required: true },
      { name: 'name', label: '이름', type: 'text', required: true },
      { name: 'email', label: '이메일', type: 'email', required: true },
      { name: 'phone', label: '전화번호', type: 'tel', required: true }
    ]
  },
  {
    title: '학력',
    name: 'education',
    type: 'array',
    isOpen: false,
    addButtonText: '학력 추가',
    fields: [
      { name: 'school', label: '학교', type: 'text', required: true },
      { name: 'major', label: '전공', type: 'text', required: true },
      { name: 'degree', label: '학위', type: 'text', required: true },
      { name: 'graduationYear', label: '졸업년도', type: 'number', required: true }
    ]
  },
  {
    title: '경력',
    name: 'experience',
    type: 'array',
    isOpen: false,
    addButtonText: '경력 추가',
    fields: [
      { name: 'company', label: '회사', type: 'text', required: true },
      { name: 'position', label: '직위', type: 'text', required: true },
      { name: 'startDate', label: '시작일', type: 'date', required: true },
      { name: 'endDate', label: '종료일', type: 'date', required: false },
      { name: 'description', label: '업무 설명', type: 'textarea', required: true }
    ]
  },
  {
    title: '기술 스택',
    type: 'single',
    isOpen: false,
    fields: [
      { name: 'skills', label: '기술 (쉼표로 구분)', type: 'text', required: false }
    ]
  },
  {
    title: '자격증',
    name: 'certificates',
    type: 'array',
    isOpen: false,
    addButtonText: '자격증 추가',
    fields: [
      { name: 'name', label: '자격증명', type: 'text', required: true },
      { name: 'date', label: '취득일', type: 'date', required: true }
    ]
  },
  {
    title: '자기소개서',
    type: 'single',
    isOpen: false,
    fields: [
      { name: 'introduction', label: '자기소개', type: 'textarea', required: true }
    ]
  }
])

// 비동기 작업을 위한 함수들
const loadResumes = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/v1/mypage/resume')
    resumes.value = response.data.map(resume => ({ ...resume, isOpen: false }))
  } catch (error) {
    console.error('이력서 목록을 불러오는데 실패했습니다:', error.response?.data || error.message)
    alert('이력서 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.')
  }
}

// 함수들 정의
const toggleResume = (id) => {
  const resume = resumes.value.find(r => r.id === id)
  if (resume) {
    resume.isOpen = !resume.isOpen
  }
}

const toggleSection = (index) => {
  formSections[index].isOpen = !formSections[index].isOpen
}

const addArrayItem = (sectionName) => {
  const newItem = {}
  const section = formSections.find(s => s.name === sectionName)
  section.fields.forEach(field => {
    newItem[field.name] = ''
  })
  formData[sectionName].push(newItem)
}

const removeArrayItem = (sectionName, index) => {
  formData[sectionName].splice(index, 1)
}

const showAddForm = () => {
  showForm.value = true
  isEditing.value = false
  resetForm()
  formSections.forEach(section => (section.isOpen = false))
  formSections[0].isOpen = true
}

const editResume = (resume) => {
  showForm.value = true
  isEditing.value = true
  editingResumeId.value = resume.id
  Object.assign(formData, JSON.parse(JSON.stringify(resume)))
}

const deleteResume = async (id) => {
  if (confirm('정말로 이 이력서를 삭제하시겠습니까?')) {
    try {
      await axios.delete(`http://localhost:8090/api/v1/mypage/resume/${id}`)
      resumes.value = resumes.value.filter(r => r.id !== id)
      alert('이력서가 성공적으로 삭제되었습니다.')
    } catch (error) {
      console.error('이력서 삭제에 실패했습니다:', error.response?.data || error.message)
      alert('이력서 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }
}

const validateForm = () => {
  const form = document.querySelector('form')
  const requiredInputs = form.querySelectorAll('input[required], textarea[required]')
  
  let isValid = true
  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      input.setCustomValidity('이 필드를 작성해주세요.')
      isValid = false
    } else {
      input.setCustomValidity('')
    }
  })

  return isValid
}

const showConfirmModal = () => {
  if (validateForm()) {
    showModal.value = true
  } else {
    alert('모든 필수 필드를 작성해주세요.')
  }
}

const closeModal = () => {
  showModal.value = false
}

const confirmSave = () => {
  saveResume()
  closeModal()
}

const saveResume = async () => {
  try {
    const jsonData = JSON.stringify(formData)
    let response
    
    if (isEditing.value) {
      response = await axios.put(`http://localhost:8090/api/v1/mypage/resume/${editingResumeId.value}`, jsonData, {
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      response = await axios.post('http://localhost:8090/api/v1/mypage/resume', jsonData, {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (response.data && response.data.id) {
      if (isEditing.value) {
        const index = resumes.value.findIndex(r => r.id === editingResumeId.value)
        if (index !== -1) {
          resumes.value[index] = { ...response.data, isOpen: false }
        }
      } else {
        resumes.value.push({ ...response.data, isOpen: false })
      }

      showForm.value = false
      resetForm()
    } else {
      throw new Error('Invalid server response')
    }
  } catch (error) {
    console.error('이력서 저장에 실패했습니다:', error.response?.data || error.message)
    alert(`이력서 저장에 실패했습니다: ${error.response?.data?.message || error.message}`)
  }
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (Array.isArray(formData[key])) {
      formData[key] = []
    } else {
      formData[key] = ''
    }
  })
  isEditing.value = false
  editingResumeId.value = null
}

// 컴포넌트가 마운트될 때 이력서를 불러옴
onMounted(loadResumes)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');

.resume-management {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 20px;
  font-family: 'Noto Sans KR', Arial, sans-serif;
  color: #333;
  box-sizing: border-box;
}

.page-title {
  font-size: 32px;
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
}

.resume-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resume-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.resume-header:hover {
  background-color: #2980b9;
}

.resume-content {
  padding: 20px;
}

.resume-view {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.resume-section {
  margin-bottom: 20px;
}

.resume-section h3 {
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.resume-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.resume-form-enlarged {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.resume-form-enlarged h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.form-section {
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.section-header:hover {
  background-color: #2980b9;
}

.section-content {
  padding: 20px;
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
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.sub-form {
  background-color: #f1f3f5;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.edit-btn, .delete-btn, .add-btn, .submit-btn, .cancel-btn, .remove-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
  font-size: 16px;
}

.edit-btn {
  background-color: #2ecc71;
  color: white;
}

.edit-btn:hover {
  background-color: #27ae60;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.add-btn, .submit-btn {
  background-color: #3498db;
  color: white;
}

.add-btn:hover, .submit-btn:hover {
  background-color: #2980b9;
}

.cancel-btn, .remove-btn {
  background-color: #95a5a6;
  color: white;
}

.cancel-btn:hover, .remove-btn:hover {
  background-color: #7f8c8d;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
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
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-content h3 {
  color: #3498db;
  font-size: 24px;
  margin-bottom: 20px;
}

.modal-content p {
  font-size: 18px;
  margin-bottom: 30px;
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
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-button {
  background-color: #2ecc71;
  color: white;
}

.confirm-button:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.cancel-button {
  background-color: #e74c3c;
  color: white;
}

.cancel-button:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 애니메이션 효과 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-content {
  animation: fadeIn 0.3s ease-out;
}

@media (max-width: 1024px) {
  .profile-content {
    flex-direction: column;
  }

  .profile-left, .profile-right {
    width: 100%;
  }

  .basic-info {
    height: auto;
  }

  .additional-info, .certificates {
    flex: 1;
  }

  .button-container {
    text-align: center;
  }
}

@media (max-width: 1024px) {
  .profile-content {
    flex-direction: column;
  }

  .profile-left, .profile-right {
    width: 100%;
  }

  .basic-info {
    height: auto;
  }

  .additional-info, .certificates {
    flex: 1;
  }

  .button-container {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .profile-section {
    padding: 20px;
  }

  .section-title {
    font-size: 24px;
  }

  .profile-details h2 {
    font-size: 28px;
  }

  .job-title {
    font-size: 20px;
  }

  .edit-button {
    width: 100%;
    justify-content: center;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-content h3 {
    font-size: 20px;
  }

  .modal-content p {
    font-size: 16px;
  }

  .confirm-button,
  .cancel-button {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>