export type HashMap = Record<string, string>;

export function readHash(): HashMap {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return {};
  return raw.split('&').reduce<HashMap>((acc, pair) => {
    if (!pair) return acc;
    const idx = pair.indexOf('=');
    if (idx === -1) {
      const key = decodeURIComponent(pair);
      acc[key] = '';
    } else {
      const key = decodeURIComponent(pair.slice(0, idx));
      const val = pair.slice(idx + 1);
      acc[key] = val;
    }
    return acc;
  }, {});
}

export function getRawHash(): string {
  return window.location.hash.replace(/^#/, '');
}

export function writeHash(next: HashMap): void {
  const parts = Object.entries(next).map(
    ([key, value]) => `${encodeURIComponent(key)}=${value}`
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
