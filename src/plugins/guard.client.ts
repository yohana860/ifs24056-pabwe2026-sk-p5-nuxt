import { getAccessToken } from "~/helpers/apiHelper";

export default defineNuxtPlugin(() => {
  const router = useRouter();
  router.beforeEach((to) => {
    const logged = !!getAccessToken();
    const isAuth = to.path.startsWith("/auth");
    if (!logged && !isAuth) return "/auth/login";
    if (logged && isAuth) return "/";
  });
});
