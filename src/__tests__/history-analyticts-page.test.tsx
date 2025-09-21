import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HeavyPageImpl from '@/app/history/HeavyPageImpl';
import {
  HistoryAnalyticsProps,
  HistoryAnalyticsItem,
} from '../../types/HistoryAnalyticsProps';
import { EmptyHistoryProps } from '../../types/EmptyHistoryProps';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchHistory } from '@/utils/fetchHistory';
import type { Auth, User, NextOrObserver, Unsubscribe } from 'firebase/auth';

vi.mock('firebase/auth', () => ({ onAuthStateChanged: vi.fn() }));
vi.mock('@/utils/fetchHistory', () => ({ fetchHistory: vi.fn() }));
vi.mock('@/lib/firebase', () => ({ auth: {} }));
vi.mock('@/hooks/useT', () => ({ useT: () => ({ t: (key: string) => key }) }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

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

  it('shows loading state initially', async () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: Auth, nextOrObserver: NextOrObserver<User>): Unsubscribe => {
        if (typeof nextOrObserver === 'function')
          nextOrObserver({ uid: 'u' } as User);
        else if (nextOrObserver && 'next' in nextOrObserver)
          nextOrObserver.next({ uid: 'u' } as User);
        return () => {};
      }
    );
    mockFetchHistory.mockImplementation(
      () => new Promise<HistoryAnalyticsItem[]>(() => {})
    );

    render(<HeavyPageImpl />);

    expect(await screen.findByText(/loading_history/i)).toBeInTheDocument();
  });

  it('renders EmptyHistory when there are no requests in DB', async () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: Auth, nextOrObserver: NextOrObserver<User>): Unsubscribe => {
        if (typeof nextOrObserver === 'function')
          nextOrObserver({ uid: 'u' } as User);
        else if (nextOrObserver && 'next' in nextOrObserver)
          nextOrObserver.next({ uid: 'u' } as User);
        return () => {};
      }
    );
    mockFetchHistory.mockResolvedValue([]);

    render(<HeavyPageImpl />);

    await waitFor(() =>
      expect(screen.getByTestId('empty-history')).toBeInTheDocument()
    );
  });

  it('renders HistoryAnalytics with provided history', async () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: Auth, nextOrObserver: NextOrObserver<User>): Unsubscribe => {
        if (typeof nextOrObserver === 'function')
          nextOrObserver({ uid: 'u' } as User);
        else if (nextOrObserver && 'next' in nextOrObserver)
          nextOrObserver.next({ uid: 'u' } as User);
        return () => {};
      }
    );

    const items: HistoryAnalyticsItem[] = [
      {
        id: 1,
        created_at: new Date('2025-01-01T00:00:00.000Z'),
        method: 'GET',
        url: 'https://api.example.com',
        status_code: 200,
        duration_ms: 5,
        response_size: 18,
        error: null,
        api_url: 'https://api.example.com',
        request_body: '',
        request_headers: [],
        request_size: 0,
      },
    ];
    mockFetchHistory.mockResolvedValue(items);

    render(<HeavyPageImpl />);

    expect(await screen.findByTestId('history-analytics')).toBeInTheDocument();
  });

  it('handles fetch errors', async () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: Auth, nextOrObserver: NextOrObserver<User>): Unsubscribe => {
        if (typeof nextOrObserver === 'function')
          nextOrObserver({ uid: 'u' } as User);
        else if (nextOrObserver && 'next' in nextOrObserver)
          nextOrObserver.next({ uid: 'u' } as User);
        return () => {};
      }
    );
    mockFetchHistory.mockRejectedValue(new Error('boom'));

    render(<HeavyPageImpl />);

    await waitFor(() =>
      expect(screen.getByTestId('empty-history')).toBeInTheDocument()
    );
  });
});
