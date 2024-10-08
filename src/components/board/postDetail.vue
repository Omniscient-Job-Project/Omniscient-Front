<template>
  <div class="page-container">
    <Header />
    <div class="post-detail-container" v-if="post">
      <div class="post-header">
        <h2>{{ isEditing ? "게시글 수정" : post.title }}</h2>
        <div class="post-info" v-if="!isEditing">
          <div>
            <span><i class="fas fa-user"></i> {{ post.author }}</span>
            <span><i class="fas fa-calendar-alt"></i> {{ post.date }}</span>
          </div>
          <div class="post-actions">
            <div class="edit-container">
              <button @click="toggleEditMode" class="edit-button">
                <i class="fas fa-edit"></i> 수정
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="post-content" v-if="!isEditing">
        {{ post.content }}
      </div>
      <div class="post-edit-form" v-else>
        <input
          v-model="editedPost.title"
          class="edit-title"
          placeholder="제목"
        />
        <textarea
          v-model="editedPost.content"
          class="edit-content"
          placeholder="내용"
        ></textarea>
        <div class="edit-actions">
          <button @click="saveEdit" class="save-button">
            <i class="fas fa-save"></i> 저장
          </button>
          <button @click="deactivatePost" class="action-button delete-button">
            <i class="fas fa-trash"></i> 삭제
          </button>
          <button @click="cancelEdit" class="cancel-button">
            <i class="fas fa-times"></i> 취소
          </button>
        </div>
      </div>
      <div class="post-actions" v-if="!isEditing">
        <button @click="goBack" class="back-button">
          <i class="fas fa-arrow-left"></i> 목록으로 돌아가기
        </button>
      </div>

      <!-- 댓글 섹션 -->
      <div class="comments-section">
        <h3><i class="fas fa-comments"></i> 댓글</h3>
        <div class="comment-form">
          <textarea
            v-model="newComment.content"
            placeholder="댓글을 입력하세요..."
          ></textarea>
          <button @click="addComment" class="submit-comment">댓글 작성</button>
        </div>
        <div class="comments-list">
          <div
            v-for="comment in post.comments"
            :key="comment.id"
            class="comment"
          >
            <div class="comment-header">
              <span class="comment-author"
                ><i class="fas fa-user-circle"></i> {{ comment.author }}</span
              >
              <span class="comment-date"
                ><i class="fas fa-clock"></i> {{ comment.createdAt }}</span
              >
            </div>
            <div v-if="!comment.isEditing" class="comment-content">
              {{ comment.content }}
            </div>
            <div v-else class="comment-edit-form">
              <textarea v-model="comment.editContent"></textarea>
              <button @click="updateComment(comment)" class="save-button">
                저장
              </button>
              <button @click="cancelEditComment(comment)" class="cancel-button">
                취소
              </button>
            </div>
            <div class="comment-actions">
              <button
                v-if="!comment.isEditing"
                @click="editComment(comment)"
                class="edit-comment-button"
              >
                <i class="fas fa-edit"></i> 수정
              </button>
              <button
                @click="deactivateComment(comment)"
                class="delete-comment-button"
              >
                <i class="fas fa-trash"></i> 삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />

    <!-- 확인 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3><i class="fas fa-question-circle"></i> 확인</h3>
        <p>{{ modalMessage }}</p>
        <div class="modal-actions">
          <button @click="confirmModal" class="confirm-button">
            <i class="fas fa-check"></i> 예
          </button>
          <button @click="closeModal" class="cancel-button">
            <i class="fas fa-times"></i> 아니오
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Header from "../header/header.vue";
import Footer from "../footer/footer.vue";

const API_URL = import.meta.env.VITE_API_URL;
const route = useRoute();
const router = useRouter();
const post = ref(null);
const newComment = ref({ content: "", author: "현재 로그인한 사용자" });
const isEditing = ref(false);
const editedPost = ref({});
const showModal = ref(false);
const modalMessage = ref("");
const modalAction = ref(null);

onMounted(async () => {
  await fetchPost();
});

const fetchPost = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/boards/${route.params.id}`
    );
    post.value = response.data;
    await fetchComments();
  } catch (error) {
    console.error("게시글을 가져오는 중 오류가 발생했습니다:", error);
  }
};

const fetchComments = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/v1/boards/comments/${post.value.id}`
    );
    post.value.comments = response.data;
  } catch (error) {
    console.error("댓글을 가져오는 중 오류가 발생했습니다:", error);
  }
};

const goBack = () => {
  router.back();
};

const toggleEditMode = () => {
  if (!isEditing.value) {
    editedPost.value = { ...post.value };
  }
  isEditing.value = !isEditing.value;
};

const saveEdit = () => {
  showModal.value = true;
  modalMessage.value = "게시글을 저장하시겠습니까?";
  modalAction.value = performSaveEdit;
};

