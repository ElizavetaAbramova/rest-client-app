import { describe, it, expect, beforeEach } from 'vitest';
import {
  readHash,
  writeHash,
  getHashParam,
  setHashParam,
} from '@/utils/hashParams';

describe('hashParams', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('read/write', () => {
    writeHash({ a: '1', b: '2' });
    expect(readHash()).toEqual({ a: '1', b: '2' });
  });

  it('get/set', () => {
    window.location.hash = 'a=1';
    expect(getHashParam('a')).toBe('1');
    setHashParam('b', '2');
    expect(getHashParam('b')).toBe('2');
    expect(readHash()).toEqual({ a: '1', b: '2' });
  });
});
