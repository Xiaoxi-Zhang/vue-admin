import Vue from 'vue'
// 清空浏览器默认样式 normalize.css/normalize.css 表示从 node_modules 中的 normalize.css 包中引入其主文件
import 'normalize.css/normalize.css'
// 引入element-ui组件
import ElementUI from 'element-ui'
// 引入element-ui的样式文件
import 'element-ui/lib/theme-chalk/index.css'
// 引入全局样式文件
// 这里的路径是相对于 src 目录的
import '@/styles/index.scss' // global css

import App from './App'
// 引入 Vuex
import store from './store/index'
// 引入路由配置文件Vue-Route
import router from './router'

// 注册svg
import '@/icons'

// 导入permission.js
// import 除了导入某个成员之外，还可以执行导入的文件
import '@/permission'

// 结果：把element-ui中导出的所有组件注册成全局组件
Vue.use(ElementUI)

// 上线之后如果有警告，要不要展示
Vue.config.productionTip = false

// vue实例化
// 注入 router和store实例 方便在项目中使用 this.$router和this.$store
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
