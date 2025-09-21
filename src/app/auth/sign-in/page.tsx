import type { Metadata } from 'next';
import AuthForm from '@/features/auth/ui/AuthForm';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Sign In | REST Client',
};

export default function Page() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <Suspense fallback={<p>Loading...</p>}>
        <AuthForm mode="sign-in" />
      </Suspense>
    </main>
  );
}
