---
name: "@ekaone/prompt-kit"
version: "0.0.1"
description: "A lightweight, zero-dependency prompt template engine for Node.js"
license: MIT
author: Eka Prasetia
repository: https://github.com/ekaone/prompt-kit
keywords:
  - prompt
  - template
  - frontmatter
  - typescript
  - ai
---

# @ekaone/prompt-kit

A lightweight, zero-dependency prompt template engine for Node.js. Build dynamic AI prompts from inline strings or `.md` files with YAML frontmatter support.

## Tech Stack

- **Language:** TypeScript 5.9+ (strict mode, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`)
- **Runtime:** Node.js >= 18
- **Build:** tsup (esbuild-based) — dual CJS + ESM output
- **Test:** Vitest with v8 coverage
- **Package Manager:** pnpm

## Project Structure

```
src/
  index.ts              # Public entry point — re-exports all modules
  core/
    builder.ts          # build() — orchestrates inject + lifecycle hooks
    injector.ts         # inject() — {{variable}} replacement engine
  loader/
    file.ts             # loadPromptFile(), buildFromFile() — Node.js fs/path only
  parser/
    frontmatter.ts      # parseFrontmatter() — hand-rolled YAML-like parser
  types/
    index.ts            # Vars, BuildOptions, FrontMatter, ParsedPrompt
  utils/
    minify.ts           # minify() — strip comments + collapse blank lines
tests/
  injector.test.ts      # Unit tests for injector
```

## Key APIs

| Export | Source | Description |
|--------|--------|-------------|
| `build(template, vars, options?)` | `core/builder.ts` | Injects variables into template, returns built prompt string |
| `inject(template, vars, options?)` | `core/injector.ts` | Low-level `{{var}}` replacement (strict/passthrough mode) |
| `buildFromFile(filePath, vars, options?)` | `loader/file.ts` | Load `.md` file → parse frontmatter → build prompt |
| `loadPromptFile(filePath)` | `loader/file.ts` | Load `.md` file → return `{ frontmatter, body }` without building |
| `parseFrontmatter(source)` | `parser/frontmatter.ts` | Parse raw string with `---` delimiters into `{ frontmatter, body }` |
| `minify(input)` | `utils/minify.ts` | Strip Markdown comments + collapse excess blank lines |

## Types

```ts
type Vars = Record<string, string | number | boolean>;

interface BuildOptions {
  strict?: boolean;              // default: true — throw on undefined vars
  onSuccess?: (result: string) => void;
  onError?: (error: Error) => void;
}

interface FrontMatter {
  [key: string]: string | number | boolean | string[];
}

interface ParsedPrompt {
  frontmatter: FrontMatter;
  body: string;
}
```

## Build & Development

```bash
pnpm install          # Install dependencies
pnpm run dev          # Watch mode build (tsup --watch)
pnpm run build        # Production build (tsup, minified, sourcemaps, treeshaken)
pnpm run typecheck    # TypeScript type-check only (tsc --noEmit)
pnpm run test         # Run tests (vitest run)
pnpm run test:watch   # Watch mode tests
pnpm run test:coverage # Coverage report (v8 provider)
pnpm run clean        # Remove dist/
```

## Architecture Notes

- **Zero runtime dependencies** — all code is hand-written, no YAML parser library
- **Strict mode by default** — `build()` throws on undefined `{{variables}}`; set `strict: false` for passthrough
- **Frontmatter parser** — regex-based (`/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/`), supports string, number, boolean, and inline array `[a, b, c]` values; skips `#` comment lines
- **Node-only module** — `loader/file.ts` uses `node:fs/promises` and `node:path`; all other modules are pure string manipulation and could run in browsers if the loader is tree-shaken
- **Dual output** — tsup produces CJS (`dist/index.js`) and ESM (`dist/index.mjs`) with type declarations (`dist/index.d.ts`)
- **Non-null assertions** — `rawFm!` and `rawBody!` in `parseFrontmatter` are safe because the regex match guard ensures capture groups exist
- **`sideEffects: false`** in package.json enables bundler tree-shaking

## Conventions

- All internal imports use `.js` extension (required by NodeNext module resolution)
- Error messages prefixed with `[prompt-kit]`
- File-based prompts use `.md` extension with YAML frontmatter between `---` delimiters
- Tests use Vitest globals (`describe`, `it`, `expect`) — no explicit imports needed
