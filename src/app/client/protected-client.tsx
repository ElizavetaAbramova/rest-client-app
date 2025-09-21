'use client';

import AuthGate from '@/components/AuthGate';
import AuthRedirect from '@/components/AuthRedirect';

export default function ProtectedClient() {
  return (
    <AuthGate
      load={() => import('./HeavyPageImpl')}
      fallback={<div className="p-6">Loading…</div>}
      unauthorized={<AuthRedirect />}
    />
  );
}
