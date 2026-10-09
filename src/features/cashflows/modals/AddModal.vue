<script setup lang="ts">
import CashFlowForm from "../components/CashFlowForm.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import type { CashFlowPayload } from "../api/cashFlowApi";

defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: "close"): void; (e: "saved"): void }>();
const store = useCashFlowsStore();

async function save(p: CashFlowPayload) {
  if (await store.addCashFlow(p)) emit("saved");
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="emit('close')">
    <div class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
      <h2 class="mb-4 text-lg font-extrabold">Tambah Transaksi</h2>
      <CashFlowForm submit-label="Simpan" :busy="store.isCashFlowAdd" @submit="save" @cancel="emit('close')" />
    </div>
  </div>
</template>
