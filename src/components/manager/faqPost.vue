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
      <button type="submit">등록</button>
    </form>
    <router-link to="/manager/faq/faqList" class="link-button">돌아가기</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const newFaq = ref({ question: '', answer: '' });
const router = useRouter();

const createFaq = async () => {
  try {
    // API 요청 URL 확인
    const response = await axios.post('http://localhost:8090/api/v1/faqs', newFaq.value);
    console.log('FAQ created:', response.data);
    // 리스트 페이지로 리다이렉트
    router.push('/manager/faq/faqList');
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

button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.link-button {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
}

.link-button:hover {
  background-color: #0056b3;
}
</style>
