<template>
  <div class="faq-form">
    <h1>FAQ 수정</h1>
    <form @submit.prevent="updateFaq">
      <div>
        <label for="question">질문:</label>
        <input v-model="faq.question" type="text" faqId="question" required />
      </div>
      <div>
        <label for="answer">답변:</label>
        <textarea v-model="faq.answer" faqId="answer" required></textarea>
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

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const router = useRouter();

const faq = ref({ question: '', answer: '' });

const fetchFaq = async () => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.get(`${API_URL}/api/v1/faqs/${route.params.faqId}`, {
      headers: {
        'Authorization': `Bearer ${token}`, 
      }
    });
    if (response.data) {
      faq.value = response.data;
    } else {
      console.error('FAQ not found');
      // 여기에서 사용자에게 알림을 줄 수 있습니다.
    }
  } catch (error) {
    console.error('Error fetching FAQ:', error.response ? error.response.data : error.message);
  }
};

const updateFaq = async () => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.put(`${API_URL}/api/v1/faqs/update/${route.params.faqId}`, faq.value, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    if (response.data) {
      router.push('/manager/faqList'); 
    } else {
      console.error('Failed to update FAQ');
      // 여기에서 사용자에게 알림을 줄 수 있습니다.
    }
  } catch (error) {
    console.error('Error updating FAQ:', error.response ? error.response.data : error.message);
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
