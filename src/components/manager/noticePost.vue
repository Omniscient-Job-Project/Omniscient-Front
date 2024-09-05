<template>
  <div class="notice-edit-container">
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
  </div>
</template>

<script>
import axios from 'axios';

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
  // 현재 시간 생성
  const currentDate = new Date().toISOString(); 

  // 날짜 포맷 맞추기
  const formattedDate = currentDate.split('.')[0]; // 초 단위까지 잘라서 포맷 맞춤

  const formData = {
    userId: 1, // 백엔드 필드와 일치
    noticeTitle: this.title, // 백엔드 필드와 일치
    noticeContent: this.content, // 백엔드 필드와 일치
    noticeCreateAt: formattedDate, // 날짜 포맷 맞춤
    noticeUpdateAt: formattedDate  // 날짜 포맷 맞춤
  };

  try {
    console.log('전송할 데이터:', formData);

    const response = await axios.post('http://localhost:8080/api/v1/notification', formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('공지 등록 성공:', response.data);
    this.title = '';
    this.content = '';
    this.$router.push('/manager/notice/noticelist');
  } catch (error) {
    console.error('공지 등록 실패:', error.response ? error.response.data : error.message);
  }
}
  }
};
</script>


<style scoped>
.notice-edit-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
  margin-top: 40px;
}

.edit-subject {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 2em;
  font-weight: bold;
}

.mb-3 .form-control {
  width: 100%;
  max-width: 100%;
  height: auto;
  min-height: 40px;
  font-size: 1em;
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
  font-size: 1em;
}

.button-group .btn-custom {
  background-color: #1244AF;
  color: white;
  border: none;
}

.button-group .btn-custom + .btn-custom {
  margin-left: 10px;
}
</style>