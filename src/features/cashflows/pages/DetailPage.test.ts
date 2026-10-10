import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";
import { createMockPinia, renderWithProviders } from "~/test-utils";
import { showConfirmDialog } from "~/helpers/toolsHelper";
import ChangeModal from "../modals/ChangeModal.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import DetailPage from "./DetailPage.vue";

vi.mock("~/helpers/toolsHelper", async (orig) => ({ ...(await orig<any>()), showConfirmDialog: vi.fn(), showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));

const cf = (o: any = {}) => ({ id: "abc", type: "inflow", source: "cash", label: "Gaji", nominal: 5000, description: "bulanan", created_at: "2026-10-09T10:00:00Z", updated_at: "2026-10-09T11:00:00Z", ...o });

async function setup(state: any = {}) {
  const pinia = createMockPinia();
  const store = useCashFlowsStore(pinia);
  const fetch = vi.spyOn(store, "fetchCashFlow").mockResolvedValue();
  const del = vi.spyOn(store, "deleteCashFlow").mockResolvedValue(true);
  store.$patch(state);
  const r = await renderWithProviders(DetailPage, { pinia, route: "/cash-flows/abc" });
  const replace = vi.spyOn(r.router, "replace");
  return { ...r, store, fetch, del, replace };
}

describe("DetailPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memuat transaksi berdasarkan id rute", async () => {
    const { fetch } = await setup({ cashFlow: cf() });
    expect(fetch).toHaveBeenCalledWith("abc");
  });
  it("status memuat dan tidak ditemukan", async () => {
    expect((await setup({ isLoading: true })).wrapper.text()).toContain("Memuat");
    expect((await setup({ cashFlow: null })).wrapper.text()).toContain("tidak ditemukan");
  });
  it("menampilkan pemasukan lengkap", async () => {
    const { wrapper } = await setup({ cashFlow: cf() });
    expect(wrapper.text()).toContain("Pemasukan");
    expect(wrapper.text()).toContain("Gaji");
    expect(wrapper.text()).toContain("Tunai");
    expect(wrapper.text()).toContain("bulanan");
  });
  it("menampilkan pengeluaran, sumber tidak dikenal, tanpa deskripsi dan tanggal", async () => {
    const { wrapper } = await setup({ cashFlow: cf({ type: "outflow", source: "lain", description: "", created_at: undefined, updated_at: undefined }) });
    expect(wrapper.text()).toContain("Pengeluaran");
    expect(wrapper.text()).toContain("lain");
    expect(wrapper.text()).toContain("-");
  });
  it("hapus: batal, gagal, dan berhasil", async () => {
    const { wrapper, del, replace } = await setup({ cashFlow: cf() });
    const click = async () => { await wrapper.find('button[aria-label="Hapus"]').trigger("click"); await flushPromises(); };
    (showConfirmDialog as any).mockResolvedValueOnce(false);
    await click();
    expect(del).not.toHaveBeenCalled();
    (showConfirmDialog as any).mockResolvedValueOnce(true);
    del.mockResolvedValueOnce(false);
    await click();
    expect(replace).not.toHaveBeenCalled();
    (showConfirmDialog as any).mockResolvedValueOnce(true);
    await click();
    expect(del).toHaveBeenCalledWith("abc");
    expect(replace).toHaveBeenCalledWith("/");
  });
  it("modal ubah: buka, simpan (muat ulang), tutup", async () => {
    const { wrapper, fetch } = await setup({ cashFlow: cf() });
    const modal = wrapper.findComponent(ChangeModal);
    await wrapper.find('button[aria-label="Ubah"]').trigger("click");
    expect(modal.props("open")).toBe(true);
    await modal.vm.$emit("saved");
    await flushPromises();
    expect(modal.props("open")).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(2);
    await wrapper.find('button[aria-label="Ubah"]').trigger("click");
    await modal.vm.$emit("close");
    expect(modal.props("open")).toBe(false);
  });
});
