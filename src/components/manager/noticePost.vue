<template>
      <div class="edit-subject">
          <h1>공지 작성</h1>
      </div>
      <div class="mb-3">
          <label for="noticeTitle" class="form-label">공지 제목</label>
          <input 
              type="text" 
              class="form-control" 
              id="noticeTitle" 
              v-model="title" 
              placeholder="제목을 작성해 주세요."
          />
      </div>
      <div class="mb-3">
          <label for="noticeContent" class="form-label">공지 사항</label>
          <textarea 
              class="form-control" 
              id="noticeContent" 
              rows="3" 
              v-model="content" 
              placeholder="공지사항을 작성해 주세요."
          ></textarea>
      </div>
      <div class="button-group">
          <button 
              type="button" 
              class="btn btn-custom" 
              @click="submitNotice"
          >
              등록
          </button>
          <button 
              type="button" 
              class="btn btn-custom" 
              @click="cancel"
          >
              취소
          </button>
      </div>
</template>

<script>
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export default {
  data() {
      return {
          title: '',
          content: '',
          noticeId: null // 수정 시 사용할 공지 ID
      };
  },
  methods: {
      async submitNotice() {
          const currentDate = new Date().toISOString(); 
          const formattedDate = currentDate.split('.')[0]; 

          const formData = {
              userId: 1, // 백엔드 필드와 일치
              noticeTitle: this.title, // 백엔드 필드와 일치
              noticeContent: this.content, // 백엔드 필드와 일치
              noticeCreateAt: formattedDate, // 날짜 포맷 맞춤
              noticeUpdateAt: formattedDate  // 날짜 포맷 맞춤
          };

          try {
              const response = await axios.post(`${API_URL}/api/v1/notice`, formData, {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });
              this.title = '';
              this.content = '';
              this.$router.push('/manager/noticelist');
          } catch (error) {
              console.error('공지 등록 실패:', error.response ? error.response.data : error.message);
          }
      },

      cancel() {
          this.$router.push('/manager/noticelist');
      }
  }
};
</script>

<style scoped>
.notice-edit-container {
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
}

.edit-subject {
  text-align: left;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px; /* 제목 폰트 크기 조정 */
  font-weight: bold;
  margin: 0; /* 제목 상하 여백 제거 */
}

.mb-3 .form-control {
  width: 100%;
  max-width: 100%;
  height: auto;
  min-height: 40px;
  font-size: 16px; /* 입력 폰트 크기 조정 */
  padding: 10px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.button-group .btn {
  min-width: 100px;
  padding: 10px 20px;
  font-size: 16px; /* 버튼 폰트 크기 조정 */
}

.button-group .btn-custom {
  background-color: #AFF6C3;
  color: rgb(3, 3, 3);
  border: none;
}

.button-group .btn-custom + .btn-custom {
  margin-left: 10px;
}
</style>
