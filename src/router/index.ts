import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'layout',
    component: () => import("../layout/index.vue"),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
