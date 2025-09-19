import { decodeBase64Url } from '@/utils/base64url';

type HeaderRow = { key?: unknown; value?: unknown };

export function parseHeaders(h: string | undefined): Record<string, string> {
  if (!h) return {};
  try {
    const parsed = JSON.parse(decodeBase64Url(h)) as unknown;
    const out: Record<string, string> = {};
    if (Array.isArray(parsed)) {
      for (const r of parsed as unknown[]) {
        const row = r as HeaderRow;
        const k = String(row.key ?? '').trim();
        const v = String(row.value ?? '');
        if (k) out[k] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}
