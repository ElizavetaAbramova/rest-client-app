import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Body from '@/components/Body';

function enc(s: string) {
  return btoa(unescape(encodeURIComponent(s)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

describe('Body mounted guard', () => {
  it('restores from #b= and shows non-zero indicators after mount', async () => {
    const raw = '{"a":1}';
    window.location.hash = `b=${enc(raw)}`;

    render(<Body />);

    const ta = await screen.findByPlaceholderText('Raw request body');
    expect((ta as HTMLTextAreaElement).value).toBe(raw);

    const btn = screen.getByRole('button', { name: /Prettify/i });
    expect(btn).not.toBeDisabled();

    const bytesText = screen.getByText(/bytes$/i).textContent!;
    const linesText = screen.getByText(/lines$/i).textContent!;
    const bytes = Number(bytesText.match(/\d+/)![0]);
    const lines = Number(linesText.match(/\d+/)![0]);
    expect(bytes).toBeGreaterThan(0);
    expect(lines).toBeGreaterThan(0);
  });
});
