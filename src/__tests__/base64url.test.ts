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

  it('decodes string with missing padding', () => {
    const enc = encodeBase64Url('abc').replace(/=*$/, '');
    expect(decodeBase64Url(enc)).toBe('abc');
  });

  it('uses url-safe alphabet only', () => {
    const s = 'a+b/c?=з';
    const enc = encodeBase64Url(s);
    expect(/^[A-Za-z0-9\-_]+$/.test(enc)).toBe(true);
    expect(decodeBase64Url(enc)).toBe(s);
  });

  it('encodes empty string', () => {
    expect(encodeBase64Url('')).toBe('');
  });
  it('decodes empty string', () => {
    expect(decodeBase64Url('')).toBe('');
  });
});
