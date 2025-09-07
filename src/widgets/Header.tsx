'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useT } from '@/hooks/useT'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Header() {
  const { t } = useT()
  const router = useRouter()
  const [user, setUser] = useState<null | { email: string }>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u ? { email: u.email || '' } : null))
    return () => unsub()
  }, [])

  async function handleSignOut() {
    await signOut(auth)
    router.replace('/')
  }

  return (
    <header className="text-neutral-content sticky top-0 z-2 flex flex-wrap items-center justify-center gap-3 bg-transparent p-3 backdrop-blur-md transition-colors duration-300 md:flex-nowrap md:justify-between">
      <div className="w-50 text-center text-xl">
        <Link href="/" className="btn btn-ghost rounded-sm text-xl normal-case hover:bg-sky-900">
          {t('app_title')}
        </Link>
      </div>
      <div className="buttons-block flex w-full flex-wrap items-center justify-center gap-5 md:flex-nowrap md:justify-end">
        <LanguageSwitcher />
        {!user && (
          <>
            <Link href="/auth/sign-in" className="btn btn-soft btn-primary rounded-sm">{t('sign_in')}</Link>
            <Link href="/auth/sign-up" className="btn btn-primary rounded-sm">{t('sign_up')}</Link>
          </>
        )}
        {user && (
          <button onClick={handleSignOut} className="btn btn-primary rounded-sm">{t('sign_out')}</button>
        )}
      </div>
    </header>
  )
}
