/**
 * @file index.ts
 * @description Core entry point for @ekaone/prompt-kit
 * @author Eka Prasetia
 * @website https://prasetia.me
 * @license MIT
 */

// Core
export { build } from "./core/builder.js";
export { inject } from "./core/injector.js";

// File-based
export { buildFromFile, loadPromptFile } from "./loader/file.js";

// Parser
export { parseFrontmatter } from "./parser/frontmatter.js";

// Utils
export { minify } from "./utils/minify.js";

// Types
export type {
  Vars,
  BuildOptions,
  FrontMatter,
  ParsedPrompt,
} from "./types/index.js";
