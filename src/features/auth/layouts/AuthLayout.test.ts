import { describe, expect, it } from "vitest";
import { renderWithProviders } from "~/test-utils";
import AuthLayout from "./AuthLayout.vue";

describe("AuthLayout", () => {
  it("menandai tab Masuk Akun aktif di /auth/login", async () => {
    const { wrapper } = await renderWithProviders(AuthLayout, { route: "/auth/login" });
    const [login, register] = wrapper.findAll("a");
    expect(wrapper.text()).toContain("Delcom Cash Flow");
    expect(login.classes()).toContain("shadow");
    expect(register.classes()).not.toContain("shadow");
    expect(wrapper.find("[data-testid='route-stub']").exists()).toBe(true);
  });
  it("menandai tab Daftar Baru aktif di /auth/register", async () => {
    const { wrapper } = await renderWithProviders(AuthLayout, { route: "/auth/register" });
    const [login, register] = wrapper.findAll("a");
    expect(login.classes()).not.toContain("shadow");
    expect(register.classes()).toContain("shadow");
  });
});
