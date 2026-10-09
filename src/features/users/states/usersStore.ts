import { defineStore } from "pinia";
import { getMe, getUsers, postPhoto, putMe, putPassword } from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "~/helpers/toolsHelper";

export const useUsersStore = defineStore("users", {
  state: () => ({ users: [] as any[], profile: null as any, isLoading: false, isMutating: false }),
  actions: {
    async fetchUsers() {
      this.isLoading = true;
      try { this.users = await getUsers(); } catch (e: any) { await showErrorDialog(e.message); }
      this.isLoading = false;
    },
    async fetchProfile() {
      try { this.profile = await getMe(); } catch (e: any) { await showErrorDialog(e.message); }
    },
    async mutate(fn: () => Promise<string>) {
      this.isMutating = true;
      try {
        await showSuccessDialog(await fn());
        await this.fetchProfile();
      } catch (e: any) { await showErrorDialog(e.message); }
      this.isMutating = false;
    },
    updateProfile(name: string, email: string) { return this.mutate(() => putMe(name, email)); },
    updatePhoto(file: File) { return this.mutate(() => postPhoto(file)); },
    updatePassword(p: string, n: string) { return this.mutate(() => putPassword(p, n)); },
  },
});
