export const enc = (s: string) =>
  btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

export const setHashParam = (key: string, raw: string) => {
  const q = new URLSearchParams(location.hash.replace(/^#/, ''));
  if (raw) q.set(key, enc(raw));
  else q.delete(key);
  location.hash = q.toString();
};
