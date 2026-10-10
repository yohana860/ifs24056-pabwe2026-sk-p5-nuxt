import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockPinia, renderWithProviders } from "~/test-utils";
import { showConfirmDialog } from "~/helpers/toolsHelper";
import { useAuthStore } from "~/features/auth/states/authStore";
import { useUsersStore } from "~/features/users/states/usersStore";
import NavbarComponent from "./NavbarComponent.vue";

vi.mock("~/helpers/toolsHelper", async (orig) => ({ ...(await orig<any>()), showConfirmDialog: vi.fn(), showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));

async function setup(profile: any = null) {
  const pinia = createMockPinia();
  const users = useUsersStore(pinia);
  const auth = useAuthStore(pinia);
  const fetchProfile = vi.spyOn(users, "fetchProfile").mockResolvedValue();
  const logout = vi.spyOn(auth, "asyncLogout").mockImplementation(() => {});
  users.profile = profile;
  const r = await renderWithProviders(NavbarComponent, { pinia });
  const replace = vi.spyOn(r.router, "replace");
  return { ...r, fetchProfile, logout, replace };
}
const logoutBtn = (w: any) => w.findAll("button").find((b: any) => b.text().includes("Keluar"));

describe("NavbarComponent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memuat profil dan menampilkan nama + email", async () => {
    const { wrapper, fetchProfile } = await setup({ name: "Yohana", email: "y@x.id" });
    expect(fetchProfile).toHaveBeenCalled();
    expect(wrapper.text()).toContain("Yohana");
    expect(wrapper.text()).toContain("y@x.id");
    expect(wrapper.text()).toContain("Y");
  });
  it("memakai email jika nama kosong", async () => {
    const { wrapper } = await setup({ name: "", email: "z@x.id" });
    expect(wrapper.text()).toContain("z@x.id");
  });
  it("memakai Pengguna jika profil belum ada", async () => {
    const { wrapper } = await setup(null);
    expect(wrapper.text()).toContain("Pengguna");
  });
  it("tombol menu mengirim event toggle", async () => {
    const { wrapper } = await setup();
    await wrapper.find('button[aria-label="Menu"]').trigger("click");
    expect(wrapper.emitted("toggle")).toHaveLength(1);
  });
  it("logout dibatalkan", async () => {
    (showConfirmDialog as any).mockResolvedValue(false);
    const { wrapper, logout, replace } = await setup();
    await logoutBtn(wrapper).trigger("click");
    await vi.waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(logout).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });
  it("logout dikonfirmasi", async () => {
    (showConfirmDialog as any).mockResolvedValue(true);
    const { wrapper, logout, replace } = await setup();
    await logoutBtn(wrapper).trigger("click");
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/auth/login"));
    expect(logout).toHaveBeenCalled();
  });
});
