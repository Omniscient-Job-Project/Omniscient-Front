<script setup>

import Sidebar from "@/components/manager/sidebar.vue";

import Section from "@/components/manager/faqSection.vue";


</script>

<template>
  <div class="section-align">
    <Sidebar />
    <div class="section">
      <Section />
    </div>
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
