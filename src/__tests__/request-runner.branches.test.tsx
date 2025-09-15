import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { renderWithI18n, makeHash } from './test-utils';
import RequestRunner from '@/widgets/RequestRunner/ui/RequestRunner';

describe('RequestRunner branches', () => {
  it('renders plain text responses (non-JSON)', async () => {
    window.location.hash = makeHash({
      method: 'GET',
      url: 'https://api.example.com/text',
      headers: [{ k: 'Accept', v: 'text/plain' }],
    });

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('hello', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Length': '5',
        },
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
    });

    const pre = await screen.findByText(
      (content, el) =>
        el?.tagName.toLowerCase() === 'pre' && content.includes('hello')
    );
    expect(pre).toBeInTheDocument();
  });

  it('handles binary responses (octet-stream)', async () => {
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
      url: 'https://api.example.com/bin',
      headers: [{ k: 'Accept', v: 'application/octet-stream' }],
    });

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(new Uint8Array([1, 2, 3, 4]), {
        status: 200,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': '4',
        },
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
    });

    const pre = screen.queryByText(
      (content, el) => el?.tagName.toLowerCase() === 'pre'
    );
    expect(pre).toBeNull();
  });
});
