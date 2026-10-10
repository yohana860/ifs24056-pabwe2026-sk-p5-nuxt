import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockPinia, renderWithProviders } from "~/test-utils";
import { useAuthStore } from "../states/authStore";
import RegisterPage from "./RegisterPage.vue";

vi.mock("~/helpers/toolsHelper", async (orig) => ({ ...(await orig<any>()), showConfirmDialog: vi.fn(), showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));

async function setup(result = true) {
  const pinia = createMockPinia();
  const store = useAuthStore(pinia);
  const register = vi.spyOn(store, "asyncRegister").mockResolvedValue(result);
  const r = await renderWithProviders(RegisterPage, { pinia });
  const replace = vi.spyOn(r.router, "replace");
  return { ...r, store, register, replace };
}
async function fill(w: any, name: string, email: string, pw: string) {
  if (name) await w.find('input[type="text"]').setValue(name);
  if (email) await w.find('input[type="email"]').setValue(email);
  if (pw) await w.find('input[type="password"]').setValue(pw);
  await w.find("form").trigger("submit");
}

describe("RegisterPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menolak form yang tidak valid", async () => {
    const { wrapper, register } = await setup();
    await fill(wrapper, "", "", "");
    await fill(wrapper, "Nama", "", "");
    await fill(wrapper, "Nama", "a@b.c", "123");
    expect(register).not.toHaveBeenCalled();
  });
  it("berhasil mendaftar -> ke halaman login", async () => {
    const { wrapper, register, replace } = await setup(true);
    await fill(wrapper, "Nama", "a@b.c", "123456");
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/auth/login"));
    expect(register).toHaveBeenCalledWith("Nama", "a@b.c", "123456");
  });
  it("gagal mendaftar -> tetap di halaman", async () => {
    const { wrapper, register, replace } = await setup(false);
    await fill(wrapper, "Nama", "a@b.c", "123456");
    await vi.waitFor(() => expect(register).toHaveBeenCalled());
    expect(replace).not.toHaveBeenCalled();
  });
  it("menampilkan status memproses", async () => {
    const { wrapper, store } = await setup();
    store.isAuthRegister = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find("button").text()).toContain("Memproses");
  });
});
