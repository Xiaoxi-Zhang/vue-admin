import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 静态路由：比如登录 404 首页 都不需要加权限
// 动态路由：需要有权限才能访问的页面叫动态路由
export const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workbench'
  },
  {
    path: '/workbench',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/Workbench/index'),
        meta: { title: '工作台', icon: 'el-icon-data-board' }
      }
    ]
  },
  {
    path: '/enterpriseDetail/:id',
    component: () => import('@/views/Park/Enterprise/EnterpriseDetail')
  },
  {
    path: '/addEnterprise',
    component: () => import('@/views/Park/Enterprise/AddEnterprise')
  },
  {
    path: '/car/addMonthCard',
    component: () => import('@/views/Car/CarCard/addMonthCard')
  },

  {
    path: '/sys/addRole',
    component: () => import('@/views/System/Role/AddRole')
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
  })

const router = createRouter()

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher
}

export default router
