<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { LayoutDashboard, Users, UserCircle } from "lucide-vue-next";

defineProps<{ open: boolean }>();
const emit = defineEmits<(e: "close") => void>();
const route = useRoute();
const menus = [
  { to: "/", label: "Ringkasan Arus Kas", icon: LayoutDashboard },
  { to: "/users", label: "Direktori Pengguna", icon: Users },
  { to: "/profile", label: "Profil Saya", icon: UserCircle },
];
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-30 bg-black/40 lg:hidden" @click="emit('close')" />
  <aside :class="['fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-slate-200 bg-white p-3 transition-transform lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full']">
    <nav class="space-y-1">
      <RouterLink v-for="m in menus" :key="m.to" :to="m.to" @click="emit('close')"
        :class="['flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold', route.path === m.to ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100']">
        <component :is="m.icon" :size="18" /> {{ m.label }}
      </RouterLink>
    </nav>
  </aside>
</template>