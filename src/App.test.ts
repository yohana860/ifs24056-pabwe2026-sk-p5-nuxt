import { describe, expect, it } from "vitest";
import { renderWithProviders } from "./test-utils";
import App from "./App.vue";

describe("App", () => {
  it("merender RouterView", async () => {
    const { wrapper } = await renderWithProviders(App);
    expect(wrapper.find("[data-testid='route-stub']").exists()).toBe(true);
  });
});
