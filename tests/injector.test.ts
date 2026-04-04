import { describe, it, expect } from "vitest";
import { inject } from "../src/core/injector.js";

describe("inject", () => {
  describe("basic substitution", () => {
    it("replaces a single variable", () => {
      expect(inject("Hello, {{name}}!", { name: "Eka" })).toBe("Hello, Eka!");
    });

    it("replaces multiple variables", () => {
      const result = inject("{{greeting}}, {{name}}. You are a {{role}}.", {
        greeting: "Hello",
        name: "Eka",
        role: "developer",
      });
      expect(result).toBe("Hello, Eka. You are a developer.");
    });

    it("replaces the same variable used more than once", () => {
      expect(inject("{{a}} and {{a}}", { a: "x" })).toBe("x and x");
    });

    it("coerces number values to string", () => {
      expect(inject("version {{v}}", { v: 3 })).toBe("version 3");
    });

    it("coerces boolean values to string", () => {
      expect(inject("strict: {{flag}}", { flag: true })).toBe("strict: true");
    });

    it("handles whitespace inside braces: {{ name }}", () => {
      expect(inject("Hello {{ name }}!", { name: "Eka" })).toBe("Hello Eka!");
    });
  });

  describe("strict mode (default)", () => {
    it("throws on undefined variable", () => {
      expect(() => inject("Hello {{missing}}", {})).toThrow(
        '[prompt-kit] Undefined variable: "{{missing}}"',
      );
    });

    it("throws even when some variables are defined", () => {
      expect(() => inject("{{name}} and {{missing}}", { name: "Eka" })).toThrow(
        "{{missing}}",
      );
    });
  });

  describe("passthrough mode (strict: false)", () => {
    it("leaves undefined variables intact", () => {
      const result = inject(
        "Hello {{name}} and {{score}}",
        { name: "Eka" },
        { strict: false },
      );
      expect(result).toBe("Hello Eka and {{score}}");
    });

    it("returns template unchanged when no vars provided", () => {
      const template = "Hello {{name}}";
      expect(inject(template, {}, { strict: false })).toBe(template);
    });
  });

  describe("edge cases", () => {
    it("returns template unchanged when no placeholders present", () => {
      expect(inject("No variables here.", { name: "Eka" })).toBe(
        "No variables here.",
      );
    });

    it("handles empty string template", () => {
      expect(inject("", { name: "Eka" })).toBe("");
    });

    it("handles empty vars with no placeholders", () => {
      expect(inject("Plain text.", {})).toBe("Plain text.");
    });

    it("only matches double braces — single {name} ignored, {{{name}}} partially matched", () => {
      const result = inject(
        "{name} and {{{name}}}",
        { name: "Eka" },
        { strict: false },
      );
      expect(result).toBe("{name} and {Eka}");
    });
  });
});
