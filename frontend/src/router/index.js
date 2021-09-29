import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Children from '../views/Children.vue'
import Child from '../views/Child.vue'
import Transactions from '../views/Transactions.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/children',
    name: 'Children',
    component: Children
  }, 
  {
    path: '/child/:childId',
    name: 'Child',
    component: Child,
    props: true
  },
  {
    path: '/transactions/:cardId',
    name: 'Transactions',
    component: Transactions,
    props: true
  }, 
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
