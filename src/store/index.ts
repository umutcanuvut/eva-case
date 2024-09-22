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
        localStorage.setItem("email", email);

        const userInfoResponse = await fetchUserInfo(token, email);
        const user: User = userInfoResponse.data.Data.user;
        commit("setUser", user);
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 401) {
            throw new Error("Invalid email or password.");
          } else if (error.response.status === 500) {
            throw new Error("Server error. Please try again later.");
          }
        } else {
          console.error("An unexpected error occurred:", error.message);
          throw new Error("An unexpected error occurred. Please try again.");
        }
      }
    },

    async restoreSession({ commit }) {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (token && email) {
        try {
          const userInfoResponse = await fetchUserInfo(token, email);
          const user: User = userInfoResponse.data.Data.user;
          commit("setUser", user);
        } catch (error) {
          console.error("Failed to restore session:", error);
          commit("logout");
        }
      }
    },

    logout({ commit }) {
      commit("logout");
      localStorage.removeItem("token");
      localStorage.removeItem("email");
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
