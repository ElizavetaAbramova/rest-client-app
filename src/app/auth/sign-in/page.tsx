import type { Metadata } from 'next'
import AuthForm from '@/components/AuthForm'

export const metadata: Metadata = {
  title: 'Sign In | REST Client'
}

export default function Page() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <AuthForm mode="sign-in" />
    </main>
  )
}
