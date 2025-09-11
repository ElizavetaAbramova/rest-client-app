import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Body from '@/components/Body';

describe('Body extra', () => {
  it('dispatches requestline:send on hotkey', async () => {
    render(<Body />);
    const ta = await screen.findByPlaceholderText('Raw request body');
    const spy = vi.fn();
    window.addEventListener('requestline:send', spy);
    fireEvent.keyDown(ta, { key: 'Enter', metaKey: true });
    await Promise.resolve();
    expect(spy).toHaveBeenCalled();
  });

  it('shows validation error for invalid JSON', async () => {
    render(<Body />);
    const ta = await screen.findByPlaceholderText('Raw request body');
    fireEvent.change(ta, { target: { value: "{'a':1,}" } });
    const btn = screen.getByRole('button', { name: /prettify/i });
    fireEvent.click(btn);
    expect(screen.getByText(/not valid json/i)).toBeInTheDocument();
  });
});
