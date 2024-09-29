<template>
  <div class="page-container">
    <Header />
    <div class="content-wrapper">
      <div class="post-form-container">
        <h2><i class="fas fa-edit"></i> 게시글 작성</h2>
        <form @submit.prevent="showConfirmModal">
          <div class="form-group">
            <label for="category"
              ><i class="fas fa-folder"></i> 카테고리:</label
            >
            <select id="category" v-model="newPost.category" required>
              <option value="" disabled>카테고리 선택</option>
              <option value="RECRUITMENT">채용</option>
              <option value="CERTIFICATION">자격증</option>
            </select>
          </div>
          <div class="form-group">
            <label for="title"><i class="fas fa-heading"></i> 제목:</label>
            <input
              type="text"
              id="title"
              v-model="newPost.title"
              required
              maxlength="30"
            />
          </div>
          <div class="form-group">
            <label for="content"><i class="fas fa-paragraph"></i> 내용:</label>
            <textarea
              id="content"
              v-model="newPost.content"
              required
              maxlength="2000"
            ></textarea>
          </div>
          <button type="submit">
            <i class="fas fa-paper-plane"></i> 게시글 등록
          </button>
        </form>
      </div>
    </div>
    <Footer />

    <!-- 확인 모달 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3><i class="fas fa-question-circle"></i> 확인</h3>
        <p>게시글을 등록하시겠습니까?</p>
        <div class="modal-actions">
          <button @click="submitPost" class="confirm-button">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Header from "../header/header.vue";
import Footer from "../footer/footer.vue";

const API_URL = import.meta.env.VITE_API_URL;
const router = useRouter();
const showModal = ref(false);
const newPost = ref({
  title: "",
  content: "",
  category: "",
});

const showConfirmModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const submitPost = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/api/v1/boards`,
      newPost.value
    );
    console.log("게시글이 성공적으로 등록되었습니다:", response.data);
    closeModal();
    // 게시글 추가 후 게시판 목록으로 이동
    router.push({
      name: "boardList",
      params: { category: newPost.value.category },
    });
  } catch (error) {
    console.error("게시글 등록 중 오류가 발생했습니다:", error);
    alert("게시글 등록에 실패했습니다. 다시 시도해 주세요.");
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css");

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #e3f2fd;
  font-family: "Noto Sans KR", sans-serif;
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
  max-width: 800px;
  margin: 0 auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid #ddd;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #fff;
}

.post-form-container input:focus,
.post-form-container textarea:focus,
.post-form-container select:focus {
  outline: none;
  border-color: #1565c0;
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
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

.post-form-container button[type="submit"] {
  display: block;
  width: 200px;
  margin: 30px auto 0;
  padding: 15px 20px;
  border: none;
  border-radius: 30px;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.post-form-container button[type="submit"]:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 모달 스타일 */
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

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
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
  background-color: #f44336;
  color: white;
}

.cancel-button:hover {
  background-color: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 아이콘 스타일 */
.fas {
  margin-right: 8px;
}

/* 애니메이션 효과 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-form-container,
.modal-content {
  animation: fadeIn 0.5s ease-out;
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

  .post-form-container button[type="submit"] {
    width: 100%;
    font-size: 16px;
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
