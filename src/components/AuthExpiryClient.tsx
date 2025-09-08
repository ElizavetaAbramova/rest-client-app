'use client'

import { type ReactNode } from 'react'
import { useAuthExpiryRedirect } from '@/hooks/useAuthExpiryRedirect'

export default function AuthExpiryClient({ children }: { children: ReactNode }) {
  useAuthExpiryRedirect()
  return <>{children}</>
}
