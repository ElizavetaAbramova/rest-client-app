import { afterEach, expect, it, vi } from 'vitest';
import { fetchHistory } from '@/utils/fetchHistory';

afterEach(() => {
  vi.restoreAllMocks();
});

it('returns requests on 200 OK', async () => {
  const json = vi.fn().mockResolvedValue({ requests: [{ id: '1' }] });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json }));
  const res = await fetchHistory('u1');
  expect(res).toEqual([{ id: '1' }]);
  expect(fetch).toHaveBeenCalledWith('/api/requests/u1');
});

it('throws on non-OK', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  await expect(fetchHistory('u2')).rejects.toBeInstanceOf(Error);
});

it('propagates network errors', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('net')));
  await expect(fetchHistory('u3')).rejects.toBeInstanceOf(Error);
});
