<template>
  <div class="section-align">
    <Sidebar />
    <div class="section">
      <Section />
    </div>
  </div>
</template>

<script setup>
import Sidebar from "@/components/manager/sidebar.vue";
import Section from "@/components/manager/noticeSection.vue"; // 수정된 파일 이름
</script>

<style scoped>
.section {
  width: 100%;
  height: 90dvh;
}
.section-align {
  display: flex;
  flex-direction: row;
}
</style>