const performSaveEdit = async () => {
  try {
    const response = await axios.put(
      `${API_URL}/api/v1/boards/${post.value.id}`,
      editedPost.value
    );
    post.value = response.data;
    isEditing.value = false;
    closeModal();
  } catch (error) {
    console.error("게시글 수정 중 오류가 발생했습니다:", error);
    alert(error.response?.data || "게시글 수정 중 오류가 발생했습니다.");
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  editedPost.value = {};
};

const deactivatePost = () => {
  showModal.value = true;
  modalMessage.value = "정말로 이 게시글을 삭제하시겠습니까?";
  modalAction.value = performDeactivatePost;
};

const performDeactivatePost = async () => {
  try {
    await axios.put(`${API_URL}/api/v1/boards/delete/${post.value.id}`, null, {
      params: { status: false },
    });
    closeModal();
    router.push({ name: "boardList" });
  } catch (error) {
    console.error("게시글 삭제 중 오류가 발생했습니다:", error);
    alert(error.response?.data || "게시글 삭제 중 오류가 발생했습니다.");
  }
};

const closeModal = () => {
  showModal.value = false;
  modalMessage.value = "";
  modalAction.value = null;
};

const confirmModal = () => {
  if (modalAction.value) {
    modalAction.value();
  }
};

const addComment = async () => {
  if (newComment.value.content.trim()) {
    try {
      const response = await axios.post(
        `${API_URL}/api/v1/boards/comments/${post.value.id}`,
        newComment.value
      );
      post.value.comments.unshift(response.data);
      newComment.value.content = "";
    } catch (error) {
      console.error("댓글 추가 중 오류가 발생했습니다:", error);
      alert(error.response?.data || "댓글 추가 중 오류가 발생했습니다.");
    }
  }
};

const editComment = (comment) => {
  comment.isEditing = true;
  comment.editContent = comment.content;
};

const cancelEditComment = (comment) => {
  comment.isEditing = false;
  comment.editContent = "";
};

const updateComment = async (comment) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/v1/boards/comments/${post.value.id}/${comment.id}`,
      {
        content: comment.editContent,
        author: comment.author,
      }
    );
    const index = post.value.comments.findIndex((c) => c.id === comment.id);
    if (index !== -1) {
      post.value.comments[index] = response.data;
    }
    comment.isEditing = false;
  } catch (error) {
    console.error("댓글 수정 중 오류가 발생했습니다:", error);
    alert(error.response?.data || "댓글 수정 중 오류가 발생했습니다.");
  }
};

const deactivateComment = async (comment) => {
  if (confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
    try {
      await axios.put(
        `${API_URL}/api/v1/boards/comments/${post.value.id}/deactivate/${comment.id}`
      );
      const index = post.value.comments.findIndex((c) => c.id === comment.id);
      if (index !== -1) {
        post.value.comments.splice(index, 1);
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류가 발생했습니다:", error);
      alert(error.response?.data || "댓글 삭제 중 오류가 발생했습니다.");
    }
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.comment-edit-form {
  margin-top: 10px;
}

.comment-edit-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.edit-comment-button,
.delete-comment-button {
  background-color: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.edit-comment-button:hover,
.delete-comment-button:hover {
  color: #1565c0;
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.action-button i {
  margin-right: 8px;
  font-size: 1.2rem;
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f4f7f6;
  font-family: "Noto Sans KR", sans-serif;
}

.post-detail-container {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 30px auto;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.post-actions {
  display: flex;
  align-items: center;
}

.likes-container,
.edit-container {
  display: flex;
  align-items: center;
  margin-left: 15px;
}

.likes-container i,
.edit-container i {
  margin-right: 5px;
}

.likes-count {
  margin-right: 10px;
}

.post-content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 30px;
}

.like-button,
.back-button,
.submit-comment,
.edit-button,
.save-button,
.delete-button,
.cancel-button {
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.like-button,
.edit-button {
  background-color: #4caf50;
  color: white;
}
.save-button {
  background-color: #4caf50;
  color: white;
}
.delete-button {
  background-color: #f44336;
  color: white;
}
.cancel-button {
  background-color: #757575;
  color: white;
}

.back-button {
  background-color: #f0f0f0;
  color: #333;
  margin-top: 20px;
}

.like-button:hover,
.submit-comment:hover,
.edit-button:hover,
.save-button:hover,
.delete-button:hover,
.cancel-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.delete-button:hover {
  background-color: #d32f2f;
}

.save-button:hover {
  background-color: #45a049;
}

.back-button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
}

.edit-title,
.edit-content {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.edit-content {
  min-height: 200px;
  resize: vertical;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.fas {
  margin-right: 5px;
}

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

.comment-form textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 10px;
}

.submit-comment {
  background-color: #2196f3;
  color: white;
}

.comment {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #666;
}

.comment-content {
  margin-bottom: 10px;
  line-height: 1.6;
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
  color: #666;
  cursor: pointer;
  padding: 5px 10px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.like-comment-button i {
  margin-right: 5px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content h3 {
  color: #1565c0;
  font-size: 24px;
  margin-bottom: 20px;
}

.modal-content p {
  font-size: 18px;
  margin-bottom: 30px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.confirm-button,
.cancel-button {
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-button {
  background-color: #4caf50;
  color: white;
}

.confirm-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.cancel-button {
  background-color: #757575;
  color: white;
}

.cancel-button:hover {
  background-color: #616161;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

@media (max-width: 768px) {
  .post-info,
  .post-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .likes-container,
  .edit-container {
    margin-left: 0;
    margin-top: 10px;
  }

  .like-button,
  .edit-button,
  .save-button,
  .delete-button,
  .cancel-button,
  .back-button {
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }

  .modal-content {
    padding: 20px;
  }

  .modal-content h3 {
    font-size: 20px;
  }

  .modal-content p {
    font-size: 16px;
  }

  .confirm-button,
  .cancel-button {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
