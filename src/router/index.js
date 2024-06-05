import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/user",
      name: "user_index",
      component: () => import("../components/user/index.vue"),
    },
    {
      path: "/user/regist",
      name: "user_regist",
      component: () => import("../views/user/RegistView.vue"),
    },
    {
      path: "/user/login",
      name: "user_login",
      component: () => import("../views/user/LoginView.vue"),
    },
  ],
});

export default router;
