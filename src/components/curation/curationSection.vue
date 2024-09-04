<script setup>
import { useCurationStore } from "@/stores/rootstore";
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import CurationMain from "./curationMain.vue";
import CurationDetail from "./curationDetail.vue"

const store = useCurationStore();
const route = useRoute();

const root = computed(() => store.root);

const setRoot = store.setRoot;

onMounted(() => {
  if (route.params.id) {
    setRoot(`detail/${route.params.id}`);
  } else {
    setRoot("main");
  }
});

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      setRoot(`detail/${newId}`);
    } else {
      setRoot("main");
    }
  }
);
</script>

<template>
  <div class="section-align">
    <Sidebar v-if="!root.includes('detail')" />
    <div class="section">
      <div>
        <div v-if="root === 'main'">
          <CurationMain />
        </div>
        <div v-if="root.includes('detail')">
          <CurationDetail />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

