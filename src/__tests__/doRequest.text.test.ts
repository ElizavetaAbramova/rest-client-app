import { describe, it, expect, vi } from 'vitest';
import { doRequest } from '@/features/RequestRunner/lib/doRequest';

describe('doRequest text response', () => {
  it('handles text/plain response', async () => {
    const text = vi.fn().mockResolvedValue('hello');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text,
      })
    );
    const ac = new AbortController();
    const res = await doRequest('/txt', { method: 'GET' }, true, ac);
    expect(fetch).toHaveBeenCalledWith(
      '/txt',
      expect.objectContaining({ method: 'GET' })
    );
    expect(res).toBeTruthy();
  });

  it('handles text/plain response', async () => {
    const text = vi.fn().mockResolvedValue('hello');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text,
      })
    );
    const ac = new AbortController();
    const res = await doRequest('/txt', { method: 'GET' }, true, ac);
    expect(fetch).toHaveBeenCalledWith(
      '/txt',
      expect.objectContaining({ method: 'GET' })
    );
    expect(res).toBeTruthy();
  });
});
