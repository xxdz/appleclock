import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import clockPage from '@/components/clockPage'
import addClock from '@/components/addClock'
import list from '@/components/list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/name',
      name: 'main',
      component: main,
      children : [
        {path : 'clockPage',name:"clockPage",components : {
          clock : clockPage,
          list : list
        }},
        // {path : 'list', name:"list",component : list},
        {path : '',name:"addClock",components : {
          default : addClock,
          clock : addClock,
          list : list,
        }}
      ]
    },{
      path:'/',
      redirect : '/name'
    }
  ]
})
