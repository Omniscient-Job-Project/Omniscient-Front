<template>
  <div class="faq-form">
    <h1>FAQ 등록</h1>
    <form @submit.prevent="createFaq">
      <div>
        <label for="question">질문:</label>
        <input v-model="newFaq.question" type="text" id="question" required />
      </div>
      <div>
        <label for="answer">답변:</label>
        <textarea v-model="newFaq.answer" id="answer" required></textarea>
      </div>
      <!-- 버튼들을 감싸는 div 추가 -->
      <div class="button-group">
        <button type="submit">등록</button>
        <router-link to="/manager/faqList" class="link-button">돌아가기</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const API_URL = import.meta.env.VITE_API_URL;
const newFaq = ref({ question: '', answer: '' });
const router = useRouter();

const createFaq = async () => {
  try {
    // API 요청 URL 확인
    const response = await axios.post(`${API_URL}/api/v1/faqs`, newFaq.value);
    console.log('FAQ created:', response.data);
    // 리스트 페이지로 리다이렉트
    router.push('/manager/faqList');
  } catch (error) {
    console.error('Error creating FAQ:', error.response?.data || error.message);
  }
};
</script>

<style scoped>
.faq-form {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* 버튼들을 오른쪽 정렬하기 위한 스타일 */
.button-group {
  display: flex;
  justify-content: flex-end; /* 버튼을 오른쪽으로 정렬 */
  gap: 10px; /* 버튼 간격을 추가 */
}

button {
  padding: 10px 15px;
  background-color: #AFF6C3;
  color: #030303;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #A1D4B4; /* 버튼 hover 색상 */
}

.link-button {
  padding: 10px 20px;
  background-color: #AFF6C3;
  color: #050505;
  text-decoration: none;
  border-radius: 4px;  
}

.link-button:hover {
  background-color: #A1D4B4; /* 링크 버튼 hover 색상 */
}
</style>
