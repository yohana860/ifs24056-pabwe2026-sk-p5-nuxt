import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockPinia, renderWithProviders } from "~/test-utils";
import { useAuthStore } from "../states/authStore";
import LoginPage from "./LoginPage.vue";

vi.mock("~/helpers/toolsHelper", async (orig) => ({ ...(await orig<any>()), showConfirmDialog: vi.fn(), showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));

async function setup(result = true) {
  const pinia = createMockPinia();
  const store = useAuthStore(pinia);
  const login = vi.spyOn(store, "asyncLogin").mockResolvedValue(result);
  const r = await renderWithProviders(LoginPage, { pinia });
  const replace = vi.spyOn(r.router, "replace");
  return { ...r, store, login, replace };
}
const form = (w: any) => w.find("form");

describe("LoginPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("tidak mengirim jika email kosong", async () => {
    const { wrapper, login } = await setup();
    await form(wrapper).trigger("submit");
    expect(login).not.toHaveBeenCalled();
  });
  it("tidak mengirim jika password kosong", async () => {
    const { wrapper, login } = await setup();
    await wrapper.find('input[type="email"]').setValue("a@b.c");
    await form(wrapper).trigger("submit");
    expect(login).not.toHaveBeenCalled();
  });
  it("login berhasil -> ke beranda", async () => {
    const { wrapper, login, replace } = await setup(true);
    await wrapper.find('input[type="email"]').setValue("a@b.c");
    await wrapper.find('input[type="password"]').setValue("rahasia");
    await form(wrapper).trigger("submit");
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/"));
    expect(login).toHaveBeenCalledWith("a@b.c", "rahasia");
  });
  it("login gagal -> tidak pindah halaman", async () => {
    const { wrapper, login, replace } = await setup(false);
    await wrapper.find('input[type="email"]').setValue("a@b.c");
    await wrapper.find('input[type="password"]').setValue("rahasia");
    await form(wrapper).trigger("submit");
    await vi.waitFor(() => expect(login).toHaveBeenCalled());
    expect(replace).not.toHaveBeenCalled();
  });
  it("menampilkan status memproses", async () => {
    const { wrapper, store } = await setup();
    store.isAuthLogin = true;
    await wrapper.vm.$nextTick();
    const btn = wrapper.find("button");
    expect(btn.text()).toContain("Memproses");
    expect(btn.attributes("disabled")).toBeDefined();
  });
});
