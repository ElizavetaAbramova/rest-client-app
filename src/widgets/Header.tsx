'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

function Header() {
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
          REST Client
        </Link>
      </div>
      <div className="buttons-block flex w-full flex-wrap justify-center gap-5 md:flex-nowrap md:justify-end">
        <label className="swap">
          <input type="checkbox" />
          <div className="swap-on">EN</div>
          <div className="swap-off">RU</div>
        </label>
        {!user && (
          <>
            <Link href="/auth/sign-in" className="btn btn-soft btn-primary rounded-sm">Sign In</Link>
            <Link href="/auth/sign-up" className="btn btn-primary rounded-sm">Sign Up</Link>
          </>
        )}
        {user && (
          <button onClick={handleSignOut} className="btn btn-primary rounded-sm">Sign Out</button>
        )}
      </div>
    </header>
  )
}

export default Header
