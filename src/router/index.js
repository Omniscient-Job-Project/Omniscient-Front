import { createRouter, createWebHistory } from 'vue-router'
// import {
//   useCurationStore,
// } from "@/stores/rootstore.js";

const Main = () => import("../views/indexView.vue");
const Curation = () => import("../views/curationView.vue");
const Certificate = () => import("../components/certificate/certificate.vue");
const CertificateSearch = () => import("../components/certificate/certificateSearch.vue");
const Mypage = () => import("../components/mypage/mypage.vue");
const ProfilePage = () => import("../components/mypage/profilePage.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: Mypage,
      children: [
        {
          path: 'profilePage',
          name: 'profilePage',
          component: ProfilePage
        }
      ]
    },
    {
      path: '/curationselect',
      name: 'curationselect',
      component: Curation
    },
    {
      path: '/certificate',
      name: 'certificate',
      component: Certificate
    },
    {
      path: '/certificateSearch',
      name: 'certificateSearch',
      component: CertificateSearch
    },
    
  ]
})

export default router
