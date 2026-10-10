import { describe, expect, it, vi } from "vitest";
import { createMockPinia, renderWithProviders } from "~/test-utils";
import CashFlowForm from "../components/CashFlowForm.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import ChangeModal from "./ChangeModal.vue";

const item = { id: "5", type: "inflow", source: "cash", label: "L", nominal: 1, description: "" } as any;
const payload = { type: "inflow", source: "cash", label: "L2", nominal: 2, description: "" };
async function setup(props: any, result = true) {
  const pinia = createMockPinia();
  const store = useCashFlowsStore(pinia);
  const change = vi.spyOn(store, "changeCashFlow").mockResolvedValue(result);
  return { ...(await renderWithProviders(ChangeModal, { props, pinia })), change };
}

describe("ChangeModal", () => {
  it("tidak tampil jika tertutup atau tanpa data", async () => {
    expect((await setup({ open: false, cashFlow: item })).wrapper.find("form").exists()).toBe(false);
    expect((await setup({ open: true, cashFlow: null })).wrapper.find("form").exists()).toBe(false);
  });
  it("mengubah data dan mengirim saved", async () => {
    const { wrapper, change } = await setup({ open: true, cashFlow: item });
    await wrapper.findComponent(CashFlowForm).vm.$emit("submit", payload);
    await vi.waitFor(() => expect(wrapper.emitted("saved")).toHaveLength(1));
    expect(change).toHaveBeenCalledWith("5", payload);
  });
  it("gagal mengubah -> tidak mengirim saved", async () => {
    const { wrapper, change } = await setup({ open: true, cashFlow: item }, false);
    await wrapper.findComponent(CashFlowForm).vm.$emit("submit", payload);
    await vi.waitFor(() => expect(change).toHaveBeenCalled());
    expect(wrapper.emitted("saved")).toBeUndefined();
  });
  it("tidak memanggil API jika data sudah hilang", async () => {
    const { wrapper, change } = await setup({ open: true, cashFlow: item });
    const form = wrapper.findComponent(CashFlowForm);
    await wrapper.setProps({ cashFlow: null });
    await form.vm.$emit("submit", payload);
    expect(change).not.toHaveBeenCalled();
  });
  it("batal dan klik latar menutup", async () => {
    const { wrapper } = await setup({ open: true, cashFlow: item });
    await wrapper.findComponent(CashFlowForm).vm.$emit("cancel");
    await wrapper.find(".fixed").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(2);
  });
});
