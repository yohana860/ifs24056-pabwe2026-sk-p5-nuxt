<script setup lang="ts">
import { useRouter } from "vue-router";
import { Mail, Lock, LogIn } from "lucide-vue-next";
import { useInput } from "~/hooks/useInput";
import { useAuthStore } from "../states/authStore";

const router = useRouter();
const auth = useAuthStore();
const email = useInput();
const password = useInput();

async function submit() {
  if (!email.value.value || !password.value.value) return;
  if (await auth.asyncLogin(email.value.value, password.value.value)) router.replace("/");
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div>
      <label for="email" class="text-xs font-bold tracking-wide text-slate-600 uppercase">Alamat Email</label>
      <div class="relative mt-1">
        <Mail class="absolute left-3 top-3 text-slate-400" :size="18" />
        <input id="email" type="email" placeholder="nama@email.com" :value="email.value.value" @input="email.onChange" class="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>
    </div>
    <div>
      <label for="password" class="text-xs font-bold tracking-wide text-slate-600 uppercase">Kata Sandi</label>
      <div class="relative mt-1">
        <Lock class="absolute left-3 top-3 text-slate-400" :size="18" />
        <input id="password" type="password" placeholder="••••••••" :value="password.value.value" @input="password.onChange" class="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>
    </div>
    <button type="submit" :disabled="auth.isAuthLogin" class="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60">
      <LogIn :size="18" /> {{ auth.isAuthLogin ? "Memproses..." : "Masuk Sekarang" }}
    </button>
  </form>
</template>
