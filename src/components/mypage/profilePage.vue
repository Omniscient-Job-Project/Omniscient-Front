<template>
  <div class="profile-page">
    <h1 class="profile-title">프로필</h1>
    <form @submit.prevent="saveProfile" class="profile-form">
      <div class="profile-content">
        <div class="profile-left">
          <div class="profile-section basic-info">
            <h2 class="section-title">기본 정보</h2>
            <div class="profile-main">
              <div class="profile-image">
                <img :src="profileImageUrl" alt="프로필 이미지" @click="triggerImageUpload" />
                <input type="file" ref="imageInput" @change="handleImageUpload" style="display: none;" accept="image/*" id="profileImage">
                <label for="profileImage" v-if="isEditing" class="image-upload-prompt">
                  <i class="fas fa-camera"></i>
                  <span>이미지 변경</span>
                </label>
              </div>
              <div class="profile-details">
                <div v-if="!isEditing">
                  <h2>{{ profile.name }}</h2>
                  <p class="job-title">{{ profile.jobTitle }}</p>
                </div>
                <div v-else>
                  <div class="form-group">
                    <label for="name">이름</label>
                    <input id="name" v-model="profile.name" type="text" class="edit-input" required>
                  </div>
                  <div class="form-group">
                    <label for="jobTitle">직책</label>
                    <input id="jobTitle" v-model="profile.jobTitle" type="text" class="edit-input">
                  </div>
                </div>
                <div class="contact-info">
                  <div v-if="!isEditing">
                    <p><i class="fas fa-envelope"></i> {{ profile.email }}</p>
                    <p><i class="fas fa-phone"></i> {{ profile.phone }}</p>
                  </div>
                  <div v-else>
                    <div class="form-group">
                      <label for="email">이메일</label>
                      <input id="email" v-model="profile.email" type="email" class="edit-input" placeholder="이메일" required>
                    </div>
                    <div class="form-group">
                      <label for="phone">전화번호</label>
                      <input id="phone" v-model="profile.phone" type="tel" class="edit-input" placeholder="전화번호">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="profile-right">
          <div class="profile-section additional-info">
            <h2 class="section-title">추가 정보</h2>
            <div class="info-section">
              <div v-if="!isEditing">
                <p>나이: {{ profile.age }}세</p>
                <p>주소: {{ profile.address }}</p>
              </div>
              <div v-else>
                <div class="form-group">
                  <label for="age">나이</label>
                  <input id="age" v-model.number="profile.age" type="number" class="edit-input" placeholder="나이">
                </div>
                <div class="form-group">
                  <label for="address">주소</label>
                  <input id="address" v-model="profile.address" type="text" class="edit-input" placeholder="주소">
                </div>
              </div>
            </div>
          </div>
          <div class="profile-section certificates">
            <h2 class="section-title">자격증</h2>
            <div class="certificates-section">
              <ul v-if="!isEditing">
                <li v-for="cert in profile.certificates" :key="cert">{{ cert }}</li>
              </ul>
              <div v-else>
                <div v-for="(cert, index) in profile.certificates" :key="index" class="certificate-edit">
                  <div class="form-group">
                    <label :for="'certificate-' + index">자격증 {{ index + 1 }}</label>
                    <input :id="'certificate-' + index" v-model="profile.certificates[index]" type="text" class="edit-input">
                  </div>
                  <button type="button" @click="removeCertificate(index)" class="remove-btn"><i class="fas fa-minus-circle"></i></button>
                </div>
                <button type="button" @click="addCertificate" class="add-btn"><i class="fas fa-plus-circle"></i> 자격증 추가</button>
              </div>
            </div>
          </div>
          <div class="button-container">
            <button type="submit" v-if="isEditing" class="edit-button save-mode">
              <i class="fas fa-save"></i> 저장
            </button>
            <button type="button" @click="toggleEditMode" v-else class="edit-button">
              <i class="fas fa-edit"></i> 수정
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfilePage',
  data() {
    return {
      profile: {
        id: null,
        name: '',
        jobTitle: '',
        email: '',
        phone: '',
        age: null,
        address: '',
        certificates: [],
        profileImage: null
      },
      isEditing: false,
      imageFile: null
    };
  },
  computed: {
    profileImageUrl() {
      return this.profile.profileImage
        ? `data:image/jpeg;base64,${this.profile.profileImage}`
        : 'https://via.placeholder.com/150';
    }
  },
  created() {
    this.loadProfile();
  },
  methods: {
    async loadProfile() {
      try {
        const response = await axios.get('http://localhost:8090/api/mypage');
        if (response.data && response.data.length > 0) {
          this.profile = response.data[0];  // 첫 번째 프로필을 사용
        } else {
          throw new Error('프로필을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('프로필을 불러오는데 실패했습니다:', error);
        alert('프로필을 불러오는데 실패했습니다.');
      }
    },
    toggleEditMode() {
      this.isEditing = !this.isEditing;
    },
    addCertificate() {
      this.profile.certificates.push('');
    },
    removeCertificate(index) {
      this.profile.certificates.splice(index, 1);
    },
    triggerImageUpload() {
      if (this.isEditing) {
        this.$refs.imageInput.click();
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profile.profileImage = e.target.result.split(',')[1]; // Store base64 string
        };
        reader.readAsDataURL(file);
      }
    },
    async saveProfile() {
  try {
    const formData = new FormData();
    Object.keys(this.profile).forEach(key => {
      if (key === 'id' && !this.profile.id) {
        // id가 없거나 0이면 전송하지 않음
        return;
      }
      if (key === 'certificates') {
        formData.append(key, JSON.stringify(this.profile[key]));
      } else {
        formData.append(key, this.profile[key]);
      }
    });

    if (this.imageFile) {
      formData.append('profileImage', this.imageFile);
    }

    let response;
    if (this.profile.id) {
      response = await axios.put(`http://localhost:8090/api/mypage/${this.profile.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      response = await axios.post('http://localhost:8090/api/mypage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }

    this.profile = response.data;
    this.isEditing = false;
    alert('프로필이 성공적으로 업데이트되었습니다.');
  } catch (error) {
    console.error('프로필 저장에 실패했습니다:', error);
    alert('프로필 저장에 실패했습니다. 자세한 내용은 콘솔을 확인해주세요.');
  }
}
  }
}
</script>


<style scoped>
.profile-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.profile-title {
  font-size: 36px;
  margin-bottom: 30px;
  text-align: center;
}

.profile-content {
  display: flex;
  gap: 30px;
}

.profile-left {
  flex: 1;
  min-width: 300px;
}
.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}


.profile-right {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.profile-section {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.basic-info {
  height: 100%;
}

.additional-info {
  flex: 2;
}

.certificates {
  flex: 1;
}

.section-title {
  font-size: 28px;
  color: #007bff;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #007bff;
}

.profile-main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 30px;
  position: relative;
  cursor: pointer;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-upload-prompt {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 8px;
  font-size: 16px;
}

.profile-details {
  text-align: center;
  width: 100%;
}

.profile-details h2 {
  font-size: 32px;
  margin-bottom: 10px;
}

.job-title {
  font-size: 22px;
  color: #666;
  margin-bottom: 20px;
}

.contact-info p {
  font-size: 18px;
  margin: 10px 0;
}

.contact-info i {
  margin-right: 15px;
  color: #007bff;
}

.info-section p {
  font-size: 18px;
  margin: 15px 0;
}

.certificates-section ul {
  padding-left: 20px;
}

.certificates-section li {
  font-size: 18px;
  margin-bottom: 10px;
}

.edit-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.certificate-edit {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.remove-btn, .add-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
}

.add-btn {
  margin-top: 15px;
}

.button-container {
  text-align: right;
  margin-top: 20px;
}

.edit-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.3s, transform 0.3s;
}

.edit-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.edit-button.save-mode {
  background-color: #28a745;
}

.edit-button i {
  margin-right: 10px;
}

@media (max-width: 1024px) {
  .profile-content {
    flex-direction: column;
  }

  .profile-left, .profile-right {
    width: 100%;
  }

  .basic-info {
    height: auto;
  }

  .additional-info, .certificates {
    flex: 1;
  }

  .button-container {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .profile-section {
    padding: 20px;
  }

  .section-title {
    font-size: 24px;
  }

  .profile-details h2 {
    font-size: 28px;
  }

  .job-title {
    font-size: 20px;
  }

  .edit-button {
    width: 100%;
    justify-content: center;
  }
}
</style>