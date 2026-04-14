import { describe, it, expect } from "vitest";
import { parseFrontmatter } from "../src/parser/frontmatter.js";

describe("parseFrontmatter", () => {
  it("returns trimmed body when no frontmatter", () => {
    const parsed = parseFrontmatter("\n\nHello world  \n");
    expect(parsed.frontmatter).toEqual({});
    expect(parsed.body).toBe("Hello world");
  });

  it("parses simple key/value lines", () => {
    const src = `---
title: Hello
enabled: true
count: 42
tags: [a, "b", 'c']
---
Body here
`;
    const parsed = parseFrontmatter(src);
    expect(parsed.frontmatter).toEqual({
      title: "Hello",
      enabled: true,
      count: 42,
      tags: ["a", "b", "c"],
    });
    expect(parsed.body).toBe("Body here");
  });

  it("ignores blank lines, comments, and invalid lines", () => {
    const src = `---
# comment

ok: yes
badline
: nope
---
Hi
`;
    const parsed = parseFrontmatter(src);
    expect(parsed.frontmatter).toEqual({ ok: "yes" });
    expect(parsed.body).toBe("Hi");
  });

  it("supports CRLF newlines", () => {
    const src = "---\r\nname: Eka\r\n---\r\nHello\r\n";
    const parsed = parseFrontmatter(src);
    expect(parsed.frontmatter).toEqual({ name: "Eka" });
    expect(parsed.body).toBe("Hello");
  });
});

