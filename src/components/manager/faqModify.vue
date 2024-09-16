<template>
  <div class="faq-form">
    <h1>FAQ 수정</h1>
    <form @submit.prevent="updateFaq">
      <div>
        <label for="question">질문:</label>
        <input v-model="faq.question" type="text" id="question" required />
      </div>
      <div>
        <label for="answer">답변:</label>
        <textarea v-model="faq.answer" id="answer" required></textarea>
      </div>
      <button type="submit">저장</button>
    </form>
    <router-link to="/manager/faqlist" class="link-button">돌아가기</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const faq = ref({ question: '', answer: '' });

const fetchFaq = async () => {
  try {
    // const response = await axios.get(`http://localhost:8090/api/v1/faqs/${route.params.id}`);
    const response = await axios.get(`https://192.168.0.150:8090/api/v1/faqs/${route.params.id}`);
    faq.value = response.data;
  } catch (error) {
    console.error('Error fetching FAQ:', error);
  }
};

const updateFaq = async () => {
  try {
    // const response = await axios.put(`http://localhost:8090/api/v1/faqs/update/${route.params.id}`, faq.value);
    const response = await axios.put(`https://192.168.0.150:8090/api/v1/faqs/update/${route.params.id}`, faq.value);
    console.log('FAQ updated:', response.data);
    router.push('/manager/faqList'); // 경로 확인
  } catch (error) {
    console.error('Error updating FAQ:', error);
  }
};



onMounted(fetchFaq);
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
  background-color: #AFF6C3;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #AFF6C3;
}

.link-button {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #AFF6C3;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
}

.link-button:hover {
  background-color: #AFF6C3;
}
</style>
