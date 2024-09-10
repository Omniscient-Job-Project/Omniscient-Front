<template>
    <div class="page-container">
      <Header />
      <div class="post-detail-container" v-if="post">
        <div class="post-header">
          <h2>{{ post.title }}</h2>
          <div class="post-info">
            <span><i class="fas fa-user"></i> {{ post.author }}</span>
            <span><i class="fas fa-calendar-alt"></i> {{ post.date }}</span>
            <span class="likes-container">
              <i class="fas fa-thumbs-up"></i> {{ post.likes }}
              <button @click="likePost" class="like-button">
                <i class="fas fa-heart"></i> 좋아요
              </button>
            </span>
          </div>
        </div>
        <div class="post-content">
          {{ post.content }}
        </div>
        <div class="post-actions">
          <button @click="goBack" class="back-button">
            <i class="fas fa-arrow-left"></i> 목록으로 돌아가기
          </button>
        </div>
      </div>
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Header from '../header/header.vue';
  import Footer from '../footer/footer.vue';
  
  const route = useRoute();
  const router = useRouter();
  const post = ref(null);
  
  onMounted(async () => {
    // 실제 애플리케이션에서는 API를 통해 데이터를 가져와야 합니다.
    // 여기서는 예시로 하드코딩된 데이터를 사용합니다.
    post.value = {
      id: parseInt(route.params.id),
      title: "예시 게시글",
      content: "이것은 예시 게시글의 내용입니다. 실제 애플리케이션에서는 이 부분에 긴 내용의 게시글이 들어갈 것입니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt nunc, vitae aliquam nunc nunc vitae nunc. Sed euismod, nunc id aliquam tincidunt, nisl nunc tincidunt nunc, vitae aliquam nunc nunc vitae nunc.",
      author: "작성자",
      date: "2024-09-10",
      likes: 5
    };
  });
  
  const likePost = () => {
    if (post.value) {
      post.value.likes++;
      // 실제 애플리케이션에서는 여기서 API 호출을 통해 서버에 업데이트해야 합니다.
    }
  };
  
  const goBack = () => {
    router.back();
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
  
  .post-detail-container {
    flex: 1;
    max-width: 800px;
    width: 100%;
    margin: 30px auto;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    position: relative;
  }
  
  .post-header {
    margin-bottom: 30px;
    border-bottom: 2px solid #e0e0e0;
    padding-bottom: 20px;
  }
  
  h2 {
    color: #1565c0;
    font-size: 2rem;
    margin-bottom: 15px;
  }
  
  .post-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: #666;
  }
  
  .post-info span {
    display: flex;
    align-items: center;
  }
  
  .post-info i {
    margin-right: 5px;
    color: #2196f3;
  }
  
  .likes-container {
    display: flex;
    align-items: center;
  }
  
  .likes-container i {
    margin-right: 10px;
  }
  
  .post-content {
    line-height: 1.8;
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 60px;  /* Increased to make room for the back button */
  }
  
  .post-actions {
    position: absolute;
    bottom: 30px;
    left: 30px;
  }
  
  .like-button, .back-button {
    padding: 10px 20px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1rem;
    display: flex;
    align-items: center;
  }
  
  .like-button {
    background-color: #4CAF50;
    color: white;
    margin-left: 15px;
  }
  
  .like-button:hover {
    background-color: #45a049;
    transform: translateY(-2px);
  }
  
  .back-button {
    background-color: #f0f0f0;
    color: #333;
  }
  
  .back-button:hover {
    background-color: #e0e0e0;
    transform: translateY(-2px);
  }
  
  .like-button i, .back-button i {
    margin-right: 8px;
  }
  
  @media (max-width: 768px) {
    .post-detail-container {
      padding: 20px;
      margin: 20px;
    }
  
    h2 {
      font-size: 1.5rem;
    }
  
    .post-info {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .post-info span {
      margin-bottom: 5px;
    }
  
    .likes-container {
      margin-top: 10px;
    }
  
    .post-actions {
      position: static;
      margin-top: 20px;
    }
  
    .like-button, .back-button {
      width: 100%;
      margin-top: 10px;
      justify-content: center;
    }
  
    .like-button {
      margin-left: 0;
    }
  }
  </style>