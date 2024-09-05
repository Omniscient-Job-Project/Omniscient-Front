import { createRouter, createWebHistory } from 'vue-router';

import Main from '../views/indexView.vue';
import Curation from '../views/curationView.vue';
import Certificate from '../components/certificate/certificate.vue';


// 진희님 관리자 페이지 import
// import ManagerMainV from '../views/managerMainV.vue';
// import ManagerFaqMain from '../views/managerFaq.vue';
// import ManagerFaqList from '../components/manager/faqList.vue';
// import ManagerFaqPost from '../components/manager/faqPost.vue';
// import ManagerFaqModify from '../components/manager/faqModify.vue';
// import ManagerUser from '../views/managerUser.vue';
// import ManagerUserList from '../components/manager/userList.vue';
// import ManagerAdminMain from '../components/manager/adminMain.vue';
// import ManagerNotice from '../views/managerNotice.vue';
// import ManagerNoticeList from '../components/manager/noticeList.vue';
// import ManagerNoticePost from '../components/manager/noticePost.vue';
// import ManagerNoticeModify from '../components/manager/noticeModify.vue';


const CertificateSearch = () => import("../components/certificate/certificateSearch.vue");
const Mypage = () => import("../components/mypage/mypage.vue");
const ProfilePage = () => import("../components/mypage/profilePage.vue");

const routes = [
  {
    path: '/',
    name: 'home',
    component: Main,
  },
  {
    path: '/curationselect',
    name: 'curationselect',
    component: Curation,
  },
  {
    path: '/certificate',
    name: 'certificate',
    component: Certificate,
  },
];


// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});


// 진희님 라우터
// Function to reset stores
// function resetStores() {
//   const curationStore = useCurationStore();
//   const managerMain = useManagerMain();
//   const managerUser = useManagerUser();
//   const managerAdmin = useManagerAdmin();
//   const managerNotice = useManagerNotice();
//   const managerFaq = useManagerFaq();

//   curationStore.setRoot("");
//   managerMain.setRoot("/manager");
//   managerUser.setRoot("/manager/admin/userList");
//   managerAdmin.setRoot("/manager/admin/adminMain");
//   managerNotice.setRoot("/manager/notice/noticeList");
//   managerFaq.setRoot("/manager/faq/faqList");
// }

// Export router instance
export default router;