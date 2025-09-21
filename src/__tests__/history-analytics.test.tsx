import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryAnalytics from '@/components/HistoryAnalytics';
import { HistoryAnalyticsItem } from '../../types/HistoryAnalyticsProps';

const mockHistory: HistoryAnalyticsItem[] = [
  {
    api_url: 'http:/dummy.json',
    created_at: new Date(2024, 2, 10, 2, 30),
    duration_ms: 12,
    error: null,
    id: 12345,
    method: 'PUT',
    request_body: 'string',
    request_headers: [],
    request_size: 12,
    response_size: 677,
    status_code: 200,
    url: 'string',
  },
  {
    api_url: 'http:/some.json',
    created_at: new Date(2025, 2, 10, 2, 30),
    duration_ms: 24,
    error: null,
    id: 1475,
    method: 'DELETE',
    request_body: 'string',
    request_headers: [],
    request_size: 132,
    response_size: 415,
    status_code: 200,
    url: 'string',
  },
];

const tableHeaders = [
  'Request Time',
  'Method',
  'Endpoint',
  'Status',
  'Duration (ms)',
  'Size (bytes)',
];

describe('HistoryAnalytics', () => {
  it('renders table headers correctly', () => {
    render(
      <HistoryAnalytics
        history={[]}
        tableHeaders={tableHeaders}
        onClickNavigator={vi.fn()}
      />
    );

    tableHeaders.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });

  it('renders rows based on history data', () => {
    render(
      <HistoryAnalytics
        history={mockHistory}
        tableHeaders={tableHeaders}
        onClickNavigator={vi.fn()}
      />
    );

    mockHistory.forEach((item) => {
      expect(screen.getByText(item.method)).toBeInTheDocument();
      expect(screen.getByText(item.api_url)).toBeInTheDocument();
      expect(screen.getByText(item.duration_ms.toString())).toBeInTheDocument();
      expect(
        screen.getByText(item.response_size.toString())
      ).toBeInTheDocument();
      expect(screen.getByText(item.created_at.toString())).toBeInTheDocument();
    });
  });

  it('calls onClickNavigator when a row is clicked', () => {
    const mockNavigator = vi.fn();

    render(
      <HistoryAnalytics
        history={mockHistory}
        tableHeaders={tableHeaders}
        onClickNavigator={mockNavigator}
      />
    );

    const firstRow = screen.getByText(mockHistory[0].method).closest('tr');
    expect(firstRow).toBeTruthy();
    if (firstRow) {
      fireEvent.click(firstRow);
      expect(mockNavigator).toHaveBeenCalledWith(
        `/client#${mockHistory[0].url}`
      );
    }
  });
});
