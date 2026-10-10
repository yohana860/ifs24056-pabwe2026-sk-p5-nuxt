import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "~/helpers/apiHelper";
import { getMe, getUsers, postPhoto, putMe, putPassword } from "./userApi";

vi.mock("~/helpers/apiHelper", async (orig) => ({ ...(await orig<any>()), apiFetch: vi.fn() }));
const api = apiFetch as any;

describe("userApi", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getUsers", async () => {
    api.mockResolvedValue({ data: { users: [{ id: 1 }] } });
    expect(await getUsers()).toEqual([{ id: 1 }]);
    expect(api).toHaveBeenCalledWith("/users");
  });
  it("getMe: data.user, data langsung, dan tanpa data", async () => {
    api.mockResolvedValueOnce({ data: { user: { name: "A" } } });
    expect(await getMe()).toEqual({ name: "A" });
    api.mockResolvedValueOnce({ data: { name: "B" } });
    expect(await getMe()).toEqual({ name: "B" });
    api.mockResolvedValueOnce({});
    expect(await getMe()).toBeUndefined();
  });
  it("putMe", async () => {
    api.mockResolvedValue({ message: "ok" });
    expect(await putMe("N", "e@x.y")).toBe("ok");
    expect(api).toHaveBeenCalledWith("/users/me", { method: "PUT", body: { name: "N", email: "e@x.y" } });
  });
  it("postPhoto mengirim FormData", async () => {
    api.mockResolvedValue({ message: "foto" });
    const file = new File(["x"], "a.png");
    expect(await postPhoto(file)).toBe("foto");
    const opts = api.mock.calls[0][1];
    expect(api.mock.calls[0][0]).toBe("/users/me/photo");
    expect(opts.body.get("photo")).toBeInstanceOf(File);
  });
  it("putPassword", async () => {
    api.mockResolvedValue({ message: "pw" });
    expect(await putPassword("lama", "baru")).toBe("pw");
    expect(api).toHaveBeenCalledWith("/users/me/password", { method: "PUT", body: { password: "lama", new_password: "baru" } });
  });
});
