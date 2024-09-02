import { createRouter, createWebHistory } from 'vue-router'
// import {
//   useCurationStore,
// } from "@/stores/rootstore.js";

const Main = () => import("../views/indexView.vue");
const Curation = () => import("../views/curationView.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main
    },
    {
      path: '/curationselect',
      name: 'curationselect',
      component: Curation
    },
  ]
})

export default router
