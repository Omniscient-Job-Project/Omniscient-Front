<template>
  <Header />
  <div class="notice-container">
    <p class="notice-text">
      📢 공지사항: 이 게시판은 자유롭게 글을 작성할 수 있는 공간입니다. 부적절한 게시글은 사전 경고 없이 삭제될 수 있습니다.
    </p>
  </div>
  <div class="board-container">
    <!-- 카테고리 버튼 -->
    <div class="action-buttons">
      <button 
        v-for="category in categories" 
        :key="category"
        :class="{ active: selectedCategory === category }"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
    </div>

    <!-- 게시판 목록 -->
    <div class="board-content">
      <h3>게시판: {{ selectedCategory }}</h3>
      <section class="post-list">
        <article v-for="post in filteredPosts" :key="post.id" class="post-item">
          <h4>{{ post.title }}</h4>
          <p>{{ post.content }}</p>
        </article>
      </section>
      <!-- 게시글 작성 버튼: '채용'과 '자격증' 카테고리에서만 표시 -->
      <div v-if="['채용', '자격증'].includes(selectedCategory)" class="post-actions">
        <button @click="goToPostForm">게시글 작성</button>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '../header/header.vue';
import Footer from '../footer/footer.vue';

const categories = ['전체글', '채용', '자격증'];
const router = useRouter();
const route = useRoute();
const selectedCategory = ref(route.params.category || '전체글');

const posts = ref([]);

const filteredPosts = computed(() => {
  return posts.value.filter(post => post.category === selectedCategory.value || selectedCategory.value === '전체글');
});

const selectCategory = (category) => {
  selectedCategory.value = category;
  router.push({ name: 'board', params: { category } });
};

const goToPostForm = () => {
  router.push({ name: 'postFormPage' });
};
</script>

<style scoped>
body {
  background-color: #E6F3FF;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.notice-container {
  background-color: #ffebcc; /* 공지사항 배경색 */
  padding: 10px 20px;
  margin-bottom: 20px;
  text-align: center;
  border-radius: 10px;
}

.notice-text {
  font-size: 1.1rem;
  font-weight: bold;
  color: #ff6b00;
}

.board-container {
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 1000px;
  background-color: #ffffff;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.action-buttons button {
  background: #007bff;
  color: #fff;
  padding: 15px 25px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 5px;
  border: none;
}

.action-buttons button.active,
.action-buttons button:hover {
  background: #0056b3;
}

.board-content {
  padding: 20px;
  border-top: 1px solid #ddd;
  background-color: #fff;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.post-item {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  background-color: #f9f9f9;
}

.post-item h4 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.post-item p {
  font-size: 1rem;
}

.post-actions {
  margin-top: 20px;
}

.post-actions button {
  background: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s;
}

.post-actions button:hover {
  background: #0056b3;
}

footer {
  background-color: #f1f1f1;
  padding: 10px;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
