import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockPinia } from "~/test-utils";
import { getAccessToken, putAccessToken } from "~/helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "~/helpers/toolsHelper";
import * as api from "../api/authApi";
import { useAuthStore } from "./authStore";

vi.mock("../api/authApi");
vi.mock("~/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));

describe("authStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    createMockPinia();
  });

  it("state awal", () => {
    const s = useAuthStore();
    expect([s.isAuthLogin, s.isAuthRegister, s.isAuthLogout, s.token]).toEqual([false, false, false, null]);
  });
  it("login berhasil menyimpan token", async () => {
    (api.postLogin as any).mockResolvedValue("tok");
    const s = useAuthStore();
    expect(await s.asyncLogin("a", "b")).toBe(true);
    expect(s.token).toBe("tok");
    expect(getAccessToken()).toBe("tok");
    expect(s.isAuthLogin).toBe(false);
  });
  it("login gagal menampilkan error", async () => {
    (api.postLogin as any).mockRejectedValue(new Error("salah"));
    const s = useAuthStore();
    expect(await s.asyncLogin("a", "b")).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("salah");
    expect(s.isAuthLogin).toBe(false);
  });
  it("register berhasil", async () => {
    (api.postRegister as any).mockResolvedValue("sukses");
    const s = useAuthStore();
    expect(await s.asyncRegister("n", "a", "b")).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("sukses");
    expect(s.isAuthRegister).toBe(false);
  });
  it("register gagal", async () => {
    (api.postRegister as any).mockRejectedValue(new Error("duplikat"));
    const s = useAuthStore();
    expect(await s.asyncRegister("n", "a", "b")).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("duplikat");
  });
  it("logout menghapus token", () => {
    putAccessToken("tok");
    const s = useAuthStore();
    s.token = "tok";
    s.asyncLogout();
    expect(s.token).toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(s.isAuthLogout).toBe(false);
  });
  it("loadToken membaca dari localStorage", () => {
    putAccessToken("zzz");
    const s = useAuthStore();
    s.loadToken();
    expect(s.token).toBe("zzz");
  });
});
