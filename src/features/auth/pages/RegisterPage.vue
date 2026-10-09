<script setup lang="ts">
import { useRouter } from "vue-router";
import { User, Mail, Lock, UserPlus } from "lucide-vue-next";
import { useInput } from "~/hooks/useInput";
import { useAuthStore } from "../states/authStore";

const router = useRouter();
const auth = useAuthStore();
const name = useInput();
const email = useInput();
const password = useInput();

async function submit() {
  if (!name.value.value || !email.value.value || password.value.value.length < 6) return;
  if (await auth.asyncRegister(name.value.value, email.value.value, password.value.value)) router.replace("/auth/login");
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <div v-for="f in [
      { id: 'name', label: 'Nama Lengkap', icon: User, model: name, type: 'text', ph: 'Nama kamu' },
      { id: 'email', label: 'Alamat Email', icon: Mail, model: email, type: 'email', ph: 'nama@email.com' },
      { id: 'password', label: 'Kata Sandi (min. 6 karakter)', icon: Lock, model: password, type: 'password', ph: '••••••••' },
    ]" :key="f.id">
      <label :for="f.id" class="text-xs font-bold tracking-wide text-slate-600 uppercase">{{ f.label }}</label>
      <div class="relative mt-1">
        <component :is="f.icon" class="absolute left-3 top-3 text-slate-400" :size="18" />
        <input :id="f.id" :type="f.type" :placeholder="f.ph" :value="f.model.value.value" @input="f.model.onChange" class="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400" />
      </div>
    </div>
    <button type="submit" :disabled="auth.isAuthRegister" class="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60">
      <UserPlus :size="18" /> {{ auth.isAuthRegister ? "Memproses..." : "Daftar Sekarang" }}
    </button>
  </form>
</template>
