<template>
    <div class="logincontainer">
    <div class="loginBox">
        <div>
            <p>소셜 계정으로 간편 로그인</p>
        </div>
        <div class="loginButtons">
            <div class="naver">
                <img src="../../assets/img/naverlogin.png" alt="네이버로그인">
            </div>
            <div class="kakao">
                <img src="../../assets/img/kakaologin.png" alt="카카오로그인">
            </div>
            <div class="google">
                <img src="../../assets/img/googlelogin.png" alt="구글로그인">
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
</script>

<style>
.logincontainer {
    height: 70vh;
}

.loginBox {
    text-align: center;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 50%;
    margin: 0 auto;
}

.loginButtons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.loginButtons div {
    cursor: pointer;
    transition: transform 0.2s;
}

.loginButtons div:hover {
    transform: scale(1.1);
}

.loginButtons img {
    width: 150px;  /* 모든 이미지의 너비 고정 */
    height: 100px; /* 모든 이미지의 높이 고정 */
    object-fit: contain; /* 이미지 비율을 유지하며 박스에 맞춤 */
}
</style>
