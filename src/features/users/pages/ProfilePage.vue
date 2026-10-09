<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useUsersStore } from "../states/usersStore";
import { showErrorDialog } from "~/helpers/toolsHelper";

const store = useUsersStore();
const name = ref("");
const email = ref("");
const oldPass = ref("");
const newPass = ref("");
const cls = "w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400";

onMounted(() => store.fetchProfile());
watch(() => store.profile, (p) => { name.value = p?.name ?? ""; email.value = p?.email ?? ""; }, { immediate: true });

const saveProfile = () => store.updateProfile(name.value, email.value);
async function savePass() {
  if (newPass.value.length < 6) return showErrorDialog("Kata sandi baru minimal 6 karakter.");
  await store.updatePassword(oldPass.value, newPass.value);
  oldPass.value = newPass.value = "";
}
function pickPhoto(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) store.updatePhoto(f);
}
</script>

<template>
  <section class="mx-auto max-w-2xl space-y-6">
    <div><h1 class="text-2xl font-extrabold">Profil Saya</h1><p class="text-sm text-slate-500">Kelola data akun dan keamanan.</p></div>
    <div class="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <img v-if="store.profile?.photo" :src="store.profile.photo" alt="Foto profil" class="h-20 w-20 rounded-full object-cover" />
      <div v-else class="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white">{{ (name || "?").charAt(0).toUpperCase() }}</div>
      <div><p class="font-bold">{{ store.profile?.name }}</p><label class="mt-2 inline-block rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold hover:bg-slate-200" for="photo">Ganti foto</label><input id="photo" type="file" accept="image/*" class="hidden" @change="pickPhoto" /></div>
    </div>
    <form class="space-y-3 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm" @submit.prevent="saveProfile">
      <h2 class="font-bold">Data Akun</h2>
      <input v-model="name" placeholder="Nama" :class="cls" />
      <input v-model="email" type="email" placeholder="Email" :class="cls" />
      <button :disabled="store.isMutating" class="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">Simpan Profil</button>
    </form>
    <form class="space-y-3 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm" @submit.prevent="savePass">
      <h2 class="font-bold">Ubah Kata Sandi</h2>
      <input v-model="oldPass" type="password" placeholder="Kata sandi lama" :class="cls" />
      <input v-model="newPass" type="password" placeholder="Kata sandi baru" :class="cls" />
      <button :disabled="store.isMutating" class="rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-60">Ubah Kata Sandi</button>
    </form>
  </section>
</template>
