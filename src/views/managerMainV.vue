<template>
  <div class="layout-container">
    <Header />
    <div class="content">
      <Sidebar />
      <div class="main-content">
        <router-view></router-view> <!-- 여기에서 하위 라우트 컴포넌트를 렌더링합니다 -->
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Header from "@/components/header/header.vue";
import Footer from "@/components/footer/footer.vue";
import Sidebar from "@/components/manager/sidebar.vue";
import ManagerMain from "@/components/manager/managerMain.vue";

</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  display: flex;
  flex: 1;
}

.sidebar {
  width: 250px; /* 사이드바 너비 */
  background-color: #f5f5f5;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}
</style>
