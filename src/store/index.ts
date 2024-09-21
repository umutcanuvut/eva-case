import { createStore } from "vuex";
import { loginApi, fetchUserInfo } from "@/services/api";
import { User } from "@/types/user";

interface State {
  token: string | null;
  user: User | null;
}

const store = createStore<State>({
  state: {
    token: localStorage.getItem("token"),
    user: null,
  },
  mutations: {
    setToken(state, token: string) {
      state.token = token;
    },
    setUser(state, user: User) {
      state.user = user;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const response = await loginApi(email, password);
        const token = response.data.Data.AccessToken;
        commit("setToken", token);

        localStorage.setItem("token", token);

        const userInfoResponse = await fetchUserInfo(token, email);
        const user: User = userInfoResponse.data.Data.user;
        commit("setUser", user);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          console.error("Invalid credentials");
        } else {
          console.error("An unexpected error occurred:", error.message);
        }
        throw new Error("Login failed");
      }
    },
    logout({ commit }) {
      commit("logout");
      localStorage.removeItem("token");
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.token;
    },
    getUser(state) {
      return state.user;
    },
  },
});

export default store;
