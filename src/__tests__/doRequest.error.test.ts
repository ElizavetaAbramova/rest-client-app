import { describe, it, expect, vi } from 'vitest';
import { doRequest } from '@/features/RequestRunner/lib/doRequest';

describe('doRequest errors', () => {
  it('rejects on non-OK response', async () => {
    const json = vi.fn().mockResolvedValue({ msg: 'bad' });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        headers: new Headers(),
        json,
      })
    );
    const ac = new AbortController();
    await expect(
      doRequest('/x', { method: 'GET' }, false, ac)
    ).rejects.toBeInstanceOf(Error);
  });

  it('rejects on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('net')));
    const ac = new AbortController();
    await expect(
      doRequest('/y', { method: 'POST', body: 'q' }, false, ac)
    ).rejects.toBeInstanceOf(Error);
  });
});
