import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: null, // 用户ID
  },
  getters: {
  },
  mutations: {
    SET_USER_ID(state, userId) {
      state.userId = userId;
    }
  },
  actions: {
    setUserId({ commit }, userId) {
      commit('SET_USER_ID', userId);
    }
  },
  modules: {
  }
})
