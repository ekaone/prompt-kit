import { describe, it, expect } from "vitest";
import { writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildFromFile, loadPromptFile } from "../src/loader/file.js";

function tmpPath(name: string) {
  return join(tmpdir(), `prompt-kit-${process.pid}-${Date.now()}-${name}`);
}

describe("file loader", () => {
  it("loadPromptFile reads and parses frontmatter", async () => {
    const p = tmpPath("prompt.md");
    const src = `---
title: Example
---
Hello {{name}}
`;

    await writeFile(p, src, "utf-8");
    try {
      const parsed = await loadPromptFile(p);
      expect(parsed.frontmatter).toEqual({ title: "Example" });
      expect(parsed.body).toBe("Hello {{name}}");
    } finally {
      await rm(p, { force: true });
    }
  });

  it("buildFromFile builds using body only", async () => {
    const p = tmpPath("prompt2.md");
    const src = `---
title: Ignored
---
Hello {{name}}!
`;

    await writeFile(p, src, "utf-8");
    try {
      await expect(buildFromFile(p, { name: "Eka" })).resolves.toBe("Hello Eka!");
    } finally {
      await rm(p, { force: true });
    }
  });

  it("throws a friendly error if file cannot be read", async () => {
    const missing = tmpPath("missing.md");
    await expect(loadPromptFile(missing)).rejects.toThrow(
      `[prompt-kit] Cannot read file: "${missing}"`,
    );
  });
});

