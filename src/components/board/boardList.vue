<template>
  <div class="page-container">
    <Header />
    <div class="board-container">
      <div class="notice-container">
        <p class="notice-text">
          📢 공지사항: 이 게시판은 자유롭게 글을 작성할 수 있는 공간입니다. 부적절한 게시글은 사전 경고 없이 삭제될 수 있습니다.
        </p>
      </div>
      
      <!-- 카테고리 버튼 -->
      <div class="action-buttons">
        <button 
          v-for="category in categories" 
          :key="category"
          :class="{ active: selectedCategory === category }"
          @click="selectCategory(category)"
        >
          <i :class="getCategoryIcon(category)"></i> {{ getCategoryDisplayName(category) }}
        </button>
      </div>

      <!-- 게시판 목록 -->
      <div class="board-content">
        <h3><i class="fas fa-list"></i> {{ getCategoryDisplayName(selectedCategory) }}</h3>
        <div class="post-grid">
          <div v-for="post in paginatedPosts" :key="post.id" class="post-card" @click="goToPostDetail(post.id)">
            <div class="post-card-header">
              <i class="fas fa-file-alt"></i>
              <h4>{{ post.title }}</h4>
            </div>
            <p>{{ truncateContent(post.content) }}</p>
            <div class="post-card-footer">
              <span><i class="fas fa-calendar-alt"></i> {{ formatDate(post.createdAt) }}</span>
              <span>
                <i class="fas fa-thumbs-up"></i> {{ post.status ? '활성' : '비활성' }}
              </span>
            </div>
          </div>
        </div>
        <!-- 페이지네이션 -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">
            <i class="fas fa-chevron-left"></i> 이전
          </button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">
            다음 <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <!-- 게시글 작성 버튼: '채용'과 '자격증' 카테고리에서만 표시 -->
        <div v-if="['RECRUITMENT', 'CERTIFICATION'].includes(selectedCategory)" class="post-actions">
          <button @click="goToPostForm"><i class="fas fa-pen"></i> 게시글 작성</button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import Header from '../header/header.vue';
import Footer from '../footer/footer.vue';

const categories = ['전체글', 'RECRUITMENT', 'CERTIFICATION'];
const router = useRouter();
const route = useRoute();
const selectedCategory = ref(route.params.category || '전체글');

const posts = ref([]);
const itemsPerPage = 20;
const currentPage = ref(1);

// API에서 게시글 데이터를 가져오는 함수
const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:8090/api/v1/boards');
    posts.value = response.data;
  } catch (error) {
    console.error('게시글을 가져오는 중 오류가 발생했습니다:', error);
  }
};

// 컴포넌트가 마운트될 때 게시글 데이터를 가져옵니다
onMounted(fetchPosts);

const filteredPosts = computed(() => {
  return posts.value.filter(post => 
    selectedCategory.value === '전체글' || post.category === selectedCategory.value
  );
});

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / itemsPerPage));

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPosts.value.slice(start, end);
});

const selectCategory = (category) => {
  selectedCategory.value = category;
  currentPage.value = 1;
  router.push({ name: 'boardList', params: { category } });
};

const goToPostForm = () => {
  router.push({ name: 'postForm', params: { category: selectedCategory.value } });
};

const goToPostDetail = (postId) => {
  router.push({ name: 'postDetail', params: { id: postId } });
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const getCategoryIcon = (category) => {
  switch(category) {
    case '전체글': return 'fas fa-globe';
    case 'RECRUITMENT': return 'fas fa-briefcase';
    case 'CERTIFICATION': return 'fas fa-certificate';
    default: return 'fas fa-folder';
  }
};

const getCategoryDisplayName = (category) => {
  switch(category) {
    case 'RECRUITMENT': return '채용';
    case 'CERTIFICATION': return '자격증';
    case '전체글': return '전체글';
    default: return category;
  }
};

const truncateContent = (content) => {
  return content.length > 50 ? content.slice(0, 50) + '...' : content;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f4f7f6;
}

.board-container {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 30px auto;
  padding: 20px;
  box-sizing: border-box;
}

.notice-container {
  background-color: #e3f2fd;
  padding: 15px 20px;
  margin-bottom: 30px;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.notice-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #1565c0;
  margin: 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.action-buttons button {
  background: #ffffff;
  color: #333;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 5px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.action-buttons button i {
  margin-right: 8px;
}

.action-buttons button.active,
.action-buttons button:hover {
  background: #2196f3;
  color: #ffffff;
  border-color: #2196f3;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.board-content {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.board-content h3 {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: #1565c0;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.post-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
}

.post-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.post-card-header i {
  color: #2196f3;
  margin-right: 10px;
  font-size: 1.2rem;
}

.post-card h4 {
  font-size: 1.2rem;
  margin: 0;
  color: #333;
  font-weight: 600;
}

.post-card p {
  font-size: 0.95rem;
  color: #666;
  flex-grow: 1;
  margin-bottom: 15px;
  line-height: 1.5;
}

.post-card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}

.post-card-footer span {
  display: flex;
  align-items: center;
}

.post-card-footer i {
  margin-right: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.pagination button {
  background: #2196f3;
  color: #fff;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  margin: 0 10px;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.pagination button:hover:not(:disabled) {
  background: #1565c0;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.pagination button:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
}

.pagination span {
  font-size: 1rem;
  font-weight: 500;
}

.post-actions {
  margin-top: 30px;
  text-align: right;
}

.post-actions button {
  background: #4caf50;
  color: #fff;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.post-actions button i {
  margin-right: 8px;
}

.post-actions button:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .board-container {
    padding: 10px;
  }

  .post-grid {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons button {
    width: 100%;
    margin: 5px 0;
  }

  .board-content {
    padding: 20px;
  }

  .board-content h3 {
    font-size: 1.5rem;
  }

  .post-card {
    padding: 15px;
  }

  .pagination button {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}
</style>