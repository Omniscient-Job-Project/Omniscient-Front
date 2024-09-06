<template>
    <div class="logincontainer">
        <div class="omniscientLogo">
            <h1>전직시</h1>
        </div>
        <div class="loginBox">
            <form class="row g-3">
                <div class="form-floating mb-3">
                    <label for="floatingInput">아이디</label>
                    <input type="id" class="form-control" id="floatingInput" placeholder="name@naver.com">
                </div>
                <div class="form-floating">
                    <label for="floatingPassword">비밀번호</label>
                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
                </div>
                <div class="loginbutton">
                    <div class="col-auto">
                        <button type="submit" class="btn btn-primary mb-3">로그인</button>
                    </div>
                </div>
            </form>
        </div>
        <div class="membership">
            <RouterLink to="/login/detail">
                회원가입
            </RouterLink>
        </div>
        <div>
            <p>아이디 찾기</p>
            <p>비밀번호 찾기</p>
        </div>
    </div>
</template>

<script setup>
</script>

<style>
.logincontainer {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70%;
    height: 100vh;
    /* 전체 높이를 차지하도록 설정 */
    border: 1px solid #ffffff;
    /* 보더 박스 추가 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    /* 그림자 효과 */
}

.loginBox {
    width: 100%;
    max-width: 400px;
    /* 최대 너비 설정 (필요에 따라 조정 가능) */
}

.loginbutton {
    margin: 10px 0 10px 0;
}

.btn {
    width: 100%;
}

.form-control {
    width: 50%;
    /* 입력창 너비를 logincontainer의 50%로 설정 */
}
</style>
