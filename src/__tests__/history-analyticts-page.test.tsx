import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HistoryPage from '@/app/history/page';
import { HistoryAnalyticsProps } from '../../types/HistoryAnalyticsProps';
import { EmptyHistoryProps } from '../../types/EmptyHistoryProps';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchHistory } from '@/utils/fetchHistory';
import type { Auth, User, NextOrObserver, Unsubscribe } from 'firebase/auth';

vi.mock('firebase/auth', () => {
  return {
    onAuthStateChanged: vi.fn(),
  };
});

vi.mock('@/utils/fetchHistory', () => {
  return {
    fetchHistory: vi.fn(),
  };
});

vi.mock('@/lib/firebase', () => ({ auth: {} }));

vi.mock('@/hooks/useT', () => ({
  useT: () => ({ t: (key: string) => key }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockOnAuthStateChanged = vi.mocked(onAuthStateChanged);
const mockFetchHistory = vi.mocked(fetchHistory);

describe('HistoryPage', () => {
  vi.mock('@/components/HistoryAnalytics', () => ({
    default: ({ history }: HistoryAnalyticsProps) => (
      <div data-testid="history-analytics">
        history length: {history.length}
      </div>
    ),
  }));

  vi.mock('@/components/EmptyHistory', () => ({
    default: (props: EmptyHistoryProps) => (
      <div data-testid="empty-history">{props.header}</div>
    ),
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<HistoryPage />);
    expect(screen.getByText('loading_history')).toBeInTheDocument();
  });

  it('renders EmptyHistory when there are no requests in DB', async () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: Auth, nextOrObserver: NextOrObserver<User>): Unsubscribe => {
        if (typeof nextOrObserver === 'function') {
          nextOrObserver({ uid: 'fake-uid' } as User);
        } else if (nextOrObserver && 'next' in nextOrObserver) {
          nextOrObserver.next({ uid: 'fake-uid' } as User);
        }
        return () => {};
      }
    );

    mockFetchHistory.mockResolvedValue([]);
    render(<HistoryPage />);
    await waitFor(() =>
      expect(screen.getByTestId('empty-history')).toBeInTheDocument()
    );
  });

  it('renders HistoryAnalytics with provided history', async () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: Auth, nextOrObserver: NextOrObserver<User>): Unsubscribe => {
        if (typeof nextOrObserver === 'function') {
          nextOrObserver({ uid: 'fake-uid' } as User);
        } else if (nextOrObserver && 'next' in nextOrObserver) {
          nextOrObserver.next({ uid: 'fake-uid' } as User);
        }
        return () => {};
      }
    );

    mockFetchHistory.mockResolvedValue([
      {
        api_url: 'http:/dummy.json',
        created_at: '1777',
        duration_ms: '12',
        error: null,
        id: '12345',
        method: 'PUT',
        request_body: 'string',
        request_headers: [],
        request_size: 12,
        response_size: 677,
        status_code: 200,
        url: 'string',
      },
    ]);

    render(<HistoryPage />);

    await waitFor(() =>
      expect(screen.getByTestId('history-analytics')).toBeInTheDocument()
    );
  });

  it('handles fetch errors', async () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: Auth, nextOrObserver: NextOrObserver<User>): Unsubscribe => {
        if (typeof nextOrObserver === 'function') {
          nextOrObserver({ uid: 'fake-uid' } as User);
        } else if (nextOrObserver && 'next' in nextOrObserver) {
          nextOrObserver.next({ uid: 'fake-uid' } as User);
        }
        return () => {};
      }
    );

    mockFetchHistory.mockResolvedValue([
      {
        api_url: 'http:/dummy.json',
        created_at: '1777',
        duration_ms: '12',
        error: null,
        id: '12345',
        method: 'PUT',
        request_body: 'string',
        request_headers: [],
        request_size: 12,
        response_size: 677,
        status_code: 200,
        url: 'string',
      },
    ]);

    render(<HistoryPage />);
  });
});
