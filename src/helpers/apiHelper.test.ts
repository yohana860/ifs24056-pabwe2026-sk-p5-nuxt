import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch, getAccessToken, pickList, putAccessToken, removeAccessToken } from "../apiHelper";

describe("access token helpers", () => {
  afterEach(() => localStorage.clear());
  it("gets, stores, and removes the access token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});

describe("apiFetch", () => {
  afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });
  it("adds query params and bearer auth and serializes JSON bodies", async () => {
    putAccessToken("secret");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, status: 200, json: async () => ({ success: true }) } as Response);
    await expect(apiFetch("/items", { method: "POST", body: { x: 1 }, query: { a: 2, empty: "", nil: null, missing: undefined } })).resolves.toEqual({ success: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/items?a=2");
    expect(init?.headers).toEqual({ Authorization: "Bearer secret", "Content-Type": "application/json" });
    expect(init?.body).toBe('{"x":1}');
  });
  it("uses defaults with no token and no request body", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, status: 200, json: async () => ({ ok: true }) } as Response);
    await expect(apiFetch("/plain")).resolves.toEqual({ ok: true });
    expect(fetchMock.mock.calls[0][1]).toEqual({ method: "GET", headers: {}, body: undefined });
  });
  it("supports unauthenticated requests and FormData", async () => {
    putAccessToken("secret");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: true, status: 200, json: async () => ({}) } as Response);
    const form = new FormData(); form.append("file", "content");
    await apiFetch("/upload", { body: form, auth: false });
    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({});
    expect(fetchMock.mock.calls[0][1]?.body).toBe(form);
  });
  it("handles invalid JSON and throws on HTTP or API errors", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    fetchMock.mockResolvedValueOnce({ ok: false, status: 503, json: async () => { throw new Error("bad json"); } } as unknown as Response);
    await expect(apiFetch("/bad", { auth: false })).rejects.toThrow("Permintaan gagal (503)");
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ success: false, message: "Ditolak" }) } as Response);
    await expect(apiFetch("/bad", { auth: false })).rejects.toThrow("Ditolak");
    fetchMock.mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({ message: "Invalid" }) } as Response);
    await expect(apiFetch("/bad", { auth: false })).rejects.toThrow("Invalid");
  });
});

describe("pickList", () => {
  it("returns the first matching array, the array itself, or an empty list", () => {
    expect(pickList({ first: "no", second: [1] }, "first", "second")).toEqual([1]);
    expect(pickList([2])).toEqual([2]);
    expect(pickList({ first: 3 }, "first")).toEqual([]);
    expect(pickList(null, "x")).toEqual([]);
  });
});
