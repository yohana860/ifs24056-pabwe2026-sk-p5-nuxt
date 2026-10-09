<script setup lang="ts">
import { onMounted } from "vue";
import { useUsersStore } from "../states/usersStore";

const store = useUsersStore();
onMounted(() => store.fetchUsers());
</script>

<template>
  <section class="space-y-4">
    <div><h1 class="text-2xl font-extrabold">Direktori Pengguna</h1><p class="text-sm text-slate-600">Semua pengguna terdaftar di sistem.</p></div>
    <p v-if="store.isLoading" class="text-slate-600">Memuat...</p>
    <p v-else-if="!store.users.length" class="text-slate-600">Belum ada pengguna.</p>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div v-for="u in store.users" :key="u.id" class="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div class="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">{{ (u.name || "?").charAt(0).toUpperCase() }}</div>
        <div class="min-w-0"><p class="truncate font-semibold">{{ u.name }}</p><p class="truncate text-sm text-slate-600">{{ u.email }}</p></div>
      </div>
    </div>
  </section>
</template>