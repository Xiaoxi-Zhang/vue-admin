import router from '@/router/index'
import store from '@/store/index'

const whiteList = ['/login', '/404'] // 白名单
router.beforeEach((to, from, next) => {
  // to: 跳转的路由对象
  // from: 从哪里来
  // next: 放行next()  重定向next(路径)
  const token = store.state.user.token
  if (token) {
    // 有token
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  next()
})
