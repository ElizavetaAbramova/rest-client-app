export function encodeBase64Url(input: string): string {
  const b64 =
    typeof window === 'undefined'
      ? Buffer.from(input, 'utf8').toString('base64')
      : btoa(unescape(encodeURIComponent(input)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function decodeBase64Url(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 ? 4 - (b64.length % 4) : 0;
  const b64p = b64 + '='.repeat(pad);
  return typeof window === 'undefined'
    ? Buffer.from(b64p, 'base64').toString('utf8')
    : decodeURIComponent(escape(atob(b64p)));
}
