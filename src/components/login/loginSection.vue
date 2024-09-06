  <script setup>
  import { useRoute } from 'vue-router';
  import Login from './login.vue';
  import LoginDetail from './loginDetail.vue';

  const route = useRoute();

  // 현재 경로가 '/login'인지 확인
  const isLoginRoute = route.path === '/login';

  // 현재 경로가 '/login/detail'인지 확인
  const isLoginDetailRoute = route.path === '/login/detail';
</script>

<template>
  <div>
    <!-- 현재 경로가 '/login'이면 Login 컴포넌트를 렌더링 -->
    <Login v-if="isLoginRoute" />
    <!-- 현재 경로가 '/login/detail'이면 LoginDetail 컴포넌트를 렌더링 -->
    <LoginDetail v-if="isLoginDetailRoute" />
  </div>
</template>

<style>
/* 스타일을 여기에 추가할 수 있습니다. */
</style>