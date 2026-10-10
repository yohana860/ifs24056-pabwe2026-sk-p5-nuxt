import { beforeEach, describe, expect, it, vi } from "vitest";
import Swal from "sweetalert2";
import { formatDate, formatRupiah, showConfirmDialog, showErrorDialog, showSuccessDialog } from "./toolsHelper";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

describe("toolsHelper", () => {
  beforeEach(() => vi.clearAllMocks());

  it("showSuccessDialog & showErrorDialog", () => {
    showSuccessDialog("ok");
    showErrorDialog("buruk");
    expect((Swal.fire as any).mock.calls[0][0]).toMatchObject({ icon: "success", text: "ok" });
    expect((Swal.fire as any).mock.calls[1][0]).toMatchObject({ icon: "error", text: "buruk" });
  });

  it("showConfirmDialog mengembalikan pilihan pengguna", async () => {
    (Swal.fire as any).mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirmDialog("yakin?")).toBe(true);
    (Swal.fire as any).mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("yakin?")).toBe(false);
  });

  it("formatRupiah", () => {
    expect(formatRupiah(50000)).toContain("50.000");
    expect(formatRupiah("1500")).toContain("1.500");
    expect(formatRupiah("abc")).toContain("0");
  });

  it("formatDate", () => {
    expect(formatDate()).toBe("-");
    expect(formatDate("2026-10-09T10:00:00Z")).toContain("2026");
  });
});
