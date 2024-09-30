import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Pinia 인스턴스 생성
const pinia = createPinia();

const app = createApp(App);

// Pinia와 라우터를 플러그인으로 등록
app.use(pinia);
app.use(router);
app.mount('#app');