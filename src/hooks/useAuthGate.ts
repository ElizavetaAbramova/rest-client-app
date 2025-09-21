'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type AuthGateOptions = {
  requireEmailVerified?: boolean;
};

export function useAuthGate(opts: AuthGateOptions = {}) {
  const [status, setStatus] = useState<'checking' | 'authed' | 'guest'>(
    'checking'
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u && (!opts.requireEmailVerified || u.emailVerified)) {
        setUser(u);
        setStatus('authed');
      } else {
        setUser(null);
        setStatus('guest');
      }
    });
    return unsub;
  }, [opts.requireEmailVerified]);

  return { status, authed: status === 'authed', user };
}
