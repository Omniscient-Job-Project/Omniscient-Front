import { createRouter, createWebHistory } from 'vue-router';

const Main = () => import("../views/indexView.vue");
const Curation = () => import("../views/curationView.vue");
const Board = () => import("../components/header/header.vue");
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
const LoginDetail = () => import("../components/login/loginDetail.vue");
const AdminUser = () => import("../components/manager/adminMain.vue");
const NoticePost = () => import("../components/manager/noticePost.vue");
const ManagerFAQPost = () => import("../components/manager/faqPost.vue");


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/',
      name: 'home',
      component: Main
    },
    { 
      path: '/board',
      name: 'board',
      component: Board
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
      component: Login,
      children: [
        {
          path: 'detail',
          component: LoginDetail // 'detail' 경로에서 LoginDetail 컴포넌트 렌더링
        }
      ]
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
          path: 'admin/userList',
          component: ManagerUser
        },
        {
          path: 'admin/adminMain', 
          component: AdminUser
        },
        {
          path: 'notice/noticeList', 
          component: ManagerNotice
        },
        {
          path: 'notice/noticePost', 
          component:NoticePost
        },
        {
          path: 'faq/faqList', 
          component: ManagerFAQ
        },
        {
          path: 'faq/faqPost', 
          component: ManagerFAQPost
        },

      ]
    },
  ]
})

export default router;
