import { describe, expect, it } from "vitest";
import { renderWithProviders } from "~/test-utils";
import NavbarComponent from "../components/NavbarComponent.vue";
import SidebarComponent from "../components/SidebarComponent.vue";
import CashFlowLayout from "./CashFlowLayout.vue";

describe("CashFlowLayout", () => {
  it("menghubungkan navbar, sidebar, dan RouterView", async () => {
    const { wrapper } = await renderWithProviders(CashFlowLayout, {
      global: { stubs: { NavbarComponent: true, SidebarComponent: true } },
    });
    const sidebar = wrapper.findComponent(SidebarComponent);
    expect(sidebar.props("open")).toBe(false);
    await wrapper.findComponent(NavbarComponent).vm.$emit("toggle");
    expect(sidebar.props("open")).toBe(true);
    await sidebar.vm.$emit("close");
    expect(sidebar.props("open")).toBe(false);
    expect(wrapper.find("[data-testid='route-stub']").exists()).toBe(true);
  });
});
