import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { renderWithI18n, makeHash } from './test-utils';
import RequestRunner from '@/widgets/RequestRunner/ui/RequestRunner';

describe('RequestRunner more branches', () => {
  it('handles fetch rejection (network error)', async () => {
    window.location.hash = makeHash({
      method: 'GET',
      url: 'https://api.example.com/crash',
    });

    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('boom'));

    renderWithI18n(<RequestRunner onResponse={vi.fn()} />);
    await act(async () => {
      window.dispatchEvent(new CustomEvent('requestline:send'));
      window.dispatchEvent(new CustomEvent('request:send'));
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    await waitFor(() => {
      expect(screen.getByText(/boom/i)).toBeInTheDocument();
    });
  });

  it('handles 204 no content (no body, no content-type)', async () => {
    if (!('createObjectURL' in URL)) {
      Object.defineProperty(URL, 'createObjectURL', {
        value: vi.fn(() => 'blob:mock'),
        writable: true,
      });
    } else {
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    }
    if (!('revokeObjectURL' in URL)) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: vi.fn(),
        writable: true,
      });
    } else {
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    }

    window.location.hash = makeHash({
      method: 'GET',
      url: 'https://api.example.com/empty',
    });

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 204 })
    );

    renderWithI18n(<RequestRunner onResponse={vi.fn()} />);
    await act(async () => {
      window.dispatchEvent(new CustomEvent('requestline:send'));
      window.dispatchEvent(new CustomEvent('request:send'));
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    await waitFor(() => {
      expect(screen.getAllByText(/204/i).length).toBeGreaterThan(0);
      expect(
        screen.queryByText((c, el) => el?.tagName.toLowerCase() === 'pre')
      ).toBeNull();
    });
  });

  it('renders non-2xx status (e.g., 404) path', async () => {
    window.location.hash = makeHash({
      method: 'GET',
      url: 'https://api.example.com/404',
      headers: [{ k: 'Accept', v: 'text/plain' }],
    });

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('not found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      })
    );

    renderWithI18n(<RequestRunner onResponse={vi.fn()} />);
    await act(async () => {
      window.dispatchEvent(new CustomEvent('requestline:send'));
      window.dispatchEvent(new CustomEvent('request:send'));
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    await waitFor(() => {
      expect(screen.getAllByText(/404/).length).toBeGreaterThan(0);
    });
  });
});
