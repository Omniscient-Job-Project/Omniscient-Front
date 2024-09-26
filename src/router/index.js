import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { useUserAuthStore } from '@/stores/userAuth';
// 기본 뷰 및 컴포넌트

// 메인 페이지
const Main = () => import("../views/indexView.vue");

// 채용 페이지
const Curation = () => import("../views/curationView.vue");

// 자유 게시판 페이지
const BoardList = () => import("../components/board/boardList.vue");
const PostDetail = () => import("../components/board/postDetail.vue");
const PostForm = () => import("../components/board/postForm.vue");

// 자격증 페이지
const Certificate = () => import("../views/certificateView.vue");
const TestJobs = () => import("../views/testJobsView.vue");

// 로그인 & 로그아웃 페이지
const Login = () => import("../views/loginView.vue");
const Signup = () => import("../views/signUp.vue");
const AdminLogin =() => import("../views/adminLoginView.vue");
const AdminSignup =() => import("../views/adminSignupView.vue");

const Mypage = () => import("../components/mypage/mypage.vue");
const ProfilePage = () => import("../components/mypage/profilePage.vue");

// 공지사항 페이지
const NoticeMainV = () => import("../views/noticeMainV.vue");
const NoticeMain = () => import("../components/notice/noticeMain.vue");
const NoticeFAQ = () => import("../components/notice/noticeFAQ.vue");
const NoticeDetail = () => import("../components/notice/noticeDetail.vue");


// 관리자 페이지
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


// 마이페이지
const MyHome = () => import("../components/mypage/myhome.vue");
const ResumeManagementPage = () => import("../components/mypage/resumeManagementPage.vue");
const ApplicationsPageComponent = () => import("../components/mypage/applicationsPageComponent.vue");
const ScrapPage = () => import("../components/mypage/scrapPage.vue");
const CertificatesPage = () => import("../components/mypage/certificatesPage.vue");

// 에러 페이지
const Error = () => import("../views/errorView.vue");

// 이용약관 페이지
const Terms = () => import("../views/termsView.vue");
 
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    // 홈
    { 
      path: '/',
      name: 'home',
      component: Main
    },


    // 자유게시판 페이지
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


    // 마이페이지
    {
      path: '/mypage',
      name: 'mypage',
      component: Mypage,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        const userAuthStore = useUserAuthStore();
        if (authStore.isLoggedIn || userAuthStore.isLoggedIn) {
          alert('로그인을 해주세요.'); 
          next();
        } else {
          next('/login'); 
        }
      },
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

    // 채용 페이지
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


    // 자격증 페이지
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

    // 로그인 & 로그아웃 페이지
    {
      path:'/adminLogin',
      component: AdminLogin
    },
    {
      path: '/adminSignup',
      component: AdminSignup,
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/signUp',
      component: Signup
    },

    // 공지사항 페이지
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

    // 관리자 페이지
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
          path: 'faqModify/:faqId',
          name: 'ManagerFaqModify',
          component: ManagerFAQModify,
          props: true
        },

      ]
    },


    // 에러 페이지
    {
      path: '/:pathMatch(.*)*',
      name: 'Error',
      component: Error
    },

    // 이용약관 페이지
    {
      path: '/terms',
      name: 'terms',
      component: Terms
    }
  ]
});

export default router;