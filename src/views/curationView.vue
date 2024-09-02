<script setup>
import Header from '@/components/header/header.vue'; // 헤더 컴포넌트 임포트
// import CurationMain from '@/components/curation/curationMain.vue';
import Footer from '@/components/footer/footer.vue'; // 풋터 불러오기
import CurationSelect from '@/components/curation/curationSelect.vue';
</script>

<template>
    <Header />
    <!-- \   <CurationMain /> -->
    <CurationSelect />
    <Footer />
</template>

<style></style>