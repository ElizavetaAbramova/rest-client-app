import { describe, it, expect } from 'vitest';
import { encodeBase64Url, decodeBase64Url } from '@/utils/base64url';

describe('base64url edge cases', () => {
  it('decodes missing padding correctly', () => {
    expect(decodeBase64Url('YQ')).toBe('a');
  });
  it('encodes/decodes empty string', () => {
    expect(decodeBase64Url(encodeBase64Url(''))).toBe('');
  });
});
