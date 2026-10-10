import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import CashFlowForm from "./CashFlowForm.vue";

const item = { id: "1", type: "outflow", source: "savings", label: "Makan", nominal: 25000, description: "siang" } as any;
const fill = async (w: any, label: string, nominal: string) => {
  await w.findAll("input")[0].setValue(label);
  await w.findAll("input")[1].setValue(nominal);
  await w.find("form").trigger("submit");
};

describe("CashFlowForm", () => {
  it("nilai awal default saat tanpa initial", () => {
    const w = mount(CashFlowForm, { props: { submitLabel: "Simpan" } });
    expect((w.findAll("select")[0].element as HTMLSelectElement).value).toBe("inflow");
    expect((w.findAll("select")[1].element as HTMLSelectElement).value).toBe("cash");
    expect(w.text()).toContain("Simpan");
  });
  it("memakai nilai initial", () => {
    const w = mount(CashFlowForm, { props: { submitLabel: "Ubah", initial: item } });
    expect((w.findAll("select")[0].element as HTMLSelectElement).value).toBe("outflow");
    expect((w.findAll("input")[0].element as HTMLInputElement).value).toBe("Makan");
    expect((w.find("textarea").element as HTMLTextAreaElement).value).toBe("siang");
  });
  it("menolak input tidak valid", async () => {
    const w = mount(CashFlowForm, { props: { submitLabel: "Simpan" } });
    await fill(w, "", "");
    await fill(w, "Gaji", "");
    await fill(w, "Gaji", "0");
    expect(w.emitted("submit")).toBeUndefined();
  });
  it("mengirim payload valid", async () => {
    const w = mount(CashFlowForm, { props: { submitLabel: "Simpan" } });
    await w.findAll("select")[0].setValue("outflow");
    await w.findAll("select")[1].setValue("loans");
    await w.find("textarea").setValue("catatan");
    await fill(w, "Gaji", "5000");
    expect(w.emitted("submit")![0][0]).toEqual({ type: "outflow", source: "loans", label: "Gaji", nominal: 5000, description: "catatan" });
  });
  it("tombol batal dan status sibuk", async () => {
    const w = mount(CashFlowForm, { props: { submitLabel: "Simpan", busy: true } });
    await w.find('button[type="button"]').trigger("click");
    expect(w.emitted("cancel")).toHaveLength(1);
    expect(w.find('button[type="submit"]').text()).toContain("Menyimpan");
  });
});
