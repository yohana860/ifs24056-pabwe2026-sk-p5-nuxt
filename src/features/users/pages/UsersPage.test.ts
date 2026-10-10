import { describe, expect, it, vi } from "vitest";
import { createMockPinia, renderWithProviders } from "~/test-utils";
import { useUsersStore } from "../states/usersStore";
import UsersPage from "./UsersPage.vue";

async function setup(state: any) {
  const pinia = createMockPinia();
  const store = useUsersStore(pinia);
  const fetch = vi.spyOn(store, "fetchUsers").mockResolvedValue();
  store.$patch(state);
  return { ...(await renderWithProviders(UsersPage, { pinia })), fetch };
}

describe("UsersPage", () => {
  it("memuat pengguna dan menampilkan status memuat", async () => {
    const { wrapper, fetch } = await setup({ isLoading: true });
    expect(fetch).toHaveBeenCalled();
    expect(wrapper.text()).toContain("Memuat");
  });
  it("status kosong", async () => {
    expect((await setup({})).wrapper.text()).toContain("Belum ada pengguna");
  });
  it("menampilkan daftar pengguna termasuk yang tanpa nama", async () => {
    const { wrapper } = await setup({ users: [{ id: 1, name: "Ani", email: "a@x.id" }, { id: 2, email: "b@x.id" }] });
    expect(wrapper.text()).toContain("Ani");
    expect(wrapper.text()).toContain("b@x.id");
    expect(wrapper.text()).toContain("?");
  });
});
