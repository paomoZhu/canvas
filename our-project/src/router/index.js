import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import FilterColor from '@/components/FilterColor'
import Login from '@/components/Login'
import DownLoad from '@/components/DownLoad'
import Canvas from '@/components/Canvas'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld
    },
    {
      path: '/filter',
      name: 'filterColor',
      component: FilterColor
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/download',
      name: 'downLoad',
      component: DownLoad
    },
    {
      path: '/canvas',
      name: 'canvas',
      component: Canvas
    }
  ]
})
