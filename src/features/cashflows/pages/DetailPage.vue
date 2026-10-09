<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { ArrowLeft, Pencil, Trash2 } from "lucide-vue-next";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import ChangeModal from "../modals/ChangeModal.vue";
import { formatDate, formatRupiah, showConfirmDialog } from "~/helpers/toolsHelper";

const route = useRoute();
const router = useRouter();
const store = useCashFlowsStore();
const editing = ref(false);
const id = String(route.params.cashFlowId);
const sourceLabel: Record<string, string> = { cash: "Tunai", savings: "Tabungan", loans: "Pinjaman" };

onMounted(() => store.fetchCashFlow(id));
async function remove() {
  if (await showConfirmDialog("Transaksi ini akan dihapus.") && (await store.deleteCashFlow(id))) router.replace("/");
}
</script>

<template>
  <section class="mx-auto max-w-2xl space-y-4">
    <RouterLink to="/" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"><ArrowLeft :size="16" /> Kembali</RouterLink>
    <p v-if="store.isLoading" class="text-slate-600">Memuat...</p>
    <p v-else-if="!store.cashFlow" class="text-slate-600">Transaksi tidak ditemukan.</p>
    <div v-else class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div class="flex items-start justify-between">
        <div>
          <span :class="['rounded-full px-3 py-1 text-xs font-bold', store.cashFlow.type === 'inflow' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800']">{{ store.cashFlow.type === "inflow" ? "Pemasukan" : "Pengeluaran" }}</span>
          <h1 class="mt-3 text-2xl font-extrabold">{{ store.cashFlow.label }}</h1>
          <p :class="['text-3xl font-extrabold mt-1', store.cashFlow.type === 'inflow' ? 'text-emerald-700' : 'text-red-600']">{{ formatRupiah(store.cashFlow.nominal) }}</p>
        </div>
        <div class="flex gap-2">
          <button class="rounded-xl bg-indigo-600 p-2.5 text-white" aria-label="Ubah" @click="editing = true"><Pencil :size="18" /></button>
          <button class="rounded-xl bg-red-600 p-2.5 text-white" aria-label="Hapus" @click="remove"><Trash2 :size="18" /></button>
        </div>
      </div>
      <dl class="mt-6 grid gap-4 sm:grid-cols-2 text-sm">
        <div><dt class="text-slate-600">Sumber Dana</dt><dd class="font-semibold">{{ sourceLabel[store.cashFlow.source] || store.cashFlow.source }}</dd></div>
        <div><dt class="text-slate-600">Dibuat</dt><dd class="font-semibold">{{ formatDate(store.cashFlow.created_at) }}</dd></div>
        <div><dt class="text-slate-600">Diperbarui</dt><dd class="font-semibold">{{ formatDate(store.cashFlow.updated_at) }}</dd></div>
        <div class="sm:col-span-2"><dt class="text-slate-600">Deskripsi</dt><dd class="font-semibold whitespace-pre-line">{{ store.cashFlow.description || "-" }}</dd></div>
      </dl>
    </div>
    <ChangeModal :open="editing" :cash-flow="store.cashFlow" @close="editing = false" @saved="editing = false; store.fetchCashFlow(id)" />
  </section>
</template>