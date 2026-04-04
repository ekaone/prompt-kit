/** Strip [//]: # (comment) style Markdown comments */
const MD_COMMENT_RE = /\[\/\/\]:\s*#\s*\(.*?\)\n?/g;

/** Collapse 3+ blank lines down to a single blank line */
const EXCESS_BLANK_RE = /\n{3,}/g;

export function minify(input: string): string {
  return input
    .replace(MD_COMMENT_RE, "")
    .replace(EXCESS_BLANK_RE, "\n\n")
    .trim();
}
