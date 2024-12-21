import { createRouter, createWebHistory } from 'vue-router'
import BaseLayout from '../components/Layout/BaseLayout.vue'
import LoginView from '../views/login/LoginView.vue'
import SupplierManagement from '../views/supplier/SupplierManagement.vue'
import PurchaseManagement from '../views/purchase/PurchaseManagement.vue'
import ProductionPlan from '../views/production/ProductionPlan.vue'
import InventoryManagement from '../views/inventory/InventoryManagement.vue'
import OrderManagement from '../views/sales/OrderManagement.vue'
import CustomerManagement from '../views/customer/CustomerManagement.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    component: BaseLayout,
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('token')) {
        next('/login')
      } else {
        next()
      }
    },
    children: [
      {
        path: 'supplier',
        name: 'SupplierManagement',
        component: SupplierManagement
      },
      {
        path: 'purchase',
        name: 'PurchaseManagement',
        component: PurchaseManagement
      },
      {
        path: 'production',
        name: 'ProductionPlan',
        component: ProductionPlan
      },
      {
        path: 'inventory',
        name: 'InventoryManagement',
        component: InventoryManagement
      },
      {
        path: 'order',
        name: 'OrderManagement',
        component: OrderManagement
      },
      {
        path: 'customer',
        name: 'CustomerManagement',
        component: CustomerManagement
      },
      {
        path: 'sales-analysis',
        name: 'SalesAnalysis',
        component: () => import('../views/sales/SalesAnalysis.vue')
      },
      {
        path: 'process',
        name: 'ProcessManagement',
        component: () => import('../views/process/ProcessManagement.vue')
      },
      {
        path: 'quality',
        name: 'QualityControl',
        component: () => import('../views/quality/QualityControl.vue')
      },
      {
        path: 'finance',
        name: 'FinanceManagement',
        component: () => import('../views/finance/FinanceManagement.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
