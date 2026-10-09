import { defineStore } from "pinia";
import * as api from "../api/cashFlowApi";
import type { CashFlow, CashFlowPayload, CashFlowQueryParams } from "../api/cashFlowApi";
import { showErrorDialog, showSuccessDialog } from "~/helpers/toolsHelper";

export interface CashFlowStats { inflow: number; outflow: number; net: number; cash: number; savings: number; loans: number }
export interface CashFlowsState {
  cashFlows: CashFlow[]; cashFlow: CashFlow | null; labels: string[]; isLoading: boolean;
  isCashFlowAdd: boolean; isCashFlowAdded: boolean; isCashFlowChange: boolean; isCashFlowChanged: boolean;
  isCashFlowDelete: boolean; isCashFlowDeleted: boolean; isCashFlowDeleteAll: boolean; isCashFlowDeletedAll: boolean;
}

export const useCashFlowsStore = defineStore("cashFlows", {
  state: (): CashFlowsState => ({
    cashFlows: [], cashFlow: null, labels: [], isLoading: false,
    isCashFlowAdd: false, isCashFlowAdded: false, isCashFlowChange: false, isCashFlowChanged: false,
    isCashFlowDelete: false, isCashFlowDeleted: false, isCashFlowDeleteAll: false, isCashFlowDeletedAll: false,
  }),
  getters: {
    stats(state): CashFlowStats {
      const s = { inflow: 0, outflow: 0, net: 0, cash: 0, savings: 0, loans: 0 };
      for (const c of state.cashFlows) {
        const n = Number(c.nominal) || 0;
        const sign = c.type === "inflow" ? 1 : -1;
        if (sign === 1) s.inflow += n; else s.outflow += n;
        if (c.source in s) (s as any)[c.source] += sign * n;
      }
      s.net = s.inflow - s.outflow;
      return s;
    },
  },
  actions: {
    async fetchCashFlows(query: CashFlowQueryParams = {}) {
      this.isLoading = true;
      try { this.cashFlows = await api.getCashFlows(query); } catch (e: any) { await showErrorDialog(e.message); }
      this.isLoading = false;
    },
    async fetchLabels() {
      try { this.labels = await api.getLabels(); } catch { this.labels = []; }
    },
    async fetchCashFlow(id: string) {
      this.isLoading = true;
      try { this.cashFlow = await api.getCashFlow(id); } catch (e: any) { this.cashFlow = null; await showErrorDialog(e.message); }
      this.isLoading = false;
    },
    async run(flag: string, done: string, fn: () => Promise<string>) {
      (this as any)[flag] = true; (this as any)[done] = false;
      try { await showSuccessDialog(await fn()); (this as any)[done] = true; } catch (e: any) { await showErrorDialog(e.message); }
      (this as any)[flag] = false;
      return (this as any)[done] as boolean;
    },
    addCashFlow(p: CashFlowPayload) { return this.run("isCashFlowAdd", "isCashFlowAdded", () => api.postCashFlow(p)); },
    changeCashFlow(id: string, p: CashFlowPayload) { return this.run("isCashFlowChange", "isCashFlowChanged", () => api.putCashFlow(id, p)); },
    deleteCashFlow(id: string) { return this.run("isCashFlowDelete", "isCashFlowDeleted", () => api.deleteCashFlow(id)); },
    deleteAllCashFlows() { return this.run("isCashFlowDeleteAll", "isCashFlowDeletedAll", () => api.deleteAllCashFlows()); },
  },
});
