import { describe, it, expect } from 'vitest';
import { encodeBase64Url, decodeBase64Url } from '@/utils/base64url';

describe('base64url errors', () => {
  it('decode handles malformed', () => {
    expect(() => decodeBase64Url('%bad%string')).toThrow();
  });
  it('encode-decode roundtrip basic', () => {
    const s = 'hello';
    expect(decodeBase64Url(encodeBase64Url(s))).toBe(s);
  });
});
