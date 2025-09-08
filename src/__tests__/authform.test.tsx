import { describe, it, expect} from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthForm from '@/components/AuthForm'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'

describe('AuthForm', () => {
  it('validates and signs in', async () => {
    render(<AuthForm mode="sign-in" />)
    const email = screen.getByPlaceholderText(/email/i)
    const pwd = screen.getByPlaceholderText(/password/i)
    const submit = screen.getByRole('button', { name: /sign in/i })
    expect(submit).toBeDisabled()
    fireEvent.change(email, { target: { value: 'user@example.com' } })
    fireEvent.change(pwd, { target: { value: 'Abcd123!' } })
    await waitFor(() => expect(submit).not.toBeDisabled())
    fireEvent.click(submit)
    await waitFor(() => expect(signInWithEmailAndPassword).toHaveBeenCalled())
  })

  it('signs up', async () => {
    render(<AuthForm mode="sign-up" />)
    const email = screen.getByPlaceholderText(/email/i)
    const pwd = screen.getByPlaceholderText(/password/i)
    const submit = screen.getByRole('button', { name: /sign up/i })
    fireEvent.change(email, { target: { value: 'new@example.com' } })
    fireEvent.change(pwd, { target: { value: 'Abcd123!' } })
    await waitFor(() => expect(submit).not.toBeDisabled())
    fireEvent.click(submit)
    await waitFor(() => expect(createUserWithEmailAndPassword).toHaveBeenCalled())
  })

  it('sends reset email', async () => {
    render(<AuthForm mode="sign-in" />)
    const email = screen.getByPlaceholderText(/email/i)
    fireEvent.change(email, { target: { value: 'user@example.com' } })
    const btn = screen.getByRole('button', { name: /forgot password|send reset link/i })
    fireEvent.click(btn)
    await waitFor(() => expect(sendPasswordResetEmail).toHaveBeenCalled())
  })
})
