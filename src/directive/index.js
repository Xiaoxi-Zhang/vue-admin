// 放置全局指令
import Vue from 'vue'
import store from '@/store'

const adminPerms = '*:*:*' // 管理员权限

Vue.directive('permission', {
  // el: 使用自定义指令的DOM元素
  // binding: 指令的绑定对象，包含指令名、值等信息 binding.value 可以接受到外部传过来的值
  // inserted: 当指令绑定到元素上时调用
  inserted(el, binding) {
    // console.log('el为：', el, 'binding为：', binding)
    const perms = store.state.menu.permission
    // 管理员账号单独处理
    if (perms.includes(adminPerms)) {
      return
    }
    if (!perms.includes(binding.value)) {
      // el.style.display = 'none'
      el.remove()
    }
  }
})
