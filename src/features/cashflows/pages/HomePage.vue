<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { Plus, Trash2, Eye, Pencil, Wallet, TrendingUp, TrendingDown, Banknote, PiggyBank, HandCoins, RotateCcw } from "lucide-vue-next";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import AddModal from "../modals/AddModal.vue";
import ChangeModal from "../modals/ChangeModal.vue";
import { formatRupiah, formatDate, showConfirmDialog } from "~/helpers/toolsHelper";
import type { CashFlow } from "../api/cashFlowApi";

const store = useCashFlowsStore();
const filters = reactive({ type: "", source: "", label: "", start_date: "", end_date: "" });
const showAdd = ref(false);
const editing = ref<CashFlow | null>(null);
const sourceLabel: Record<string, string> = { cash: "Tunai", savings: "Tabungan", loans: "Pinjaman" };

const cards = computed(() => [
  { t: "Total Saldo Kas Bersih", v: store.stats.net, icon: Wallet, c: "bg-indigo-600 text-white" },
  { t: "Total Pemasukan (Inflow)", v: store.stats.inflow, icon: TrendingUp, c: "bg-white text-emerald-700" },
  { t: "Total Pengeluaran (Outflow)", v: store.stats.outflow, icon: TrendingDown, c: "bg-white text-red-600" },
  { t: "Saldo Kas Tunai", v: store.stats.cash, icon: Banknote, c: "bg-white text-slate-800" },
  { t: "Saldo Tabungan", v: store.stats.savings, icon: PiggyBank, c: "bg-white text-slate-800" },
  { t: "Saldo Pinjaman", v: store.stats.loans, icon: HandCoins, c: "bg-white text-slate-800" },
]);
const load = () => store.fetchCashFlows({ ...filters });
const resetFilters = () => Object.assign(filters, { type: "", source: "", label: "", start_date: "", end_date: "" });

onMounted(() => { load(); store.fetchLabels(); });
watch(filters, load);

async function remove(c: CashFlow) {
  if (await showConfirmDialog(`Hapus transaksi "${c.label}"?`)) { await store.deleteCashFlow(c.id); load(); }
}
async function removeAll() {
  if (await showConfirmDialog("Seluruh transaksi akan dihapus permanen.")) { await store.deleteAllCashFlows(); load(); }
}
function saved() { showAdd.value = false; editing.value = null; load(); store.fetchLabels(); }
const inp = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400";
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div><h1 class="text-2xl font-extrabold">Ringkasan Arus Kas</h1><p class="text-sm text-slate-600">Pantau pemasukan dan pengeluaranmu.</p></div>
      <div class="flex gap-2">
        <button class="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50" @click="removeAll"><RotateCcw :size="16" /> Reset Semua</button>
        <button class="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700" @click="showAdd = true"><Plus :size="16" /> Tambah Transaksi</button>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div v-for="c in cards" :key="c.t" :class="['rounded-2xl p-5 shadow-sm border border-slate-100', c.c]">
        <div class="flex items-center justify-between"><p class="text-sm font-medium">{{ c.t }}</p><component :is="c.icon" :size="20" /></div>
        <p class="mt-2 text-2xl font-extrabold">{{ formatRupiah(c.v) }}</p>
      </div>
    </div>

    <div class="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
      <select v-model="filters.type" aria-label="Filter jenis" :class="inp"><option value="">Semua Jenis</option><option value="inflow">Inflow</option><option value="outflow">Outflow</option></select>
      <select v-model="filters.source" aria-label="Filter sumber dana" :class="inp"><option value="">Semua Sumber</option><option value="cash">Tunai</option><option value="savings">Tabungan</option><option value="loans">Pinjaman</option></select>
      <select v-model="filters.label" aria-label="Filter label" :class="inp"><option value="">Semua Label</option><option v-for="l in store.labels" :key="l" :value="l">{{ l }}</option></select>
      <input v-model="filters.start_date" type="date" :class="inp" aria-label="Tanggal awal" />
      <input v-model="filters.end_date" type="date" :class="inp" aria-label="Tanggal akhir" />
      <button class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200" @click="resetFilters">Reset Filter</button>
    </div>

    <div class="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase text-slate-600">
          <tr><th class="px-4 py-3">Tanggal</th><th class="px-4 py-3">Label</th><th class="px-4 py-3">Jenis</th><th class="px-4 py-3">Sumber</th><th class="px-4 py-3 text-right">Nominal</th><th class="px-4 py-3 text-right">Aksi</th></tr>
        </thead>
        <tbody>
          <tr v-if="store.isLoading"><td colspan="6" class="px-4 py-10 text-center text-slate-600">Memuat data...</td></tr>
          <tr v-else-if="!store.cashFlows.length"><td colspan="6" class="px-4 py-10 text-center text-slate-600">Belum ada transaksi.</td></tr>
          <tr v-for="c in store.cashFlows" :key="c.id" class="border-t border-slate-100 hover:bg-slate-50">
            <td class="px-4 py-3 whitespace-nowrap text-slate-600">{{ formatDate(c.created_at) }}</td>
            <td class="px-4 py-3 font-semibold">{{ c.label }}</td>
            <td class="px-4 py-3"><span :class="['rounded-full px-2.5 py-1 text-xs font-bold', c.type === 'inflow' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800']">{{ c.type === "inflow" ? "Pemasukan" : "Pengeluaran" }}</span></td>
            <td class="px-4 py-3">{{ sourceLabel[c.source] || c.source }}</td>
            <td :class="['px-4 py-3 text-right font-bold', c.type === 'inflow' ? 'text-emerald-700' : 'text-red-600']">{{ c.type === "inflow" ? "+" : "-" }}{{ formatRupiah(c.nominal) }}</td>
            <td class="px-4 py-3">
              <div class="flex justify-end gap-1">
                <RouterLink :to="`/cash-flows/${c.id}`" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Detail"><Eye :size="16" /></RouterLink>
                <button class="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50" aria-label="Ubah" @click="editing = c"><Pencil :size="16" /></button>
                <button class="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Hapus" @click="remove(c)"><Trash2 :size="16" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AddModal :open="showAdd" @close="showAdd = false" @saved="saved" />
    <ChangeModal :open="!!editing" :cash-flow="editing" @close="editing = null" @saved="saved" />
  </section>
</template>