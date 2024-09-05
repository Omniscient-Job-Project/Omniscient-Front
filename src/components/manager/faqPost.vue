<template>
    <div>
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
      <router-link to="/faq/list">돌아가기</router-link>
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
      await axios.post('/api/faqs', newFaq.value);
      router.push('/faq/list');
    } catch (error) {
      console.error('Error creating FAQ:', error);
    }
  };
  </script>
  