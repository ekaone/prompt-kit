import { describe, it, expect, vi } from "vitest";
import { build } from "../src/core/builder.js";

describe("build", () => {
  it("returns injected result", () => {
    expect(build("Hello {{name}}", { name: "Eka" })).toBe("Hello Eka");
  });

  it("calls onSuccess with result", () => {
    const onSuccess = vi.fn();
    const result = build("Hi {{name}}", { name: "Eka" }, { onSuccess });
    expect(result).toBe("Hi Eka");
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith("Hi Eka");
  });

  it("calls onError and rethrows as Error", () => {
    const onError = vi.fn();
    expect(() => build("Hi {{missing}}", {}, { onError })).toThrow(
      /Undefined variable/,
    );

    expect(onError).toHaveBeenCalledTimes(1);
    const err = onError.mock.calls[0]![0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toContain("Undefined variable");
  });

  it("passes through unexpected runtime errors (still Error)", () => {
    const onError = vi.fn();
    expect(() =>
      build(
        "Hello {{name}}",
        { name: "Eka" },
        { onSuccess: () => JSON.parse("{") as never, onError },
      ),
    ).toThrow();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0]![0]).toBeInstanceOf(Error);
  });
});
