export const routes = [
  { path: "/auth", component: () => import("~/features/auth/layouts/AuthLayout.vue"), redirect: "/auth/login",
    children: [
      { path: "login", component: () => import("~/features/auth/pages/LoginPage.vue") },
      { path: "register", component: () => import("~/features/auth/pages/RegisterPage.vue") },
    ] },
  { path: "/", component: () => import("~/features/cashflows/layouts/CashFlowLayout.vue"),
    children: [
      { path: "", component: () => import("~/features/cashflows/pages/HomePage.vue") },
      { path: "cash-flows/:cashFlowId", component: () => import("~/features/cashflows/pages/DetailPage.vue") },
      { path: "users", component: () => import("~/features/users/pages/UsersPage.vue") },
      { path: "profile", component: () => import("~/features/users/pages/ProfilePage.vue") },
    ] },
  { path: "/:pathMatch(.*)*", component: () => import("~/features/common/pages/NotFoundPage.vue") },
];
