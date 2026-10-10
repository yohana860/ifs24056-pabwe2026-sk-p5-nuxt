import { describe, expect, it } from "vitest";
import { routes } from "./routes";
import routerOptions from "./router.options";

describe("routes", () => {
  it("mendefinisikan rute auth, dashboard, dan 404", () => {
    const paths = routes.map((r) => r.path);
    expect(paths).toEqual(["/auth", "/", "/:pathMatch(.*)*"]);
    expect(routes[0].redirect).toBe("/auth/login");
    expect(routes[0].children!.map((c) => c.path)).toEqual(["login", "register"]);
    expect(routes[1].children!.map((c) => c.path)).toEqual(["", "cash-flows/:cashFlowId", "users", "profile"]);
  });

  it("semua komponen bisa dimuat", async () => {
    const all = [...routes, ...routes[0].children!, ...routes[1].children!];
    for (const r of all) {
      if (r.component) expect((await (r.component as any)()).default).toBeTruthy();
    }
  });

  it("router.options mengembalikan routes", () => {
    expect((routerOptions as any).routes()).toBe(routes);
  });
});
