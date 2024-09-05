<template>
  <div class="noticeEditContainer">
    <div class="editsubject">
      <h1>공지 수정</h1>
    </div>
    <div class="mb-3">
      <label for="noticeTitle" class="form-label">공지 제목</label>
      <input
        type="text"
        class="form-control"
        id="noticeTitle"
        v-model="noticeTitle"
        placeholder="공지 제목을 입력하세요" />
    </div>
    <div class="mb-3">
      <label for="noticeContent" class="form-label">공지 사항</label>
      <textarea
        class="form-control"
        id="noticeContent"
        rows="3"
        v-model="noticeContent"
        placeholder="공지 내용을 입력하세요"></textarea>
    </div>
    <div class="buttongroup">
      <button type="button" class="btn btn-custom" @click="updateNotice">
        수정
      </button>
      <button type="button" class="btn btn-custom" @click="cancel">
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
      noticeId: null,
      noticeTitle: '',
      noticeContent: ''
    };
  },
  watch: {
    '$route.query.id': {
      handler(newVal) {
        if (newVal) {
          this.noticeId = newVal;
          this.fetchNotice();
        }
      },
      immediate: true
    }
  },
  methods: {
    async fetchNotice() {
      if (this.noticeId) {
        try {
          const response = await axios.get(`/api/notice/${this.noticeId}`);
          const notice = response.data;
          if (notice) {
            this.noticeTitle = notice.noticeTitle;
            this.noticeContent = notice.noticeContent;
          } else {
            console.error('공지사항을 찾을 수 없습니다.');
          }
        } catch (error) {
          console.error('공지사항을 가져오는 중 오류가 발생했습니다!', error);
        }
      } else {
        console.error('공지 ID가 없습니다.');
      }
    },

    async updateNotice() {
      console.log('updateNotice 호출됨');
      console.log('noticeTitle:', this.noticeTitle);
      console.log('noticeContent:', this.noticeContent);

      if (this.noticeId) {
        const updatedNotice = {
          noticeTitle: this.noticeTitle,
          noticeContent: this.noticeContent,
          // 서버에서 기대하는 다른 필드가 있다면 여기에 추가
          // 예: noticeUpdateAt: new Date().toISOString()
        };

        try {
          const response = await axios.put(`/api/${this.noticeId}`, updatedNotice, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('공지 수정 성공', response.data);
          this.$router.push('/manager/notice/noticelist');
        } catch (error) {
          console.error('공지 수정 실패:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
        }
      } else {
        console.error('공지 ID가 없습니다.');
      }
    },

    cancel() {
      this.$router.push('/manager/notice/noticelist');
    }
  }
}
</script>

<style scoped>
.noticeEditContainer {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
  margin-top: 40px;
}

.editsubject {
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

.buttongroup {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.buttongroup .btn {
  min-width: 100px;
  padding: 10px 20px;
  font-size: 1em;
}

.buttongroup .btn-custom {
  background-color: #1244AF;
  color: white;
  border: none;
}

.buttongroup .btn-custom + .btn-custom {
  margin-left: 10px;
}
</style>