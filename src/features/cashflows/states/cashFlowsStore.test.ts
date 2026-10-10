import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockPinia } from "~/test-utils";
import { showErrorDialog, showSuccessDialog } from "~/helpers/toolsHelper";
import * as api from "../api/cashFlowApi";
import { useCashFlowsStore } from "./cashFlowsStore";

vi.mock("../api/cashFlowApi");
vi.mock("~/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));
const m = (f: any) => f as ReturnType<typeof vi.fn>;
const payload = { type: "inflow", source: "cash", label: "L", nominal: 1, description: "" };

describe("cashFlowsStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
  });

  it("stats menghitung total dari daftar", () => {
    const s = useCashFlowsStore();
    s.cashFlows = [
      { id: "1", type: "inflow", source: "cash", nominal: 500 },
      { id: "2", type: "outflow", source: "savings", nominal: 200 },
      { id: "3", type: "inflow", source: "loans", nominal: 100 },
      { id: "4", type: "outflow", source: "lainnya", nominal: "x" },
    ] as any;
    expect(s.stats).toEqual({ inflow: 600, outflow: 200, net: 400, cash: 500, savings: -200, loans: 100 });
  });
  it("fetchCashFlows berhasil dan gagal", async () => {
    const s = useCashFlowsStore();
    m(api.getCashFlows).mockResolvedValueOnce([{ id: "1" }]);
    await s.fetchCashFlows({ type: "inflow" });
    expect(api.getCashFlows).toHaveBeenCalledWith({ type: "inflow" });
    expect(s.cashFlows).toEqual([{ id: "1" }]);
    m(api.getCashFlows).mockRejectedValueOnce(new Error("e1"));
    await s.fetchCashFlows();
    expect(showErrorDialog).toHaveBeenCalledWith("e1");
    expect(s.isLoading).toBe(false);
  });
  it("fetchLabels berhasil dan gagal", async () => {
    const s = useCashFlowsStore();
    m(api.getLabels).mockResolvedValueOnce(["A"]);
    await s.fetchLabels();
    expect(s.labels).toEqual(["A"]);
    m(api.getLabels).mockRejectedValueOnce(new Error("x"));
    await s.fetchLabels();
    expect(s.labels).toEqual([]);
  });
  it("fetchCashFlow berhasil dan gagal", async () => {
    const s = useCashFlowsStore();
    m(api.getCashFlow).mockResolvedValueOnce({ id: "7" });
    await s.fetchCashFlow("7");
    expect(s.cashFlow).toEqual({ id: "7" });
    m(api.getCashFlow).mockRejectedValueOnce(new Error("e2"));
    await s.fetchCashFlow("8");
    expect(s.cashFlow).toBeNull();
    expect(showErrorDialog).toHaveBeenCalledWith("e2");
    expect(s.isLoading).toBe(false);
  });
  it("add/change/delete/deleteAll berhasil", async () => {
    const s = useCashFlowsStore();
    m(api.postCashFlow).mockResolvedValue("ok");
    m(api.putCashFlow).mockResolvedValue("ok");
    m(api.deleteCashFlow).mockResolvedValue("ok");
    m(api.deleteAllCashFlows).mockResolvedValue("ok");
    expect(await s.addCashFlow(payload)).toBe(true);
    expect(s.isCashFlowAdded).toBe(true);
    expect(s.isCashFlowAdd).toBe(false);
    expect(await s.changeCashFlow("1", payload)).toBe(true);
    expect(api.putCashFlow).toHaveBeenCalledWith("1", payload);
    expect(await s.deleteCashFlow("1")).toBe(true);
    expect(api.deleteCashFlow).toHaveBeenCalledWith("1");
    expect(await s.deleteAllCashFlows()).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledTimes(4);
  });
  it("aksi gagal mengembalikan false dan menampilkan error", async () => {
    const s = useCashFlowsStore();
    m(api.postCashFlow).mockRejectedValue(new Error("gagal tambah"));
    expect(await s.addCashFlow(payload)).toBe(false);
    expect(s.isCashFlowAdded).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("gagal tambah");
  });
});
