import { describe, it, expect } from "vitest";
import { minify } from "../src/utils/minify.js";

describe("minify", () => {
  it("removes markdown comment lines of form [//]: # (comment)", () => {
    const input = `Hello
[//]: # (this is a comment)
World
`;
    expect(minify(input)).toBe("Hello\nWorld");
  });

  it("collapses 3+ blank lines to a single blank line", () => {
    const input = "A\n\n\n\nB\n\n\nC";
    expect(minify(input)).toBe("A\n\nB\n\nC");
  });

  it("trims leading/trailing whitespace", () => {
    expect(minify("  A \n\n B  \n")).toBe("A \n\n B");
  });
});

