import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithI18n } from './test-utils';
import RequestLine from '@/components/RequestLine';

describe('RequestLine', () => {
  const setup = () =>
    renderWithI18n(
      <RequestLine setUrlProp={vi.fn()} setMethodProp={vi.fn()} />
    );

  it('enables Send for valid URL and dispatches send', async () => {
    setup();

    const urlInput = screen.getByPlaceholderText('https://example.com');
    const sendButton = screen.getByRole('button', { name: /send/i });
    const onSend = vi.fn();
    window.addEventListener('requestline:send', onSend);

    expect(sendButton).toBeDisabled();

    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    expect(sendButton).toBeEnabled();

    fireEvent.click(sendButton);

    await waitFor(() => expect(onSend).toHaveBeenCalled());
  });

  it('hotkey Cmd/Ctrl+Enter triggers send', async () => {
    setup();
    const onSend = vi.fn();
    window.addEventListener('requestline:send', onSend);

    const urlInput = screen.getByPlaceholderText('https://example.com');
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    fireEvent.keyDown(urlInput, { key: 'Enter', metaKey: true });

    await waitFor(() => expect(onSend).toHaveBeenCalled());
  });

  it('click on Share copies URL', async () => {
    setup();

    const writeText = vi.fn();
    Object.assign(navigator, { clipboard: { writeText } });

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });
});
