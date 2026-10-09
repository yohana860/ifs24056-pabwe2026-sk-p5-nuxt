import { apiFetch, pickList } from "~/helpers/apiHelper";

export interface CashFlow {
  id: string;
  type: "inflow" | "outflow";
  source: "cash" | "savings" | "loans";
  label: string;
  nominal: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}
export interface CashFlowPayload {
  type: string;
  source: string;
  label: string;
  nominal: number;
  description: string;
}
export interface CashFlowQueryParams {
  type?: string;
  source?: string;
  label?: string;
  start_date?: string;
  end_date?: string;
}

export const getCashFlows = async (query: CashFlowQueryParams = {}): Promise<CashFlow[]> =>
  pickList((await apiFetch("/cash-flows", { query: query as any })).data, "cash_flows", "cashFlows");
export const getCashFlow = async (id: string): Promise<CashFlow> => {
  const d = (await apiFetch(`/cash-flows/${id}`)).data;
  return d?.cash_flow ?? d;
};
export const postCashFlow = async (p: CashFlowPayload) =>
  (await apiFetch("/cash-flows", { method: "POST", body: p as any })).message;
export const putCashFlow = async (id: string, p: CashFlowPayload) =>
  (await apiFetch(`/cash-flows/${id}`, { method: "PUT", body: p as any })).message;
export const deleteCashFlow = async (id: string) =>
  (await apiFetch(`/cash-flows/${id}`, { method: "DELETE" })).message;
export const deleteAllCashFlows = async () =>
  (await apiFetch("/cash-flows", { method: "DELETE" })).message;
export const getLabels = async (): Promise<string[]> =>
  pickList((await apiFetch("/cash-flows/labels")).data, "labels");
export const getDailyStats = async () => (await apiFetch("/cash-flows/stats/daily")).data;
export const getMonthlyStats = async () => (await apiFetch("/cash-flows/stats/monthly")).data;
