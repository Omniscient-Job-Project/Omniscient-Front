<template>
    <Header />
    <div class="container">
        <div class="select">
            <p>보유하고 있는 자격증 또는 취득할 자격증을 선택하세요.</p>
        </div>
        <div class="input-group mb-3">
            <input type="text" class="form-control" placeholder="자격증의 이름을 입력하세요." aria-label="자격증"
                aria-describedby="button-addon2">
        </div>
        <div class="button-container">
            <button class="btn btn-outline-secondary" type="button" id="button-addon2">선택 완료</button>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import Header from '@/components/header/header.vue'; // 헤더 컴포넌트 임포트
import Footer from '@/components/footer/footer.vue'; // 풋터 불러오기
import '@/assets/css/curation/curationSelect.css'
</script>

<style>
/* 전체 레이아웃 */
.container {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center; /* 수평 가운데 정렬 */
    min-height: 80vh; 
}

.select {
    width: 50%; /* 인풋창의 너비와 동일하게 설정 */
    margin-top: 40px;
    text-align: left; /* 왼쪽 정렬 */
}

.input-group {
    width: 50%; /* 인풋 창의 너비를 화면의 50%로 설정 */
}

.form-control {
    width: 100%; /* 인풋창이 가능한 한 넓게 차지하도록 설정 */
    height: 6vh;

}

.button-container {
    width: 50%;
    display: flex;
    justify-content: flex-end; /* 버튼을 오른쪽 끝에 정렬 */
    margin-top: 10px; /* 버튼과 인풋창 사이의 간격 */
}

.btn {
    width: 100px;
    height: 6vh;
    background-color: #0166FF; /* 버튼 색상 */
    color: white; /* 버튼 텍스트 색상 */
}

.btn:hover {
    background-color: #002e83; /* 호버 시 버튼 색상 */
    color: white;
}

</style>
