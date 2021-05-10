import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home.vue'
import Acknowledgements from '../views/Acknowledgements/Acknowledgements.vue'
import Classification from '../views/Classification/Classification.vue'
import Taxon from '../components/Taxon/Taxon.vue'
import Search from '../views/Search/Search.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/static/acknowledgements',
    name: 'Acknowledgements',
    component: Acknowledgements,
  },
  {
    path: '/flora/classification/:id',
    name: 'Classification',
    component: Classification,
  },
  {
    path: '/flora/classification/taxon/:id',
    name: 'Taxon',
    component: Taxon,

  },
  {
    path: '/flora/search',
    name: 'Search',
    component: Search,

  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router