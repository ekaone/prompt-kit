import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { build, buildFromFile } from "../../src/index.js";

const system = build("You are a {{role}} expert. Be concise and direct.", {
  role: "TypeScript",
});

const prompt = await buildFromFile("./prompts/review.md", {
  language: "TypeScript",
  focus: "performance",
});

const { text } = await generateText({
  model: anthropic("claude-sonnet-4-5"),
  system,
  prompt,
});
