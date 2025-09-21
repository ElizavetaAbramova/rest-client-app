import { describe, it, expect } from 'vitest';
import { isGatedRoute } from '@/utils/isGatedRoute';

describe('isGatedRoute', () => {
  it('handles empty/undefined', () => {
    expect(isGatedRoute('')).toBe(false);
    expect(isGatedRoute(null)).toBe(false);
    expect(isGatedRoute(undefined as unknown as string)).toBe(false);
  });
  it('matches gated prefixes', () => {
    expect(isGatedRoute('/client/x')).toBe(true);
    expect(isGatedRoute('/history')).toBe(true);
    expect(isGatedRoute('/variables')).toBe(true);
    expect(isGatedRoute('/public')).toBe(false);
  });
});
