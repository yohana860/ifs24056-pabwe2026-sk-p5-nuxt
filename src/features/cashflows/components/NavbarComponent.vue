<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Menu, LogOut } from "lucide-vue-next";
import { useUsersStore } from "~/features/users/states/usersStore";
import { useAuthStore } from "~/features/auth/states/authStore";
import { showConfirmDialog } from "~/helpers/toolsHelper";

defineEmits<(e: "toggle") => void>();
const router = useRouter();
const users = useUsersStore();
const auth = useAuthStore();
onMounted(() => users.fetchProfile());
const name = computed(() => users.profile?.name || users.profile?.email || "Pengguna");

async function logout() {
  if (!(await showConfirmDialog("Kamu akan keluar dari akun."))) return;
  auth.asyncLogout();
  router.replace("/auth/login");
}
</script>

<template>
  <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur">
    <div class="flex items-center gap-3">
      <button class="rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Menu" @click="$emit('toggle')"><Menu :size="22" /></button>
      <span class="font-extrabold text-indigo-600">Delcom Cash Flow</span>
    </div>
    <div class="flex items-center gap-3">
      <div class="hidden text-right sm:block">
        <p class="text-sm font-semibold leading-tight">{{ name }}</p>
        <p class="text-xs text-slate-500">{{ users.profile?.email }}</p>
      </div>
      <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">{{ name.charAt(0).toUpperCase() }}</div>
      <button class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" @click="logout"><LogOut :size="16" /> Keluar</button>
    </div>
  </header>
</template>