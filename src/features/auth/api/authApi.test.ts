import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "~/helpers/apiHelper";
import { postLogin, postRegister } from "./authApi";

vi.mock("~/helpers/apiHelper", async (orig) => ({ ...(await orig<any>()), apiFetch: vi.fn() }));
const api = apiFetch as any;

describe("authApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("postLogin mengembalikan token", async () => {
    api.mockResolvedValue({ data: { token: "tok" } });
    expect(await postLogin("a@b.c", "pw")).toBe("tok");
    expect(api).toHaveBeenCalledWith("/auth/login", { method: "POST", body: { email: "a@b.c", password: "pw" }, auth: false });
  });
  it("postLogin tanpa data -> undefined", async () => {
    api.mockResolvedValue({});
    expect(await postLogin("a", "b")).toBeUndefined();
  });
  it("postRegister mengembalikan pesan", async () => {
    api.mockResolvedValue({ message: "Terdaftar" });
    expect(await postRegister("N", "a@b.c", "pw")).toBe("Terdaftar");
    expect(api).toHaveBeenCalledWith("/auth/register", { method: "POST", body: { name: "N", email: "a@b.c", password: "pw" }, auth: false });
  });
});
