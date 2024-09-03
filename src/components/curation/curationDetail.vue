<template>
    <!-- 디테일 페이지 전체 컨테이너 -->
    <div class="container">
        <div class="top">
            <!-- 회사이름 및 채용 제목 -->
            <div>
                <div class="companyname">
                    회사이름
                </div>
                <div class="subject">
                    채용 제목
                </div>
            </div>
            <div class="buttons">
                <!-- 스크랩 버튼 -->
                <div class="scrapbutton">
                    <!-- 클릭 전 -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor"
                        class="bi bi-bookmark" viewBox="0 0 16 16">
                        <path
                            d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z" />
                    </svg>
                    <!-- 클릭후 -->
                    <!-- <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-bookmark-fill" viewBox="0 0 16 16">
                    <path
                        d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2" />
                </svg> -->
                </div>
                <!-- 홈페이지 지원 버튼 -->
                <div class="homepagelink">
                    <a class="btn btn-primary" href="#" role="button">홈페이지 지원</a>
                </div>
            </div>
        </div>

        <!-- 중간 내용 -->
        <div class="middle">
            <div>
                경력
            </div>
            <div>
                급여
            </div>
            <div>
                학력
            </div>
            <div>
                근무지역
            </div>
            <div>
                근무형태
            </div>
        </div>
        <!-- 채용 구체적 내용 -->
        <div class="bottom">
            <div>
                디테일 내용
            </div>
        </div>
    </div>
</template>

<script setup>


</script>


<style>
.container {
    border: 2px solid #000000;
    padding: 20px;
    margin: 0 auto;
    max-width: 800px;
    box-sizing: border-box;
    height: 80vh;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); /* 그림자 효과 추가 */
}

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
    margin-top: 10px;
}

.companyname {
    font-weight: bold;
    font-size: 18px;
    margin-right: 10px;
}

.subject {
    font-size: 24px;
    font-weight: bold;
    flex-grow: 1;
}

.buttons {
    display: flex;
    align-items: center;
}

.scrapbutton {
    margin-right: 20px; /* 버튼 간격 조정 */
    cursor: pointer;
}

.scrapbutton {
    cursor: pointer;
}

.homepagelink a {
    padding: 10px 20px;
    border: 1px solid #000;
    text-decoration: none;
    color: #000;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.homepagelink a:hover {
    background-color: #0091ff;
    color: #fff;
}

.middle {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
}

.middle div {
    font-size: 16px;
}

.bottom {
    padding: 10px 0;
    font-size: 16px;
    margin-bottom: 10px;
}
</style>