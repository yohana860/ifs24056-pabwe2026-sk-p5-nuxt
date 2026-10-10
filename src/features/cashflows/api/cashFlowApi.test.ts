import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "~/helpers/apiHelper";
import * as cf from "./cashFlowApi";

vi.mock("~/helpers/apiHelper", async (orig) => ({ ...(await orig<any>()), apiFetch: vi.fn() }));
const api = apiFetch as any;
const payload = { type: "inflow", source: "cash", label: "Gaji", nominal: 100, description: "d" };

describe("cashFlowApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getCashFlows tanpa dan dengan query", async () => {
    api.mockResolvedValue({ data: { cash_flows: [{ id: "1" }] } });
    expect(await cf.getCashFlows()).toEqual([{ id: "1" }]);
    expect(api).toHaveBeenLastCalledWith("/cash-flows", { query: {} });
    api.mockResolvedValue({ data: { cashFlows: [{ id: "2" }] } });
    expect(await cf.getCashFlows({ type: "inflow" })).toEqual([{ id: "2" }]);
    expect(api).toHaveBeenLastCalledWith("/cash-flows", { query: { type: "inflow" } });
  });
  it("getCashFlow: cash_flow, data langsung, tanpa data", async () => {
    api.mockResolvedValueOnce({ data: { cash_flow: { id: "1" } } });
    expect(await cf.getCashFlow("1")).toEqual({ id: "1" });
    expect(api).toHaveBeenLastCalledWith("/cash-flows/1");
    api.mockResolvedValueOnce({ data: { id: "2" } });
    expect(await cf.getCashFlow("2")).toEqual({ id: "2" });
    api.mockResolvedValueOnce({});
    expect(await cf.getCashFlow("3")).toBeUndefined();
  });
  it("post, put, delete, deleteAll", async () => {
    api.mockResolvedValue({ message: "m" });
    expect(await cf.postCashFlow(payload)).toBe("m");
    expect(api).toHaveBeenLastCalledWith("/cash-flows", { method: "POST", body: payload });
    expect(await cf.putCashFlow("9", payload)).toBe("m");
    expect(api).toHaveBeenLastCalledWith("/cash-flows/9", { method: "PUT", body: payload });
    expect(await cf.deleteCashFlow("9")).toBe("m");
    expect(api).toHaveBeenLastCalledWith("/cash-flows/9", { method: "DELETE" });
    expect(await cf.deleteAllCashFlows()).toBe("m");
    expect(api).toHaveBeenLastCalledWith("/cash-flows", { method: "DELETE" });
  });
  it("labels dan statistik", async () => {
    api.mockResolvedValue({ data: { labels: ["Gaji"] } });
    expect(await cf.getLabels()).toEqual(["Gaji"]);
    api.mockResolvedValue({ data: { x: 1 } });
    expect(await cf.getDailyStats()).toEqual({ x: 1 });
    expect(api).toHaveBeenLastCalledWith("/cash-flows/stats/daily");
    expect(await cf.getMonthlyStats()).toEqual({ x: 1 });
    expect(api).toHaveBeenLastCalledWith("/cash-flows/stats/monthly");
  });
});
