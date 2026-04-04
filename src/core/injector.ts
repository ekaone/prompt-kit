import type { Vars, BuildOptions } from "../types/index.js";

const VARIABLE_RE = /\{\{(\s*[\w.]+\s*)\}\}/g;

export function inject(
  template: string,
  vars: Vars,
  options: BuildOptions = {},
): string {
  const { strict = true } = options;

  return template.replace(VARIABLE_RE, (match, rawKey: string) => {
    const key = rawKey.trim();
    if (key in vars) {
      return String(vars[key]);
    }
    if (strict) {
      throw new Error(`[prompt-kit] Undefined variable: "{{${key}}}"`);
    }
    return match; // passthrough — leave {{var}} intact
  });
}
