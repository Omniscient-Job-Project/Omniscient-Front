<template>
  <div class="page-background">
    <Header />
    <div class="mypage-container">
      <!-- 사이드바 시작 -->
      <div class="sidebar">
        <ul>
          <li v-for="item in menuItems" :key="item.name" 
              @mouseover="onMouseOver(item.name)" 
              @mouseleave="onMouseLeave">
            <router-link :to="{ name: item.name }" :class="{ 'hover-effect': hoveredItem === item.name }">
              <i :class="item.icon"></i> {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 사이드바 끝 -->

      <!-- 메인 콘텐츠 영역 시작 -->
      <div class="main-content">
        <router-view></router-view>
      </div>
      <!-- 메인 콘텐츠 영역 끝 -->
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/header/header.vue';
import Footer from '@/components/footer/footer.vue';

// 메뉴 아이템 데이터
const menuItems = [
  { name: 'myHome', label: 'MyHome', icon: 'fas fa-home' },
  { name: 'profilePage', label: '프로필', icon: 'fas fa-user' },
  { name: 'resumePage', label: '이력서 관리', icon: 'fas fa-file-alt' },
  { name: 'applicationsPage', label: '지원 현황', icon: 'fas fa-briefcase' },
  { name: 'scrapPage', label: '스크랩', icon: 'fas fa-bookmark' },
  { name: 'certificatesPage', label: '자격증 관리', icon: 'fas fa-certificate' },
  { name: 'withdrawalPage', label: '회원 탈퇴', icon: 'fas fa-user-slash' }
];

const hoveredItem = ref(null);

const onMouseOver = (itemName) => {
  hoveredItem.value = itemName;
};

const onMouseLeave = () => {
  hoveredItem.value = null;
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

.page-background {
  background-color: #E6F3FF;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.mypage-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 50px 20px;
  box-sizing: border-box;
  flex-grow: 1;
}

.sidebar {
  width: 250px;
  background: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-right: 50px;
  flex-shrink: 0;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  margin-bottom: 15px;
}

.sidebar a {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: inherit;
  text-decoration: none;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.sidebar a.active {
  color: #007bff;
}

.sidebar a.hover-effect {
  background-color: #f0f0f0;
  color: #007bff;
  transform: translateX(5px);
}

.sidebar i {
  margin-right: 10px;
  width: 20px;
}

.main-content {
  flex-grow: 1;
  background: #FFFFFF;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 50px;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .mypage-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    margin-right: 0;
    margin-bottom: 30px;
  }

  .main-content {
    width: 100%;
  }
}
</style>