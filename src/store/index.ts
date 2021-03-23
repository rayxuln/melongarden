import { createStore } from 'vuex'

export default createStore({
  state: {
    memberNum: 0,
    postNum: 0
  },
  mutations: {
    memberNumChanged (state, v) {
      state.memberNum = v
    },
    postNumChanged (state, v) {
      state.postNum = v
    }
  },
  actions: {
  },
  modules: {
  }
})
