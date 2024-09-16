<template>
    <div class="terms-container">
      <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
        <div class="terms-content" v-if="showTerms">
          <h1 class="terms-title">이용약관</h1>
          <section class="terms-section">
            <h2 class="section-title">1. 서비스 이용</h2>
            <p>전지적 구직자 시점 이용약관에 오신 것을 환영합니다. 본 약관은 사용자의 권리와 의무를 규정하며, 서비스 이용에 관한 사항을 안내합니다.</p>
          </section>
          <section class="terms-section">
            <h2 class="section-title">2. 사용자 의무</h2>
            <p>사용자는 서비스를 이용함에 있어 법적 책임을 지며, 허위 정보를 입력하거나 불법적인 행위를 하지 않아야 합니다.</p>
          </section>
          <section class="terms-section">
            <h2 class="section-title">3. 개인정보 보호</h2>
            <p>사용자의 개인정보는 관련 법령에 따라 보호됩니다. 개인정보 처리방침을 참조해 주세요.</p>
          </section>
          <section class="terms-section">
            <h2 class="section-title">4. 서비스 변경 및 중단</h2>
            <p>회사는 서비스의 일부 또는 전체를 언제든지 변경하거나 중단할 수 있습니다.</p>
          </section>
          <section class="terms-section">
            <h2 class="section-title">5. 면책 조항</h2>
            <p>회사는 서비스 이용으로 발생한 문제에 대해 책임을 지지 않습니다.</p>
          </section>
          <section class="terms-section">
            <h2 class="section-title">6. 약관 변경</h2>
            <p>회사는 본 약관을 변경할 수 있으며, 변경된 약관은 웹사이트에 공지합니다.</p>
          </section>
          <section class="terms-section">
            <h2 class="section-title">7. 문의</h2>
            <p>약관에 대한 문의는 <a href="mailto:support@example.com">무한열차</a>으로 연락해 주세요.</p>
          </section>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const showTerms = ref(true); // 기본적으로 약관을 표시하도록 설정
  
  // 애니메이션 효과를 위해 추가된 메서드들
  const beforeEnter = (el) => {
    el.style.opacity = 0;
    el.style.transform = 'scale(0.95)';
  };
  
  const enter = (el, done) => {
    el.offsetHeight; // trigger reflow
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    el.style.opacity = 1;
    el.style.transform = 'scale(1)';
    done();
  };
  
  const leave = (el, done) => {
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    el.style.opacity = 0;
    el.style.transform = 'scale(0.95)';
    done();
  };
  </script>
  
  <style scoped>
  .terms-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .terms-title {
    font-size: 2em;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .terms-section {
    margin-bottom: 20px;
  }
  
  .section-title {
    font-size: 1.5em;
    margin-bottom: 10px;
    color: #2c3e50;
  }
  
  .terms-content {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
    padding: 20px;
    transition: opacity 0.5s ease, transform 0.5s ease; /* 애니메이션 효과 */
  }
  
  /* 애니메이션 스타일 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
    transform: scale(0.95);
  }
  </style>
  