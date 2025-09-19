'use client';
import AuthGate from '@/components/AuthGate';

export default function ProtectedHistory() {
  return <AuthGate load={() => import('./HeavyPageImpl')} />;
}
