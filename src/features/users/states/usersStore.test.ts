import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockPinia } from "~/test-utils";
import { showErrorDialog, showSuccessDialog } from "~/helpers/toolsHelper";
import * as api from "../api/userApi";
import { useUsersStore } from "./usersStore";

vi.mock("../api/userApi");
vi.mock("~/helpers/toolsHelper", () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));
const m = (f: any) => f as ReturnType<typeof vi.fn>;

describe("usersStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMockPinia();
    m(api.getMe).mockResolvedValue({ name: "Me" });
  });

  it("fetchUsers berhasil dan gagal", async () => {
    const s = useUsersStore();
    m(api.getUsers).mockResolvedValueOnce([{ id: 1 }]);
    await s.fetchUsers();
    expect(s.users).toEqual([{ id: 1 }]);
    expect(s.isLoading).toBe(false);
    m(api.getUsers).mockRejectedValueOnce(new Error("x"));
    await s.fetchUsers();
    expect(showErrorDialog).toHaveBeenCalledWith("x");
    expect(s.isLoading).toBe(false);
  });
  it("fetchProfile berhasil dan gagal", async () => {
    const s = useUsersStore();
    await s.fetchProfile();
    expect(s.profile).toEqual({ name: "Me" });
    m(api.getMe).mockRejectedValueOnce(new Error("y"));
    await s.fetchProfile();
    expect(showErrorDialog).toHaveBeenCalledWith("y");
  });
  it("mutate berhasil memuat ulang profil", async () => {
    const s = useUsersStore();
    await s.mutate(() => Promise.resolve("selesai"));
    expect(showSuccessDialog).toHaveBeenCalledWith("selesai");
    expect(api.getMe).toHaveBeenCalled();
    expect(s.isMutating).toBe(false);
  });
  it("mutate gagal menampilkan error", async () => {
    const s = useUsersStore();
    await s.mutate(() => Promise.reject(new Error("gagal")));
    expect(showErrorDialog).toHaveBeenCalledWith("gagal");
    expect(s.isMutating).toBe(false);
  });
  it("updateProfile, updatePhoto, updatePassword memanggil API", async () => {
    const s = useUsersStore();
    m(api.putMe).mockResolvedValue("a");
    m(api.postPhoto).mockResolvedValue("b");
    m(api.putPassword).mockResolvedValue("c");
    const file = new File(["x"], "f.png");
    await s.updateProfile("N", "e");
    await s.updatePhoto(file);
    await s.updatePassword("lama", "baru");
    expect(api.putMe).toHaveBeenCalledWith("N", "e");
    expect(api.postPhoto).toHaveBeenCalledWith(file);
    expect(api.putPassword).toHaveBeenCalledWith("lama", "baru");
  });
});
