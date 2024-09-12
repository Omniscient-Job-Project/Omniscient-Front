<!-- ApplicationsPageComponent.vue -->
<template>
    <div class="applications-page">
      <h1 class="page-title"><i class="fas fa-briefcase"></i> 지원 현황</h1>
      <div class="applications-summary">
        <div class="summary-item">
          <i class="fas fa-paper-plane"></i>
          <p>전체 지원</p>
          <span>{{ totalApplications }}</span>
        </div>
        <div class="summary-item">
          <i class="fas fa-hourglass-half"></i>
          <p>서류 심사 중</p>
          <span>{{ inReviewApplications }}</span>
        </div>
        <div class="summary-item">
          <i class="fas fa-user-check"></i>
          <p>서류 통과</p>
          <span>{{ passedApplications }}</span>
        </div>
        <div class="summary-item">
          <i class="fas fa-times-circle"></i>
          <p>불합격</p>
          <span>{{ rejectedApplications }}</span>
        </div>
      </div>
      <div class="applications-list">
        <h2 class="section-title">지원 목록</h2>
        <div v-for="application in applications" :key="application.id" class="application-item" @click="openModal(application)">
          <div class="company-logo">
            <img :src="application.companyLogo" :alt="application.companyName">
          </div>
          <div class="application-details">
            <h3>{{ application.position }}</h3>
            <p class="company-name">{{ application.companyName }}</p>
            <p class="application-date">지원일: {{ formatDate(application.applicationDate) }}</p>
          </div>
          <div class="application-status" :class="application.status.toLowerCase()">
            {{ getStatusText(application.status) }}
          </div>
        </div>
      </div>
  
      <!-- 상세 정보 모달 -->
      <div v-if="selectedApplication" class="modal" @click="closeModal">
        <div class="modal-content" @click.stop>
          <span class="close" @click="closeModal">&times;</span>
          <h2>{{ selectedApplication.position }}</h2>
          <div class="modal-company-info">
            <img :src="selectedApplication.companyLogo" :alt="selectedApplication.companyName" class="modal-company-logo">
            <div>
              <h3>{{ selectedApplication.companyName }}</h3>
              <p>지원일: {{ formatDate(selectedApplication.applicationDate) }}</p>
              <p>상태: <span :class="selectedApplication.status.toLowerCase()">{{ getStatusText(selectedApplication.status) }}</span></p>
            </div>
          </div>
          <div class="modal-details">
            <h4>직무 설명</h4>
            <p>{{ selectedApplication.jobDescription }}</p>
            <h4>요구 사항</h4>
            <ul>
              <li v-for="(req, index) in selectedApplication.requirements" :key="index">{{ req }}</li>
            </ul>
            <h4>지원 절차</h4>
            <ol>
              <li v-for="(step, index) in selectedApplication.applicationProcess" :key="index" 
                  :class="{ 'completed': selectedApplication.currentStep > index, 'current': selectedApplication.currentStep === index }">
                {{ step }}
              </li>
            </ol>
          </div>
          <div class="modal-actions">
            <button @click="withdrawApplication" class="withdraw-btn">지원 취소</button>
            <button @click="contactCompany" class="contact-btn">회사 연락하기</button>
          </div>
        </div>
      </div>
  
      <!-- 확인 모달 -->
      <div v-if="showConfirmModal" class="modal" @click="cancelWithdrawal">
        <div class="modal-content confirm-modal" @click.stop>
          <h3>지원 취소 확인</h3>
          <p>정말로 이 지원을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
          <div class="modal-actions">
            <button @click="confirmWithdrawal" class="confirm-btn">확인</button>
            <button @click="cancelWithdrawal" class="cancel-btn">취소</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ApplicationsPageComponent',
    data() {
      return {
        applications: [
          {
            id: 1,
            companyName: '테크 이노베이션',
            companyLogo: '/images/tech-innovation-logo.png',
            position: '프론트엔드 개발자',
            applicationDate: '2024-08-15',
            status: 'IN_REVIEW',
            jobDescription: '최신 웹 기술을 활용한 사용자 중심의 웹 애플리케이션 개발',
            requirements: ['React 또는 Vue.js 경험', 'HTML, CSS, JavaScript 능숙', '반응형 웹 디자인 경험'],
            applicationProcess: ['서류 전형', '코딩 테스트', '기술 면접', '임원 면접'],
            currentStep: 1
          },
          {
            id: 2,
            companyName: '글로벌 소프트',
            companyLogo: '/images/global-soft-logo.png',
            position: '풀스택 개발자',
            applicationDate: '2024-08-10',
            status: 'PASSED',
            jobDescription: '클라우드 기반 엔터프라이즈 솔루션 개발 및 유지보수',
            requirements: ['Node.js 백엔드 경험', 'AWS 또는 Azure 경험', 'SQL 및 NoSQL 데이터베이스 경험'],
            applicationProcess: ['서류 전형', '1차 기술 면접', '2차 임원 면접'],
            currentStep: 2
          },
          {
            id: 3,
            companyName: '데이터 솔루션즈',
            companyLogo: '/images/data-solutions-logo.png',
            position: 'UI/UX 개발자',
            applicationDate: '2024-08-05',
            status: 'REJECTED',
            jobDescription: '데이터 시각화 도구 및 대시보드 디자인 및 개발',
            requirements: ['D3.js 또는 유사 라이브러리 경험', 'Figma 또는 Sketch 사용 능력', 'UI/UX 디자인 원칙 이해'],
            applicationProcess: ['포트폴리오 검토', '기술 면접', '디자인 과제', '최종 면접'],
            currentStep: 0
          },
        ],
        selectedApplication: null,
        showConfirmModal: false
      };
    },
    computed: {
      totalApplications() {
        return this.applications.length;
      },
      inReviewApplications() {
        return this.applications.filter(app => app.status === 'IN_REVIEW').length;
      },
      passedApplications() {
        return this.applications.filter(app => app.status === 'PASSED').length;
      },
      rejectedApplications() {
        return this.applications.filter(app => app.status === 'REJECTED').length;
      }
    },
    methods: {
      formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ko-KR', options);
      },
      getStatusText(status) {
        const statusMap = {
          IN_REVIEW: '서류 심사 중',
          PASSED: '서류 통과',
          REJECTED: '불합격'
        };
        return statusMap[status] || status;
      },
      openModal(application) {
        this.selectedApplication = application;
      },
      closeModal() {
        this.selectedApplication = null;
        this.showConfirmModal = false;
      },
      withdrawApplication() {
        this.showConfirmModal = true;
      },
      confirmWithdrawal() {
        if (this.selectedApplication) {
          const index = this.applications.findIndex(app => app.id === this.selectedApplication.id);
          if (index !== -1) {
            this.applications.splice(index, 1);
          }
          this.showConfirmModal = false;
          this.closeModal();
          // 사용자에게 피드백 제공
          this.$nextTick(() => {
            alert('지원이 성공적으로 취소되었습니다.');
          });
        }
      },
      cancelWithdrawal() {
        this.showConfirmModal = false;
      },
      contactCompany() {
        alert('회사 담당자에게 메시지를 보냈습니다.');
      }
    }
  };
  </script>
  
  <style scoped>
