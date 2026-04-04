import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseFrontmatter } from "../parser/frontmatter.js";
import { build } from "../core/builder.js";
import type { Vars, BuildOptions, ParsedPrompt } from "../types/index.js";

export async function loadPromptFile(filePath: string): Promise<ParsedPrompt> {
  const abs = resolve(filePath);
  let source: string;

  try {
    source = await readFile(abs, "utf-8");
  } catch {
    throw new Error(`[prompt-kit] Cannot read file: "${filePath}"`);
  }

  return parseFrontmatter(source);
}

export async function buildFromFile(
  filePath: string,
  vars: Vars = {},
  options: BuildOptions = {},
): Promise<string> {
  const { body } = await loadPromptFile(filePath);
  return build(body, vars, options);
}
