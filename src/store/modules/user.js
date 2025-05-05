import { loginAPI } from '@/api/user.js'
import { getToken, setToken } from '@/utils/auth.js'

export default {
  // 命名空间
  namespaced: true,
  // 模块内的state写法：推荐是个函数写法。但写对象也行
  state: {
    token: getToken() || '' // 读取cookie中的token值,如果没有就设置为空字符串
  },
  mutations: {
    setToken(state, newToken) {
      state.token = newToken
      setToken(newToken) // 调用设置token的方法,存到cookie中
    }
  },
  actions: {
    async loginAction(store, data) {
      const res = await loginAPI(data)
      console.log(res)
      store.commit('setToken', res.data.token)
    }
  },
  getters: {}
}
