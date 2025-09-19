'use client';

import AuthGate from '@/components/AuthGate';

export default function ProtectedClient() {
  return <AuthGate load={() => import('./HeavyPageImpl')} />;
}
