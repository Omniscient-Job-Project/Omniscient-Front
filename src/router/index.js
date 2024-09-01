import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../components/index.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
    },
    {
      // path: '/about',
      // name: 'about',
      // component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
