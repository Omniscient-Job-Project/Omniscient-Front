<script setup>
import Sidebar from "@/components/manager/sidebar.vue";
import Section from "@/components/manager/userSection.vue"; 
</script>

<template>
    <Sidebar />
    <div class="section">
      <Section />
    </div>
</template>

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
