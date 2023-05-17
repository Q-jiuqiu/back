import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: ""
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  }
};

const actions = {
  // user login
  login({ commit }, userName) {
    setToken();
    commit("SET_NAME", userName);
  },

  // user logout
  logout({ commit, state }) {
    removeToken();
    resetRouter();
    commit("RESET_STATE");
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken();
      commit("RESET_STATE");
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

