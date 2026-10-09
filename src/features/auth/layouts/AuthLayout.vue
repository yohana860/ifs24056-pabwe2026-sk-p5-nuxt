<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import { Wallet } from "lucide-vue-next";
const route = useRoute();
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-50 to-sky-50 p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-6">
        <div class="mx-auto mb-3 h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center shadow-lg">
          <Wallet class="text-white" :size="28" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">Delcom Cash Flow</h1>
        <p class="text-sm text-slate-500">Catat pemasukan &amp; pengeluaran dengan rapi</p>
      </div>
      <div class="bg-white rounded-3xl shadow-xl p-6">
        <div class="grid grid-cols-2 gap-1 bg-slate-100 rounded-xl p-1 mb-5 text-sm font-semibold text-center">
          <RouterLink to="/auth/login" :class="['py-2 rounded-lg', route.path === '/auth/login' ? 'bg-white text-indigo-600 shadow' : 'text-slate-600']">Masuk Akun</RouterLink>
          <RouterLink to="/auth/register" :class="['py-2 rounded-lg', route.path === '/auth/register' ? 'bg-white text-indigo-600 shadow' : 'text-slate-600']">Daftar Baru</RouterLink>
        </div>
        <RouterView />
      </div>
    </div>
  </main>
</template>
