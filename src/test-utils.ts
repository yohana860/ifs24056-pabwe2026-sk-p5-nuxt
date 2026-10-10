import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { defineComponent, h } from "vue";

export const createMockPinia = () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  return pinia;
};

export async function renderWithProviders(
  component: any,
  { props = {}, route = "/", pinia = createMockPinia(), global = {} }: { props?: any; route?: string; pinia?: any; global?: any } = {}
) {
  const Stub = defineComponent({ render: () => h("div", { "data-testid": "route-stub" }) });
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/cash-flows/:cashFlowId", component: Stub },
      { path: "/:pathMatch(.*)*", component: Stub },
    ],
  });
  await router.push(route);
  await router.isReady();
  const wrapper = mount(component, { props, global: { ...global, plugins: [pinia, router] } });
  return { wrapper, router, pinia };
}