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
          <!-- 이력서 내용 표시 -->
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
    
    <!-- 이력서 폼 -->
    <form v-if="showForm" @submit.prevent="handleSubmit" class="resume-form-enlarged">
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
    const response = await axios.get('http://localhost:8090/api/mypage/resume')
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
      await axios.delete(`http://localhost:8090/api/mypage/resume/${id}`)
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

const handleSubmit = () => {
  if (validateForm()) {
    saveResume()
  } else {
    alert('모든 필수 필드를 작성해주세요.')
  }
}

const saveResume = async () => {
  try {
    const jsonData = JSON.stringify(formData)
    let response
    
    if (isEditing.value) {
      response = await axios.put(`http://localhost:8090/api/mypage/resume/${editingResumeId.value}`, jsonData, {
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      response = await axios.post('http://localhost:8090/api/mypage/resume', jsonData, {
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
      alert(isEditing.value ? '이력서가 성공적으로 수정되었습니다.' : '새 이력서가 성공적으로 등록되었습니다.')
    } else {
      throw new Error('Invalid server response')
    }
  } catch (error) {
    console.error('이력서 저장에 실패했습니다:', error.response?.data || error.message)
    alert(`이력서 저장에 실패했습니다: ${error.response?.data?.message || error.message}`)
  }
}

const cancelForm = () => {
  showForm.value = false
  resetForm()
}

const resetForm = () => {
  formData.title = ''
  formData.name = ''
  formData.email = ''
  formData.phone = ''
  formData.education = []
  formData.experience = []
  formData.skills = ''
  formData.certificates = []
  formData.introduction = ''
  isEditing.value = false
  editingResumeId.value = null
}

// 컴포넌트가 마운트될 때 이력서를 불러옴
onMounted(loadResumes)
</script>

<style scoped>
/* 기존 스타일 코드 동일하게 유지 */
.resume-management {
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
  color: #333;
  box-sizing: border-box;
}

.page-title {
  font-size: 32px;
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
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

.add-btn, .submit-btn {
  background-color: #28a745;
  color: white;
}

.add-btn:hover, .submit-btn:hover {
  background-color: #218838;
}

.cancel-btn, .remove-btn {
  background-color: #dc3545;
  color: white;
}

.cancel-btn:hover, .remove-btn:hover {
  background-color: #c82333;
}

.form-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .resume-form-enlarged {
    padding: 20px;
  }
  
  .section-header {
    padding: 10px 15px;
  }
  
  .section-content {
    padding: 15px;
  }
}
</style>
