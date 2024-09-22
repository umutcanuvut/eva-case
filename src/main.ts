import { createApp } from "vue";
import App from "./App.vue";
import "./assets/index.css";
import store from "./store";
import router from "./router";

const app = createApp(App);

store.dispatch("restoreSession").finally(() => {
  app.use(store);
  app.use(router);
  app.mount("#app");
});
