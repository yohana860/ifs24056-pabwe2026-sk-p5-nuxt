import { describe, expect, it, vi } from "vitest";
import { createMockPinia, renderWithProviders } from "~/test-utils";
import CashFlowForm from "../components/CashFlowForm.vue";
import { useCashFlowsStore } from "../states/cashFlowsStore";
import AddModal from "./AddModal.vue";

const payload = { type: "inflow", source: "cash", label: "L", nominal: 1, description: "" };
async function setup(open: boolean, result = true) {
  const pinia = createMockPinia();
  const store = useCashFlowsStore(pinia);
  const add = vi.spyOn(store, "addCashFlow").mockResolvedValue(result);
  return { ...(await renderWithProviders(AddModal, { props: { open }, pinia })), add };
}

describe("AddModal", () => {
  it("tidak tampil saat tertutup", async () => {
    const { wrapper } = await setup(false);
    expect(wrapper.find("form").exists()).toBe(false);
  });
  it("menyimpan dan mengirim saved", async () => {
    const { wrapper, add } = await setup(true, true);
    await wrapper.findComponent(CashFlowForm).vm.$emit("submit", payload);
    await vi.waitFor(() => expect(wrapper.emitted("saved")).toHaveLength(1));
    expect(add).toHaveBeenCalledWith(payload);
  });
  it("gagal menyimpan -> tidak mengirim saved", async () => {
    const { wrapper, add } = await setup(true, false);
    await wrapper.findComponent(CashFlowForm).vm.$emit("submit", payload);
    await vi.waitFor(() => expect(add).toHaveBeenCalled());
    expect(wrapper.emitted("saved")).toBeUndefined();
  });
  it("batal dan klik latar menutup", async () => {
    const { wrapper } = await setup(true);
    await wrapper.findComponent(CashFlowForm).vm.$emit("cancel");
    await wrapper.find(".fixed").trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(2);
  });
});
