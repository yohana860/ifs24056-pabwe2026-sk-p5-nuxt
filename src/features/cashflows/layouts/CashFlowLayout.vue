<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import NavbarComponent from "../components/NavbarComponent.vue";
import SidebarComponent from "../components/SidebarComponent.vue";

const open = ref(false);
</script>

<template>
  <div class="min-h-screen">
    <NavbarComponent @toggle="open = !open" />
    <SidebarComponent :open="open" @close="open = false" />
    <main class="p-4 sm:p-6 lg:ml-64"><RouterView /></main>
  </div>
</template>
