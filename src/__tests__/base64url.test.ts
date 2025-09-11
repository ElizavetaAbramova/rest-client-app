import { describe, it, expect } from 'vitest';
import { encodeBase64Url, decodeBase64Url } from '@/utils/base64url';

describe('base64url', () => {
  it('roundtrips ascii', () => {
    const s = '{"a":1}';
    const enc = encodeBase64Url(s);
    expect(enc).not.toContain('+');
    expect(enc).not.toContain('/');
    expect(enc.endsWith('=')).toBe(false);
    expect(decodeBase64Url(enc)).toBe(s);
  });
  it('roundtrips unicode', () => {
    const s = 'привет {"a":1}';
    const enc = encodeBase64Url(s);
    expect(decodeBase64Url(enc)).toBe(s);
  });
});
