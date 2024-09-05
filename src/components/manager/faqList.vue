<template>
    <div>
      <h1>FAQ 목록</h1>
      <ul>
        <li v-for="faq in faqs" :key="faq.id" class="faq-item">
          <div>
            <strong>{{ faq.question }}</strong>
            <p>{{ faq.answer }}</p>
          </div>
          <div>
            <button @click="editFaq(faq.id)">수정</button>
            <button @click="deleteFaq(faq.id)">삭제</button>
          </div>
        </li>
      </ul>
      <router-link to="/faq/post">FAQ 등록하기</router-link>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  const faqs = ref([]);
  const router = useRouter();
  
  const fetchFaqs = async () => {
    try {
      const response = await axios.get('/api/faqs');
      faqs.value = response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };
  
  const editFaq = (id) => {
    router.push({ name: 'faqModify', params: { id } });
  };
  
  const deleteFaq = async (id) => {
    try {
      await axios.delete(`/api/faqs/${id}`);
      fetchFaqs(); // Refresh the list
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };
  
  onMounted(fetchFaqs);
  </script>
  
  <style scoped>
  .faq-item {
    margin-bottom: 1rem;
  }
  button {
    margin-right: 0.5rem;
  }
  </style>
  