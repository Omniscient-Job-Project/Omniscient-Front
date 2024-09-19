<template>
  <div class="curation-index">
    <div class="curation-item home"><i class="fas fa-home"></i><p>홈</p></div>
    <div class="curation-item certificate"><i class="fas fa-certificate"></i><p>자격증</p></div>
    <div class="curation-item subway"><i class="fas fa-subway"></i><p>지하철</p></div>
    <div class="curation-item etc"><i class="fas fa-ellipsis-h"></i><p>등등</p></div>
  </div>
</template>

<script setup>
// 필터기능 추가 예정
</script>

<style scoped>
.curation-index {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
}

.curation-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.curation-item:hover {
  transform: translateY(-3px);
}

.curation-item i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.curation-item p {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
}

/* 각 아이콘에 대한 새로운 색상 지정 */
.curation-item.home i {
  color: #875cdb; /* 보라색 (홈 아이콘) */
}

.curation-item.certificate i {
  color: #4caf50; /* 주황색 (자격증 아이콘) */
}

.curation-item.subway i {
  color: #3498db; /* 파란색 (지하철 아이콘) */
}

.curation-item.etc i {
  color: #7687a6; /* 회색 (기타 아이콘) */
}
</style>