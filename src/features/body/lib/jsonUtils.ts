import { decodeBase64Url } from '@/utils/base64url';
export function bytesOf(text: string): number {
  return new Blob([text]).size;
}

export function linesOf(text: string): number {
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}

export function looksLikeJson(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  const first = t[0];
  return first === '{' || first === '[';
}
export const encodeBase64Url = (s: string) =>
  btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

export const setHashParam = (key: string, raw: string) => {
  const q = new URLSearchParams(location.hash.replace(/^#/, ''));
  if (raw) {
    q.set(key, encodeBase64Url(raw));
  } else {
    q.delete(key);
  }
  location.hash = q.toString();
};

export const ensureJsonContentType = () => {
  const q = new URLSearchParams(location.hash.replace(/^#/, ''));
  const h = q.get('h');
  let rows: Array<{ key: string; value: string }> = [];

  if (h) {
    try {
      rows = JSON.parse(decodeBase64Url(h));
    } catch (e) {
      console.error(e);
    }
  }

  if (!rows.some((r) => r.key.toLowerCase() === 'content-type')) {
    rows.push({ key: 'Content-Type', value: 'application/json' });
    setHashParam('h', JSON.stringify(rows));
  }
};
