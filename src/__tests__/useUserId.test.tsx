import { describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

type User = { uid: string } | null;
const subs: Array<(u: User) => void> = [];

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth: unknown, cb: (u: User) => void) => {
    subs.push(cb);
    return () => {};
  },
}));
vi.mock('@/lib/firebase', () => ({ auth: {} }));

import { useUserId } from '@/hooks/useUserId';

describe('useUserId', () => {
  it('returns current user id after auth', async () => {
    const { result } = renderHook(() => useUserId());
    subs.forEach((cb) => cb({ uid: 'abc' }));
    await waitFor(() => {
      expect(result.current.userId).toBe('abc');
    });
  });
});
