import { describe, expect, it } from "vitest";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("nilai awal default kosong", () => {
    expect(useInput().value.value).toBe("");
  });
  it("memperbarui nilai saat input berubah", () => {
    const { value, onChange } = useInput("a");
    expect(value.value).toBe("a");
    onChange({ target: { value: "baru" } } as unknown as Event);
    expect(value.value).toBe("baru");
  });
});
