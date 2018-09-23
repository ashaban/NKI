import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Login from './components/Login.vue'
import AddMember from './components/AddMember'
import Pledges from './components/Pledges'
import Contributions from './components/Contributions'
import AddBeneficiary from './components/AddBeneficiary'
import PayBeneficiary from './components/PayBeneficiary'
import AddCenter from './components/AddCenter'
import store from './store'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
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

router.beforeEach ((to, from, next)=> {
  if (!store.state.token) {
    if (to.path != '/Login') {
      next({
        path: '/Login'
      })
    } else {
      next ()
    }
  } else {
    next()
  }
})

export default router