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
    // {
    //   path: '/processFlow',
    //   name: 'processFlow',
    //   component: () => import('../views/ProcessFlowView.vue')
    // },
    {
      path: '/processFlowv3',
      name: 'processFlowv3',
      component: () => import('../views/ProcessFlowViewv3.vue')
    },
    {
      path: '/processFlowViewing',
      name: 'processFlowViewing',
      component: () => import('../views/ProcessFlowViewing.vue')
    },
    {
      path: '/processFlow',
      name: 'processFlow',
      component: () => import('../views/ProcessFlow.vue')
    },
    {
      path: '/formAssignment',
      name: 'formAssignment',
      component: () => import('../views/formAssignment.vue')
    },
    {
      path: '/conditionFetch',
      name: 'conditionFetch',
      component: () => import('../views/conditionFetch.vue')
    },
    {
      path: '/formAssignmentView',
      name: 'formAssignmentView',
      component: () => import('../views/formAssignmentView.vue')
    },
    {
      path: '/formAssignmentv2',
      name: 'formAssignmentv2',
      component: () => import('../views/formAssignmentViewv2.vue')
    },
    {
      path: '/formAttachments',
      name: 'formAttachments',
      component: () => import('../views/formAttachmentsView.vue')
    },
    {
      path: '/GenerateQrCode',
      name: 'GenerateQrCode',
      component: () => import('../views/GenerateQrCodeView.vue')
    },
    {
      path: '/formQRGenerator',
      name: 'formQRGenerator',
      component: () => import('../views/formQRGenerator.vue')
    },
    {
      path: '/ReasonNG',
      name: 'ReasonNG',
      component: () => import('../views/ReasonNGView.vue')
    },
    {
      path: '/ItemCodeLoader',
      name: 'ItemCodeLoader',
      component: () => import('../views/ItemCodeLoader.vue')
    },
    {
      path: '/404',
      name: '404',
      component: () => import('../views/404.vue')
    },
    {
      path: '/TransferDeliveryDate',
      name: 'TransferDeliveryDate',
      component: () => import('../views/TransferDeliveryDate.vue')
    },
  ]
})

export default router
