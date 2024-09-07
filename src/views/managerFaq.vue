<script setup>
import Header from "@/components/header/header.vue";
import Footer from "@/components/footer/footer.vue";
import Sidebar from "@/components/manager/sidebar.vue";

import Section from "@/components/manager/faqSection.vue";


</script>

<template>
  <Header />
  <div class="section-align">
    <Sidebar />
    <div class="section">
      <Section />
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.section {
  width: 100%;
  height: 95dvh;
}
.section-align {
  display: flex;
  flex-direction: row;
}
</style>
