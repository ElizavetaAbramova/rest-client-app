import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Body from '@/components/Body';

function decodeB64Url(b: string) {
  b = b.replace(/-/g, '+').replace(/_/g, '/');
  while (b.length % 4) b += '=';
  return decodeURIComponent(escape(atob(b)));
}
function encodeB64Url(s: string) {
  return btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

describe('Body', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('restores from #b= after mount', async () => {
    const raw = '{"a":1}';
    window.location.hash = `b=${encodeB64Url(raw)}`;
    render(<Body setBody={vi.fn()} setRequestSize={vi.fn()} />);
    const ta = await screen.findByPlaceholderText('Raw request body');
    expect((ta as HTMLTextAreaElement).value).toBe(raw);
  });

  it('writes to #b= on blur', async () => {
    render(<Body setBody={vi.fn()} setRequestSize={vi.fn()} />);
    const ta = await screen.findByPlaceholderText('Raw request body');
    fireEvent.change(ta, { target: { value: '{"a":2}' } });
    fireEvent.blur(ta);
    const hash = window.location.hash.replace(/^#/, '');
    const b = hash
      .split('&')
      .find((p) => p.startsWith('b='))!
      .split('=')[1];
    expect(decodeB64Url(b)).toBe('{"a":2}');
  });

  it('prettify formats json and keeps focus', async () => {
    render(<Body setBody={vi.fn()} setRequestSize={vi.fn()} />);
    const ta = await screen.findByPlaceholderText('Raw request body');
    fireEvent.change(ta, { target: { value: '{"a":1}' } });
    const btn = screen.getByRole('button', { name: /Prettify/i });
    fireEvent.click(btn);
    expect((ta as HTMLTextAreaElement).value).toBe('{\n  "a": 1\n}');
    expect(document.activeElement).toBe(ta);
  });

  it('disables prettify for non-json', async () => {
    render(<Body setBody={vi.fn()} setRequestSize={vi.fn()} />);
    const ta = await screen.findByPlaceholderText('Raw request body');
    fireEvent.change(ta, { target: { value: 'hello' } });
    const btn = screen.getByRole('button', { name: /Prettify/i });
    expect(btn).toBeDisabled();
  });

  it('updates indicators', async () => {
    render(<Body setBody={vi.fn()} setRequestSize={vi.fn()} />);
    const ta = await screen.findByPlaceholderText('Raw request body');
    fireEvent.change(ta, { target: { value: '{"a":1}' } });
    await waitFor(() => {
      expect(screen.getByText(/bytes$/i).textContent).toMatch(/\d+ bytes/);
      expect(screen.getByText(/lines$/i).textContent).toMatch(/\d+ lines/);
    });
  });
});
