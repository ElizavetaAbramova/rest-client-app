import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithI18n } from './test-utils';
import ResponsePanel from '@/components/ResponsePanel';

const base = {
  status: 200 as const,
  statusText: 'OK' as const,
  timeMs: 1,
  sizeBytes: 3,
  headers: [] as [string, string][],
  isJson: true,
  isText: true,
  isBinary: false,
};

describe('ResponsePanel', () => {
  it('shows truncated and expands on request', () => {
    const onShowAll = vi.fn();

    renderWithI18n(
      <ResponsePanel
        resp={{
          ...base,
          headers: [['Content-Type', 'application/json']],
          truncated: true,
          bodyText: '{"a":1}',
          bodyFullText: '{\n  "a": 1\n}',
        }}
        onShowAll={onShowAll}
        showAll={false}
      />
    );

    expect(
      screen.getByRole('button', { name: /show all/i })
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /show all/i }));
    expect(onShowAll).toHaveBeenCalled();
  });
});
