import { beforeEach, describe, expect, it, vi } from "vitest";
import { putAccessToken } from "~/helpers/apiHelper";

async function setup() {
  let guard: any;
  vi.resetModules();
  vi.stubGlobal("defineNuxtPlugin", (fn: any) => fn);
  vi.stubGlobal("useRouter", () => ({ beforeEach: (cb: any) => (guard = cb) }));
  const mod = await import("./guard.client");
  (mod.default as any)();
  return guard;
}

describe("guard plugin", () => {
  beforeEach(() => localStorage.clear());

  it("belum login ke halaman terproteksi -> login", async () => {
    expect((await setup())({ path: "/" })).toBe("/auth/login");
  });
  it("belum login ke halaman auth -> boleh", async () => {
    expect((await setup())({ path: "/auth/login" })).toBeUndefined();
  });
  it("sudah login ke halaman auth -> beranda", async () => {
    putAccessToken("t");
    expect((await setup())({ path: "/auth/register" })).toBe("/");
  });
  it("sudah login ke halaman terproteksi -> boleh", async () => {
    putAccessToken("t");
    expect((await setup())({ path: "/users" })).toBeUndefined();
  });
});
