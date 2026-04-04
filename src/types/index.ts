export type Vars = Record<string, string | number | boolean>;

export interface BuildOptions {
  /** Throw on undefined variables. Default: true */
  strict?: boolean;
  /** Called after a successful build */
  onSuccess?: (result: string) => void;
  /** Called when build throws */
  onError?: (error: Error) => void;
}

export interface FrontMatter {
  [key: string]: string | number | boolean | string[];
}

export interface ParsedPrompt {
  frontmatter: FrontMatter;
  body: string;
}
