<script setup lang="ts">
import CashFlowForm from "../components/CashFlowForm.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import type { CashFlow, CashFlowPayload } from "../api/cashFlowApi";

const props = defineProps<{ open: boolean; cashFlow: CashFlow | null }>();
const emit = defineEmits<{ (e: "close"): void; (e: "saved"): void }>();
const store = useCashFlowsStore();

async function save(p: CashFlowPayload) {
  if (props.cashFlow && (await store.changeCashFlow(props.cashFlow.id, p))) emit("saved");
}
</script>

<template>
  <div v-if="open && cashFlow" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="emit('close')">
    <div class="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
      <h2 class="mb-4 text-lg font-extrabold">Ubah Transaksi</h2>
      <CashFlowForm :key="cashFlow.id" :initial="cashFlow" submit-label="Simpan Perubahan" :busy="store.isCashFlowChange" @submit="save" @cancel="emit('close')" />
    </div>
  </div>
</template>
