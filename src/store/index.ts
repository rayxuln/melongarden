import APIs from '@/APIs'
import { ElMessage } from 'element-plus'

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
    updateMembersPosts (context) {
      APIs.getMembersAndPosts().then((value:unknown) => {
        const v = value as {members:unknown, posts:unknown}
        context.commit('memberNumChanged', v.members)
        context.commit('postNumChanged', v.posts)
      }).catch((v:unknown) => {
        ElMessage.error('There is something wrong with the server. Please try to refresh this page in a moment. ' + v)
      })
    }
  },
  modules: {
  }
})
