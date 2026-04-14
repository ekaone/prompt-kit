# @ekaone/prompt-kit

A lightweight, zero-dependency prompt template engine for Node.js. Build dynamic AI prompts from inline strings or `.md` files with YAML frontmatter support.

## Installation

```bash
npm install @ekaone/prompt-kit

pnpm add @ekaone/prompt-kit

yarn add @ekaone/prompt-kit

bun add @ekaone/prompt-kit
```

## Features

- `{{variable}}` injection with strict or passthrough mode
- YAML frontmatter parser — zero dependencies, hand-rolled
- File-based prompt loading from `.md` files
- Minifier to strip comments and collapse whitespace
- Lifecycle hooks — `onSuccess` and `onError`
- Zero dependencies
- ESM + CJS dual output
- TypeScript-first

## Quick Start

```ts
import { build } from "@ekaone/prompt-kit";

const prompt = build(
  "You are a {{role}} assistant. Help the user with {{topic}}.",
  { role: "TypeScript", topic: "code review" }
);

console.log(prompt);
// → "You are a TypeScript assistant. Help the user with code review."
```

## API

### `build(template, vars, options?)`

Injects variables into a template string and returns the built prompt.

```ts
import { build } from "@ekaone/prompt-kit";

const prompt = build(
  "Summarize {{topic}} in {{words}} words.",
  { topic: "Rust", words: "100" }
);
```

**Parameters**

| Parameter  | Type          | Description                        |
| ---------- | ------------- | ---------------------------------- |
| `template` | `string`      | Prompt string with `{{var}}` placeholders |
| `vars`     | `Vars`        | Key-value map of variable values   |
| `options`  | `BuildOptions`| Optional config (see below)        |

**BuildOptions**

| Option      | Type                        | Default | Description                                      |
| ----------- | --------------------------- | ------- | ------------------------------------------------ |
| `strict`    | `boolean`                   | `true`  | Throw on undefined variables                     |
| `onSuccess` | `(result: string) => void`  | —       | Called after a successful build                  |
| `onError`   | `(error: Error) => void`    | —       | Called when build throws                         |

#### Strict mode (default)

Throws if a variable is referenced in the template but not provided in `vars`.

```ts
build("Hello {{name}}", {});
// → Error: [prompt-kit] Undefined variable: "{{name}}"
```

#### Passthrough mode

Leaves undefined `{{variables}}` intact in the output.

```ts
const prompt = build(
  "Hello {{name}}, your score is {{score}}.",
  { name: "Eka" },
  { strict: false }
);
// → "Hello Eka, your score is {{score}}."
```

#### Lifecycle hooks

```ts
const prompt = build(
  "Review {{language}} code.",
  { language: "TypeScript" },
  {
    onSuccess: (result) => console.log("Built:", result.length, "chars"),
    onError: (err) => console.error("Failed:", err.message),
  }
);
```

---

### `buildFromFile(filePath, vars, options?)`

Loads a `.md` file, parses the frontmatter, and builds the prompt from the body.

```ts
import { buildFromFile } from "@ekaone/prompt-kit";

const prompt = await buildFromFile("./prompts/review.md", {
  language: "TypeScript",
  focus: "type safety",
});
```

**Prompt file format** — `./prompts/review.md`

```md
---
name: code-review
version: 1
tags: [typescript, review]
---
You are a senior {{language}} engineer.
Review the code for correctness, performance, and style.
Focus on: {{focus}}.
```

---

### `loadPromptFile(filePath)`

Reads and parses a `.md` file, returning `frontmatter` and `body` separately. Useful for reading metadata without triggering a build.

```ts
import { loadPromptFile } from "@ekaone/prompt-kit";

const { frontmatter, body } = await loadPromptFile("./prompts/review.md");

console.log(frontmatter.name);    // → "code-review"
console.log(frontmatter.version); // → 1
console.log(frontmatter.tags);    // → ["typescript", "review"]
console.log(body);                // → "You are a senior {{language}} engineer..."
```

---

### `parseFrontmatter(source)`

Parses a raw markdown string into `{ frontmatter, body }`. Useful when you load file content yourself.

```ts
import { parseFrontmatter } from "@ekaone/prompt-kit";

const source = `---
name: summarizer
model: claude-opus-4-5
---
Summarize the following: {{input}}`;

const { frontmatter, body } = parseFrontmatter(source);
```

**Supported frontmatter value types**

| Type    | Example                   |
| ------- | ------------------------- |
| String  | `name: code-review`       |
| Number  | `version: 1`              |
| Boolean | `strict: true`            |
| Array   | `tags: [a, b, c]`         |

---

### `minify(input)`

Strips Markdown comments and collapses excess blank lines. Useful for reducing token usage before sending to an AI SDK.

```ts
import { buildFromFile, minify } from "@ekaone/prompt-kit";

const raw = await buildFromFile("./prompts/verbose.md", vars);
const prompt = minify(raw);
```

Strips `[//]: # (internal note)` style comments and collapses 3+ blank lines into one.

---

## Types

```ts
type Vars = Record<string, string | number | boolean>;

interface BuildOptions {
  strict?: boolean;
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

---

## Real-world pattern

```ts
import { buildFromFile, minify } from "@ekaone/prompt-kit";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const prompt = minify(
  await buildFromFile("./prompts/review.md", {
    language: "TypeScript",
    focus: "type safety",
  })
);

const response = await client.messages.create({
  model: "claude-opus-4-5",
  max_tokens: 1024,
  messages: [{ role: "user", content: prompt }],
});
```

---

## License

MIT © [Eka Prasetia](https://prasetia.me/)

## Links

- [npm Package](https://www.npmjs.com/package/@ekaone/prompt-kit)
- [GitHub Repository](https://github.com/ekaone/prompt-kit)
- [Issue Tracker](https://github.com/ekaone/prompt-kit/issues)

---

⭐ If this library helps you, please consider giving it a star on GitHub!