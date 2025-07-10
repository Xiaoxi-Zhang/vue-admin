import { getProfileAPI } from '@/api/user'

export default {
  namespaced: true,
  state: {
    permission: []
  },
  mutations: {
    setPermission(state, newPermission) {
      state.permission = newPermission
    }
  },
  getters: {},
  actions: {
    async getUserPermission(store) {
      const res = await getProfileAPI()
      store.commit('setPermission', res.data.permissions)
      return res.data.permissions
    }
  }
}
