import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockPinia, renderWithProviders } from "~/test-utils";
import { showErrorDialog } from "~/helpers/toolsHelper";
import { useUsersStore } from "../states/usersStore";
import ProfilePage from "./ProfilePage.vue";

vi.mock("~/helpers/toolsHelper", async (orig) => ({ ...(await orig<any>()), showConfirmDialog: vi.fn(), showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }));

async function setup(profile: any = null) {
  const pinia = createMockPinia();
  const store = useUsersStore(pinia);
  const fetch = vi.spyOn(store, "fetchProfile").mockResolvedValue();
  const profileUpd = vi.spyOn(store, "updateProfile").mockResolvedValue();
  const photo = vi.spyOn(store, "updatePhoto").mockResolvedValue();
  const pass = vi.spyOn(store, "updatePassword").mockResolvedValue();
  store.profile = profile;
  return { ...(await renderWithProviders(ProfilePage, { pinia })), store, fetch, profileUpd, photo, pass };
}
const input = (w: any, ph: string) => w.find(`input[placeholder="${ph}"]`);

describe("ProfilePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memuat profil; tanpa profil memakai inisial ?", async () => {
    const { wrapper, fetch } = await setup(null);
    expect(fetch).toHaveBeenCalled();
    expect((input(wrapper, "Nama").element as HTMLInputElement).value).toBe("");
    expect(wrapper.text()).toContain("?");
  });
  it("mengisi form dari profil dan menampilkan foto", async () => {
    const { wrapper } = await setup({ name: "Yohana", email: "y@x.id", photo: "http://x/f.png" });
    expect((input(wrapper, "Nama").element as HTMLInputElement).value).toBe("Yohana");
    expect((input(wrapper, "Email").element as HTMLInputElement).value).toBe("y@x.id");
    expect(wrapper.find("img").attributes("src")).toBe("http://x/f.png");
  });
  it("profil tanpa nama, email, foto", async () => {
    const { wrapper } = await setup({});
    expect((input(wrapper, "Nama").element as HTMLInputElement).value).toBe("");
    expect(wrapper.find("img").exists()).toBe(false);
  });
  it("form ikut berubah saat profil dimuat belakangan", async () => {
    const { wrapper, store } = await setup(null);
    store.profile = { name: "Baru", email: "b@x.id" };
    await wrapper.vm.$nextTick();
    expect((input(wrapper, "Nama").element as HTMLInputElement).value).toBe("Baru");
    expect(wrapper.text()).toContain("B");
  });
  it("menyimpan profil", async () => {
    const { wrapper, profileUpd } = await setup({ name: "A", email: "a@x.id" });
    await input(wrapper, "Nama").setValue("Ani");
    await input(wrapper, "Email").setValue("ani@x.id");
    await wrapper.findAll("form")[0].trigger("submit");
    expect(profileUpd).toHaveBeenCalledWith("Ani", "ani@x.id");
  });
  it("ubah kata sandi: terlalu pendek dan valid", async () => {
    const { wrapper, pass } = await setup({ name: "A", email: "a@x.id" });
    await input(wrapper, "Kata sandi lama").setValue("lama");
    await input(wrapper, "Kata sandi baru").setValue("123");
    await wrapper.findAll("form")[1].trigger("submit");
    await vi.waitFor(() => expect(showErrorDialog).toHaveBeenCalled());
    expect(pass).not.toHaveBeenCalled();
    await input(wrapper, "Kata sandi baru").setValue("barubaru");
    await wrapper.findAll("form")[1].trigger("submit");
    await vi.waitFor(() => expect(pass).toHaveBeenCalledWith("lama", "barubaru"));
    await wrapper.vm.$nextTick();
    expect((input(wrapper, "Kata sandi baru").element as HTMLInputElement).value).toBe("");
  });
  it("ganti foto: ada file, tanpa file, dan files null", async () => {
    const { wrapper, photo } = await setup({ name: "A", email: "a@x.id" });
    const el = wrapper.find('input[type="file"]');
    const file = new File(["x"], "a.png");
    Object.defineProperty(el.element, "files", { value: [file], configurable: true });
    await el.trigger("change");
    expect(photo).toHaveBeenCalledWith(file);
    Object.defineProperty(el.element, "files", { value: [], configurable: true });
    await el.trigger("change");
    Object.defineProperty(el.element, "files", { value: null, configurable: true });
    await el.trigger("change");
    expect(photo).toHaveBeenCalledTimes(1);
  });
});
