import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

type User = { uid: string } | null;
const subs: Array<(u: User) => void> = [];

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/history',
}));
vi.mock('@/utils/isGatedRoute', () => ({
  isGatedRoute: () => true,
}));
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth: unknown, cb: (u: User) => void) => {
    subs.push(cb);
    return () => {};
  },
}));
vi.mock('@/lib/firebase', () => ({ auth: {} }));

import { useAuthGate } from '@/hooks/useAuthGate';

describe('useAuthGate', () => {
  it('guest state when no user', async () => {
    const { result } = renderHook(() => useAuthGate());
    subs.forEach((cb) => cb(null));
    await waitFor(() => {
      expect(result.current.authed).toBe(false);
      expect(result.current.status).toBe('guest');
    });
  });
  it('authed state when user present', async () => {
    const { result } = renderHook(() => useAuthGate());
    subs.forEach((cb) => cb({ uid: 'u1' }));
    await waitFor(() => {
      expect(result.current.authed).toBe(true);
      expect(result.current.status).toBe('authed');
    });
  });
});
