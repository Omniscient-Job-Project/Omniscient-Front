import { createRouter, createWebHistory } from 'vue-router';
// import {
//   useCurationStore,
//   useManagerMainV,
//   useManagerMain,
//   useManagerFaq,
//   useManager,
//   useManagerAdmin,
//   useManagerNotice,
//   useManagerUser,
// } from "@/stores/rootstore.js";

const Main = () => import("../views/indexView.vue");
const Curation = () => import("../views/curationView.vue");
const Certificate = () => import("../components/certificate/certificate.vue");
const CertificateSearch = () => import("../components/certificate/certificateSearch.vue");
const Mypage = () => import("../components/mypage/mypage.vue");
const Login = () => import("../views/loginView.vue")
const ProfilePage = () => import("../components/mypage/profilePage.vue");
const Notice = () => import("../views/noticeView.vue");
const Manager = () => import("../views/managerMainV.vue");
const ManagerFAQ = () => import("../views/managerFaq.vue");
const ManagerNotice = () => import("../views/managerNotice.vue");
const ManagerUser = () => import("../views/managerUser.vue");


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
      path: '/curation',
      name: 'curation',
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
    {
      path: '/login',
      component: Login
    },
    {
      path: '/notice',
      component: Notice
    },
    {
      path: '/manager',
      name: 'manager',
      component: Manager,
      children:[
        {
          path: '/admin/userList',
          component: ManagerUser
        },
        // {
        //   path: '/admin/adminMain',
        //   component: ManagerMain
        // },
        {
          path: '/notice/noticeList',
          component: ManagerNotice
        },
        {
          path: '/faq/faqList',
          component: ManagerFAQ
        },
      ]
    },
  ]
})

// // 진희님 라우터
// function resetStores() {
//   const curationStore = useCurationStore();
//   const managerMain = useManagerMain();
//   const managerUser = useManagerUser();
//   const managerAdmin = useManagerAdmin();
//   const managerNotice = useManagerNotice();
//   const managerFaq = useManagerFaq();
//   const useManagerMainV = useManagerMainV();
//   const useManager = useManager();

//   curationStore.setRoot("/curation");
//   managerMain.setRoot("/manager");
//   managerUser.setRoot("/manager/admin/userList");
//   managerAdmin.setRoot("/manager/admin/adminMain");
//   managerNotice.setRoot("/manager/notice/noticeList");
//   managerFaq.setRoot("/manager/faq/faqList");
//   useManagerMainV.setRoot("/manager");
//   useManager.setRoot("/manager");
// }

export default router;