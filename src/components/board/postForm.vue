<template>
    <div>
      <Header />
      <div class="post-form-container">
        <h2>게시글 작성</h2>
        <form @submit.prevent="submitPost">
          <label for="title">제목:</label>
          <input type="text" id="title" v-model="newPost.title" required />
          <label for="content">내용:</label>
          <textarea id="content" v-model="newPost.content" required></textarea>
          <button type="submit">제출</button>
        </form>
      </div>
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import Header from '../header/header.vue';
  import Footer from '../footer/footer.vue';
  
  // 새 게시글 데이터
  const newPost = ref({ title: '', content: '' });
  const router = useRouter();
  const route = useRoute();
  const selectedCategory = route.params.category;
  
  // 게시글 제출 처리
  const submitPost = () => {
    // 게시글 추가 로직 (예: API 호출)
    console.log('제출된 게시글:', newPost.value);
    router.push({ name: 'board', params: { category: selectedCategory } });
  };
  </script>
  
  <style scoped>
  .post-form-container {
    margin: 20px auto;
    padding: 20px;
    border-radius: 10px;
    max-width: 600px;
    background-color: #f9f9f9;
  }
  
  .post-form-container h2 {
    margin-bottom: 20px;
  }
  
  .post-form-container form {
    display: flex;
    flex-direction: column;
  }
  
  .post-form-container label {
    margin-top: 10px;
  }
  
  .post-form-container input,
  .post-form-container textarea {
    margin-top: 5px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
  }
  
  .post-form-container button {
    margin-top: 10px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .post-form-container button:hover {
    background-color: #0056b3;
  }
  </style>
  