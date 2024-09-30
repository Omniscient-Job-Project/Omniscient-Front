<template>
  <div class="terms-outer-container">
  <div class="terms-container">
    <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div class="terms-content" v-if="showTerms">
        <h1 class="terms-title">이용약관</h1>
        <div class="terms-sections">
          <section v-for="(section, index) in sections" :key="index" class="terms-section">
            <h2 class="section-title">{{ section.title }}</h2>
            <p>{{ section.content }}</p>
          </section>
        </div>
        <div class="terms-footer">
          <p>약관에 대한 문의는 <a href="https://github.com/Omniscient-Job-Project" class="link">전직시</a>로 연락해 주세요.</p>
        </div>
      </div>
    </transition>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';

const showTerms = ref(true);

const sections = [
  { title: "1. 서비스 이용", content: "전지적 구직자 시점 이용약관에 오신 것을 환영합니다. 본 약관은 사용자의 권리와 의무를 규정하며, 서비스 이용에 관한 사항을 안내합니다." },
  { title: "2. 사용자 의무", content: "사용자는 서비스를 이용함에 있어 법적 책임을 지며, 허위 정보를 입력하거나 불법적인 행위를 하지 않아야 합니다." },
  { title: "3. 개인정보 보호", content: "사용자의 개인정보는 관련 법령에 따라 보호됩니다. 개인정보 처리방침을 참조해 주세요." },
  { title: "4. 서비스 변경 및 중단", content: "회사는 서비스의 일부 또는 전체를 언제든지 변경하거나 중단할 수 있습니다." },
  { title: "5. 면책 조항", content: "회사는 서비스 이용으로 발생한 문제에 대해 책임을 지지 않습니다." },
  { title: "6. 약관 변경", content: "회사는 본 약관을 변경할 수 있으며, 변경된 약관은 웹사이트에 공지합니다." },
];

const beforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
};

const enter = (el, done) => {
  el.style.transition = 'all 0.5s ease';
  el.style.opacity = 1;
  el.style.transform = 'translateY(0)';
  done();
};

const leave = (el, done) => {
  el.style.transition = 'all 0.5s ease';
  el.style.opacity = 0;
  el.style.transform = 'translateY(20px)';
  done();
};
</script>

<style scoped>

.terms-outer-container {
  background-color: #E6F3FF;
  min-height: 100vh;
  padding: 40px 20px;
}

.terms-container {
  max-width: 1100px;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  color: #333;
  line-height: 0.8;
}

.terms-content {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: all 0.5s ease;
}

.terms-title {
  font-size: 2.2em;
  margin-bottom: 25px;
  text-align: center;
  color: #2c3e50;
  font-weight: bold;
}

.terms-sections {
  display: grid;
  gap: 20px;
}

.terms-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.terms-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.2em;
  margin-bottom: 12px;
  color: #3498db;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
}

.terms-footer {
  margin-top: 25px;
  text-align: center;
  font-style: italic;
  color: #7f8c8d;
}

.link {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link:hover {
  color: #2980b9;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .terms-outer-container {
    padding: 20px 15px;
  }

  .terms-content {
    padding: 20px 15px;
  }

  .terms-title {
    font-size: 1.8em;
  }

  .section-title {
    font-size: 1.1em;
  }
}

/* Fade animation */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>