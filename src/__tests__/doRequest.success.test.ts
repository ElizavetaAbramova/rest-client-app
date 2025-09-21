import { describe, it, expect, vi } from 'vitest';
import { doRequest } from '@/features/RequestRunner/lib/doRequest';

describe('doRequest success', () => {
  it('resolves on OK response', async () => {
    const json = vi.fn().mockResolvedValue({ ok: 1 });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({
          'content-type': 'application/json',
          'content-length': '7',
        }),
        json,
      })
    );
    const ac = new AbortController();
    const res = await doRequest('/ok', { method: 'GET' }, false, ac);
    expect(fetch).toHaveBeenCalledWith(
      '/ok',
      expect.objectContaining({ method: 'GET' })
    );
    expect(res).toBeTruthy();
  });
});
