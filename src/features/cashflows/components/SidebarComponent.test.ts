import { describe, expect, it } from "vitest";
import { renderWithProviders } from "~/test-utils";
import SidebarComponent from "./SidebarComponent.vue";

describe("SidebarComponent", () => {
  it("tertutup: tanpa overlay dan menu beranda aktif", async () => {
    const { wrapper } = await renderWithProviders(SidebarComponent, { props: { open: false }, route: "/" });
    expect(wrapper.find(".fixed.inset-0").exists()).toBe(false);
    expect(wrapper.find("aside").classes()).toContain("-translate-x-full");
    const links = wrapper.findAll("a");
    expect(links).toHaveLength(3);
    expect(links[0].classes()).toContain("text-indigo-600");
    expect(links[1].classes()).not.toContain("text-indigo-600");
  });
  it("terbuka: overlay dan klik menutup", async () => {
    const { wrapper } = await renderWithProviders(SidebarComponent, { props: { open: true }, route: "/users" });
    expect(wrapper.find("aside").classes()).toContain("translate-x-0");
    expect(wrapper.findAll("a")[1].classes()).toContain("text-indigo-600");
    await wrapper.find(".fixed.inset-0").trigger("click");
    await wrapper.findAll("a")[2].trigger("click");
    expect(wrapper.emitted("close")).toHaveLength(2);
  });
});
