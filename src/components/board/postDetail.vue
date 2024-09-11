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
            <span class="likes-count"><i class="fas fa-heart"></i> {{ post.likes }}</span>
            <button @click="likePost" class="like-button">
              좋아요
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

      <!-- 댓글 섹션 -->
      <div class="comments-section">
        <h3><i class="fas fa-comments"></i> 댓글</h3>
        <div class="comment-form">
          <textarea v-model="newComment" placeholder="댓글을 입력하세요..."></textarea>
          <button @click="addComment" class="submit-comment">
            댓글 작성
          </button>
        </div>
        <div class="comments-list">
          <div v-for="comment in post.comments" :key="comment.id" class="comment">
            <div class="comment-header">
              <span class="comment-author"><i class="fas fa-user-circle"></i> {{ comment.author }}</span>
              <span class="comment-date"><i class="fas fa-clock"></i> {{ comment.date }}</span>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-actions">
              <button @click="likeComment(comment)" class="like-comment-button">
                <i class="fas fa-heart"></i> {{ comment.likes }}
              </button>
            </div>
          </div>
        </div>
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
const newComment = ref('');

onMounted(async () => {
  // 실제 애플리케이션에서는 API를 통해 데이터를 가져와야 합니다.
  post.value = {
    id: parseInt(route.params.id),
    title: "예시 게시글",
    content: "이것은 예시 게시글의 내용입니다. 실제 애플리케이션에서는 이 부분에 긴 내용의 게시글이 들어갈 것입니다.",
    author: "작성자",
    date: "2024-09-10",
    likes: 5,
    comments: [
      {
        id: 1,
        author: "댓글작성자1",
        content: "첫 번째 댓글입니다.",
        date: "2024-09-11",
        likes: 3,
      },
      {
        id: 2,
        author: "댓글작성자2",
        content: "두 번째 댓글입니다.",
        date: "2024-09-11",
        likes: 1,
      }
    ]
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

const addComment = () => {
  if (newComment.value.trim()) {
    const comment = {
      id: post.value.comments.length + 1,
      author: "현재 사용자", // 실제로는 로그인된 사용자 정보를 사용해야 합니다.
      content: newComment.value,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
    };
    post.value.comments.unshift(comment);
    newComment.value = '';
  }
};

const likeComment = (comment) => {
  comment.likes++;
  // 실제 애플리케이션에서는 여기서 API 호출을 통해 서버에 업데이트해야 합니다.
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Noto Sans KR', sans-serif;
}

.post-detail-container {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 30px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.post-header {
  margin-bottom: 30px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 20px;
}

h2 {
  color: #343a40;
  font-size: 2.2rem;
  margin-bottom: 15px;
  font-weight: 700;
}

.post-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  color: #6c757d;
}

.post-info span {
  display: flex;
  align-items: center;
}

.post-info i {
  margin-right: 5px;
  color: #4dabf7;
}

.likes-container {
  display: flex;
  align-items: center;
}

.likes-count {
  margin-right: 15px;
}

.post-content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #495057;
  margin-bottom: 30px;
}

.post-actions {
  margin-bottom: 30px;
}

.like-button, .back-button, .submit-comment {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.like-button {
  background-color: #fa5252;
  color: white;
}

.like-button:hover, .submit-comment:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.back-button {
  background-color: #e9ecef;
  color: #495057;
}

.back-button:hover {
  background-color: #dee2e6;
  transform: translateY(-2px);
}

.like-button i, .back-button i, .submit-comment i {
  margin-right: 8px;
}

/* 댓글 스타일 */
.comments-section {
  margin-top: 40px;
}

.comments-section h3 {
  font-size: 1.5rem;
  color: #343a40;
  margin-bottom: 20px;
  font-weight: 700;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-form textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 10px;
  font-family: 'Noto Sans KR', sans-serif;
}

.submit-comment {
  background-color: #4dabf7;
  color: white;
}

.comment {
  background-color: #f1f3f5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.comment:hover {
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: #6c757d;
}

.comment-content {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #495057;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.like-comment-button {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  color: #fa5252;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.like-comment-button:hover {
  color: #e03131;
}

.like-comment-button i {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .post-detail-container {
    padding: 20px;
    margin: 20px;
  }

  h2 {
    font-size: 1.8rem;
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

  .like-button, .back-button, .submit-comment, .like-comment-button {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }

  .comment-actions {
    flex-direction: column;
  }

  .like-comment-button {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>