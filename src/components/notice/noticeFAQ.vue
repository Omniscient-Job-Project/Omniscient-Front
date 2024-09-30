<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const faqs = ref([]);
const selectedFaqId = ref(null); // To track the currently selected FAQ
const incrementing = ref(false); // Track if a view increment is in progress

const fetchFaqs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/faqs`);
    faqs.value = response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
  }
};

// Computed property to get the top 6 FAQs
const displayedFaqs = computed(() => faqs.value.slice(0, 6));

// Toggle the selected FAQ
const toggleAnswer = async (faqId) => {
  if (selectedFaqId.value === faqId) {
    // If the same FAQ is clicked again, close it
    selectedFaqId.value = null;
  } else {
    // If a different FAQ is clicked, open it and increment view count
    selectedFaqId.value = faqId;
    await incrementViewCount(faqId); // Increment the view count when the answer is opened
  }
};

const incrementViewCount = async (faqId) => {
  console.log(`Incrementing views for faqId: ${faqId}`);
  try {
    // Check if an update is already in progress
    if (incrementing.value) return;
    incrementing.value = true;
    
    // Update the view count on the server
    await axios.put(`${API_URL}/api/v1/faqs/views/${faqId}`);

    // Update the local faq's view count
    const faq = faqs.value.find(faq => faq.faqId === faqId);
    if (faq) {
      faq.faqViews += 1;
    }
  } catch (error) {
    console.error('조회수를 업데이트하는 중 오류가 발생했습니다!', error);
  } finally {
    incrementing.value = false; // Reset the status after processing
  }
};

onMounted(fetchFaqs);
</script>

<template>
  <div class="container">
    <div class="board">
      <h2>자주 묻는 질문 (FAQ)</h2>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(faq, index) in displayedFaqs" :key="faq.faqId">
            <tr>
              <td>{{ index + 1 }}</td>
              <td @click="toggleAnswer(faq.faqId)" class="clickable-title">
                {{ faq.question }}
              </td>
              <td>{{ faq.faqViews }}</td>
            </tr>
            <tr v-if="selectedFaqId === faq.faqId">
              <td colspan="3" class="answer">
                {{ faq.answer }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  margin: 0 auto;
  max-width: 1200px;
  min-height: 70vh;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.board {
  width: 100%;
  font-family: Arial, sans-serif;
  background-color: transparent;
  border-radius: 8px;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #495057;
}

th:first-child, td:first-child {
  width: 60px;
}

th:last-child, td:last-child {
  width: 100px;
}

.clickable-title {
  cursor: pointer;
  color: #007bff;
}

.clickable-title:hover {
  text-decoration: underline;
}

.answer {
  background-color: #f8f9fa;
  padding: 15px;
  text-align: left;
}

tbody tr {
  transition: background-color 0.3s, box-shadow 0.3s;
}

tbody tr:hover {
  background-color: #f1f3f5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>