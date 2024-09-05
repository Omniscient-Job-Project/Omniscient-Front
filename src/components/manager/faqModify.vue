<template>
  <div>
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
    <router-link to="/faq/list">돌아가기</router-link>
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
    const response = await axios.get(`/api/faqs/${route.params.id}`);
    faq.value = response.data;
  } catch (error) {
    console.error('Error fetching FAQ:', error);
  }
};

const updateFaq = async () => {
  try {
    await axios.put(`/api/faqs/${route.params.id}`, faq.value);
    router.push('/faq/list');
  } catch (error) {
    console.error('Error updating FAQ:', error);
  }
};

onMounted(fetchFaq);
</script>

<style scoped>
/* Add your styles here */
</style>
