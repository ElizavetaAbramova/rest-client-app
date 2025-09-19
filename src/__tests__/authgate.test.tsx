import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthGate from '@/components/AuthGate';
import { useAuthGate } from '@/hooks/useAuthGate';
import type { User } from 'firebase/auth';

vi.mock('@/hooks/useAuthGate', () => ({ useAuthGate: vi.fn() }));

const mockedUseAuthGate = vi.mocked(useAuthGate);

describe('AuthGate', () => {
  it('renders fallback while checking', () => {
    mockedUseAuthGate.mockReturnValue({
      status: 'checking',
      authed: false,
      user: null,
    });

    type P = Record<string, unknown>;
    const loader = () =>
      Promise.resolve({
        default: (props: P) => (
          <div data-props={String(Boolean(props))}>LAZY</div>
        ),
      });

    render(
      <AuthGate<P>
        load={loader}
        fallback={<div>FALLBACK</div>}
        unauthorized={<div>UNAUTH</div>}
      />
    );

    expect(screen.getByText('FALLBACK')).toBeInTheDocument();
  });

  it('renders unauthorized when not authed', () => {
    mockedUseAuthGate.mockReturnValue({
      status: 'guest',
      authed: false,
      user: null,
    });

    type P = Record<string, unknown>;
    const loader = () =>
      Promise.resolve({
        default: (props: P) => (
          <div data-props={String(Boolean(props))}>LAZY</div>
        ),
      });

    render(
      <AuthGate<P>
        load={loader}
        fallback={<div>FALLBACK</div>}
        unauthorized={<div>UNAUTH</div>}
      />
    );

    expect(screen.getByText('UNAUTH')).toBeInTheDocument();
  });

  it('renders lazy component when authed', async () => {
    mockedUseAuthGate.mockReturnValue({
      status: 'authed',
      authed: true,
      user: {} as User,
    });

    type P = Record<string, unknown>;
    const loader = () =>
      Promise.resolve({
        default: (props: P) => (
          <div data-props={String(Boolean(props))}>LAZY</div>
        ),
      });

    render(
      <AuthGate<P>
        load={loader}
        fallback={<div>FALLBACK</div>}
        unauthorized={<div>UNAUTH</div>}
      />
    );

    expect(await screen.findByText('LAZY')).toBeInTheDocument();
  });
});
