<template>
  <div class="faq-list">
    <h1>FAQ 목록</h1>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>질문</th>
            <th>답변</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="faq in faqs.slice(0, 6)" :key="faq.id">
            <td>{{ faq.question }}</td>
            <td>{{ faq.answer }}</td>
            <td>
              <button @click="editFaq(faq.id)">수정</button>
              <button @click="deleteFaq(faq.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const API_URL = import.meta.env.VITE_API_URL;
const faqs = ref([]);
const router = useRouter();

const fetchFaqs = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/faqs`);
    faqs.value = response.data;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
  }
};

const editFaq = (id) => {
  router.push({ name: 'ManagerFaqModify', params: { id } });
};

const deleteFaq = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/api/v1/faqs/delete/${id}`);
    if (response.data) { // 삭제 성공 시
      fetchFaqs(); // Refresh the list
    }
  } catch (error) {
    console.error('Error deleting FAQ:', error);
  }
};

onMounted(fetchFaqs);
</script>

<style scoped>
.faq-list {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
}

.table-container {
  max-height: 300px; /* 테이블 높이 제한 */
  overflow-y: auto; /* 수직 스크롤 추가 */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}

button {
  margin-right: 5px;
  padding: 5px 10px;
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
