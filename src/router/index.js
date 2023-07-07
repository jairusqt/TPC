import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/section',
      name: 'section',
      component: () => import('../views/SectionView.vue')
    },
    {
      path: '/keyProcess',
      name: 'keyProcess',
      component: () => import('../views/KeyProcessView.vue')
    },
    {
      path: '/subProcess',
      name: 'subProcess',
      component: () => import('../views/SubProcessView.vue')
    },
    {
      path: '/processFlow',
      name: 'processFlow',
      component: () => import('../views/ProcessFlowView.vue')
    },
    {
      path: '/processFlowv2',
      name: 'processFlowv2',
      component: () => import('../views/ProcessFlowViewv2.vue')
    },
    {
      path: '/formAssignment',
      name: 'formAssignment',
      component: () => import('../views/formAssignmentView.vue')
    }

  ]
})

export default router
