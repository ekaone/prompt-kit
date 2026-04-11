import type { ParsedPrompt, FrontMatter } from "../types/index.js";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Parse a single YAML-like line: key: value */
function parseLine(line: string): [string, FrontMatter[string]] | null {
  const colonIdx = line.indexOf(":");
  if (colonIdx === -1) return null;

  const key = line.slice(0, colonIdx).trim();
  const raw = line.slice(colonIdx + 1).trim();

  if (!key) return null;

  // Boolean
  if (raw === "true") return [key, true];
  if (raw === "false") return [key, false];

  // Number
  const num = Number(raw);
  if (raw !== "" && !isNaN(num)) return [key, num];

  // Inline array: [a, b, c]
  if (raw.startsWith("[") && raw.endsWith("]")) {
    const items = raw
      .slice(1, -1)
      .split(",")
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
    return [key, items];
  }

  // String — strip optional surrounding quotes
  return [key, raw.replace(/^['"]|['"]$/g, "")];
}

export function parseFrontmatter(source: string): ParsedPrompt {
  const match = source.match(FRONTMATTER_RE);

  if (!match) {
    return { frontmatter: {}, body: source.trim() };
  }

  const [, rawFm, rawBody] = match;
  const frontmatter: FrontMatter = {};

  for (const line of rawFm!.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parsed = parseLine(trimmed);
    if (parsed) {
      const [key, value] = parsed;
      frontmatter[key] = value;
    }
  }

  return { frontmatter, body: rawBody!.trim() };
}
