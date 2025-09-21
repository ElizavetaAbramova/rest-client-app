import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUrlRequestState } from '@/hooks/useUrlRequestState';
import { getHashParam } from '@/utils/hashParams';

vi.mock('@/utils/base64url', () => ({
  decodeBase64Url: (v: string) => v,
}));

vi.mock('@/utils/hashParams', () => ({
  getHashParam: vi.fn(),
}));

const mockGetHashParam = vi.mocked(getHashParam);

describe('useUrlRequestState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns default state when no params', () => {
    mockGetHashParam.mockReturnValue('');

    const { result } = renderHook(() => useUrlRequestState());

    expect(result.current).toMatchObject({
      url: '',
      method: 'GET',
      body: '',
      headers: [],
    });
  });

  it('parses values from hash params', () => {
    mockGetHashParam.mockImplementation((key) => {
      switch (key) {
        case 'm':
          return 'POST';
        case 'u':
          return 'https://api';
        case 'b':
          return 'body';
        case 'h':
          return JSON.stringify([{ key: 'x', value: '1' }]);
        default:
          return undefined;
      }
    });

    const { result } = renderHook(() => useUrlRequestState());

    expect(result.current.method).toBe('POST');
    expect(result.current.url).toBe('https://api');
    expect(result.current.body).toBe('body');
    expect(result.current.headers).toEqual([{ key: 'x', value: '1' }]);
  });

  it('updates state on hashchange', () => {
    mockGetHashParam.mockImplementation(() => undefined);

    const { result } = renderHook(() => useUrlRequestState());

    expect(result.current.method).toBe('GET');
    expect(result.current.url).toBe('');
    expect(result.current.body).toBe('');
    expect(result.current.headers).toEqual([]);

    mockGetHashParam.mockImplementation((key: string): string | undefined => {
      switch (key) {
        case 'm':
          return 'PUT';
        case 'u':
          return 'https://new-api';
        case 'b':
          return 'new body';
        case 'h':
          return JSON.stringify([{ key: 'k', value: 'v' }]);
        default:
          return undefined;
      }
    });
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(result.current.method).toBe('PUT');
    expect(result.current.url).toBe('https://new-api');
    expect(result.current.body).toBe('new body');
    expect(result.current.headers).toEqual([{ key: 'k', value: 'v' }]);
  });

  it('handles invalid base64', () => {
    vi.doMock('@/utils/base64url', () => ({
      decodeBase64Url: () => {
        throw new Error('Incorrect URL');
      },
    }));

    mockGetHashParam.mockReturnValue('%%%');

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { result } = renderHook(() => useUrlRequestState());

    expect(result.current.method).toBe('GET');
    expect(warn).toHaveBeenCalledWith('Invalid URL state, ignored');
  });
});
