<template>
  <div class="profile-page">
    <h1 class="profile-title">프로필</h1>
    <form @submit.prevent="showConfirmModal" class="profile-form">
      <div class="profile-content">
        <div class="profile-left">
          <div class="profile-section basic-info">
            <h2 class="section-title">기본 정보</h2>
            <div class="profile-main">
              <div class="profile-image">
                <img :src="previewImage || profileImageUrl" alt="프로필 이미지" @click="triggerImageUpload" />
                <input type="file" ref="imageInput" @change="handleImageUpload" style="display: none;" accept="image/*" id="profileImage" multiple>
                <label for="profileImage" v-if="isEditing" class="image-upload-prompt">
                  <i class="fas fa-camera"></i>
                  <span>이미지 변경 (최대 5MB)</span>
                </label>
              </div>

              <div class="profile-details">
                <!-- 이름, 직책 입력 필드 -->
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

                <!-- 연락처 정보 -->
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
          <!-- 추가 정보 섹션 -->
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

          <!-- 자격증 섹션 -->
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

          <!-- 버튼 섹션 -->
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

    <!-- 저장 확인 모달 -->
    <div v-if="showSaveModal" class="modal-overlay" @click="closeSaveModal">
      <div class="modal-content" @click.stop>
        <h3><i class="fas fa-question-circle"></i> 확인</h3>
        <p>프로필을 저장하시겠습니까?</p>
        <div class="modal-actions">
          <button @click="confirmSave" class="confirm-button">
            <i class="fas fa-check"></i> 예
          </button>
          <button @click="closeSaveModal" class="cancel-button">
            <i class="fas fa-times"></i> 아니오
          </button>
        </div>
      </div>
    </div>

    <!-- 비활성화 확인 모달 -->
    <div v-if="showDeactivateModal" class="modal-overlay" @click="closeDeactivateModal">
      <div class="modal-content" @click.stop>
        <h3><i class="fas fa-exclamation-triangle"></i> 경고</h3>
        <p>정말로 이 프로필을 비활성화하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
        <div class="modal-actions">
          <button @click="confirmDeactivate" class="confirm-button">
            <i class="fas fa-check"></i> 예, 비활성화합니다
          </button>
          <button @click="closeDeactivateModal" class="cancel-button">
            <i class="fas fa-times"></i> 아니오, 취소합니다
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090/api/v1/mypage/profile';

