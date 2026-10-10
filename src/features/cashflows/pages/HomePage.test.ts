import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { createMockPinia, renderWithProviders } from "~/test-utils";
import { showConfirmDialog } from "~/helpers/toolsHelper";
import AddModal from "../modals/AddModal.vue";
import ChangeModal from "../modals/ChangeModal.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import HomePage from "./HomePage.vue";

vi.mock("~/helpers/toolsHelper", async (orig) => ({ ...(await orig<any>()), showConfirmDialog: vi.fn(), showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));

const cf = (o: any = {}) => ({ id: "1", type: "inflow", source: "cash", label: "Gaji", nominal: 1000, description: "d", created_at: "2026-10-09T10:00:00Z", ...o });

async function setup(state: any = {}) {
  const pinia = createMockPinia();
  const store = useCashFlowsStore(pinia);
  const fetch = vi.spyOn(store, "fetchCashFlows").mockResolvedValue();
  const labels = vi.spyOn(store, "fetchLabels").mockResolvedValue();
  const del = vi.spyOn(store, "deleteCashFlow").mockResolvedValue(true);
  const delAll = vi.spyOn(store, "deleteAllCashFlows").mockResolvedValue(true);
  store.$patch(state);
  const r = await renderWithProviders(HomePage, { pinia });
  return { ...r, store, fetch, labels, del, delAll };
}
const btn = (w: any, text: string) => w.findAll("button").find((b: any) => b.text().includes(text));

describe("HomePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memuat data dan label saat dibuka, menampilkan kartu ringkasan", async () => {
    const { wrapper, fetch, labels } = await setup({ cashFlows: [cf()] });
    expect(fetch).toHaveBeenCalled();
    expect(labels).toHaveBeenCalled();
    expect(wrapper.text()).toContain("Total Saldo Kas Bersih");
    expect(wrapper.text()).toContain("Saldo Pinjaman");
  });
  it("status memuat dan kosong", async () => {
    expect((await setup({ isLoading: true })).wrapper.text()).toContain("Memuat data");
    expect((await setup({})).wrapper.text()).toContain("Belum ada transaksi");
  });
  it("menampilkan baris pemasukan, pengeluaran, dan sumber tidak dikenal", async () => {
    const { wrapper } = await setup({
      cashFlows: [cf(), cf({ id: "2", type: "outflow", source: "savings", label: "Makan" }), cf({ id: "3", source: "lain", label: "X" })],
    });
    const text = wrapper.text();
    expect(text).toContain("Pemasukan");
    expect(text).toContain("Pengeluaran");
    expect(text).toContain("Tunai");
    expect(text).toContain("Tabungan");
    expect(text).toContain("lain");
    expect(wrapper.findAll("tbody tr")).toHaveLength(3);
  });
  it("filter memicu pemuatan ulang dan bisa direset", async () => {
    const { wrapper, fetch } = await setup({ labels: ["Gaji"], cashFlows: [cf()] });
    const selects = wrapper.findAll("select");
    await selects[0].setValue("inflow");
    await selects[1].setValue("cash");
    await selects[2].setValue("Gaji");
    const dates = wrapper.findAll('input[type="date"]');
    await dates[0].setValue("2026-10-01");
    await dates[1].setValue("2026-10-31");
    await flushPromises();
    expect(fetch).toHaveBeenLastCalledWith({ type: "inflow", source: "cash", label: "Gaji", start_date: "2026-10-01", end_date: "2026-10-31" });
    await btn(wrapper, "Reset Filter").trigger("click");
    await flushPromises();
    expect(fetch).toHaveBeenLastCalledWith({ type: "", source: "", label: "", start_date: "", end_date: "" });
  });
  it("hapus satu transaksi: batal dan konfirmasi", async () => {
    const { wrapper, del, fetch } = await setup({ cashFlows: [cf()] });
    (showConfirmDialog as any).mockResolvedValueOnce(false);
    await wrapper.find('button[aria-label="Hapus"]').trigger("click");
    await flushPromises();
    expect(del).not.toHaveBeenCalled();
    (showConfirmDialog as any).mockResolvedValueOnce(true);
    const calls = fetch.mock.calls.length;
    await wrapper.find('button[aria-label="Hapus"]').trigger("click");
    await flushPromises();
    expect(del).toHaveBeenCalledWith("1");
    expect(fetch.mock.calls.length).toBe(calls + 1);
  });
  it("reset semua: batal dan konfirmasi", async () => {
    const { wrapper, delAll } = await setup({});
    (showConfirmDialog as any).mockResolvedValueOnce(false);
    await btn(wrapper, "Reset Semua").trigger("click");
    await flushPromises();
    expect(delAll).not.toHaveBeenCalled();
    (showConfirmDialog as any).mockResolvedValueOnce(true);
    await btn(wrapper, "Reset Semua").trigger("click");
    await flushPromises();
    expect(delAll).toHaveBeenCalled();
  });
  it("modal tambah: buka, simpan, tutup", async () => {
    const { wrapper, fetch } = await setup({});
    const modal = wrapper.findComponent(AddModal);
    expect(modal.props("open")).toBe(false);
    await btn(wrapper, "Tambah Transaksi").trigger("click");
    expect(modal.props("open")).toBe(true);
    const calls = fetch.mock.calls.length;
    await modal.vm.$emit("saved");
    await flushPromises();
    expect(modal.props("open")).toBe(false);
    expect(fetch.mock.calls.length).toBe(calls + 1);
    await btn(wrapper, "Tambah Transaksi").trigger("click");
    await modal.vm.$emit("close");
    expect(modal.props("open")).toBe(false);
  });
  it("modal ubah: buka, simpan, tutup", async () => {
    const { wrapper } = await setup({ cashFlows: [cf()] });
    const modal = wrapper.findComponent(ChangeModal);
    expect(modal.props("open")).toBe(false);
    await wrapper.find('button[aria-label="Ubah"]').trigger("click");
    expect(modal.props("open")).toBe(true);
    expect((modal.props("cashFlow") as any).id).toBe("1");
    await modal.vm.$emit("saved");
    await flushPromises();
    expect(modal.props("open")).toBe(false);
    await wrapper.find('button[aria-label="Ubah"]').trigger("click");
    await modal.vm.$emit("close");
    expect(modal.props("open")).toBe(false);
  });
});
