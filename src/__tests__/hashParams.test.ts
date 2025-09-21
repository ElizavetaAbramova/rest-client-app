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

  it('returns undefined for missing param', () => {
    window.location.hash = 'a=1';
    expect(getHashParam('zzz')).toBeUndefined();
  });

  it('overwrites existing param', () => {
    window.location.hash = 'a=1';
    setHashParam('a', '2');
    expect(getHashParam('a')).toBe('2');
    expect(readHash()).toEqual({ a: '2' });
  });

  it('read empty hash', () => {
    window.location.hash = '';
    expect(readHash()).toEqual({});
  });

  it('set on empty hash creates single pair', () => {
    window.location.hash = '';
    setHashParam('q', '1');
    expect(window.location.hash).toBe('#q=1');
    expect(readHash()).toEqual({ q: '1' });
  });

  it('parses percent-encoded value', () => {
    window.location.hash = '#q=a%20b%26c';
    expect(getHashParam('q')).toBe('a%20b%26c');
  });

  it('write empty object clears hash', () => {
    window.location.hash = '#a=1';
    writeHash({});
    expect(window.location.hash === '' || window.location.hash === '#').toBe(
      true
    );
  });

  it('reads hash with empty pair safely', () => {
    window.location.hash = '#a=1&&b=2&';
    expect(readHash()).toEqual({ a: '1', b: '2' });
  });

  it('key without value returns empty string', () => {
    window.location.hash = '#a=';
    expect(getHashParam('a')).toBe('');
  });
});
