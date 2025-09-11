import { describe, it, expect } from 'vitest';
import { setHashParam } from '@/utils/urlState';

describe('urlState', () => {
  it('sets and clears hash param', () => {
    window.location.hash = '';
    setHashParam('x', 'hello');
    expect(window.location.hash).toMatch(/x=/);
    setHashParam('x', '');
    expect(window.location.hash).not.toMatch(/x=/);
  });
});
