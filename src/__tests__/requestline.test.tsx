import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithI18n } from './test-utils';
import RequestLine from '@/components/RequestLine';

describe('RequestLine', () => {
  it('enables Send for valid URL and dispatches send', async () => {
    renderWithI18n(<RequestLine />);
    const url = screen.getByPlaceholderText('https://example.com');
    const send = screen.getByRole('button', { name: /send/i });
    expect(send).toBeDisabled();
    fireEvent.change(url, { target: { value: 'https://example.com' } });
    expect(send).not.toBeDisabled();

    const spy = vi.fn();
    const handler = () => spy();
    window.addEventListener('requestline:send', handler);
    document.addEventListener('requestline:send', handler);
    window.addEventListener('request:send', handler);
    document.addEventListener('request:send', handler);

    fireEvent.click(send);

    await waitFor(() => expect(spy).toHaveBeenCalled());
  });

  it('hotkey Cmd/Ctrl+Enter triggers send and Share copies URL', async () => {
    renderWithI18n(<RequestLine />);
    const url = screen.getByPlaceholderText('https://example.com');
    fireEvent.change(url, { target: { value: 'https://example.com' } });

    const spy = vi.fn();
    const handler = () => spy();
    window.addEventListener('requestline:send', handler);
    document.addEventListener('requestline:send', handler);
    window.addEventListener('request:send', handler);
    document.addEventListener('request:send', handler);

    fireEvent.keyDown(url, { key: 'Enter', metaKey: true });

    await waitFor(() => expect(spy).toHaveBeenCalled());

    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });
});
