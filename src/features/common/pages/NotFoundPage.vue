<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center text-center p-6">
    <p class="text-7xl font-extrabold text-indigo-600">404</p>
    <h1 class="mt-2 text-xl font-bold">Halaman tidak ditemukan</h1>
    <p class="text-slate-500 mb-5">Alamat yang kamu tuju tidak tersedia.</p>
    <RouterLink to="/" class="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">Kembali ke Beranda</RouterLink>
  </main>
</template>
