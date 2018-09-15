import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import AddMember from './components/AddMember'
import Pledges from './components/Pledges'
import Contributions from './components/Contributions'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/addMember',
      name: 'AddMember',
      component: AddMember
    },
    {
      path: '/Pledges',
      name: 'Pledges',
      component: Pledges
    },
    {
      path: '/Contriutions',
      name: 'Contriutions',
      component: Contributions
    }
  ]
})
