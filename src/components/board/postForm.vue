<template>
  <div class="page-container">
    <Header />
    <div class="content-wrapper">
      <div class="post-form-container">
        <h2>게시글 작성</h2>
        <form @submit.prevent="submitPost">
          <div class="form-group">
            <label for="category">카테고리:</label>
            <select id="category" v-model="selectedCategory" required>
              <option value="" disabled>카테고리 선택</option>
              <option value="채용">채용</option>
              <option value="자격증">자격증</option>
            </select>
          </div>
          <div class="form-group">
            <label for="title">제목:</label>
            <input type="text" id="title" v-model="newPost.title" required />
          </div>
          <div class="form-group">
            <label for="content">내용:</label>
            <textarea id="content" v-model="newPost.content" required></textarea>
          </div>
          <button type="submit">게시글 등록</button>
        </form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '../header/header.vue';
import Footer from '../footer/footer.vue';

const newPost = ref({ title: '', content: '' });
const router = useRouter();
const route = useRoute();
const selectedCategory = ref(route.params.category || '');

const submitPost = () => {
  // 게시글 추가 로직 (예: API 호출)
  console.log('제출된 게시글:', newPost.value);
  console.log('선택된 카테고리:', selectedCategory.value);
  
  // 게시글 추가 후 게시판 목록으로 이동
  router.push({ name: 'boardList', params: { category: selectedCategory.value } });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #e3f2fd;
  font-family: 'Noto Sans KR', sans-serif;
}

.content-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
}

.post-form-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.post-form-container h2 {
  margin-bottom: 30px;
  color: #1565c0;
  font-size: 28px;
  text-align: center;
}

.form-group {
  margin-bottom: 25px;
}

.post-form-container label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
  font-size: 18px;
}

.post-form-container input,
.post-form-container textarea,
.post-form-container select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.post-form-container input:focus,
.post-form-container textarea:focus,
.post-form-container select:focus {
  outline: none;
  border-color: #1565c0;
}

.post-form-container select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23333' viewBox='0 0 12 12'%3E%3Cpath d='M10.293 3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L6 7.586l4.293-4.293z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  padding-right: 40px;
}

.post-form-container textarea {
  min-height: 300px;
  resize: vertical;
}

.post-form-container button {
  display: block;
  width: 200px;
  margin: 30px auto 0;
  padding: 15px 20px;
  border: none;
  border-radius: 30px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.post-form-container button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

@media (max-width: 768px) {
  .post-form-container {
    padding: 30px 20px;
  }

  .post-form-container h2 {
    font-size: 24px;
  }

  .post-form-container label {
    font-size: 16px;
  }

  .post-form-container input,
  .post-form-container textarea,
  .post-form-container select {
    font-size: 14px;
  }

  .post-form-container button {
    width: 100%;
    font-size: 16px;
  }
}
</style>