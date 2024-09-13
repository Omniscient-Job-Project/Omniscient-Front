<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const faqs = ref([]);
const selectedFaqId = ref(null); // To track the currently selected FAQ

const fetchFaqs = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/v1/faqs');
    faqs.value = response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
  }
};

// Computed property to get the top 6 FAQs
const displayedFaqs = computed(() => faqs.value.slice(0, 6));

// Toggle the selected FAQ
const toggleAnswer = (id) => {
  selectedFaqId.value = selectedFaqId.value === id ? null : id;
};

onMounted(fetchFaqs);
</script>
<!-- 수정 -->
<template>
  <div class="main-content">
    <div class="notice-board">
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
          <template v-for="(faq, index) in displayedFaqs" :key="faq.id">
            <tr>
              <td>{{ index + 1 }}</td>
              <td @click="toggleAnswer(faq.id)" class="clickable-title">
                {{ faq.question }}
              </td>
              <td>{{ faq.views }}</td>
            </tr>
            <!-- Display the answer when an FAQ is selected -->
            <tr v-if="selectedFaqId === faq.id">
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
  height: 70vh;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.main-content {
  flex: 1;
  padding: 40px;
  margin-left: 20px;
  background-color: white;
  max-width: 1000px;
  margin-top: 10px;
}

.notice-board {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  text-align: center;
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

/* 번호 칸의 너비를 조정 */
th:first-child, td:first-child {
  width: 60px; /* 번호 칸의 너비 */
}

/* 조회수 칸의 너비를 조정 */
th:last-child, td:last-child {
  width: 100px; /* 조회수 칸의 너비 */
}

/* 클릭 가능한 제목 스타일 */
.clickable-title {
  cursor: pointer;
  color: #3498db;
  text-decoration: underline;
}

.clickable-title:hover {
  color: #2980b9;
}

/* 답변 스타일 */
.answer {
  background-color: #f9f9f9;
  padding: 10px;
  border-top: 1px solid #ddd;
}

tbody tr {
  transition: background-color 0.3s, box-shadow 0.3s;
}

tbody tr:hover {
  background-color: #e3f2fd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
}
</style>
