'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function AuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const qs = sp.toString();
  const current = pathname ? (qs ? `${pathname}?${qs}` : pathname) : '/';
  useEffect(() => {
    router.replace(`/auth/sign-in?redirectTo=${encodeURIComponent(current)}`);
  }, [router, current]);
  return null;
}
