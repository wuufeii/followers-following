import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/page/index.vue')
  }
]

const router = new Router({
  routes: routes
})

export default router
