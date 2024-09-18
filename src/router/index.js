import { createRouter, createWebHistory } from 'vue-router';

// 기본 뷰 및 컴포넌트
const Main = () => import("../views/indexView.vue");
const Curation = () => import("../views/curationView.vue");
const BoardList = () => import("../components/board/boardList.vue");
const PostDetail = () => import("../components/board/postDetail.vue");
const PostForm = () => import("../components/board/postForm.vue");
const Certificate = () => import("../views/certificateView.vue");
const TestJobs = () => import("../views/testJobsView.vue");
const CertificateSearch = () => import("../components/certificate/certificateSearch.vue");
const Mypage = () => import("../components/mypage/mypage.vue");
const Login = () => import("../views/loginView.vue");
const Signup = () => import("../views/signUp.vue");
const ProfilePage = () => import("../components/mypage/profilePage.vue");
const NoticeMainV = () => import("../views/noticeMainV.vue");
const NoticeMain = () => import("../components/notice/noticeMain.vue");
const NoticeFAQ = () => import("../components/notice/noticeFAQ.vue");
const NoticeDetail = () => import("../components/notice/noticeDetail.vue");
const Manager = () => import("../views/managerMainV.vue");
const ManagerMain = () => import("../components/manager/managerMain.vue");
const ManagerFAQ = () => import("../views/managerFaq.vue");
const ManagerNotice = () => import("../views/managerNotice.vue");
const ManagerUser = () => import("../views/managerUser.vue");
const AdminUser = () => import("../components/manager/adminMain.vue");
const ManagerFAQPost = () => import("../components/manager/faqPost.vue");
const ManagerFAQModify = () => import("../components/manager/faqModify.vue");
const ManagerNoticeModify = () => import("../components/manager/noticeModify.vue");
const ManagerNoticePost = () => import("../components/manager/noticePost.vue");
const MyHome = () => import("../components/mypage/myhome.vue");
const ResumeManagementPage = () => import("../components/mypage/resumeManagementPage.vue");
const ApplicationsPageComponent = () => import("../components/mypage/applicationsPageComponent.vue");
const ScrapPage = () => import("../components/mypage/scrapPage.vue");
const CertificatesPage = () => import("../components/mypage/certificatesPage.vue");
const Error = () => import("../views/errorView.vue");
const Terms = () => import("../views/termsView.vue");
 
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/',
      name: 'home',
      component: Main
    },
    {
      path: '/board/:category?',
      name: 'boardList',
      component: BoardList,
    },
    {
      path: '/post/:id',
      name: 'postDetail',
      component: PostDetail,
    },
    {
      path: '/post-form/:category?',
      name: 'postForm',
      component: PostForm,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: Mypage,
      children: [
        {
          path: '',
          name: 'myHome',
          component: MyHome
        },
        {
          path: 'profile',
          name: 'profilePage',
          component: ProfilePage
        },
        {
          path: 'resume',
          name: 'resumePage',
          component: ResumeManagementPage
        },
        {
          path: 'applications',
          name: 'applicationsPage',
          component: ApplicationsPageComponent
        },
        {
          path: 'scrap',
          name: 'scrapPage',
          component: ScrapPage
        },
        {
          path: 'certificates',
          name: 'certificatesPage',
          component: CertificatesPage
        }
      ]
    },
    {
      path: '/curation',
      name: 'curation',
      component: Curation
    },
    {
      path: '/curation/:id',
      name: 'curationDetail',
      component: Curation
    },
    {
      path: '/certificate',
      name: 'certificate',
      component: Certificate
    },
    {
      path: "/testJobs",
      name: "testJobs",
      component: TestJobs
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/signUp',
      component: Signup
    },
    {
      path: '/notice',
      component: NoticeMainV,
      redirect: '/notice/noticeMain', 
      children: [
        {
          path: 'noticeMain',
          name: 'noticeMain',
          component: NoticeMain
        },
        {
          path: 'noticeFAQ',
          name: 'noticeFAQ',
          component: NoticeFAQ, 
        },
        {
          path: 'notice/:id',
          name: 'noticeDetail',
          component: NoticeDetail,
          props: true,
        }
      ]
    },
    {
      path: '/manager',
      name: 'manager',
      component: Manager,
      redirect: '/manager/main',
      children: [
        {
          path: 'main',
          component: ManagerMain
        },
        {
          path: 'userList',
          component: ManagerUser
        },
        {
          path: 'adminMain', 
          component: AdminUser
        },
        {
          path: 'noticeList', 
          component: ManagerNotice
        },
        {
          path: 'noticePost', 
          component: ManagerNoticePost
        },
        {
          path: 'noticeModify',
          component: ManagerNoticeModify
        },
        {
          path: 'faqList', 
          component: ManagerFAQ
        },
        {
          path: 'faqPost', 
          component: ManagerFAQPost
        },
        {
          path: 'faqModify/:id',
          name: 'ManagerFaqModify',
          component: ManagerFAQModify,
          props: true
        },

      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Error',
      component: Error
    },
    {
      path: '/terms',
      name: 'terms',
      component: Terms
    }
  ]
});

export default router;