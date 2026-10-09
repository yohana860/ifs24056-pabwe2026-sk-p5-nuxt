<script setup lang="ts">
import { reactive } from "vue";
import type { CashFlow, CashFlowPayload } from "../api/cashFlowApi";

const props = defineProps<{ initial?: CashFlow | null; busy?: boolean; submitLabel: string }>();
const emit = defineEmits<{ (e: "submit", p: CashFlowPayload): void; (e: "cancel"): void }>();

const form = reactive({
  type: props.initial?.type ?? "inflow",
  source: props.initial?.source ?? "cash",
  label: props.initial?.label ?? "",
  nominal: props.initial?.nominal ?? ("" as number | ""),
  description: props.initial?.description ?? "",
});
const cls = "w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-400";

function submit() {
  if (!form.label || !form.nominal || Number(form.nominal) <= 0) return;
  emit("submit", { ...form, nominal: Number(form.nominal) });
}
</script>

<template>
  <form class="space-y-3" @submit.prevent="submit">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-xs font-bold uppercase text-slate-600">Jenis</label>
        <select v-model="form.type" :class="cls"><option value="inflow">Inflow (Pemasukan)</option><option value="outflow">Outflow (Pengeluaran)</option></select>
      </div>
      <div>
        <label class="text-xs font-bold uppercase text-slate-600">Sumber Dana</label>
        <select v-model="form.source" :class="cls"><option value="cash">Tunai</option><option value="savings">Tabungan</option><option value="loans">Pinjaman</option></select>
      </div>
    </div>
    <div><label class="text-xs font-bold uppercase text-slate-600">Label Kategori</label><input v-model="form.label" placeholder="mis. Gaji, Makan" :class="cls" /></div>
    <div><label class="text-xs font-bold uppercase text-slate-600">Nominal (Rp)</label><input v-model="form.nominal" type="number" min="1" placeholder="50000" :class="cls" /></div>
    <div><label class="text-xs font-bold uppercase text-slate-600">Keterangan</label><textarea v-model="form.description" rows="3" placeholder="Catatan singkat" :class="cls" /></div>
    <div class="flex justify-end gap-2 pt-2">
      <button type="button" class="rounded-xl px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-100" @click="emit('cancel')">Batal</button>
      <button type="submit" :disabled="busy" class="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">{{ busy ? "Menyimpan..." : submitLabel }}</button>
    </div>
  </form>
</template>
