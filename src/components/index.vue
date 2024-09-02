<template>

  <body>
    <div class="container">
      <!-- 검색창 -->
      <div class="search-container">
        <input type="text" class="search-input" placeholder="검색할 내용을 입력하세요" aria-label="Search" />
        <button class="search-button" type="button">search</button>
      </div>

      <!-- 베너 카드 부분 -->
      <div class="card-group">
        <div class="card">
          <img src="..." class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">채용 제목</h5>
            <p class="card-text">
              This is a wider card with supporting text below as a natural lead-in
              to additional content. This content is a little bit longer.
            </p>
            <p class="card-text">
              <small class="text-muted">Last updated 3 mins ago</small>
            </p>
          </div>
        </div>
        <div class="card">
          <img src="..." class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">
              This card has supporting text below as a natural lead-in to
              additional content.
            </p>
            <p class="card-text">
              <small class="text-muted">Last updated 3 mins ago</small>
            </p>
          </div>
        </div>
        <div class="card">
          <img src="..." class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">
              This is a wider card with supporting text below as a natural lead-in
              to additional content. This card has even longer content than the
              first to show that equal height action.
            </p>
            <p class="card-text">
              <small class="text-muted">Last updated 3 mins ago</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </body>

</template>

<script setup>

</script>

<style scoped>
/* 전체 레이아웃 */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  /* 페이지 전체를 채우도록 설정 */
}

.container {
  height: 80vh;
}

.search-container {
  display: flex;
  justify-content: flex-end;
  /* 오른쪽 정렬 */
  align-items: center;
  margin: 20px;
}

.search-input {
  width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  /* border-radius: 25px 0 0 25px; */
  outline: none;
}

.search-button {
  padding: 10px 20px;
  border: 1px solid #007bff;
  background-color: #007bff;
  color: white;
  /* border-radius: 0 25px 25px 0; */
  cursor: pointer;
}

.card-group {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  flex: 1;
  /* 컨텐츠가 충분하지 않으면 푸터를 밀어내도록 설정 */
}

.card {
  width: 500px;
  height: 60vh;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.card-img-top {
  width: 100%;
  height: 150px;
  background-color: #e0e0e0;
}

.card-body {
  padding: 15px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.card-text {
  font-size: 14px;
  color: #666;
}

.text-muted {
  color: #999;
}
</style>