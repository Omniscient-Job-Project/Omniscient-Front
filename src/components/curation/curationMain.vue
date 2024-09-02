<template>
    <div class="container">
        <!-- 메인페이지 검색창 -->
        <div class="search-bar">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="검색할 내용" aria-label="검색"
                    aria-describedby="button-addon2">
                <button class="btn btn-outline-secondary" type="button" id="button-addon2">검색</button>
            </div>
        </div>

        <!-- 큐레이션 -->
        <div class="curationIndex">
            <div>
                <p>홈</p>
            </div>
            <div>
                <p>자격증</p>
            </div>
            <div>
                <p>지하철</p>
            </div>
            <div>
                <p>등등</p>
            </div>
        </div>

        <!-- 채용정보 카드 -->
        <div class="recruitmentCards">
            <div class="row row-cols-1 row-cols-md-2 g-4">
                <div class="col">
                    <div class="card">
                        <img src="..." class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">채용 제목</h5>
                            <p class="card-text">This is a longer card with supporting text below as a natural lead-in
                                to additional content. This content is a little bit longer.</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card">
                        <img src="..." class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">This is a longer card with supporting text below as a natural lead-in
                                to additional content. This content is a little bit longer.</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card">
                        <img src="..." class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">This is a longer card with supporting text below as a natural lead-in
                                to additional content.</p>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card">
                        <img src="..." class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">This is a longer card with supporting text below as a natural lead-in
                                to additional content. This content is a little bit longer.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 채용정보카드 끝 -->
    </div>
</template>

<script setup>

</script>

<style>
/* 전체 컨테이너 레이아웃 */
.container {
    font-family: Arial, sans-serif;
    margin: 0 auto; /* 좌우 마진을 자동으로 설정하여 중앙 정렬 */
    padding: 20px; /* 전체 패딩 설정 */
    box-sizing: border-box;
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center; /* 내부 요소들을 수평으로 중앙 정렬 */
}

/* 검색창 스타일 */
.search-bar {
    display: flex;
    justify-content: center; /* 검색창을 가운데 정렬 */
    width: 100%;
    margin-bottom: 20px;
}

.input-group {
    width: 300px; /* 검색창 너비 설정 */
}

/* 큐레이션 박스 스타일 */
.curationIndex {
    border: 1px solid #ddd; /* 보더 박스 */
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
    padding: 15px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-around; /* 각 p 태그 간 간격을 적절히 조정 */
    width: 100%; /* 큐레이션 박스를 컨테이너 너비에 맞춤 */
}

.curationIndex div {
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 채용정보 카드 스타일 */
.recruitmentCards {
    width: 100%;

    margin: 10px 10px 10px 10px;
}

.recruitmentCards .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center; /* 카드들을 가운데 정렬 */
}

.recruitmentCards .col {
    width: calc(50% - 10px); /* 가로로 2개씩 배치되도록 설정 (간격 조정 포함) */
    margin-bottom: 20px; /* 카드 간 간격 */
}

.card {
    border: 1px solid #ddd; /* 카드 보더 */
    margin: 0px 10px 0px 10px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

.card-body {
    padding: 15px;
}

</style>