.applications-page {
  padding: 20px;
}

.page-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
}

.page-title i {
  margin-right: 10px;
  color: #007bff;
}

.applications-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.summary-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  flex: 1;
  margin: 0 10px;
}

.summary-item i {
  color: #007bff;
  font-size: 24px;
  margin-bottom: 10px;
}

.summary-item p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.summary-item span {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.section-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.application-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.application-item:hover {
  transform: translateY(-5px);
}

.company-logo {
  width: 80px;
  height: 80px;
  margin-right: 20px;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.application-details {
  flex-grow: 1;
}

.application-details h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 5px;
}

.company-name {
  font-size: 16px;
  color: #666;
  margin-bottom: 5px;
}

.application-date {
  font-size: 14px;
  color: #999;
}

.application-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.application-status.in_review {
  background-color: #ffeeba;
  color: #856404;
}

.application-status.passed {
  background-color: #d4edda;
  color: #155724;
}

.application-status.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.modal {
  display: flex;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.modal-company-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.modal-company-logo {
  width: 60px;
  height: 60px;
  margin-right: 20px;
  object-fit: contain;
}

.modal-details h4 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #333;
}

.modal-details ul, .modal-details ol {
  padding-left: 20px;
}

.modal-details li {
  margin-bottom: 5px;
}

.modal-details .completed {
  color: #28a745;
}

.modal-details .current {
  font-weight: bold;
  color: #007bff;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.withdraw-btn {
  background-color: #dc3545;
  color: white;
}

.withdraw-btn:hover {
  background-color: #c82333;
}

.contact-btn {
  background-color: #28a745;
  color: white;
}

.contact-btn:hover {
  background-color: #218838;
}

.confirm-modal {
  max-width: 400px;
  text-align: center;
}

.confirm-modal h3 {
  margin-bottom: 15px;
}

.confirm-modal p {
  margin-bottom: 20px;
}

.confirm-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  margin: 0 10px;
}

.confirm-btn {
  background-color: #dc3545;
  color: white;
}

.confirm-btn:hover {
  background-color: #c82333;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
}

.cancel-btn:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .applications-summary {
    flex-wrap: wrap;
  }

  .summary-item {
    flex-basis: calc(50% - 20px);
    margin-bottom: 20px;
  }

  .application-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .company-logo {
    margin-bottom: 15px;
  }

  .application-status {
    margin-top: 15px;
    align-self: flex-start;
  }

  .modal-content {
    width: 95%;
    padding: 15px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-actions button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>