import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import AddMember from './components/AddMember'
import Pledges from './components/Pledges'
import Contributions from './components/Contributions'
import AddBeneficiary from './components/AddBeneficiary'
import PayBeneficiary from './components/PayBeneficiary'
import AddCenter from './components/AddCenter'
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
      path: '/Contributions',
      name: 'Contributions',
      component: Contributions
    },
    {
      path: '/AddBeneficiary',
      name: 'AddBeneficiary',
      component: AddBeneficiary
    },
    {
      path: '/PayBeneficiary',
      name: 'PayBeneficiary',
      component: PayBeneficiary
    },
    {
      path: '/AddCenter',
      name: 'AddCenter',
      component: AddCenter
    }
  ]
})
