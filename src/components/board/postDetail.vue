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
            <span class="likes-count"><i class="fas fa-thumbs-up"></i> {{ post.likes }}</span>
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

      <!-- 댓글 섹션 -->
      <div class="comments-section">
        <h3><i class="fas fa-comments"></i> 댓글</h3>
        <div class="comment-form">
          <textarea v-model="newComment" placeholder="댓글을 입력하세요..."></textarea>
          <button @click="addComment" class="submit-comment">
            <i class="fas fa-paper-plane"></i> 댓글 작성
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
              <button @click="toggleReplyForm(comment)" class="reply-button">
                <i class="fas fa-reply"></i> 답글
              </button>
              <button @click="likeComment(comment)" class="like-comment-button">
                <i class="fas fa-thumbs-up"></i> 좋아요 <span class="like-count">{{ comment.likes }}</span>
              </button>
            </div>
            <div v-if="comment.showReplyForm" class="reply-form">
              <textarea v-model="comment.newReply" placeholder="답글을 입력하세요..."></textarea>
              <button @click="addReply(comment)" class="submit-reply">
                <i class="fas fa-paper-plane"></i> 답글 작성
              </button>
            </div>
            <div class="replies" v-if="comment.replies && comment.replies.length > 0">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply">
                <div class="reply-header">
                  <span class="reply-author"><i class="fas fa-user-circle"></i> {{ reply.author }}</span>
                  <span class="reply-date"><i class="fas fa-clock"></i> {{ reply.date }}</span>
                </div>
                <div class="reply-content">{{ reply.content }}</div>
                <div class="reply-actions">
                  <button @click="likeReply(comment, reply)" class="like-reply-button">
                    <i class="fas fa-thumbs-up"></i> 좋아요 <span class="like-count">{{ reply.likes }}</span>
                  </button>
                </div>
              </div>
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
        replies: [
          {
            id: 1,
            author: "답글작성자1",
            content: "첫 번째 답글입니다.",
            date: "2024-09-11",
            likes: 1
          }
        ]
      },
      {
        id: 2,
        author: "댓글작성자2",
        content: "두 번째 댓글입니다.",
        date: "2024-09-11",
        likes: 1,
        replies: []
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
      replies: []
    };
    post.value.comments.unshift(comment);
    newComment.value = '';
  }
};

const toggleReplyForm = (comment) => {
  comment.showReplyForm = !comment.showReplyForm;
  if (comment.showReplyForm) {
    comment.newReply = '';
  }
};

const addReply = (comment) => {
  if (comment.newReply && comment.newReply.trim()) {
    const reply = {
      id: comment.replies.length + 1,
      author: "현재 사용자", // 실제로는 로그인된 사용자 정보를 사용해야 합니다.
      content: comment.newReply,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    };
    comment.replies.push(reply);
    comment.newReply = '';
    comment.showReplyForm = false;
  }
};

const likeComment = (comment) => {
  comment.likes++;
  // 실제 애플리케이션에서는 여기서 API 호출을 통해 서버에 업데이트해야 합니다.
};

const likeReply = (comment, reply) => {
  reply.likes++;
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
  background-color: #f4f7f6;
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
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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
  margin-right: 5px;
}

.likes-count {
  margin-right: 15px; /* 좋아요 수와 버튼 사이의 간격 */
}

.post-content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 30px;
}

.post-actions {
  margin-bottom: 30px;
}

.like-button, .back-button, .submit-comment, .reply-button, .submit-reply {
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
}

.like-button:hover, .submit-comment:hover, .submit-reply:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.back-button {
  background-color: #f0f0f0;
  color: #333;
}

.back-button:hover, .reply-button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

.like-button i, .back-button i, .submit-comment i, .reply-button i, .submit-reply i {
  margin-right: 8px;
}

/* 댓글 스타일 */
.comments-section {
  margin-top: 40px;
}

.comments-section h3 {
  font-size: 1.5rem;
  color: #1565c0;
  margin-bottom: 20px;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-form textarea, .reply-form textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 10px;
}

.submit-comment, .submit-reply {
  background-color: #2196f3;
  color: white;
}

.comment, .reply {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.comment-header, .reply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #666;
}

.comment-content, .reply-content {
  margin-bottom: 10px;
  line-height: 1.6;
}

.comment-actions, .reply-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.reply-button {
  background-color: #f0f0f0;
  color: #333;
  margin-right: 10px;
}

.like-comment-button, .like-reply-button {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.like-comment-button i, .like-reply-button i {
  margin-right: 5px;
}

.like-count {
  margin-left: 5px;
}

.replies {
  margin-left: 30px;
  margin-top: 20px;
}

.reply {
  background-color: #f0f0f0;
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

  .like-button, .back-button, .submit-comment, .reply-button, .submit-reply {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }

  .comment-actions, .reply-actions {
    flex-direction: column;
  }

  .reply-button, .like-comment-button, .like-reply-button {
    margin-left: 0;
    margin-top: 10px;
  }

  .replies {
    margin-left: 15px;
  }
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

  .like-button, .back-button, .submit-comment, .reply-button, .submit-reply, .like-comment-button, .like-reply-button {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }

  .comment-actions, .reply-actions {
    flex-direction: column;
  }

  .reply-button, .like-comment-button, .like-reply-button {
    margin-left: 0;
    margin-top: 10px;
  }

  .replies {
    margin-left: 15px;
  }
}
</style>