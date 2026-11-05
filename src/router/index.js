import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/Search.vue') // 懒加载：匹配到时才加载，避免初始加载所有组件
    },
    {
      path: '/playlist/:id',
      name: 'playlist',
      component: () => import('../views/PlaylistDetail.vue')
    },
    {
      path: '/lyric',
      name: 'lyric',
      component: () => import('../views/Lyric.vue')
    },
    {
      path: '/player',
      name: 'player',
      component: () => import('../views/FullPlayer.vue')
    }
  ]
})
export default router