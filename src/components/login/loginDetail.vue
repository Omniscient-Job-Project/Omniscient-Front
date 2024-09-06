<template>
    <div class="detailcontainer">
        <!-- 이름 -->
        <div class="name">
            <div class="col-auto">
                <label class="visually-hidden" for="autoSizingInput">이름</label>
                <input type="text" class="form-control" id="autoSizingInput" placeholder="차은우">
            </div>
        </div>
        <!-- 나이 -->
        <div class="age">
            <div class="col-auto">
                <label class="visually-hidden" for="autoSizingInput">나이</label>
                <input type="text" class="form-control" id="autoSizingInput" placeholder="20살">
            </div>
        </div>

        <!-- 이메일 -->
        <div class="email">
            <label for="inputEmail3" class="col-sm-2 col-form-label">이메일</label>
            <div class="col-sm-10">
                <input type="email" placeholder="email@naver.com" class="form-control" id="inputEmail3">
            </div>
        </div>

        <!-- 자격증 -->
        <div class="certificate">
            <div class="col-auto">
                <label class="visually-hidden" for="autoSizingInput">자격증</label>
                <input type="text" class="form-control" id="autoSizingInput" placeholder="자격증을 입력해주세요.">
            </div>
        </div>

        <div class="buttons">
            <!-- 등록 버튼 -->
            <button type="button" class="btn btn-primary">회원가입</button>

        </div>
    </div>
</template>

<script setup>
</script>

<style>
.detailcontainer {
    width: 60%;
    margin: 20px auto; /* 중앙 정렬 */
    padding: 20px; /* 패딩 추가 */
    border: 1px solid #ddd;/* 테두리 추가 */
    border-radius: 8px; /* 모서리 둥글게 */
    background-color: #f9f9f9; /* 배경색 설정 */
}

.name,
.age,
.email,
.certificate {
    margin-bottom: 15px;
    /* 각 입력 필드 간격 */
}

.form-control {
    width: 100%;
    /* 입력 필드 너비 100% */
    padding: 10px;
    /* 패딩 추가 */
    border: 1px solid #ccc;
    /* 테두리 색상 */
    border-radius: 4px;
    /* 모서리 둥글게 */
    transition: border-color 0.3s;
    /* 테두리 색상 변화 효과 */
}

.form-control:focus {
    border-color: #007bff;
    /* 포커스 시 테두리 색상 */
    outline: none;
    /* 기본 아웃라인 제거 */
}

.buttons {
    display: flex;
    /* 버튼을 가로로 나열 */
    justify-content: space-between;
    /* 버튼 간격 조정 */
}

.btn {
    padding: 10px 20px;
    /* 버튼 패딩 */
    border: none;
    /* 테두리 제거 */
    border-radius: 4px;
    /* 모서리 둥글게 */
    cursor: pointer;
    /* 커서 포인터로 변경 */
    transition: background-color 0.3s;
    /* 배경색 변화 효과 */
}

.btn-primary {
    background-color: #007bff;
    /* 기본 버튼 색상 */
    color: white;
    /* 글자 색상 */
}

.btn-primary:hover {
    background-color: #0056b3;
    /* 호버 시 색상 변화 */
}

.btn-warning {
    background-color: #ffc107;
    /* 경고 버튼 색상 */
    color: black;
    /* 글자 색상 */
}

.btn-warning:hover {
    background-color: #e0a800;
    /* 호버 시 색상 변화 */
}
</style>
