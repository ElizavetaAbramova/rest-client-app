import { describe, it, expect, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithI18n } from './test-utils';
import HeadersEditor from '@/components/HeadersEditor';

vi.mock('@/utils/urlState', () => ({ setHashParam: vi.fn() }));
const { setHashParam } = await import('@/utils/urlState');

describe('HeadersEditor', () => {
  it('adds, applies, clears, and resets headers', () => {
    window.location.hash = '';
    renderWithI18n(<HeadersEditor setHeadersProp={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /add header/i }));
    const nameInputs = screen.getAllByPlaceholderText('Content-Type');
    const valueInputs = screen.getAllByPlaceholderText('application/json');
    fireEvent.change(nameInputs[1], { target: { value: 'X-Test' } });
    fireEvent.change(valueInputs[1], { target: { value: '42' } });

    fireEvent.click(screen.getByRole('button', { name: /apply headers/i }));
    expect(setHashParam).toHaveBeenCalledWith(
      'h',
      expect.stringContaining('X-Test')
    );

    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.getAllByPlaceholderText('Content-Type')[0]).toHaveValue('');

    window.location.hash =
      'h=' +
      btoa(JSON.stringify([{ key: 'A', value: 'B' }]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(screen.getByDisplayValue('A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('B')).toBeInTheDocument();
  });
});
