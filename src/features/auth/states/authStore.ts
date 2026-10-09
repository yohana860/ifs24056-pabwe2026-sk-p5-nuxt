import { defineStore } from "pinia";
import { postLogin, postRegister } from "../api/authApi";
import { getAccessToken, putAccessToken, removeAccessToken } from "~/helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "~/helpers/toolsHelper";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthLogin: false,
    isAuthRegister: false,
    isAuthLogout: false,
    token: null as string | null,
  }),
  actions: {
    async asyncLogin(email: string, password: string) {
      this.isAuthLogin = true;
      try {
        const token = await postLogin(email, password);
        putAccessToken(token);
        this.token = token;
        return true;
      } catch (e: any) {
        await showErrorDialog(e.message);
        return false;
      } finally {
        this.isAuthLogin = false;
      }
    },
    async asyncRegister(name: string, email: string, password: string) {
      this.isAuthRegister = true;
      try {
        await showSuccessDialog(await postRegister(name, email, password));
        return true;
      } catch (e: any) {
        await showErrorDialog(e.message);
        return false;
      } finally {
        this.isAuthRegister = false;
      }
    },
    asyncLogout() {
      this.isAuthLogout = true;
      removeAccessToken();
      this.token = null;
      this.isAuthLogout = false;
    },
    loadToken() {
      this.token = getAccessToken();
    },
  },
});
