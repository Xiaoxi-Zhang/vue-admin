import router from '@/router/index'
import store from '@/store/index'
import asyncRoutes from '@/router/asyncRoutes'

const whiteList = ['/login', '/404'] // 白名单
// 获取一级权限标识
function getFirstRouterPermissions(permissions) {
  const firstPermArr = permissions.map(item => {
    return item.split(':')[0]
  })
  // console.log(firstPermArr)
  // 去重
  // Set 不能存重复的数据（去重），但是它不是一个真实的数组
  return Array.from(new Set(firstPermArr))
}
// 获取二级权限标识
function getSecondRouterPermissions(permissions) {
  const secondPermArr = permissions.map(item => {
    const arr = item.split(':')
    return `${arr[0]}:${arr[1]}`
  })
  // console.log(secondPermArr)
  return Array.from(new Set(secondPermArr))
}
// 根据一级、二级权限标识，筛选出对应可展示的动态路由
function getRoutes(firstPermission, secondPermission, asyncRoutes) {
  // 判断当前登录人是不是管理员，如果是管理员就不进行筛选了
  if (firstPermission.includes('*')) {
    return asyncRoutes
  }
  const firstRoutes = asyncRoutes.filter(item => firstPermission.includes(item.permission))
  // console.log('firstRoutes:', firstRoutes)
  const routes = firstRoutes.map(item => {
    return {
      ...item,
      children: item.children.filter(child => secondPermission.includes(child.permission))
    }
  })
  return routes
}
router.beforeEach(async(to, from, next) => {
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
      // 1.拿到用户的权限信息
      const permissions = await store.dispatch('menu/getUserPermission')
      // console.log('全部的权限标识', permissions)
      // 2.根据权限标识 筛选出对应的一级路由标识
      const firstPermission = getFirstRouterPermissions(permissions)
      // console.log('一级权限标识', firstPermission)
      // 3.根据权限标识 筛选出对应的二级路由标识
      const secondPermission = getSecondRouterPermissions(permissions)
      // console.log('二级权限标识', secondPermission)
      // 4.根据一级权限标识和二级权限标识和动态路由进行筛选
      // console.log('所有的动态路由', asyncRoutes)
      const routes = getRoutes(firstPermission, secondPermission, asyncRoutes)
      // console.log('筛选之后的动态路由', routes)
      // 5.把筛选后的路由 展示在左侧
      // 5.1 先把筛选之后的路由添加到路由对象中（跳转）
      routes.forEach(item => router.addRoute(item))
      // 5.2 再把筛选之后的路由添加到vuex中（渲染）
      store.commit('menu/setMenuList', routes)
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