export default {
  name: 'ProfilePage',
  setup() {
    const profile = reactive({
      id: null,
      name: '',
      jobTitle: '',
      email: '',
      phone: '',
      age: null,
      address: '',
      certificates: [],
      status: true,
      profileImages: []
    });

    const isEditing = ref(false);
    const imageInput = ref(null);
    const previewImage = ref(null);
    const showSaveModal = ref(false);
    const showDeactivateModal = ref(false);
    const profileImageUrl = computed(() => {
  // 프로필에 이미지가 있는 경우 Base64 형식으로 표시
  return profile.profileImages && profile.profileImages.length > 0
    ? `data:image/jpeg;base64,${profile.profileImages[0]}`  // Base64 인코딩된 이미지 표시
    : 'https://via.placeholder.com/150'; // 기본 이미지
});

const loadProfile = async () => {
  try {
    const response = await axios.get(API_URL);
    if (response.data && response.data.length > 0) {
      // 프로필 데이터를 불러옴
      Object.assign(profile, response.data[0]);

      // 이미지 데이터가 있을 경우 Base64로 프로필에 저장
      if (response.data[0].profileImages) {
        profile.profileImages = response.data[0].profileImages.map(img => img.image);  // 이미지 데이터를 Base64로 저장
      }
    } else {
      throw new Error('프로필을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('프로필을 불러오는데 실패했습니다:', error);
    alert('프로필을 불러오는데 실패했습니다.');
  }
};


    const toggleEditMode = () => {
      isEditing.value = !isEditing.value;
    };

    const addCertificate = () => {
      profile.certificates.push('');
    };

    const removeCertificate = (index) => {
      profile.certificates.splice(index, 1);
    };

    const triggerImageUpload = () => {
      if (isEditing.value) {
        imageInput.value.click();
      }
    };
    const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB를 초과할 수 없습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
      // Base64 인코딩된 이미지 데이터를 profile 객체에 저장
      profile.profileImages = [e.target.result.split(',')[1]];  // Base64 데이터로 저장
    };
    reader.readAsDataURL(file);
  }
};


    const showConfirmModal = () => {
      showSaveModal.value = true;
    };

    const closeSaveModal = () => {
      showSaveModal.value = false;
    };

    const confirmSave = () => {
      saveProfile();
    };

    const saveProfile = async () => {
  try {
    const formData = new FormData();
    Object.keys(profile).forEach(key => {
      if (key === 'id' && !profile.id) return;
      if (key === 'certificates') {
        formData.append(key, JSON.stringify(profile[key]));
      } else if (key === 'profileImages' && profile[key]) {
        // Base64 이미지 데이터를 Blob으로 변환하여 추가
        const imageBlob = b64toBlob(profile[key][0], 'image/jpeg');
        formData.append('profileImages', imageBlob, 'profile_image.jpg');
      } else {
        formData.append(key, profile[key]);
      }
    });

    console.log('FormData 내용:', Object.fromEntries(formData));

    let response;
    if (profile.id) {
      response = await axios.put(`${API_URL}/${profile.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }

    // 서버에서 갱신된 프로필 데이터를 다시 로드하여 업데이트
    await loadProfile();  // 프로필 재로드

    console.log('서버 응답:', response.data);
    Object.assign(profile, response.data);
    isEditing.value = false;
    showSaveModal.value = false;
    previewImage.value = null;
    alert('프로필이 성공적으로 저장되었습니다.');
  } catch (error) {
    console.error('프로필 저장 중 오류 발생:', error);
    console.error('오류 상세 정보:', error.response ? error.response.data : '응답 없음');
    alert('프로필 저장에 실패했습니다. 자세한 내용은 콘솔을 확인해주세요.');
  }
};

    // Base64를 Blob으로 변환하는 유틸리티 함수
    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    };

    const showDeactivateConfirmation = () => {
      showDeactivateModal.value = true;
    };

    const closeDeactivateModal = () => {
      showDeactivateModal.value = false;
    };

    const confirmDeactivate = async () => {
      try {
        await axios.put(`${API_URL}/api/v1/mypage/profile/deactivate/${profile.id}`);
        showDeactivateModal.value = false;
        alert('프로필이 성공적으로 비활성화되었습니다.');
        // 여기서 로그아웃 처리나 홈페이지로 리다이렉트 등을 수행할 수 있습니다.
      } catch (error) {
        console.error('프로필 비활성화에 실패했습니다:', error);
        alert('프로필 비활성화에 실패했습니다. 자세한 내용은 콘솔을 확인해주세요.');
      }
    };

    onMounted(() => {
      loadProfile();
    });

    return {
      profile,
      isEditing,
      imageInput,
      previewImage,
      showSaveModal,
      showDeactivateModal,
      profileImageUrl,
      toggleEditMode,
      addCertificate,
      removeCertificate,
      triggerImageUpload,
      handleImageUpload,
      showConfirmModal,
      closeSaveModal,
      confirmSave,
      showDeactivateConfirmation,
      closeDeactivateModal,
      confirmDeactivate,
      handleImageUpload,
      saveProfile,
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css');

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
  color: #007bff;
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
  background-color: #28a745;
  color: white;
}

.confirm-button:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.cancel-button {
  background-color: #dc3545;
  color: white;
}

.cancel-button:hover {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* 애니메이션 효과 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-content {
  animation: fadeIn 0.3s ease-out;
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