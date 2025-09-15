import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { renderWithI18n, makeHash } from './test-utils';
import RequestRunner from '@/widgets/RequestRunner/ui/RequestRunner';

describe('RequestRunner', () => {
  it('parses hash, sends request and shows response', async () => {
    window.location.hash = makeHash({
      method: 'GET',
      url: 'https://api.example.com/data',
      headers: [{ k: 'Accept', v: 'application/json' }],
    });

    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ ok: true, n: 1 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Content-Length': '18' },
      })
    );

    renderWithI18n(<RequestRunner />);

    await act(async () => {
      window.dispatchEvent(new CustomEvent('requestline:send'));
      window.dispatchEvent(new CustomEvent('request:send'));
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    await waitFor(() => {
      expect(screen.getAllByText(/200/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/bytes/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/ms/i).length).toBeGreaterThan(0);
    });

    const pre = await screen.findByText(
      (content, element) =>
        element?.tagName.toLowerCase() === 'pre' &&
        content.includes('"ok": true')
    );
    expect(pre).toBeInTheDocument();
  });
});
