import { inject } from "./injector.js";
import type { Vars, BuildOptions } from "../types/index.js";

export function build(
  template: string,
  vars: Vars = {},
  options: BuildOptions = {},
): string {
  const { onSuccess, onError } = options;

  try {
    const result = inject(template, vars, options);
    onSuccess?.(result);
    return result;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    onError?.(error);
    throw error;
  }
}
