import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: () => import('@/page/followers.vue')
  }
]

const router = new Router({
  routes: routes
})

export default router
