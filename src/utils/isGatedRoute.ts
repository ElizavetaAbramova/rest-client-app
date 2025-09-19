export const GATED_PREFIXES = ['/client', '/history', '/variables'];

export function isGatedRoute(path?: string | null) {
  if (!path) return false;
  return GATED_PREFIXES.some((p) => path.startsWith(p));
}
