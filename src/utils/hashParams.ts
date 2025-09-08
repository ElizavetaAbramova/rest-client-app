export type HashMap = Record<string, string>;

export function readHash(): HashMap {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return {};
  return raw.split('&').reduce<HashMap>((acc, pair) => {
    const [k, v] = pair.split('=');
    if (k) acc[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
    return acc;
  }, {});
}

export function writeHash(next: HashMap): void {
  const parts = Object.entries(next).map(
    ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
  );
  const hash = parts.join('&');
  if (hash !== window.location.hash.replace(/^#/, '')) {
    window.location.hash = hash;
  }
}

export function getHashParam(key: string): string | undefined {
  const map = readHash();
  return map[key];
}

export function setHashParam(key: string, value: string): void {
  const map = readHash();
  map[key] = value;
  writeHash(map);
}
