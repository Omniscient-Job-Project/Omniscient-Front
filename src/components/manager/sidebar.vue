<template>
  <div class="sidebar-wrapper">
    <div class="sidebar-con d-flex flex-column">
      <!-- 메뉴 그룹 -->
      <div class="list-group list-group-flush">
        <!-- 홈화면 -->
        <div class="menu-group">
          <router-link class="menu-item" to="/manager">
            홈화면
          </router-link>
        </div>
        <hr class="divider">

        <!-- 회원 메뉴 -->
        <div class="menu-group">
          <button class="menu-group-header">회원</button>
          <div class="submenu">
            <router-link class="list-group-item list-group-item-action sidebar-text" to="/manager/admin/userList">
              회원목록
            </router-link>
            <router-link class="list-group-item list-group-item-action sidebar-text" to="/manager/admin/adminMain">
              회원권한설정
            </router-link>
          </div>
        </div>
        <hr>

        <!-- 공지 관리 메뉴 -->
        <div class="menu-group">
          <button class="menu-group-header">공지 관리</button>
          <div class="submenu">
            <router-link class="list-group-item list-group-item-action sidebar-text" to="/manager/notice/noticeList">
              공지목록
            </router-link>
            <router-link class="list-group-item list-group-item-action sidebar-text" to="/manager/notice/noticePost">
              공지등록
            </router-link>
          </div>
        </div>
        <hr>

        <!-- F&Q 메뉴 -->
        <div class="menu-group">
          <button class="menu-group-header">F&Q</button>
          <div class="submenu">
            <router-link class="list-group-item list-group-item-action sidebar-text" to="/manager/faq/faqList">
              F&Q목록
            </router-link>
            <router-link class="list-group-item list-group-item-action sidebar-text" to="/manager/faq/faqPost">
              F&Q등록
            </router-link>
          </div>
        </div>
        <hr>

        <!-- 종료 -->
        <div class="menu-group">
          <button class="menu-group-header" @click="showConfirmation">종료</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter();

function showConfirmation() {
  Swal.fire({
    title: '종료 확인',
    text: '종료하고 돌아가시겠습니까?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '확인',
    cancelButtonText: '취소'
  }).then((result) => {
    if (result.isConfirmed) {
      router.push('/');
    }
  });
}
</script>

<style scoped>
.sidebar-wrapper {
  background-color: #c1eece !important;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  position: fixed;
  top: 60px; /* 헤더 높이에 맞춰 조정 (헤더가 60px 높이인 경우) */
  left: 0;
  height: calc(100% - 60px); /* 헤더 높이만큼 빼기 */
  width: 250px;
  overflow-y: auto;
  z-index: 1; /* 헤더보다 낮은 값으로 설정 */
}

.sidebar-con {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-title {
  font-family: "LINESeedKR-Bd";
  font-size: 28px;
  color: #1eaf49;
  margin-top: 30px;
}

.sidebar-text {
  font-family: "LINESeedKR-Bd";
  font-size: 16px;
  color: #0a0a0a;
  margin-top: 5px;
  margin-bottom: 5px;
  text-align: center;
  cursor: pointer;
}

.menu-group {
  margin-top: 10px;
}

.menu-group-header {
  background-color: #1eaf49;
  color: white;
  border: none;
  font-size: 16px;
  padding: 10px;
  text-align: left;
  cursor: pointer;
  width: 100%;
}

.menu-item {
  display: block;
  background-color: #1eaf49;
  color: white;
  text-decoration: none;
  padding: 10px;
  font-size: 16px;
  text-align: left;
  width: 100%;
}

.submenu {
  display: flex;
  flex-direction: column;
}

.submenu .list-group-item {
  border: none !important;
  padding-left: 30px;
}

.list-group-item {
  border: none !important;
}

.divider {
  border: none;
  border-top: 1px solid #ddd;
}

@media (max-width: 992px) {
  .sidebar-wrapper {
    width: 100%;
  }
}
</style>
