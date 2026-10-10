import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch, getAccessToken, pickList, putAccessToken, removeAccessToken } from "./apiHelper";

const respond = (body: any, ok = true, status = 200) =>
  vi.fn().mockResolvedValue({ ok, status, json: () => Promise.resolve(body) });

describe("apiHelper", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("GET tanpa opsi, tanpa token", async () => {
    const f = respond({ success: true, data: 1 });
    vi.stubGlobal("fetch", f);
    const json = await apiFetch("/x");
    expect(json.data).toBe(1);
    const [url, init] = f.mock.calls[0];
    expect(String(url)).toBe(`${DELCOM_BASEURL}/x`);
    expect(init.method).toBe("GET");
    expect(init.headers.Authorization).toBeUndefined();
    expect(init.body).toBeUndefined();
  });

  it("menambahkan query yang terisi dan melewati yang kosong", async () => {
    const f = respond({});
    vi.stubGlobal("fetch", f);
    await apiFetch("/x", { query: { a: "1", b: "", c: null, d: undefined, e: 0 } });
    const url = String(f.mock.calls[0][0]);
    expect(url).toContain("a=1");
    expect(url).toContain("e=0");
    expect(url).not.toContain("b=");
    expect(url).not.toContain("c=");
    expect(url).not.toContain("d=");
  });

  it("mengirim Bearer token, kecuali auth=false", async () => {
    putAccessToken("tok");
    const f = respond({});
    vi.stubGlobal("fetch", f);
    await apiFetch("/x");
    expect(f.mock.calls[0][1].headers.Authorization).toBe("Bearer tok");
    await apiFetch("/x", { auth: false });
    expect(f.mock.calls[1][1].headers.Authorization).toBeUndefined();
  });

  it("mengirim body JSON", async () => {
    const f = respond({});
    vi.stubGlobal("fetch", f);
    await apiFetch("/x", { method: "POST", body: { a: 1 } });
    const init = f.mock.calls[0][1];
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("mengirim FormData apa adanya", async () => {
    const f = respond({});
    vi.stubGlobal("fetch", f);
    const fd = new FormData();
    await apiFetch("/x", { method: "POST", body: fd });
    const init = f.mock.calls[0][1];
    expect(init.body).toBe(fd);
    expect(init.headers["Content-Type"]).toBeUndefined();
  });

  it("melempar pesan dari server saat respons tidak ok", async () => {
    vi.stubGlobal("fetch", respond({ message: "Salah" }, false, 400));
    await expect(apiFetch("/x")).rejects.toThrow("Salah");
  });

  it("melempar error saat success=false", async () => {
    vi.stubGlobal("fetch", respond({ success: false, message: "Gagal bos" }));
    await expect(apiFetch("/x")).rejects.toThrow("Gagal bos");
  });

  it("memakai pesan bawaan saat tidak ada pesan / body bukan JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.reject(new Error("x")) }));
    await expect(apiFetch("/x")).rejects.toThrow("Permintaan gagal (500)");
  });

  it("pickList", () => {
    expect(pickList({ a: [1] }, "z", "a")).toEqual([1]);
    expect(pickList([2], "a")).toEqual([2]);
    expect(pickList(null, "a")).toEqual([]);
    expect(pickList({ a: "bukan array" }, "a")).toEqual([]);
  });
});
