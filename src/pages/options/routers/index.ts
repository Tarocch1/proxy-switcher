import { createRouter, createWebHashHistory } from 'vue-router'
import Proxy from '../views/Proxy.vue'

const routes = [{ path: '/', name: 'proxy', component: Proxy }]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
