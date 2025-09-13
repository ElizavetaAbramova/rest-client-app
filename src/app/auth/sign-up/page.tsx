import type { Metadata } from 'next';
import AuthForm from '@/components/AuthForm';

export const metadata: Metadata = {
  title: 'Sign Up | REST Client',
};

export default function Page() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <AuthForm mode="sign-up" />
    </main>
  );
}
