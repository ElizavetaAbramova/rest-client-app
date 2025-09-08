'use client';

import { useEffect, useRef } from 'react';
import { onIdTokenChanged, getIdTokenResult, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

const SKEW_MS = 3000;

const PUBLIC_ROUTES = ['/auth/sign-in', '/auth/sign-up', '/404'];

export function useAuthExpiryRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const unsub = onIdTokenChanged(auth, async (user) => {
      clearTimer();

      if (!user) {
        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.replace('/');
        }
        return;
      }

      try {
        const info = await getIdTokenResult(user, false);
        const expMs = new Date(info.expirationTime).getTime();
        const now = Date.now();
        const wait = Math.max(expMs - now + SKEW_MS, 0);

        timerRef.current = setTimeout(async () => {
          try {
            await signOut(auth);
          } finally {
            router.replace('/');
          }
        }, wait);
      } catch {
        try {
          await signOut(auth);
        } finally {
          router.replace('/');
        }
      }
    });

    return () => {
      clearTimer();
      unsub();
    };
  }, [router, pathname]);
}
