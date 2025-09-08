import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthForm from '@/components/AuthForm'
import * as authMod from 'firebase/auth'
import { useRouter } from 'next/navigation'
import type { Auth, User, UserCredential } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('AuthForm extras', () => {
  it('toggles password visibility', async () => {
    render(<AuthForm mode="sign-in" />)
    const pwd = screen.getByPlaceholderText(/password/i) as HTMLInputElement
    const toggle = screen.getByRole('button', { name: /show|hide/i })
    expect(pwd.type).toBe('password')
    fireEvent.click(toggle)
    expect(pwd.type).toBe('text')
    fireEvent.click(toggle)
    expect(pwd.type).toBe('password')
  })

  it('signs up branch calls createUserWithEmailAndPassword', async () => {
    const spy = vi
      .spyOn(authMod, 'createUserWithEmailAndPassword')
      .mockResolvedValue({} as unknown as UserCredential)
    render(<AuthForm mode="sign-up" />)
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'new@example.com' } })
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'Abcd123!' } })
    const submit = screen.getByRole('button', { name: /sign up/i })
    await waitFor(() => expect(submit).not.toBeDisabled())
    fireEvent.click(submit)
    await waitFor(() => expect(spy).toHaveBeenCalled())
  })

  it('maps Firebase error message (too many requests)', async () => {
    vi.spyOn(authMod, 'signInWithEmailAndPassword')
      .mockRejectedValue(new FirebaseError('auth/too-many-requests', 'x'))
  
    render(<AuthForm mode="sign-in" />)
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@example.com' } })
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'Abcd123!' } })
    const submit = screen.getByRole('button', { name: /sign in/i })
    await waitFor(() => expect(submit).not.toBeDisabled())
    fireEvent.click(submit)
    await screen.findByText(/too many attempts/i)
  })

  it('forgot password requires email', async () => {
    render(<AuthForm mode="sign-in" />)
    const btn = screen.getByRole('button', { name: /forgot password|send reset link/i })
    fireEvent.click(btn)
    await screen.findByText(/enter your email/i)
  })

  it('forgot password sends email and shows info message', async () => {
    const spy = vi.spyOn(authMod, 'sendPasswordResetEmail').mockResolvedValue()
    render(<AuthForm mode="sign-in" />)
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@example.com' } })
    const btn = screen.getByRole('button', { name: /forgot password|send reset link/i })
    fireEvent.click(btn)
    await waitFor(() => expect(spy).toHaveBeenCalled())
    await screen.findByText(/reset link sent|link sent/i)
  })

  it('redirects away if already authenticated (ready gate)', async () => {
    vi.spyOn(authMod, 'onAuthStateChanged').mockImplementation((_: Auth, observer: authMod.NextOrObserver<User>) => {
      if (typeof observer === 'function') {
        observer({} as unknown as User)
      } else if (observer && typeof observer.next === 'function') {
        observer.next({} as unknown as User)
      }
      return () => {}
    })
    const router = useRouter() as unknown as { replace: (url: string) => void }
    render(<AuthForm mode="sign-in" />)
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/'))
  })
})
