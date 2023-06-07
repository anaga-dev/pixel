import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import PixelEditor from '@/pages/PixelEditor.vue'

export const routes = [
  { path: '/', component: Home },
  { path: '/pixel', component: PixelEditor }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
